import { Button, Typography } from 'antd';

import { RecommendForm } from './RecommendForm';
import { useRegisterResult } from '../hooks/useRegisterResult';

import '../roboking.css';

const { Title } = Typography;

interface ResultScreenProps {
  totalScore: number;
  onRetry: () => void;
  onExitToMain: () => void;
}

export function ResultScreen({
  totalScore,
  onRetry,
  onExitToMain,
}: ResultScreenProps) {
  const { response } = useRegisterResult(totalScore);

  return (
    <div className="roboking-stage">
      <div className="roboking-stage-inner roboking-result-stage">
        {!response && <Title level={3}>결과 확인 중...</Title>}

        {response?.win === false && (
          <>
            <Title level={2} className="roboking-title">
              아쉽습니다, 당첨되지 않았습니다
            </Title>
            <p>총점: {response.totalScore}</p>
            <div className="roboking-result-buttons">
              <Button type="primary" onClick={onRetry}>
                다시하기
              </Button>
              <Button onClick={onExitToMain}>메인으로</Button>
            </div>
          </>
        )}

        {response?.win === true && <RecommendForm />}
      </div>
    </div>
  );
}
