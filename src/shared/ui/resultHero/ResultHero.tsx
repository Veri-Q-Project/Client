import type { ReactNode } from 'react';

import { statusMarkIconByTone } from '@/shared/icon/resultIcons';
import type { ResultTone } from '@/shared/types/resultTone';

import * as styles from './resultHero.css';

type ResultHeroProps = {
  description: ReactNode;
  title: ReactNode;
  tone: ResultTone;
};

export default function ResultHero({ description, title, tone }: ResultHeroProps) {
  return (
    <header className={styles.root}>
      <div className={styles.statusHalo}>
        <img alt="" aria-hidden className={styles.statusBadge} src={statusMarkIconByTone[tone]} />
      </div>

      <h1 className={styles.titleTone[tone]}>{title}</h1>
      <p className={styles.descriptionTone[tone]}>{description}</p>
    </header>
  );
}
