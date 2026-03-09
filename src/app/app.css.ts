import { globalStyle } from '@vanilla-extract/css';

import { vars } from '@/vars.css';

globalStyle('html', {
  scrollBehavior: 'smooth',
});

globalStyle('body', {
  margin: 0,
  minWidth: '320px',
  background: `linear-gradient(180deg, ${vars.colors.white} 0%, ${vars.colors.mainXLight} 100%)`,
  color: vars.colors.black,
  fontFamily: "'Pretendard Variable', 'Noto Sans KR', 'Segoe UI', sans-serif",
  lineHeight: 1.5,
});

globalStyle('*', {
  boxSizing: 'border-box',
});

globalStyle('a', {
  color: 'inherit',
  textDecoration: 'none',
});

globalStyle('button, input', {
  fontFamily: 'inherit',
  fontSize: 'inherit',
});

globalStyle('#app', {
  minHeight: '100vh',
});

globalStyle('.app-shell', {
  minHeight: '100vh',
});

globalStyle('.site-header', {
  position: 'sticky',
  top: 0,
  zIndex: 10,
  backdropFilter: 'blur(12px)',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderBottom: `1px solid ${vars.colors.mainBorder}`,
});

globalStyle('.site-header__inner, .section, .site-footer__inner', {
  width: 'min(1120px, calc(100vw - 32px))',
  margin: '0 auto',
});

globalStyle('.site-header__inner', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.spacing.lg,
  minHeight: vars.spacing.header,
  '@media': {
    'screen and (max-width: 960px)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: `${vars.spacing.md} 0`,
    },
  },
});

globalStyle('.site-header__brand', {
  display: 'flex',
  alignItems: 'center',
  gap: vars.spacing.md,
});

globalStyle('.site-header__text', {
  display: 'grid',
  gap: vars.spacing.xs,
});

globalStyle('.site-header__mark', {
  display: 'grid',
  placeItems: 'center',
  width: '44px',
  height: '44px',
  borderRadius: vars.radius.lg,
  backgroundColor: vars.colors.main,
  color: vars.colors.white,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.bold,
  letterSpacing: '0.08em',
});

globalStyle('.site-header__eyebrow', {
  display: 'block',
  color: vars.colors.subDark,
  fontSize: vars.font.size.xs,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
});

globalStyle('.site-header__title', {
  display: 'block',
  color: vars.colors.black,
  fontSize: vars.font.size.lg,
  fontWeight: vars.font.weight.bold,
});

globalStyle('.site-header__nav', {
  display: 'flex',
  gap: vars.spacing.md,
  color: vars.colors.subText,
  fontSize: vars.font.size.sm,
  '@media': {
    'screen and (max-width: 640px)': {
      flexWrap: 'wrap',
    },
  },
});

globalStyle('.section', {
  padding: `${vars.spacing.xl} 0`,
});

globalStyle('.hero', {
  paddingTop: vars.spacing.lg,
});

