import { VoninHome } from './VoninHome';
import { VoninTopNavi } from './VoninTopNavi';
import { VoninUtilButtons } from './VoninUtilButtons';

import '../vonin.css';

export function VoninStage() {
  return (
    <div className="vonin-stage">
      <header className="vonin-header">
        <VoninTopNavi />
        <VoninUtilButtons />
      </header>
      <VoninHome />
    </div>
  );
}
