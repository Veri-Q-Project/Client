import { style } from '@vanilla-extract/css';

import { vars } from '@/vars.css';

const bpTablet = 'screen and (min-width: 768px)';
const bpDesktop = 'screen and (min-width: 1200px)';

export const root = style({
  width: '100%',
  borderBottom: `1px solid ${vars.colors.border}`,
  backgroundColor: vars.colors.white,
});

export const inner = style({
  boxSizing: 'border-box',
  maxWidth: '1120px',
  width: '100%',
  minHeight: '72px',
  margin: '0 auto',
  padding: `0 ${vars.spacing.md}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.spacing.md,
  '@media': {
    [bpTablet]: {
      minHeight: '96px',
      padding: `0 ${vars.spacing.lg}`,
    },
    [bpDesktop]: {
      minHeight: '120px',
      padding: `0 ${vars.spacing.xl}`,
    },
  },
});

export const brand = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.spacing.sm,
  color: vars.colors.black,
  fontSize: vars.font.size['2xl'],
  fontWeight: vars.font.weight.bold,
  lineHeight: 1,
  whiteSpace: 'nowrap',
  '@media': {
    [bpTablet]: {
      gap: vars.spacing.md,
      fontSize: vars.font.size['4xl'],
    },
    [bpDesktop]: {
      fontSize: vars.font.size['5xl'],
    },
  },
});

export const brandIcon = style({
  display: 'inline-flex',
  width: '28px',
  height: '28px',
  flexShrink: 0,
  '@media': {
    [bpTablet]: {
      width: '40px',
      height: '40px',
    },
    [bpDesktop]: {
      width: '48px',
      height: '48px',
    },
  },
});

export const brandIconImage = style({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
});

export const rightSlot = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.spacing.sm,
  fontSize: vars.font.size.sm,
  '@media': {
    [bpTablet]: {
      fontSize: vars.font.size.md,
    },
  },
});
