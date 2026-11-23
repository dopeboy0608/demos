"""
경기도 시/군/구 경계 데이터를 region-view 목업에서 쓰는 형태로 가공한다(#84, #91).

데이터 출처: cubensys/Korea_District (GitHub, https://github.com/cubensys/Korea_District)
  - 2_대한민국_기초자치단체/대한민국_기초자치단체_경계_2017.geojson (전국 250개 시/군/구, WGS84)
  해당 저장소는 라이선스가 명시돼 있지 않다(비상업 개인 데모 프로젝트에 한해 사용자가 직접
  사용을 확정, #64와 동일 조건).

서울과 달리 이 저장소에는 경기도 읍면동 단위 경계가 없다(시/군/구 단위까지만 존재). 따라서
소분류·세분류는 이 스크립트의 범위가 아니며, #92(경기 센터 연동)에서 radialSubdivision으로
시뮬레이션한다. 이 스크립트는 1회성이다 — 실행해 만든 결과(gyeonggiDistricts.json)만
src/features/region-view/data/에 커밋하고, 빌드 파이프라인에는 포함하지 않는다.

실행:
  python3 -m venv .venv && .venv/bin/pip install shapely
  .venv/bin/python3 scripts/data/prepare-gyeonggi-boundaries.py <전국-기초자치단체-geojson-path> <output-dir>
"""

import json
import sys

from shapely.geometry import mapping, shape

# 원본 시/군/구 경계는 평균 4천 점/구 수준으로 매우 촘촘해(해안선 등) 42개 전체가 4.5MB에
# 달한다. simplify(tolerance, preserve_topology=True)로 다듬어도 면적 변화는 사실상 0(테스트
# 결과 최대 상대 오차 ~1e-14)이라 중복·거의 직선인 점들만 제거된다는 뜻이다. 서울(union으로
# 이미 단순화됨, 평균 220점/구) 수준에 맞춰 0.0005도(약 50m)로 단순화한다.
SIMPLIFY_TOLERANCE_DEGREES = 0.0005


def round_coords(obj, nd=6):
    if isinstance(obj, float):
        return round(obj, nd)
    # shapely.mapping()은 좌표를 리스트가 아닌 튜플로 반환하므로 둘 다 처리한다.
    if isinstance(obj, (list, tuple)):
        return [round_coords(x, nd) for x in obj]
    return obj


def to_multipolygon_coords(geom):
    # region-view의 RawDraftPolygon.geom.coordinates 형식: number[][][][]
    if geom["type"] == "Polygon":
        return [geom["coordinates"]]
    if geom["type"] == "MultiPolygon":
        return geom["coordinates"]
    raise ValueError(f"unsupported geometry type: {geom['type']}")


def main(sigungu_path: str, out_dir: str) -> None:
    with open(sigungu_path, encoding="utf-8") as f:
        fc = json.load(f)

    gyeonggi_features = [
        feat
        for feat in fc["features"]
        if str(feat["properties"].get("SIG_CD", "")).startswith("41")
    ]
    gyeonggi_features.sort(key=lambda feat: feat["properties"]["SIG_CD"])

    districts = []
    for feat in gyeonggi_features:
        # shapely를 거쳐 좌표를 정규화(round_coords가 기대하는 리스트 형태로)한다. 서울
        # 스크립트와 달리 union이 필요 없어(이미 시/군/구 단위) simplify()→mapping()만 적용.
        simplified = shape(feat["geometry"]).simplify(
            SIMPLIFY_TOLERANCE_DEGREES, preserve_topology=True
        )
        geom = mapping(simplified)
        districts.append(
            {
                "code": feat["properties"]["SIG_CD"],
                "name": feat["properties"]["SIG_KOR_NM"],
                "coordinates": round_coords(to_multipolygon_coords(geom)),
            }
        )

    with open(f"{out_dir}/gyeonggiDistricts.json", "w", encoding="utf-8") as f:
        json.dump(districts, f, ensure_ascii=False)

    print(f"경기도 시/군/구 {len(districts)}개 저장 완료")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(
            "usage: prepare-gyeonggi-boundaries.py <전국-기초자치단체-geojson-path> <output-dir>"
        )
        sys.exit(1)
    main(sys.argv[1], sys.argv[2])
