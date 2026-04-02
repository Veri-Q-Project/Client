import { style, styleVariants } from '@vanilla-extract/css';

import { vars } from '@/vars.css';

const bpTablet = 'screen and (min-width: 768px)';

export const page = style({
  minHeight: '100vh',
  backgroundColor: vars.colors.white,
});

export const shell = style({
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: '440px',
  margin: '0 auto',
  padding: `28px ${vars.spacing.md} 48px`,
  display: 'grid',
  gap: '28px',
  '@media': {
    [bpTablet]: {
      maxWidth: '520px',
      padding: `40px ${vars.spacing.xl} 64px`,
    },
  },
});

export const intro = style({
  display: 'grid',
  gap: vars.spacing.sm,
});

export const title = style({
  margin: 0,
  color: '#1f2937',
  fontSize: 'clamp(34px, 8vw, 48px)',
  fontWeight: vars.font.weight.bold,
  lineHeight: 1.12,
  letterSpacing: '-0.03em',
});

export const description = style({
  margin: 0,
  color: '#60656f',
  fontSize: vars.font.size.lg,
  lineHeight: 1.5,
});

export const helper = style({
  margin: 0,
  color: '#9aa3b2',
  fontSize: vars.font.size.xs,
  lineHeight: 1.5,
});

export const listSection = style({
  display: 'grid',
  gap: vars.spacing.md,
});

export const list = style({
  margin: 0,
  padding: 0,
  listStyle: 'none',
  display: 'grid',
  gap: '22px',
});

export const card = style({
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: '52px minmax(0, 1fr)',
  alignItems: 'center',
  gap: vars.spacing.md,
  minHeight: '96px',
  padding: '26px 22px 24px',
  borderRadius: '30px',
  boxShadow: '0 12px 30px rgba(15, 23, 42, 0.07)',
  border: '1px solid rgba(15, 23, 42, 0.04)',
});

export const cardTone = styleVariants({
  critical: {
    background: 'linear-gradient(180deg, #fff4f3 0%, #fff0f0 100%)',
  },
  safe: {
    background: 'linear-gradient(180deg, #f1fff7 0%, #eefcf4 100%)',
  },
  warning: {
    background: 'linear-gradient(180deg, #fffdf2 0%, #fffbee 100%)',
  },
});

export const cardIconWrap = style({
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  display: 'grid',
  placeItems: 'center',
});

export const cardIconWrapTone = styleVariants({
  critical: {
    backgroundColor: 'rgba(255, 103, 103, 0.12)',
  },
  safe: {
    backgroundColor: 'rgba(17, 212, 131, 0.12)',
  },
  warning: {
    backgroundColor: 'rgba(242, 223, 13, 0.18)',
  },
});

export const cardIcon = style({
  width: '26px',
  height: '26px',
  objectFit: 'contain',
});

export const cardContent = style({
  minWidth: 0,
  display: 'grid',
  gap: '8px',
});

export const cardUrl = style({
  margin: 0,
  color: '#24292f',
  fontSize: 'clamp(16px, 4vw, 20px)',
  fontWeight: vars.font.weight.bold,
  lineHeight: 1.35,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const cardMeta = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  color: '#616975',
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.medium,
});

export const metaIcon = style({
  width: '14px',
  height: '14px',
  display: 'inline-flex',
  flexShrink: 0,
});

export const badge = style({
  position: 'absolute',
  top: '-12px',
  right: '24px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  minWidth: '72px',
  height: '28px',
  padding: '0 12px',
  borderRadius: '999px',
  boxShadow: '0 8px 16px rgba(15, 23, 42, 0.12)',
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.bold,
});

export const badgeTone = styleVariants({
  critical: {
    backgroundColor: '#ff6b65',
    color: vars.colors.white,
  },
  safe: {
    backgroundColor: '#28e56d',
    color: '#0e3b1f',
  },
  warning: {
    backgroundColor: '#ffd84b',
    color: '#3f3500',
  },
});

export const badgeIcon = style({
  width: '12px',
  height: '12px',
  display: 'inline-flex',
  flexShrink: 0,
});

export const emptyState = style({
  padding: '32px 24px',
  borderRadius: '28px',
  border: `1px dashed ${vars.colors.border}`,
  backgroundColor: '#fafafa',
  textAlign: 'center',
  color: vars.colors.subText,
  fontSize: vars.font.size.md,
  lineHeight: 1.6,
});
