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

export const modeSwitch = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: vars.spacing.sm,
});

export const modeButton = style({
  border: '1px solid rgba(255, 255, 255, 0.35)',
  borderRadius: vars.radius.md,
  backgroundColor: 'transparent',
  color: vars.colors.white,
  padding: `${vars.spacing.sm} ${vars.spacing.md}`,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.medium,
  cursor: 'pointer',
});

export const modeButtonActive = style({
  backgroundColor: vars.colors.white,
  color: vars.colors.black,
  borderColor: vars.colors.white,
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
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '78px',
});

export const mockCheckbox = style({
  display: 'grid',
  gridTemplateColumns: '24px 1fr',
  alignItems: 'center',
  columnGap: vars.spacing.sm,
  cursor: 'pointer',
});

export const mockCheckboxInput = style({
  position: 'absolute',
  opacity: 0,
  pointerEvents: 'none',
});

export const mockCheckboxIndicator = style({
  width: '24px',
  height: '24px',
  borderRadius: vars.radius.sm,
  border: `1px solid ${vars.colors.border}`,
  backgroundColor: vars.colors.white,
  selectors: {
    [`${mockCheckboxInput}:checked + &`]: {
      backgroundColor: vars.colors.success,
      borderColor: vars.colors.success,
      boxShadow: `inset 0 0 0 3px ${vars.colors.white}`,
    },
  },
});

export const mockCheckboxText = style({
  color: vars.colors.black,
  fontSize: vars.font.size.lg,
  fontWeight: vars.font.weight.medium,
  lineHeight: 1.3,
});

export const fallbackMessage = style({
  margin: 0,
  color: vars.colors.warning,
  fontSize: vars.font.size.sm,
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

export const envHint = style({
  margin: 0,
  color: vars.colors.subDark,
  fontSize: vars.font.size.xs,
  lineHeight: 1.5,
  textAlign: 'center',
});
