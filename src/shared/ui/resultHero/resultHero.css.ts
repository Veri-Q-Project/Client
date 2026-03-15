import { style, styleVariants } from '@vanilla-extract/css';

import type { ResultTone } from '@/shared/types/resultTone';

import { vars } from '@/vars.css';

export const root = style({
  display: 'grid',
  justifyItems: 'center',
  textAlign: 'center',
  gap: vars.spacing.md,
});

export const statusHalo = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'clamp(216px, 40vw, 270px)',
  height: 'clamp(216px, 40vw, 270px)',
});

export const statusBadge = style({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'contain',
});

const baseTitle = style({
  margin: 0,
  fontWeight: vars.font.weight.bold,
  letterSpacing: '-0.02em',
});

export const titleTone = styleVariants<Record<ResultTone, object>>({
  critical: [
    baseTitle,
    {
      color: vars.colors.error,
      fontSize: 'clamp(30px, 4.4vw, 44px)',
      lineHeight: 1.25,
    },
  ],
  safe: [
    baseTitle,
    {
      color: vars.colors.black,
      fontSize: 'clamp(32px, 5vw, 48px)',
      lineHeight: 1.15,
    },
  ],
  warning: [
    baseTitle,
    {
      color: vars.colors.black,
      fontSize: 'clamp(32px, 5vw, 48px)',
      lineHeight: 1.15,
    },
  ],
});

const baseDescription = style({
  margin: 0,
  fontSize: vars.font.size.md,
  lineHeight: 1.6,
});

export const descriptionTone = styleVariants<Record<ResultTone, object>>({
  critical: [
    baseDescription,
    {
      color: vars.colors.resultCriticalText,
    },
  ],
  safe: [
    baseDescription,
    {
      color: vars.colors.subText,
    },
  ],
  warning: [
    baseDescription,
    {
      color: vars.colors.resultWarningText,
    },
  ],
});
