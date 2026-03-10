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

export const hero = style({
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

export const heroTitle = style({
  margin: 0,
  color: vars.colors.black,
  fontSize: 'clamp(32px, 5vw, 48px)',
  lineHeight: 1.15,
  letterSpacing: '-0.02em',
});

export const heroDescription = style({
  margin: 0,
  color: vars.colors.subText,
  fontSize: vars.font.size.md,
  lineHeight: 1.6,
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

export const reportPanel = style({
  padding: vars.spacing.md,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.colors.border}`,
  backgroundColor: vars.colors.sub,
  display: 'grid',
  gap: vars.spacing.sm,
});

export const reportPanelTitle = style({
  margin: 0,
  color: vars.colors.black,
  fontSize: vars.font.size.md,
  fontWeight: vars.font.weight.semibold,
});

export const reportList = style({
  margin: 0,
  paddingLeft: vars.spacing.md,
  display: 'grid',
  gap: vars.spacing.xs,
  color: vars.colors.subText,
  fontSize: vars.font.size.sm,
  lineHeight: 1.5,
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
