import { useState } from 'react';
import { message } from 'antd';

import { XmarkAbout } from './XmarkAbout';
import { XmarkContact } from './XmarkContact';
import { XmarkFooter } from './XmarkFooter';
import { XmarkGnb } from './XmarkGnb';
import { XmarkLogo } from './XmarkLogo';
import { XmarkPortfolioGallery } from './XmarkPortfolioGallery';
import { XmarkRecruitButton } from './XmarkRecruitButton';
import { XmarkUtilPanel } from './XmarkUtilPanel';
import { XMARK_COMING_SOON_MESSAGE } from '../helper/xmarkConstants';
import type { XmarkTab } from '../helper/xmarkConstants';

import '../xmark.css';

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

      <div className="xmark-content">
        {activeTab === 'about' ? (
          <XmarkAbout />
        ) : activeTab === 'contact' ? (
          <XmarkContact />
        ) : (
          <XmarkPortfolioGallery />
        )}
      </div>

      <XmarkFooter />
    </div>
  );
}
