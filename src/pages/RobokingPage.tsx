import { useState } from 'react';

import { GameStage } from '@/features/roboking/components/GameStage';
import { MainCover } from '@/features/roboking/components/MainCover';
import { ResultScreen } from '@/features/roboking/components/ResultScreen';
import { bedStageConfig } from '@/features/roboking/helper/bedStageConfig';
import { kitchenStageConfig } from '@/features/roboking/helper/kitchenStageConfig';
import { livingStageConfig } from '@/features/roboking/helper/livingStageConfig';

type RobokingScreen = 'cover' | 'kitchen' | 'living' | 'bed' | 'result';

export function RobokingPage() {
  const [screen, setScreen] = useState<RobokingScreen>('cover');
  const [stageAttempt, setStageAttempt] = useState(0);
  const [stageScores, setStageScores] = useState<number[]>([]);

  const goToScreen = (next: RobokingScreen) => {
    setStageAttempt((prev) => prev + 1);
    setScreen(next);
  };

  const restartFromKitchen = () => {
    setStageScores([]);
    goToScreen('kitchen');
  };

  if (screen === 'kitchen') {
    return (
      <GameStage
        key={stageAttempt}
        config={kitchenStageConfig}
        clearLabel="다음 스테이지로"
        onClear={(score) => {
          setStageScores([score]);
          goToScreen('living');
        }}
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
        onClear={(score) => {
          setStageScores((prev) => [...prev, score]);
          goToScreen('bed');
        }}
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
        clearLabel="결과 보기"
        onClear={(score) => {
          setStageScores((prev) => [...prev, score]);
          goToScreen('result');
        }}
        onRetry={() => setStageAttempt((prev) => prev + 1)}
        onExitToMain={() => setScreen('cover')}
      />
    );
  }

  if (screen === 'result') {
    // 세 스테이지 점수를 합산하는 원본 공식은 코드에서 확인하지 못해, 데모용으로
    // 세 스테이지 점수(0~100%)의 평균을 totalScore로 사용한다.
    const totalScore = Math.round(
      stageScores.reduce((sum, score) => sum + score, 0) /
        (stageScores.length || 1),
    );

    return (
      <ResultScreen
        totalScore={totalScore}
        onRetry={restartFromKitchen}
        onExitToMain={() => setScreen('cover')}
      />
    );
  }

  return <MainCover onStart={() => goToScreen('kitchen')} />;
}
