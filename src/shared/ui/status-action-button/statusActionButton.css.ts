import { style, styleVariants } from '@vanilla-extract/css';

import { vars } from '@/vars.css';

export const root = style({
  width: '100%',
  minWidth: '0',
  height: '52px',
  padding: `0 ${vars.spacing.md}`,
  border: 'none',
  borderRadius: '999px',
  fontSize: vars.font.size.xl,
  fontWeight: vars.font.weight.semibold,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.spacing.sm,
});

export const filledTone = styleVariants({
  safe: {
    backgroundColor: '#11D483',
    color: vars.colors.white,
  },
  warning: {
    backgroundColor: vars.colors.warning,
    color: vars.colors.black,
  },
  critical: {
    backgroundColor: vars.colors.error,
    color: vars.colors.white,
  },
});

export const iconWrap = style({
  display: 'inline-flex',
  width: '14px',
  height: '14px',
  flexShrink: 0,
});

export const iconImage = style({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
});
