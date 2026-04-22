import { style } from '@vanilla-extract/css';

import { vars } from '@/vars.css';

const bpTablet = 'screen and (min-width: 768px)';
const bpDesktop = 'screen and (min-width: 1200px)';

export const page = style({
  minHeight: '100vh',
  backgroundColor: vars.colors.white,
});

export const shell = style({
  boxSizing: 'border-box',
  maxWidth: '1120px',
  width: '100%',
  margin: '0 auto',
  padding: `0 ${vars.spacing.md} ${vars.spacing.lg}`,
  '@media': {
    [bpTablet]: {
      padding: `0 ${vars.spacing.lg} ${vars.spacing.xl}`,
    },
  },
});

export const content = style({
  width: '100%',
  maxWidth: '640px',
  margin: '0 auto',
  display: 'grid',
  gap: vars.spacing.lg,
  paddingTop: vars.spacing.lg,
  '@media': {
    [bpDesktop]: {
      gap: vars.spacing.xl,
    },
  },
});

export const metricsGrid = style({
  display: 'grid',
  gap: vars.spacing.md,
  '@media': {
    [bpTablet]: {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
  },
});

export const footer = style({
  textAlign: 'center',
  color: vars.colors.subDark,
  fontSize: vars.font.size.xs,
  paddingTop: vars.spacing.sm,
  '@media': {
    [bpDesktop]: {
      paddingTop: vars.spacing.md,
    },
  },
});
