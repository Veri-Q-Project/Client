import { keyframes, style } from '@vanilla-extract/css';

import { vars } from '@/vars.css';

const bpTablet = 'screen and (min-width: 768px)';

const scanLineMotion = keyframes({
  '0%': {
    opacity: 0.6,
    transform: 'translateY(-54px)',
  },
  '50%': {
    opacity: 1,
    transform: 'translateY(28px)',
  },
  '100%': {
    opacity: 0.6,
    transform: 'translateY(-54px)',
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
  background:
    'linear-gradient(180deg, rgba(250, 251, 253, 0.98) 0%, rgba(239, 242, 246, 0.98) 100%)',
  boxShadow: 'inset 0 0 0 1px rgba(15, 23, 42, 0.04)',
  isolation: 'isolate',
});

export const scanBackdrop = style({
  position: 'absolute',
  inset: 0,
  background: `
    radial-gradient(circle at 50% 28%, rgba(17, 212, 131, 0.14), transparent 26%),
    radial-gradient(circle at 26% 84%, rgba(255, 255, 255, 0.85), transparent 36%),
    radial-gradient(circle at 88% 78%, rgba(232, 236, 242, 0.9), transparent 22%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.52), rgba(242, 245, 249, 0.82))
  `,
});

export const handSilhouette = style({
  position: 'absolute',
  inset: '58px 22px 18px 22px',
  opacity: 0.3,
  filter: 'blur(0.4px)',
});

export const handPalm = style({
  position: 'absolute',
  left: '12%',
  right: '12%',
  bottom: '8%',
  height: '56%',
  borderRadius: '40% 42% 26% 30%',
  background:
    'linear-gradient(135deg, rgba(229, 214, 201, 0.72) 0%, rgba(240, 227, 214, 0.42) 100%)',
  transform: 'rotate(-10deg)',
});

export const handThumb = style({
  position: 'absolute',
  left: '10%',
  bottom: '28%',
  width: '34%',
  height: '18%',
  borderRadius: '999px',
  background: 'linear-gradient(90deg, rgba(231, 216, 204, 0.66), rgba(245, 236, 226, 0.28))',
  transform: 'rotate(-28deg)',
});

export const device = style({
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '92px',
  height: '160px',
  borderRadius: '18px',
  transform: 'translate(-50%, -50%)',
  background: 'linear-gradient(180deg, #dbe6f2 0%, #c3d1df 100%)',
  boxShadow: '0 18px 36px rgba(58, 77, 98, 0.2)',
  overflow: 'hidden',
});

export const deviceSpeaker = style({
  position: 'absolute',
  top: '10px',
  left: '50%',
  width: '32px',
  height: '5px',
  borderRadius: '999px',
  backgroundColor: 'rgba(59, 69, 82, 0.35)',
  transform: 'translateX(-50%)',
});

export const deviceScreen = style({
  position: 'absolute',
  top: '22px',
  left: '8px',
  right: '8px',
  bottom: '24px',
  borderRadius: '8px',
  padding: '14px 10px',
  display: 'grid',
  alignContent: 'start',
  justifyItems: 'center',
  gap: '10px',
  background: 'linear-gradient(180deg, #f9fbff 0%, #eef4fb 100%)',
  boxShadow: 'inset 0 0 0 1px rgba(189, 204, 221, 0.6)',
});

export const deviceQrGhost = style({
  width: '42px',
  height: '42px',
  borderRadius: vars.radius.md,
  background: `
    linear-gradient(90deg, rgba(163, 180, 198, 0.55) 0 22%, transparent 22% 28%, rgba(163, 180, 198, 0.55) 28% 50%, transparent 50% 56%, rgba(163, 180, 198, 0.55) 56% 78%, transparent 78% 100%),
    linear-gradient(rgba(163, 180, 198, 0.55) 0 22%, transparent 22% 28%, rgba(163, 180, 198, 0.55) 28% 50%, transparent 50% 56%, rgba(163, 180, 198, 0.55) 56% 78%, transparent 78% 100%)
  `,
  opacity: 0.8,
});

export const deviceTextLine = style({
  width: '100%',
  height: '10px',
  borderRadius: '999px',
  backgroundColor: 'rgba(189, 204, 221, 0.76)',
});

export const deviceTextLineShort = style([
  deviceTextLine,
  {
    width: '70%',
    justifySelf: 'start',
  },
]);

export const deviceFooter = style({
  position: 'absolute',
  left: '50%',
  bottom: '10px',
  display: 'inline-flex',
  gap: '10px',
  transform: 'translateX(-50%)',
});

export const deviceFooterDot = style({
  width: '4px',
  height: '4px',
  borderRadius: '999px',
  backgroundColor: 'rgba(246, 248, 251, 0.76)',
});

export const scanLine = style({
  position: 'absolute',
  left: '14%',
  right: '14%',
  top: '50%',
  height: '4px',
  borderRadius: '999px',
  background:
    'linear-gradient(90deg, rgba(17, 212, 131, 0) 0%, rgba(17, 212, 131, 0.9) 24%, rgba(17, 212, 131, 1) 50%, rgba(17, 212, 131, 0.9) 76%, rgba(17, 212, 131, 0) 100%)',
  boxShadow: '0 0 18px rgba(17, 212, 131, 0.55)',
  animation: `${scanLineMotion} 3s ease-in-out infinite`,
});

export const centerBadge = style({
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '76px',
  height: '76px',
  display: 'grid',
  placeItems: 'center',
  borderRadius: '999px',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  boxShadow: '0 14px 30px rgba(105, 124, 147, 0.22)',
  transform: 'translate(-50%, -50%)',
});

export const scanCorner = style({
  position: 'absolute',
  width: '28px',
  height: '28px',
  borderColor: vars.colors.success,
  borderStyle: 'solid',
  borderWidth: '0',
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

export const historyUrl = style({
  margin: 0,
  color: vars.colors.black,
  fontSize: vars.font.size.md,
  fontWeight: vars.font.weight.bold,
  lineHeight: 1.45,
  wordBreak: 'break-all',
});

export const historyStatus = style({
  margin: 0,
  color: vars.colors.success,
  fontSize: '12px',
  fontWeight: vars.font.weight.medium,
  lineHeight: 1.4,
});
