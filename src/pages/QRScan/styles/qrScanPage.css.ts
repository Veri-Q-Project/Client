import { keyframes, style, styleVariants } from '@vanilla-extract/css';

import { vars } from '@/vars.css';

const bpTablet = 'screen and (min-width: 768px)';

const scanLineMotion = keyframes({
  '0%': {
    opacity: 0.45,
    transform: 'translateY(-62px)',
  },
  '50%': {
    opacity: 1,
    transform: 'translateY(32px)',
  },
  '100%': {
    opacity: 0.45,
    transform: 'translateY(-62px)',
  },
});

export const page = style({
  minHeight: '100vh',
  backgroundColor: vars.colors.white,
});

export const shell = style({
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: '420px',
  margin: '0 auto',
  padding: `20px ${vars.spacing.md} 48px`,
  display: 'grid',
  gap: '28px',
  '@media': {
    [bpTablet]: {
      maxWidth: '480px',
      padding: `28px ${vars.spacing.xl} 56px`,
      gap: vars.spacing.xl,
    },
  },
});

export const heroSection = style({
  display: 'grid',
  gap: vars.spacing.lg,
});

export const scanStage = style({
  position: 'relative',
  minHeight: '246px',
  borderRadius: '28px',
  overflow: 'hidden',
  backgroundColor: '#09131a',
  boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.06)',
  isolation: 'isolate',
});

export const cameraPreview = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  backgroundColor: '#0b1220',
});

export const scanBackdrop = style({
  position: 'absolute',
  inset: 0,
  background: `
    radial-gradient(circle at 50% 24%, rgba(17, 212, 131, 0.18), transparent 26%),
    linear-gradient(180deg, rgba(6, 11, 15, 0.16) 0%, rgba(6, 11, 15, 0.28) 100%)
  `,
});

export const cameraLiveBadge = style({
  position: 'absolute',
  top: '16px',
  left: '16px',
  zIndex: 1,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 12px',
  borderRadius: '999px',
  fontSize: '11px',
  fontWeight: vars.font.weight.bold,
  letterSpacing: '0.12em',
  backdropFilter: 'blur(12px)',
});

export const cameraLiveBadgeTone = styleVariants({
  error: {
    backgroundColor: 'rgba(239, 68, 68, 0.18)',
    color: '#fee2e2',
  },
  loading: {
    backgroundColor: 'rgba(15, 23, 42, 0.42)',
    color: '#f8fafc',
  },
  ready: {
    backgroundColor: 'rgba(17, 212, 131, 0.18)',
    color: '#dcfce7',
  },
});

export const cameraLiveDot = style({
  width: '8px',
  height: '8px',
  borderRadius: '999px',
  backgroundColor: 'currentColor',
  boxShadow: '0 0 10px currentColor',
});

export const cameraFallback = style({
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  display: 'grid',
  alignContent: 'center',
  justifyItems: 'center',
  gap: vars.spacing.sm,
  padding: '40px 24px',
  textAlign: 'center',
  backdropFilter: 'blur(8px)',
});

export const cameraFallbackTone = styleVariants({
  error: {
    backgroundColor: 'rgba(15, 23, 42, 0.58)',
  },
  loading: {
    backgroundColor: 'rgba(15, 23, 42, 0.42)',
  },
  ready: {
    backgroundColor: 'transparent',
  },
});

export const cameraFallbackTitle = style({
  margin: 0,
  color: vars.colors.white,
  fontSize: vars.font.size.lg,
  fontWeight: vars.font.weight.bold,
});

export const cameraFallbackDescription = style({
  margin: 0,
  color: 'rgba(255, 255, 255, 0.82)',
  fontSize: vars.font.size.sm,
  lineHeight: 1.6,
});

