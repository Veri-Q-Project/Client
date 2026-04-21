import { style, styleVariants } from '@vanilla-extract/css';

import { vars } from '@/vars.css';

const bpTablet = 'screen and (min-width: 768px)';

export const page = style({
  minHeight: '100vh',
  backgroundColor: vars.colors.white,
});

export const container = style({
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: '720px',
  margin: '0 auto',
  padding: `48px ${vars.spacing.md} ${vars.spacing.xl}`,
  display: 'grid',
  gap: '40px',
  '@media': {
    [bpTablet]: {
      padding: `64px ${vars.spacing.xl}`,
    },
  },
});

export const progressSection = style({
  display: 'grid',
  justifyItems: 'center',
  gap: vars.spacing.md,
});

export const progressRingWrap = style({
  position: 'relative',
  width: '240px',
  height: '240px',
  display: 'grid',
  placeItems: 'center',
});

export const progressSvg = style({
  width: '100%',
  height: '100%',
  transform: 'rotate(-90deg)',
});

export const progressTrack = style({
  fill: 'none',
  stroke: '#E7ECEF',
  strokeWidth: 12,
});

export const progressValue = style({
  fill: 'none',
  stroke: vars.colors.success,
  strokeWidth: 12,
  strokeLinecap: 'round',
  transition: 'stroke-dashoffset 220ms ease',
});

export const progressCenter = style({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
});

export const centerIconPreparing = style({
  width: '34px',
  height: '40px',
  objectFit: 'contain',
  transform: 'scale(2.15)',
  transformOrigin: 'center',
});

export const centerIconDone = style({
  width: '30px',
  height: '36px',
  objectFit: 'contain',
});

export const percentText = style({
  margin: 0,
  color: vars.colors.black,
  fontSize: '48px',
  fontWeight: vars.font.weight.bold,
  lineHeight: 1,
});

export const progressMetaText = style({
  margin: 0,
  color: vars.colors.subText,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.medium,
  lineHeight: 1.3,
  textAlign: 'center',
});

export const title = style({
  margin: 0,
  color: vars.colors.black,
  fontSize: 'clamp(30px, 5vw, 42px)',
  fontWeight: vars.font.weight.bold,
  textAlign: 'center',
});

export const description = style({
  margin: 0,
  color: vars.colors.subText,
  fontSize: vars.font.size.lg,
  lineHeight: 1.5,
  textAlign: 'center',
});

export const flowSection = style({
  display: 'grid',
  gap: vars.spacing.md,
});

export const caseControlSection = style({
  display: 'grid',
  gap: vars.spacing.md,
  paddingTop: vars.spacing.sm,
  borderTop: `1px solid ${vars.colors.border}`,
});

export const caseControlHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.spacing.sm,
  flexWrap: 'wrap',
});

export const caseControlTitle = style({
  margin: 0,
  color: vars.colors.black,
  fontSize: vars.font.size.lg,
  fontWeight: vars.font.weight.semibold,
});

export const caseControlCurrent = style({
  margin: 0,
  color: vars.colors.subText,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.medium,
});

export const caseButtonList = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(92px, 1fr))',
  gap: vars.spacing.sm,
});

export const caseButton = style({
  minHeight: '44px',
  border: `1px solid ${vars.colors.border}`,
  borderRadius: vars.radius.md,
  backgroundColor: vars.colors.white,
  color: vars.colors.black,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.semibold,
  cursor: 'pointer',
  transition: 'background-color 160ms ease, border-color 160ms ease, color 160ms ease',
  selectors: {
    '&:hover': {
      borderColor: vars.colors.mainBorder,
      backgroundColor: vars.colors.mainXLight,
    },
  },
});

export const caseButtonActive = style({
  borderColor: vars.colors.main,
  backgroundColor: vars.colors.main,
  color: vars.colors.white,
});

export const randomCaseButton = style({
  borderColor: vars.colors.success,
  color: vars.colors.success,
  selectors: {
    '&:hover': {
      borderColor: vars.colors.success,
      backgroundColor: 'rgba(34, 197, 94, 0.08)',
    },
  },
});

