import { useEffect, useState } from 'react';

import { registerScore } from '../api/registerApi';
import type { RegisterResponse } from '../helper/types';

export function useRegisterResult(totalScore: number) {
  const [response, setResponse] = useState<RegisterResponse | null>(null);

  useEffect(() => {
    registerScore({ id: 'demo', key: 'demo', totalScore }).then(setResponse);
  }, [totalScore]);

  return { response };
}