export const scanLine = style({
  position: 'absolute',
  left: '14%',
  right: '14%',
  top: '50%',
  zIndex: 1,
  height: '4px',
  borderRadius: '999px',
  background:
    'linear-gradient(90deg, rgba(17, 212, 131, 0) 0%, rgba(17, 212, 131, 0.9) 24%, rgba(17, 212, 131, 1) 50%, rgba(17, 212, 131, 0.9) 76%, rgba(17, 212, 131, 0) 100%)',
  boxShadow: '0 0 18px rgba(17, 212, 131, 0.55)',
  animation: `${scanLineMotion} 3s ease-in-out infinite`,
  transition: 'opacity 160ms ease',
});

export const scanLineHidden = style({
  opacity: 0,
});

export const captureFlash = style({
  position: 'absolute',
  inset: 0,
  zIndex: 2,
  opacity: 0,
  pointerEvents: 'none',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  transition: 'opacity 140ms ease',
});

export const captureFlashVisible = style({
  opacity: 1,
});

export const centerBadge = style({
  position: 'absolute',
  top: '50%',
  left: '50%',
  zIndex: 1,
  width: '76px',
  height: '76px',
  display: 'grid',
  placeItems: 'center',
  borderRadius: '999px',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  color: vars.colors.success,
  boxShadow: '0 14px 30px rgba(9, 19, 26, 0.28)',
  transform: 'translate(-50%, -50%)',
});

export const scanCorner = style({
  position: 'absolute',
  zIndex: 1,
  width: '28px',
  height: '28px',
  borderColor: vars.colors.success,
  borderStyle: 'solid',
  borderWidth: '0',
  boxShadow: '0 0 12px rgba(17, 212, 131, 0.2)',
});

export const scanCornerTopLeft = style({
  top: '18px',
  left: '20px',
  borderTopWidth: '4px',
  borderLeftWidth: '4px',
  borderTopLeftRadius: '24px',
});

export const scanCornerTopRight = style({
  top: '18px',
  right: '20px',
  borderTopWidth: '4px',
  borderRightWidth: '4px',
  borderTopRightRadius: '24px',
});

export const scanCornerBottomLeft = style({
  bottom: '22px',
  left: '20px',
  borderBottomWidth: '4px',
  borderLeftWidth: '4px',
  borderBottomLeftRadius: '24px',
});

export const scanCornerBottomRight = style({
  right: '20px',
  bottom: '22px',
  borderRightWidth: '4px',
  borderBottomWidth: '4px',
  borderBottomRightRadius: '24px',
});

export const intro = style({
  display: 'grid',
  gap: vars.spacing.sm,
  justifyItems: 'center',
  textAlign: 'center',
});

export const title = style({
  margin: 0,
  color: vars.colors.black,
  fontSize: '30px',
  fontWeight: vars.font.weight.bold,
  lineHeight: 1.2,
});

export const description = style({
  margin: 0,
  color: vars.colors.subText,
  fontSize: vars.font.size.md,
  lineHeight: 1.5,
});

export const cameraStatusText = style({
  margin: 0,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.medium,
  lineHeight: 1.5,
});

export const cameraStatusTone = styleVariants({
  error: {
    color: vars.colors.error,
  },
  loading: {
    color: vars.colors.subDark,
  },
  ready: {
    color: vars.colors.success,
  },
});

export const actionSection = style({
  display: 'grid',
  gap: vars.spacing.sm,
});

export const actionButton = style({
  width: '100%',
  minHeight: '56px',
  borderRadius: '999px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.spacing.sm,
  fontSize: vars.font.size.md,
  fontWeight: vars.font.weight.semibold,
  cursor: 'pointer',
  transition:
    'transform 160ms ease, box-shadow 160ms ease, background-color 160ms ease, border-color 160ms ease',
  selectors: {
    '&:hover': {
      transform: 'translateY(-1px)',
    },
    '&:focus-visible': {
      outline: `3px solid ${vars.colors.mainLightHover}`,
      outlineOffset: '2px',
    },
    '&:disabled': {
      transform: 'none',
      opacity: 0.7,
      cursor: 'wait',
    },
  },
});

