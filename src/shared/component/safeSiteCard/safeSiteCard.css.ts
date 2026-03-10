import { style } from '@vanilla-extract/css';

import { vars } from '@/vars.css';

export const card = style({
  display: 'grid',
  gap: vars.spacing.md,
  padding: vars.spacing.md,
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.colors.border}`,
  backgroundColor: vars.colors.white,
});

export const info = style({
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr)',
  gap: vars.spacing.md,
  alignItems: 'center',
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

export const titleRow = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: vars.spacing.sm,
  marginBottom: vars.spacing.xs,
});

export const title = style({
  margin: 0,
  color: vars.colors.black,
  fontSize: vars.font.size.xl,
  fontWeight: vars.font.weight.bold,
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

export const siteUrl = style({
  margin: `0 0 ${vars.spacing.xs}`,
  color: vars.colors.subText,
  fontSize: vars.font.size.sm,
});

export const siteMeta = style({
  margin: 0,
  color: vars.colors.subDark,
  fontSize: vars.font.size.xs,
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

export const visitButtonIcon = style({
  width: '14px',
  height: '14px',
  display: 'inline-flex',
  flexShrink: 0,
});

export const visitButtonIconImage = style({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
});
