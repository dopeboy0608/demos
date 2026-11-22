"""
서울시 자치구/행정동 경계 데이터를 region-view 목업에서 쓰는 형태로 가공한다(#64, #67).

데이터 출처: cubensys/Korea_District (GitHub, https://github.com/cubensys/Korea_District)
  - 3_서울시_자치구/서울_자치구_경계_2017.geojson (25개 구, WGS84)
  - 4_서울시_행정동/서울_행정동_경계_2017.geojson (424개 행정동, WGS84)
  해당 저장소는 라이선스가 명시돼 있지 않다(비상업 개인 데모 프로젝트에 한해 사용자가
  직접 사용을 확정). 공공데이터포털/VWorld의 공식 데이터(공공누리 4유형)는 각각 캡차와
  로그인으로 자동 다운로드가 막혀 있어 이 대안을 대신 사용했다.

이 스크립트는 1회성이다 — 실행해 만든 결과(seoulDistricts.json, seoulDongs.json)만
src/features/region-view/data/에 커밋하고, 빌드 파이프라인에는 포함하지 않는다.

실행:
  python3 -m venv .venv && .venv/bin/pip install shapely
  .venv/bin/python3 scripts/data/prepare-seoul-boundaries.py <dong-geojson-path> <gu-geojson-path> <output-dir>
"""

import json
import sys
from collections import defaultdict

from shapely.geometry import mapping, shape
from shapely.ops import unary_union


def round_coords(obj, nd=6):
    if isinstance(obj, float):
        return round(obj, nd)
    # shapely.mapping()은 좌표를 리스트가 아닌 튜플로 반환하므로 둘 다 처리한다.
    if isinstance(obj, (list, tuple)):
        return [round_coords(x, nd) for x in obj]
    return obj


def to_multipolygon_coords(geom):
    # region-view의 RawDraftPolygon.geom.coordinates 형식: number[][][][]
    # (폴리곤 배열 -> 각 폴리곤은 링 배열 -> 각 링은 [lng, lat] 배열)
    if geom["type"] == "Polygon":
        return [geom["coordinates"]]
    if geom["type"] == "MultiPolygon":
        return geom["coordinates"]
    raise ValueError(f"unsupported geometry type: {geom['type']}")


def main(dong_path: str, gu_path: str, out_dir: str) -> None:
    with open(dong_path, encoding="utf-8") as f:
        dong_fc = json.load(f)
    with open(gu_path, encoding="utf-8") as f:
        gu_fc = json.load(f)

    sig_cd_by_name = {
        feat["properties"]["SIG_KOR_NM"]: feat["properties"]["SIG_CD"]
        for feat in gu_fc["features"]
    }

    dong_by_gu = defaultdict(list)
    dongs = []
    for feat in dong_fc["features"]:
        # adm_nm 형식: "서울특별시 <구> <동>"
        adm_nm = feat["properties"]["adm_nm"]
        adm_cd = feat["properties"]["adm_cd"]
        parts = adm_nm.split(" ")
        gu_name = parts[1]
        dong_name = parts[2] if len(parts) > 2 else parts[-1]
        geom = shape(feat["geometry"])
        dong_by_gu[gu_name].append(geom)
        dongs.append({
            "code": adm_cd,
            "name": dong_name,
            "guName": gu_name,
            "coordinates": round_coords(to_multipolygon_coords(mapping(geom))),
        })
    dongs.sort(key=lambda d: d["code"])

    # 구 경계는 별도 파일을 쓰지 않고, 소속 행정동을 union(dissolve)해서 도출한다.
    # 이렇게 하면 "소분류를 모두 합치면 센터(구) 영역과 정확히 일치" 불변식(#47/#51)이
    # 항상 성립한다. SIG_CD(행안부 코드)는 원본 구 파일에서 이름으로 매칭해 가져온다.
    districts = []
    for gu_name, geoms in dong_by_gu.items():
        merged = unary_union(geoms)
        districts.append({
            "code": sig_cd_by_name[gu_name],
            "name": gu_name,
            "dongCount": len(geoms),
            "coordinates": round_coords(to_multipolygon_coords(mapping(merged))),
        })
    districts.sort(key=lambda d: d["code"])

    assert len(districts) == 25, f"expected 25 districts, got {len(districts)}"
    assert len(dongs) == 424, f"expected 424 dongs, got {len(dongs)}"
    assert sum(d["dongCount"] for d in districts) == len(dongs)

    with open(f"{out_dir}/seoulDistricts.json", "w", encoding="utf-8") as f:
        json.dump(districts, f, ensure_ascii=False, separators=(",", ":"))
    with open(f"{out_dir}/seoulDongs.json", "w", encoding="utf-8") as f:
        json.dump(dongs, f, ensure_ascii=False, separators=(",", ":"))

    print(f"districts: {len(districts)}, dongs: {len(dongs)}")


if __name__ == "__main__":
    if len(sys.argv) != 4:
        print(
            "usage: prepare-seoul-boundaries.py <dong-geojson> <gu-geojson> <output-dir>"
        )
        sys.exit(1)
    main(sys.argv[1], sys.argv[2], sys.argv[3])
