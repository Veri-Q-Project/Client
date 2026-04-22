import { style, styleVariants } from '@vanilla-extract/css';

import { vars } from '@/vars.css';

export const card = style({
  boxSizing: 'border-box',
  display: 'grid',
  gap: vars.spacing.md,
  width: '100%',
  padding: vars.spacing.md,
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.colors.border}`,
  backgroundColor: vars.colors.white,
  overflow: 'hidden',
});

export const info = style({
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr)',
  gap: vars.spacing.md,
  alignItems: 'center',
  minWidth: 0,
});

export const iconFrame = style({
  position: 'relative',
  width: '68px',
  height: '68px',
  display: 'block',
});

export const iconImage = style({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const checkBadge = style({
  position: 'absolute',
  right: '-6px',
  bottom: '-6px',
  width: '18px',
  height: '18px',
  borderRadius: '999px',
  backgroundColor: vars.colors.success,
  color: vars.colors.white,
  fontSize: '10px',
  fontWeight: vars.font.weight.bold,
  display: 'grid',
  placeItems: 'center',
});

export const checkBadgeTone = styleVariants({
  safe: {
    backgroundColor: vars.colors.success,
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

export const titleRow = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: vars.spacing.sm,
  marginBottom: vars.spacing.xs,
  minWidth: 0,
});

export const textBlock = style({
  minWidth: 0,
});

export const title = style({
  margin: 0,
  color: vars.colors.black,
  fontSize: vars.font.size.xl,
  fontWeight: vars.font.weight.bold,
  lineHeight: 1.3,
  maxWidth: '100%',
  overflowWrap: 'anywhere',
  wordBreak: 'break-word',
});

export const official = style({
  display: 'inline-flex',
  alignItems: 'center',
  height: '20px',
  padding: `0 ${vars.spacing.sm}`,
  borderRadius: '999px',
  backgroundColor: 'rgba(34, 197, 94, 0.14)',
  color: vars.colors.success,
  fontSize: vars.font.size.xs,
  fontWeight: vars.font.weight.bold,
  letterSpacing: '0.04em',
});

export const officialTone = styleVariants({
  safe: {
    backgroundColor: 'rgba(34, 197, 94, 0.14)',
    color: vars.colors.success,
  },
  warning: {
    backgroundColor: 'rgba(242, 223, 13, 0.2)',
    color: vars.colors.warning,
  },
  critical: {
    backgroundColor: 'rgba(242, 13, 13, 0.12)',
    color: vars.colors.error,
  },
});

export const siteUrl = style({
  margin: `0 0 ${vars.spacing.xs}`,
  color: vars.colors.subText,
  fontSize: vars.font.size.sm,
  lineHeight: 1.45,
  overflowWrap: 'anywhere',
  wordBreak: 'break-all',
});

export const siteMeta = style({
  margin: 0,
  color: vars.colors.subDark,
  fontSize: vars.font.size.xs,
  lineHeight: 1.45,
  overflowWrap: 'anywhere',
});

export const visitButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.spacing.sm,
  width: '100%',
  height: '52px',
  padding: `0 ${vars.spacing.md}`,
  border: 'none',
  borderRadius: '999px',
  backgroundColor: vars.colors.success,
  color: vars.colors.white,
  fontSize: vars.font.size.xl,
  fontWeight: vars.font.weight.semibold,
});

export const visitButtonTone = styleVariants({
  safe: {
    backgroundColor: vars.colors.success,
    color: vars.colors.white,
  },
  warning: {
    backgroundColor: vars.colors.warning,
    color: vars.colors.white,
  },
  critical: {
    backgroundColor: vars.colors.error,
    color: vars.colors.white,
  },
});

export const visitButtonIcon = style({
  width: '30px',
  height: '30px',
  display: 'inline-flex',
  flexShrink: 0,
});

export const visitButtonIconImage = style({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
});
