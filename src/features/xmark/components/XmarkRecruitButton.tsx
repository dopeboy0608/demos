interface XmarkRecruitButtonProps {
  onClick: () => void;
}

export function XmarkRecruitButton({ onClick }: XmarkRecruitButtonProps) {
  return (
    <button type="button" className="xmark-recruit" onClick={onClick}>
      RECRUIT
    </button>
  );
}
