import type { ButtonHTMLAttributes, ReactNode } from 'react';

import * as styles from './statusActionButton.css';

export type StatusTone = 'safe' | 'warning' | 'critical';

type StatusActionButtonProps = {
  children: ReactNode;
  iconSrc?: string;
  tone: StatusTone;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

export default function StatusActionButton({
  children,
  className,
  iconSrc,
  tone,
  type = 'button',
  ...buttonProps
}: StatusActionButtonProps) {
  const buttonClassName = className
    ? `${styles.root} ${styles.filledTone[tone]} ${className}`
    : `${styles.root} ${styles.filledTone[tone]}`;

  return (
    <button className={buttonClassName} type={type} {...buttonProps}>
      {iconSrc ? (
        <span aria-hidden className={styles.iconWrap}>
          <img alt="" className={styles.iconImage} src={iconSrc} />
        </span>
      ) : null}
      {children}
    </button>
  );
}
