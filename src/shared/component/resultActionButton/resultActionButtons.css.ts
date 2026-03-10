import { style } from '@vanilla-extract/css';

import { vars } from '@/vars.css';

export const root = style({
  display: 'grid',
  gap: vars.spacing.sm,
});

export const rescanButton = style({
  height: '52px',
  borderRadius: '999px',
  fontSize: vars.font.size.xl,
  fontWeight: vars.font.weight.semibold,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  border: 'none',
  backgroundColor: '#0b1736',
  color: vars.colors.white,
});

export const shareButton = style({
  height: '52px',
  borderRadius: '999px',
  fontSize: vars.font.size.xl,
  fontWeight: vars.font.weight.semibold,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.spacing.sm,
  width: '100%',
  border: `1px solid ${vars.colors.border}`,
  backgroundColor: vars.colors.white,
  color: vars.colors.black,
});

export const shareIcon = style({
  display: 'inline-flex',
  width: '14px',
  height: '14px',
  flexShrink: 0,
});

export const shareIconImage = style({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
});
