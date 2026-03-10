import shareResultIcon from '@/shared/icon/결과 공유.svg';

import * as styles from './resultActionButtons.css';

type ResultActionButtonsProps = {
  onRescanClick?: () => void;
  onShareClick?: () => void;
};

export default function ResultActionButtons({
  onRescanClick,
  onShareClick,
}: ResultActionButtonsProps) {
  return (
    <section className={styles.root}>
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
