import { message } from 'antd';
import { useEffect, useState } from 'react';

// ProjectMain.as의 sendHandler/sendComplete 그대로: 실제 전송 없음(결정 사항 ③), 성공 메시지는
// 원본 alert() 문구를 그대로 사용.
const SUCCESS_MESSAGE =
  '문의해 주셔서 감사합니다. 최대한 빨리 확인하여 연락 드리겠습니다.';

interface XmarkContactFormProps {
  onClose: () => void;
}

export function XmarkContactForm({ onClose }: XmarkContactFormProps) {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    message.success(SUCCESS_MESSAGE);
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: 배경 클릭 닫기는 마우스 전용 편의 기능이고, Esc 키와 CLOSE 버튼으로 키보드 접근을 보장한다.
    // biome-ignore lint/a11y/useKeyWithClickEvents: 위와 동일한 이유.
    <div className="xmark-popup-backdrop" onClick={onClose}>
      {/** biome-ignore lint/a11y/noStaticElementInteractions: 카드 내부 클릭이 배경으로 전파되어 닫히는 것만 막는 용도. */}
      {/** biome-ignore lint/a11y/useKeyWithClickEvents: 위와 동일한 이유. */}
      <div
        className="xmark-contact-form-card"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="xmark-popup-close" onClick={onClose}>
          CLOSE
        </button>
        <h3 className="xmark-contact-form-title">프로젝트 문의</h3>
        {submitted ? (
          <p className="xmark-contact-form-success">{SUCCESS_MESSAGE}</p>
        ) : (
          <form className="xmark-contact-form" onSubmit={handleSubmit}>
            <input
              className="xmark-contact-form-input"
              placeholder="이름"
              required
            />
            <input className="xmark-contact-form-input" placeholder="회사명" />
            <input
              className="xmark-contact-form-input"
              type="email"
              placeholder="이메일"
              required
            />
            <input className="xmark-contact-form-input" placeholder="연락처" />
            <input
              className="xmark-contact-form-input"
              placeholder="제목"
              required
            />
            <textarea
              className="xmark-contact-form-textarea"
              placeholder="문의 내용"
              rows={5}
              required
            />
            <button type="submit" className="xmark-contact-form-submit">
              보내기
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
