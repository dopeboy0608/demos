// stage_kitchen.fla(XFL) LIBRARY/corner_icon.xml의 "Layer 1"(애니메이션 레이어)을 그대로 옮긴 것.
// 아이템이 튀어나왔다가(스케일 업) 제자리로 돌아오고, 20프레임에 알파 0으로 사라지는 클래식 트윈.
export const CORNER_ICON_LAYER_1_XML = `
<DOMLayer name="Layer 1" color="#4FFF4F" current="true" isSelected="true">
  <frames>
    <DOMFrame index="0" duration="6" tweenType="motion" motionTweenSnap="true" keyMode="22017">
      <elements>
        <DOMSymbolInstance libraryItemName="mc/corner_icon_mc" selected="true" centerPoint3DX="19.5" centerPoint3DY="19.5">
          <transformationPoint>
            <Point x="19.5" y="19.5"/>
          </transformationPoint>
        </DOMSymbolInstance>
      </elements>
    </DOMFrame>
    <DOMFrame index="6" duration="5" keyMode="9728">
      <elements>
        <DOMSymbolInstance libraryItemName="mc/corner_icon_mc" selected="true" centerPoint3DX="19.5" centerPoint3DY="19.5">
          <matrix>
            <Matrix a="1.57998657226563" d="1.57998657226563" tx="-11.3" ty="-11.3"/>
          </matrix>
          <transformationPoint>
            <Point x="19.5" y="19.5"/>
          </transformationPoint>
        </DOMSymbolInstance>
      </elements>
    </DOMFrame>
    <DOMFrame index="11" duration="9" tweenType="motion" motionTweenSnap="true" keyMode="22017">
      <elements>
        <DOMSymbolInstance libraryItemName="mc/corner_icon_mc" selected="true" centerPoint3DX="19.5" centerPoint3DY="19.5">
          <transformationPoint>
            <Point x="19.5" y="19.5"/>
          </transformationPoint>
        </DOMSymbolInstance>
      </elements>
    </DOMFrame>
    <DOMFrame index="20" keyMode="9728">
      <elements>
        <DOMSymbolInstance libraryItemName="mc/corner_icon_mc" centerPoint3DX="19.5" centerPoint3DY="19.5">
          <transformationPoint>
            <Point x="19.5" y="19.5"/>
          </transformationPoint>
          <color>
            <Color alphaMultiplier="0"/>
          </color>
        </DOMSymbolInstance>
      </elements>
    </DOMFrame>
  </frames>
</DOMLayer>
`;

// LIBRARY/motion/mc/aura2.xml 전체. 작게 시작해(글로우 없음) 59프레임에 걸쳐 커지면서
// 노란 GlowFilter가 함께 강해지는 "아이템 획득 아우라" 트윈.
export const AURA2_LAYER_XML = `
<DOMLayer name="Layer 1" color="#4FFF4F" current="true" isSelected="true">
  <frames>
    <DOMFrame index="0" duration="59" tweenType="motion" motionTweenSnap="true" keyMode="22017" acceleration="-100">
      <elements>
        <DOMSymbolInstance libraryItemName="motion/mc/aura3:mc" centerPoint3DX="88.5" centerPoint3DY="88">
          <matrix>
            <Matrix a="0.29998779296875" d="0.29998779296875" tx="61.95" ty="61.6"/>
          </matrix>
          <transformationPoint>
            <Point x="88.5" y="88"/>
          </transformationPoint>
          <filters>
            <GlowFilter blurX="0" blurY="0" strength="0"/>
          </filters>
        </DOMSymbolInstance>
      </elements>
    </DOMFrame>
    <DOMFrame index="59" keyMode="9728">
      <elements>
        <DOMSymbolInstance libraryItemName="motion/mc/aura3:mc" centerPoint3DX="88.5" centerPoint3DY="88">
          <matrix>
            <Matrix a="1.10000610351563" d="1.10000610351563" tx="-8.8" ty="-8.8"/>
          </matrix>
          <transformationPoint>
            <Point x="88.45" y="88"/>
          </transformationPoint>
          <filters>
            <GlowFilter blurX="20" blurY="20" color="#FFFF00" quality="3"/>
          </filters>
        </DOMSymbolInstance>
      </elements>
    </DOMFrame>
  </frames>
</DOMLayer>
`;