export const primaryButton = style([
  actionButton,
  {
    border: 'none',
    color: vars.colors.white,
    backgroundColor: vars.colors.success,
    boxShadow: '0 12px 28px rgba(17, 212, 131, 0.28)',
    selectors: {
      '&:hover': {
        backgroundColor: '#0fbe75',
      },
      '&:focus-visible': {
        outline: `3px solid ${vars.colors.mainLightHover}`,
        outlineOffset: '2px',
      },
    },
  },
]);

export const secondaryButton = style([
  actionButton,
  {
    border: '1px solid rgba(11, 11, 11, 0.08)',
    color: vars.colors.subText,
    backgroundColor: vars.colors.white,
    boxShadow: '0 10px 20px rgba(15, 23, 42, 0.04)',
    selectors: {
      '&:hover': {
        backgroundColor: '#fbfbfc',
        borderColor: 'rgba(17, 212, 131, 0.22)',
      },
      '&:focus-visible': {
        outline: `3px solid ${vars.colors.mainLightHover}`,
        outlineOffset: '2px',
      },
    },
  },
]);

export const buttonIcon = style({
  width: '18px',
  height: '18px',
  display: 'inline-flex',
  flexShrink: 0,
});

export const helperText = style({
  margin: 0,
  color: vars.colors.subDark,
  fontSize: vars.font.size.xs,
  lineHeight: 1.6,
  textAlign: 'center',
});

export const historySection = style({
  display: 'grid',
  gap: vars.spacing.md,
});

export const sectionHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.spacing.sm,
});

export const sectionTitle = style({
  margin: 0,
  color: vars.colors.black,
  fontSize: vars.font.size.lg,
  fontWeight: vars.font.weight.bold,
});

export const viewAllLink = style({
  color: vars.colors.success,
  fontSize: vars.font.size.xs,
  fontWeight: vars.font.weight.semibold,
  textDecoration: 'none',
  selectors: {
    '&:hover': {
      textDecoration: 'underline',
    },
    '&:focus-visible': {
      outline: `2px solid ${vars.colors.mainLightHover}`,
      outlineOffset: '3px',
      borderRadius: vars.radius.sm,
    },
  },
});

export const historyCard = style({
  position: 'relative',
  display: 'grid',
  gap: vars.spacing.sm,
  padding: '18px 16px 16px',
  borderRadius: '16px',
  backgroundColor: '#eef2f6',
  boxShadow: 'inset 0 0 0 1px rgba(148, 163, 184, 0.08)',
});

export const historyBadge = style({
  position: 'absolute',
  top: 0,
  right: 0,
  minWidth: '86px',
  height: '28px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  padding: '0 12px',
  borderRadius: '0 16px 0 16px',
  backgroundColor: vars.colors.success,
  color: vars.colors.white,
  fontSize: '11px',
  fontWeight: vars.font.weight.bold,
  letterSpacing: '0.18em',
});

export const historyBadgeIcon = style({
  width: '12px',
  height: '12px',
  display: 'inline-flex',
});

export const historyDate = style({
  margin: 0,
  color: '#6b7280',
  fontSize: '11px',
  fontWeight: vars.font.weight.medium,
});

export const historyHeadline = style({
  margin: 0,
  color: vars.colors.black,
  fontSize: vars.font.size.md,
  fontWeight: vars.font.weight.bold,
  lineHeight: 1.45,
  wordBreak: 'keep-all',
});

export const historyStatus = style({
  margin: 0,
  color: vars.colors.success,
  fontSize: '12px',
  fontWeight: vars.font.weight.medium,
  lineHeight: 1.4,
});

export const historyThumbnail = style({
  overflow: 'hidden',
  borderRadius: '12px',
  backgroundColor: '#dbe4ec',
  aspectRatio: '16 / 9',
});

export const historyThumbnailImage = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
});
