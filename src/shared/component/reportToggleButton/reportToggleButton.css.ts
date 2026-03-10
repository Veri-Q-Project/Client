import { style } from '@vanilla-extract/css';

import { vars } from '@/vars.css';

export const button = style({
  width: '100%',
  minHeight: '48px',
  padding: `0 ${vars.spacing.sm}`,
  border: 'none',
  borderRadius: vars.radius.sm,
  background: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  color: vars.colors.black,
  fontSize: vars.font.size.md,
  fontWeight: vars.font.weight.semibold,
});

export const label = style({
  display: 'inline-flex',
  alignItems: 'center',
});

export const trailingIcon = style({
  display: 'inline-flex',
  width: '20px',
  height: '16px',
  flexShrink: 0,
  transition: 'transform 0.2s ease',
});

export const trailingIconOpen = style({
  transform: 'rotate(180deg)',
});

export const trailingIconImage = style({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
});
