import { shareResultIcon } from '@/shared/icon/actionIcons';

import * as styles from './resultActionButtons.css';

type ResultActionButtonsProps = {
  onReportClick?: () => void;
  onRescanClick?: () => void;
  onShareClick?: () => void;
  reportLabel?: string;
};

export default function ResultActionButtons({
  onReportClick,
  onRescanClick,
  onShareClick,
  reportLabel = '신고하기',
}: ResultActionButtonsProps) {
  return (
    <section className={styles.root}>
      {onReportClick ? (
        <button className={styles.reportButton} onClick={onReportClick} type="button">
          {reportLabel}
        </button>
      ) : null}

      <button className={styles.rescanButton} onClick={onRescanClick} type="button">
        다시 스캔하기
      </button>

      <button className={styles.shareButton} onClick={onShareClick} type="button">
        <span aria-hidden className={styles.shareIcon}>
          <img alt="" className={styles.shareIconImage} src={shareResultIcon} />
        </span>
        결과 공유
      </button>
    </section>
  );
}
