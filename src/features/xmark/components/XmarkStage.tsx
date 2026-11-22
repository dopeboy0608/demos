import { useState } from 'react';
import { message } from 'antd';

import { XmarkFooter } from './XmarkFooter';
import { XmarkGnb } from './XmarkGnb';
import { XmarkLogo } from './XmarkLogo';
import { XmarkRecruitButton } from './XmarkRecruitButton';
import { XmarkUtilPanel } from './XmarkUtilPanel';
import { XMARK_COMING_SOON_MESSAGE } from '../helper/xmarkConstants';
import type { XmarkTab } from '../helper/xmarkConstants';

import '../xmark.css';

const TAB_PLACEHOLDER_LABEL: Record<XmarkTab, string> = {
  portfolio: 'Portfolio 영역 (다음 서브태스크에서 구현)',
  about: 'About 영역 (다음 서브태스크에서 구현)',
  contact: 'Contact 영역 (다음 서브태스크에서 구현)',
  story: 'Portfolio 영역 (다음 서브태스크에서 구현)',
};

export function XmarkStage() {
  const [activeTab, setActiveTab] = useState<XmarkTab>('portfolio');

  const showComingSoon = () => message.info(XMARK_COMING_SOON_MESSAGE);

  return (
    <div className="xmark-stage">
      <XmarkLogo />
      <XmarkGnb
        activeTab={activeTab}
        onSelect={setActiveTab}
        onStorySelect={showComingSoon}
      />
      <XmarkUtilPanel />
      <XmarkRecruitButton onClick={showComingSoon} />

      <div className="xmark-content">{TAB_PLACEHOLDER_LABEL[activeTab]}</div>

      <XmarkFooter />
    </div>
  );
}
