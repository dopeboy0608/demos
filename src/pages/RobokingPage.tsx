import { useState } from 'react';

import { GameStage } from '@/features/roboking/components/GameStage';
import { MainCover } from '@/features/roboking/components/MainCover';
import { kitchenStageConfig } from '@/features/roboking/helper/kitchenStageConfig';

type RobokingScreen = 'cover' | 'kitchen';

export function RobokingPage() {
  const [screen, setScreen] = useState<RobokingScreen>('cover');
  const [kitchenAttempt, setKitchenAttempt] = useState(0);

  if (screen === 'kitchen') {
    return (
      <GameStage
        key={kitchenAttempt}
        config={kitchenStageConfig}
        onRetry={() => setKitchenAttempt((prev) => prev + 1)}
        onExitToMain={() => setScreen('cover')}
      />
    );
  }

  return (
    <MainCover
      onStart={() => {
        setKitchenAttempt((prev) => prev + 1);
        setScreen('kitchen');
      }}
    />
  );
}
