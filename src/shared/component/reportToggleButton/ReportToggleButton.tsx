import detailViewIcon from '@/shared/icon/자세히보기.svg';

import * as styles from './reportToggleButton.css';

type ReportToggleButtonProps = {
  isOpen: boolean;
  onToggle?: () => void;
};

export default function ReportToggleButton({ isOpen, onToggle }: ReportToggleButtonProps) {
  return (
    <button aria-expanded={isOpen} className={styles.button} onClick={onToggle} type="button">
      <span className={styles.label}>상세 분석 리포트 보기</span>
      <span
        aria-hidden
        className={`${styles.trailingIcon} ${isOpen ? styles.trailingIconOpen : ''}`}
      >
        <img alt="" className={styles.trailingIconImage} src={detailViewIcon} />
      </span>
    </button>
  );
}