export const branchDemoButton = style({
  borderColor: vars.colors.black,
  color: vars.colors.black,
  selectors: {
    '&:hover': {
      borderColor: vars.colors.black,
      backgroundColor: vars.colors.sub,
    },
  },
});

export const branchDemoButtonActive = style({
  backgroundColor: vars.colors.black,
  color: vars.colors.white,
});

export const flowList = style({
  margin: 0,
  padding: 0,
  listStyle: 'none',
  display: 'grid',
  gap: vars.spacing.md,
});

export const flowItem = style({
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: '36px minmax(0, 1fr)',
  columnGap: vars.spacing.md,
  alignItems: 'start',
});

export const flowItemWithLine = style({
  selectors: {
    '&::after': {
      content: '',
      position: 'absolute',
      left: '17px',
      top: '34px',
      bottom: '-16px',
      width: '2px',
      backgroundColor: 'rgba(17, 212, 131, 0.32)',
    },
  },
});

export const flowIcon = style({
  width: '32px',
  height: '32px',
  borderRadius: '999px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  justifySelf: 'center',
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.bold,
});

export const flowIconImage = style({
  width: '18px',
  height: '18px',
  objectFit: 'contain',
});

export const flowIconState = styleVariants({
  done: {
    backgroundColor: vars.colors.success,
    color: vars.colors.white,
  },
  active: {
    border: `2px solid ${vars.colors.success}`,
    color: vars.colors.success,
    backgroundColor: vars.colors.white,
  },
  pending: {
    backgroundColor: vars.colors.sub,
    color: vars.colors.subDark,
  },
});

export const flowContent = style({
  display: 'grid',
  gap: vars.spacing.xs,
  paddingTop: 0,
});

export const flowTitleRow = style({
  minHeight: '32px',
  display: 'flex',
  alignItems: 'center',
});

export const flowTitle = style({
  margin: 0,
  color: vars.colors.black,
  fontSize: vars.font.size['2xl'],
  fontWeight: vars.font.weight.semibold,
  lineHeight: 1,
});

export const flowDescription = style({
  margin: 0,
  color: vars.colors.subText,
  fontSize: vars.font.size.md,
  lineHeight: 1.5,
});

export const stateText = style({
  margin: 0,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.medium,
});

export const stateTextState = styleVariants({
  done: {
    color: vars.colors.success,
  },
  active: {
    color: vars.colors.main,
  },
  pending: {
    color: vars.colors.subDark,
  },
});

export const detailList = style({
  margin: `${vars.spacing.sm} 0 0`,
  padding: `${vars.spacing.sm} 0 0 ${vars.spacing.md}`,
  listStyle: 'none',
  display: 'grid',
  gap: vars.spacing.sm,
  borderLeft: `2px solid ${vars.colors.sub}`,
});

export const detailItem = style({
  display: 'grid',
  gridTemplateColumns: '24px minmax(0, 1fr)',
  columnGap: vars.spacing.sm,
  alignItems: 'start',
});

export const detailIcon = style({
  width: '24px',
  height: '24px',
  borderRadius: '999px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const detailIconImage = style({
  width: '12px',
  height: '12px',
  objectFit: 'contain',
});

export const detailIconState = styleVariants({
  done: {
    backgroundColor: vars.colors.success,
    color: vars.colors.white,
  },
  active: {
    border: `2px solid ${vars.colors.success}`,
    color: vars.colors.success,
    backgroundColor: vars.colors.white,
  },
  pending: {
    backgroundColor: vars.colors.sub,
    color: vars.colors.subDark,
  },
});

export const detailContent = style({
  display: 'grid',
  gap: '2px',
});

export const detailTitle = style({
  margin: 0,
  color: vars.colors.black,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.medium,
  lineHeight: 1.4,
});

export const detailState = style({
  margin: 0,
  fontSize: vars.font.size.xs,
});

export const detailStateTone = styleVariants({
  done: {
    color: vars.colors.success,
  },
  active: {
    color: vars.colors.main,
  },
  pending: {
    color: vars.colors.subDark,
  },
});
