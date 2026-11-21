import { useState } from 'react';

import { GameStage } from '@/features/roboking/components/GameStage';
import { MainCover } from '@/features/roboking/components/MainCover';
import { kitchenStageConfig } from '@/features/roboking/helper/kitchenStageConfig';

type RobokingScreen = 'cover' | 'kitchen';

export function RobokingPage() {
  const [screen, setScreen] = useState<RobokingScreen>('cover');

  if (screen === 'kitchen') {
    return <GameStage config={kitchenStageConfig} />;
  }

  return <MainCover onStart={() => setScreen('kitchen')} />;
}
