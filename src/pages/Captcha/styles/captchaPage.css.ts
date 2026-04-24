import { style } from '@vanilla-extract/css';

import { vars } from '@/vars.css';

const bpTablet = 'screen and (min-width: 768px)';

export const page = style({
  minHeight: '100vh',
  backgroundColor: vars.colors.white,
});

export const shell = style({
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: '680px',
  margin: '0 auto',
  padding: `24px ${vars.spacing.md} 48px`,
  display: 'grid',
  gap: vars.spacing.lg,
  '@media': {
    [bpTablet]: {
      padding: `32px ${vars.spacing.xl} 56px`,
    },
  },
});

export const intro = style({
  display: 'grid',
  gap: vars.spacing.sm,
  textAlign: 'center',
});

export const title = style({
  margin: 0,
  color: vars.colors.black,
  fontSize: 'clamp(28px, 5vw, 42px)',
  fontWeight: vars.font.weight.bold,
  lineHeight: 1.2,
});

export const description = style({
  margin: 0,
  color: vars.colors.subText,
  fontSize: vars.font.size.md,
  lineHeight: 1.5,
});

export const card = style({
  display: 'grid',
  gap: vars.spacing.md,
  backgroundColor: '#2E333D',
  borderRadius: vars.radius.lg,
  padding: vars.spacing.lg,
});

export const providerLabel = style({
  margin: 0,
  color: vars.colors.white,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.medium,
  textAlign: 'center',
});

export const widgetFrame = style({
  backgroundColor: vars.colors.white,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.colors.border}`,
  padding: vars.spacing.md,
});

export const enterpriseBox = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '78px',
  gap: vars.spacing.xs,
});

export const captchaError = style({
  margin: 0,
  color: '#B42318',
  fontSize: vars.font.size.xs,
  lineHeight: 1.4,
});

export const captchaHint = style({
  margin: 0,
  color: vars.colors.mainXLight,
  fontSize: vars.font.size.sm,
  lineHeight: 1.4,
});

export const footer = style({
  display: 'grid',
  gap: vars.spacing.sm,
});

export const verifyButton = style({
  width: '100%',
  border: 0,
  borderRadius: vars.radius.md,
  backgroundColor: vars.colors.main,
  color: vars.colors.white,
  padding: `${vars.spacing.sm} ${vars.spacing.md}`,
  fontSize: vars.font.size.md,
  fontWeight: vars.font.weight.semibold,
  cursor: 'pointer',
  selectors: {
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
  },
});

export const feedback = style({
  margin: 0,
  color: vars.colors.subText,
  fontSize: vars.font.size.sm,
  lineHeight: 1.4,
});