globalStyle('.hero__grid', {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.2fr) minmax(320px, 0.8fr)',
  gap: vars.spacing.lg,
  alignItems: 'start',
  '@media': {
    'screen and (max-width: 960px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

globalStyle('.panel', {
  backgroundColor: 'rgba(255, 255, 255, 0.88)',
  border: `1px solid ${vars.colors.mainBorder}`,
  borderRadius: vars.radius.xl,
  boxShadow: '0 20px 48px rgba(0, 106, 228, 0.08)',
});

globalStyle('.hero__content', {
  padding: vars.spacing.xl,
  '@media': {
    'screen and (max-width: 640px)': {
      padding: vars.spacing.md,
    },
  },
});

globalStyle('.eyebrow', {
  display: 'inline-flex',
  alignItems: 'center',
  padding: `${vars.spacing.sm} ${vars.spacing.md}`,
  borderRadius: '999px',
  backgroundColor: vars.colors.mainXLight,
  color: vars.colors.mainDark,
  fontSize: vars.font.size.xs,
  fontWeight: vars.font.weight.semibold,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
});

globalStyle('.hero__title', {
  margin: `${vars.spacing.md} 0`,
  fontSize: `clamp(${vars.font.size['4xl']}, 6vw, ${vars.font.size['8xl']})`,
  lineHeight: 1.1,
  letterSpacing: '-0.04em',
});

globalStyle(
  '.hero__description, .scan-form__description, .result-card__description, .hero-note__list, .scan-form__caption, .site-footer p',
  {
    color: vars.colors.subText,
  },
);

globalStyle('.hero__actions', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.spacing.sm,
  marginTop: vars.spacing.lg,
});

globalStyle('.button', {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '48px',
  padding: `0 ${vars.spacing.md}`,
  border: '1px solid transparent',
  borderRadius: '999px',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
  '@media': {
    'screen and (max-width: 640px)': {
      width: '100%',
    },
  },
});

globalStyle('.button:hover', {
  transform: 'translateY(-1px)',
});

globalStyle('.button--primary', {
  backgroundColor: vars.colors.main,
  color: vars.colors.white,
});

globalStyle('.button--secondary', {
  backgroundColor: vars.colors.white,
  borderColor: vars.colors.mainBorder,
  color: vars.colors.mainDark,
});

globalStyle('.hero__stats', {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: vars.spacing.sm,
  marginTop: vars.spacing.lg,
  '@media': {
    'screen and (max-width: 960px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

globalStyle('.stat-card', {
  padding: vars.spacing.md,
  borderRadius: vars.radius.lg,
  backgroundColor: vars.colors.white,
  border: `1px solid ${vars.colors.mainBorder}`,
});

globalStyle('.stat-card__value', {
  display: 'block',
  color: vars.colors.mainDark,
  fontSize: vars.font.size['2xl'],
  fontWeight: vars.font.weight.bold,
});

globalStyle('.stat-card__label', {
  display: 'block',
  marginTop: vars.spacing.xs,
  color: vars.colors.subText,
  fontSize: vars.font.size.sm,
});

globalStyle('.hero__side', {
  display: 'grid',
  gap: vars.spacing.md,
});

globalStyle('.scan-form, .hero-note', {
  padding: vars.spacing.xl,
  '@media': {
    'screen and (max-width: 640px)': {
      padding: vars.spacing.md,
    },
  },
});

globalStyle('.scan-form__title, .hero-note__title', {
  margin: `0 0 ${vars.spacing.sm}`,
  fontSize: vars.font.size['2xl'],
});

globalStyle('.scan-form__controls', {
  display: 'grid',
  gap: vars.spacing.sm,
  marginTop: vars.spacing.md,
});

globalStyle('.scan-form__label', {
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.semibold,
});

globalStyle('.scan-form__input', {
  width: '100%',
  padding: `${vars.spacing.md} ${vars.spacing.ml}`,
  border: `1px solid ${vars.colors.border}`,
  borderRadius: vars.radius.xl,
  backgroundColor: vars.colors.white,
  outline: 'none',
});

globalStyle('.scan-form__input:focus', {
  borderColor: vars.colors.main,
  boxShadow: `0 0 0 4px ${vars.colors.mainLightHover}`,
});

globalStyle('.scan-form__caption', {
  fontSize: vars.font.size.xs,
});

globalStyle('.result-card', {
  marginTop: vars.spacing.md,
  padding: vars.spacing.md,
  borderRadius: vars.radius.xl,
  border: '1px solid transparent',
});

globalStyle('.result-card--idle', {
  backgroundColor: vars.colors.sub,
  borderColor: vars.colors.border,
});

globalStyle('.result-card--safe', {
  backgroundColor: 'rgba(34, 197, 94, 0.08)',
  borderColor: 'rgba(34, 197, 94, 0.24)',
});

globalStyle('.result-card--warning', {
  backgroundColor: 'rgba(230, 72, 72, 0.08)',
  borderColor: 'rgba(230, 72, 72, 0.24)',
});

globalStyle('.result-card__eyebrow', {
  display: 'inline-flex',
  marginBottom: vars.spacing.sm,
  color: vars.colors.mainDark,
  fontSize: vars.font.size.xs,
  fontWeight: vars.font.weight.semibold,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
});

globalStyle('.result-card__title', {
  margin: `0 0 ${vars.spacing.sm}`,
  fontSize: vars.font.size.xl,
});

globalStyle('.result-card__hints, .hero-note__list', {
  margin: `${vars.spacing.md} 0 0`,
  paddingLeft: vars.spacing.md,
});

globalStyle('.result-card__hints li + li, .hero-note__list li + li', {
  marginTop: vars.spacing.sm,
});

globalStyle('.site-footer', {
  padding: `${vars.spacing.lg} 0 ${vars.spacing.xl}`,
});

globalStyle('.site-footer__inner', {
  display: 'flex',
  justifyContent: 'space-between',
  gap: vars.spacing.lg,
  paddingTop: vars.spacing.lg,
  borderTop: `1px solid ${vars.colors.mainBorder}`,
  '@media': {
    'screen and (max-width: 960px)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
});

globalStyle('.site-footer__brand', {
  color: vars.colors.black,
  fontWeight: vars.font.weight.bold,
});

globalStyle('.placeholder-page', {
  display: 'grid',
  placeItems: 'center',
  minHeight: '100vh',
  padding: vars.spacing.xl,
});

globalStyle('.placeholder-page__body', {
  width: 'min(560px, 100%)',
  padding: vars.spacing.xl,
  backgroundColor: 'rgba(255, 255, 255, 0.92)',
  border: `1px solid ${vars.colors.mainBorder}`,
  borderRadius: vars.radius.xl,
  boxShadow: '0 20px 48px rgba(0, 106, 228, 0.08)',
});

globalStyle('.placeholder-page__badge', {
  display: 'inline-flex',
  alignItems: 'center',
  padding: `${vars.spacing.xs} ${vars.spacing.sm}`,
  borderRadius: '999px',
  backgroundColor: vars.colors.mainXLight,
  color: vars.colors.mainDark,
  fontSize: vars.font.size.xs,
  fontWeight: vars.font.weight.semibold,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
});

globalStyle('.placeholder-page__title', {
  margin: `${vars.spacing.md} 0 ${vars.spacing.sm}`,
  fontSize: vars.font.size['3xl'],
  lineHeight: 1.2,
});

globalStyle('.placeholder-page__description', {
  margin: 0,
  color: vars.colors.subText,
  fontSize: vars.font.size.md,
});
