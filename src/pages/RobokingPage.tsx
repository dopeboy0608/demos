import { useState } from 'react';

import { GameStage } from '@/features/roboking/components/GameStage';
import { MainCover } from '@/features/roboking/components/MainCover';
import { bedStageConfig } from '@/features/roboking/helper/bedStageConfig';
import { kitchenStageConfig } from '@/features/roboking/helper/kitchenStageConfig';
import { livingStageConfig } from '@/features/roboking/helper/livingStageConfig';

type RobokingScreen = 'cover' | 'kitchen' | 'living' | 'bed';

export function RobokingPage() {
  const [screen, setScreen] = useState<RobokingScreen>('cover');
  const [stageAttempt, setStageAttempt] = useState(0);

  const goToScreen = (next: RobokingScreen) => {
    setStageAttempt((prev) => prev + 1);
    setScreen(next);
  };

  if (screen === 'kitchen') {
    return (
      <GameStage
        key={stageAttempt}
        config={kitchenStageConfig}
        clearLabel="다음 스테이지로"
        onClear={() => goToScreen('living')}
        onRetry={() => setStageAttempt((prev) => prev + 1)}
        onExitToMain={() => setScreen('cover')}
      />
    );
  }

  if (screen === 'living') {
    return (
      <GameStage
        key={stageAttempt}
        config={livingStageConfig}
        clearLabel="다음 스테이지로"
        onClear={() => goToScreen('bed')}
        onRetry={() => setStageAttempt((prev) => prev + 1)}
        onExitToMain={() => setScreen('cover')}
      />
    );
  }

  if (screen === 'bed') {
    return (
      <GameStage
        key={stageAttempt}
        config={bedStageConfig}
        // 07(결과 화면)은 아직 구현 전이라 침실 클리어 후에는 메인으로 돌아간다.
        clearLabel="메인으로"
        onClear={() => setScreen('cover')}
        onRetry={() => setStageAttempt((prev) => prev + 1)}
        onExitToMain={() => setScreen('cover')}
      />
    );
  }

  return <MainCover onStart={() => goToScreen('kitchen')} />;
}
