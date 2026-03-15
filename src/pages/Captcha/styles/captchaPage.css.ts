import { style } from '@vanilla-extract/css';

import { vars } from '@/vars.css';

const palette = {
  bodyText: '#5D6472',
  cardBackground: '#F7F8FA',
  cardBorder: '#D5DAE3',
  hint: '#7C8598',
  notice: '#FFF8D9',
  noticeBorder: '#F2DF0D',
  panelBackground: '#434A59',
  panelText: '#F9FAFB',
  statusError: '#F20D0D',
  statusSuccess: '#11D483',
};

export const page = style({
  minHeight: '100vh',
  backgroundColor: vars.colors.white,
});

export const shell = style({
  width: '100%',
  maxWidth: '960px',
  margin: '0 auto',
  padding: `${vars.spacing.xl} ${vars.spacing.md} 80px`,
});

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.spacing.xl,
  alignItems: 'center',
});

export const hero = style({
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.spacing.md,
  alignItems: 'center',
});

export const heroTitle = style({
  fontSize: 'clamp(36px, 5vw, 64px)',
  fontWeight: vars.font.weight.bold,
  color: vars.colors.black,
  margin: 0,
  lineHeight: 1.15,
});

export const heroDescription = style({
  margin: 0,
  color: palette.bodyText,
  fontSize: 'clamp(16px, 2vw, 22px)',
  lineHeight: 1.6,
});

export const panel = style({
  width: '100%',
  maxWidth: '640px',
  padding: vars.spacing.lg,
  backgroundColor: palette.panelBackground,
  borderRadius: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.spacing.md,
  boxShadow: '0 18px 40px rgba(12, 22, 44, 0.12)',
});

export const panelTitle = style({
  margin: 0,
  color: palette.panelText,
  fontSize: vars.font.size.xl,
  fontWeight: vars.font.weight.bold,
  textAlign: 'center',
});

export const widgetWrap = style({
  padding: vars.spacing.lg,
  borderRadius: vars.radius.xl,
  backgroundColor: vars.colors.white,
  border: `1px solid ${palette.cardBorder}`,
  display: 'flex',
  justifyContent: 'center',
  overflowX: 'auto',
});

export const helperText = style({
  margin: 0,
  color: palette.panelText,
  fontSize: vars.font.size.sm,
  textAlign: 'center',
  lineHeight: 1.6,
});

export const missingConfigNotice = style({
  width: '100%',
  maxWidth: '640px',
  padding: vars.spacing.md,
  borderRadius: vars.radius.lg,
  backgroundColor: palette.notice,
  border: `1px solid ${palette.noticeBorder}`,
  color: vars.colors.black,
  fontSize: vars.font.size.sm,
  lineHeight: 1.6,
});

export const submitButton = style({
  width: '100%',
  maxWidth: '640px',
  height: '56px',
  border: 'none',
  borderRadius: '999px',
  backgroundColor: vars.colors.main,
  color: vars.colors.white,
  fontSize: vars.font.size.xl,
  fontWeight: vars.font.weight.bold,
  cursor: 'pointer',
  boxShadow: '0 18px 32px rgba(0, 106, 228, 0.18)',
  selectors: {
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.55,
      boxShadow: 'none',
    },
    '&:focus-visible': {
      outline: `3px solid ${vars.colors.mainLightHover}`,
      outlineOffset: '3px',
    },
  },
});

export const feedback = style({
  minHeight: '24px',
  margin: 0,
  fontSize: vars.font.size.sm,
  lineHeight: 1.5,
  textAlign: 'center',
});

export const feedbackSuccess = style({
  color: palette.statusSuccess,
});

export const feedbackError = style({
  color: palette.statusError,
});

export const guideCard = style({
  width: '100%',
  maxWidth: '640px',
  padding: vars.spacing.lg,
  borderRadius: '20px',
  border: `1px solid ${palette.cardBorder}`,
  backgroundColor: palette.cardBackground,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.spacing.sm,
});

export const guideTitle = style({
  margin: 0,
  color: vars.colors.black,
  fontSize: vars.font.size.lg,
  fontWeight: vars.font.weight.bold,
});

export const guideList = style({
  margin: 0,
  paddingLeft: vars.spacing.lg,
  color: palette.bodyText,
  fontSize: vars.font.size.sm,
  lineHeight: 1.7,
});

export const footerHint = style({
  margin: 0,
  color: palette.hint,
  fontSize: vars.font.size.xs,
  textAlign: 'center',
  lineHeight: 1.6,
});
