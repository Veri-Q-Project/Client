import type { ReactNode } from 'react';

import * as styles from './appHeader.css';

type AppHeaderProps = {
  iconAlt?: string;
  iconSrc: string;
  rightSlot?: ReactNode;
  title?: string;
};

export default function AppHeader({
  iconAlt = '',
  iconSrc,
  rightSlot,
  title = 'Veri-Q',
}: AppHeaderProps) {
  return (
    <header className={styles.root}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span aria-hidden className={styles.brandIcon}>
            <img alt={iconAlt} className={styles.brandIconImage} src={iconSrc} />
          </span>
          <span>{title}</span>
        </div>

        {rightSlot ? <div className={styles.rightSlot}>{rightSlot}</div> : null}
      </div>
    </header>
  );
}
