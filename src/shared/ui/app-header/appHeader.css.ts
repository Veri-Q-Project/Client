import { style } from '@vanilla-extract/css';

import { vars } from '@/vars.css';

const bpTablet = 'screen and (min-width: 768px)';

export const root = style({
  width: '100%',
  borderBottom: `1px solid ${vars.colors.border}`,
  backgroundColor: vars.colors.white,
});

export const inner = style({
  width: 'min(1120px, 100%)',
  minHeight: vars.spacing.header,
  margin: '0 auto',
  padding: `0 ${vars.spacing.md}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.spacing.md,
  '@media': {
    [bpTablet]: {
      padding: `0 ${vars.spacing.lg}`,
    },
  },
});

export const brand = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.spacing.sm,
  color: vars.colors.black,
  fontSize: vars.font.size.lg,
  fontWeight: vars.font.weight.bold,
});

export const brandIcon = style({
  display: 'inline-flex',
  width: '24px',
  height: '24px',
  flexShrink: 0,
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
});
