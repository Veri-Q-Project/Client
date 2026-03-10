import { style, styleVariants } from '@vanilla-extract/css';

import { vars } from '@/vars.css';

export const card = style({
  padding: vars.spacing.md,
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.colors.border}`,
  backgroundColor: vars.colors.white,
  display: 'grid',
  gap: vars.spacing.sm,
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const label = style({
  color: vars.colors.subText,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.medium,
});

export const iconWrap = style({
  display: 'inline-flex',
  width: '16px',
  height: '20px',
  flexShrink: 0,
});

export const iconImage = style({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
});

export const level = style({
  margin: 0,
  color: vars.colors.success,
  fontSize: vars.font.size['4xl'],
  lineHeight: 1.2,
});

export const levelTone = styleVariants({
  safe: {
    color: vars.colors.success,
  },
  warning: {
    color: vars.colors.warning,
  },
  critical: {
    color: vars.colors.error,
  },
});

export const description = style({
  margin: 0,
  color: vars.colors.subText,
  fontSize: vars.font.size.sm,
  lineHeight: 1.4,
});
