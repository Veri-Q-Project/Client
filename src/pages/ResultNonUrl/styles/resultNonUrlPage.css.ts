import { style } from '@vanilla-extract/css';

import { vars } from '@/vars.css';

const nonUrlPalette = {
  accentEnd: '#D9B800',
  accentStart: vars.colors.warning,
  actionBodyBackground: '#FFF9E8',
  actionBodyBorder: 'rgba(242, 223, 13, 0.4)',
  actionCardBorder: 'rgba(242, 223, 13, 0.34)',
  actionCardShadow: '0 20px 48px rgba(242, 223, 13, 0.08)',
  actionDivider: 'rgba(217, 184, 0, 0.32)',
  actionTitleText: '#16345B',
  cautionText: '#50637C',
  detailText: '#B28300',
  executionButtonShadow: '0 14px 32px rgba(242, 223, 13, 0.18)',
  focusRing: 'rgba(0, 106, 228, 0.24)',
  previewActiveText: '#3D3200',
  previewBackground: '#FFFBEF',
  previewBorder: 'rgba(242, 223, 13, 0.28)',
  previewText: '#7D6200',
  previewValueText: '#6F5A00',
  sectionBackground: '#FFFDF6',
  sectionBorder: 'rgba(242, 223, 13, 0.45)',
  sectionNumberBackground: '#FFF1B8',
  sectionNumberBorder: 'rgba(242, 223, 13, 0.72)',
  sectionNumberText: '#A27200',
  strongText: '#1D3557',
  subtleText: '#7D8FB3',
};

export const futureContent = style({
  display: 'grid',
  gap: vars.spacing.md,
});

export const analysisSection = style({
  display: 'grid',
  gap: vars.spacing.md,
  padding: vars.spacing.lg,
  borderRadius: '24px',
  border: `1px solid ${nonUrlPalette.sectionBorder}`,
  backgroundColor: nonUrlPalette.sectionBackground,
});

export const sectionHeader = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: vars.spacing.md,
});

export const sectionNumber = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '32px',
  height: '32px',
  padding: '0 10px',
  borderRadius: '12px',
  backgroundColor: nonUrlPalette.sectionNumberBackground,
  border: `1px solid ${nonUrlPalette.sectionNumberBorder}`,
  color: nonUrlPalette.sectionNumberText,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.bold,
  lineHeight: 1,
});

export const sectionHeaderTextBlock = style({
  display: 'grid',
  gap: vars.spacing.xs,
});

export const sectionTitle = style({
  margin: 0,
  color: nonUrlPalette.strongText,
  fontSize: 'clamp(20px, 2.6vw, 28px)',
  fontWeight: vars.font.weight.bold,
  lineHeight: 1.3,
});

export const sectionDescription = style({
  margin: 0,
  color: vars.colors.subText,
  fontSize: vars.font.size.sm,
  lineHeight: 1.6,
});

export const actionCard = style({
  display: 'grid',
  gap: vars.spacing.md,
  padding: vars.spacing.lg,
  borderRadius: '24px',
  border: `1px solid ${nonUrlPalette.actionCardBorder}`,
  backgroundColor: vars.colors.white,
  boxShadow: nonUrlPalette.actionCardShadow,
});

export const actionCardHeader = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: vars.spacing.md,
});

export const actionAccent = style({
  flexShrink: 0,
  width: '4px',
  minHeight: '52px',
  borderRadius: '999px',
  background: `linear-gradient(180deg, ${nonUrlPalette.accentStart} 0%, ${nonUrlPalette.accentEnd} 100%)`,
});

export const actionHeaderTextBlock = style({
  display: 'grid',
  gap: vars.spacing.xs,
});

export const actionTitle = style({
  margin: 0,
  color: nonUrlPalette.actionTitleText,
  fontSize: 'clamp(20px, 2.8vw, 34px)',
  fontWeight: vars.font.weight.bold,
  lineHeight: 1.25,
  wordBreak: 'keep-all',
});

export const actionEnglishLabel = style({
  margin: 0,
  color: nonUrlPalette.subtleText,
  fontSize: 'clamp(13px, 1.3vw, 18px)',
  fontWeight: vars.font.weight.semibold,
  letterSpacing: '0.08em',
  lineHeight: 1.4,
  textTransform: 'uppercase',
});

export const actionBody = style({
  display: 'grid',
  gap: vars.spacing.md,
  padding: vars.spacing.lg,
  borderRadius: '20px',
  backgroundColor: nonUrlPalette.actionBodyBackground,
  border: `1px solid ${nonUrlPalette.actionBodyBorder}`,
});

export const detailLabelRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.spacing.sm,
});

export const detailLabelDot = style({
  width: '10px',
  height: '10px',
  borderRadius: '999px',
  backgroundColor: nonUrlPalette.accentEnd,
});

export const detailLabel = style({
  margin: 0,
  color: nonUrlPalette.detailText,
  fontSize: vars.font.size.md,
  fontWeight: vars.font.weight.bold,
  lineHeight: 1.4,
});

export const actionDescription = style({
  margin: 0,
  color: nonUrlPalette.actionTitleText,
  fontSize: 'clamp(16px, 1.7vw, 22px)',
  fontWeight: vars.font.weight.medium,
  lineHeight: 1.7,
  wordBreak: 'keep-all',
});

export const actionDivider = style({
  width: '100%',
  height: '1px',
  backgroundColor: nonUrlPalette.actionDivider,
});

export const actionCaution = style({
  margin: 0,
  color: nonUrlPalette.cautionText,
  fontSize: 'clamp(15px, 1.5vw, 20px)',
  lineHeight: 1.75,
  wordBreak: 'keep-all',
});

export const actionCautionLabel = style({
  color: nonUrlPalette.detailText,
  fontWeight: vars.font.weight.bold,
});

export const executionButton = style({
  width: '100%',
  border: 0,
  borderRadius: vars.radius.lg,
  backgroundColor: vars.colors.warning,
  color: vars.colors.black,
  padding: '14px 18px',
  fontSize: vars.font.size.md,
  fontWeight: vars.font.weight.bold,
  lineHeight: 1.2,
  cursor: 'pointer',
  boxShadow: nonUrlPalette.executionButtonShadow,
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${vars.colors.main}`,
      outlineOffset: '3px',
      boxShadow: `0 0 0 4px ${nonUrlPalette.focusRing}, ${nonUrlPalette.executionButtonShadow}`,
    },
    '&:disabled': {
      opacity: 0.55,
      cursor: 'not-allowed',
      pointerEvents: 'none',
      boxShadow: 'none',
    },
  },
});

export const executionFeedback = style({
  margin: 0,
  color: nonUrlPalette.previewText,
  fontSize: vars.font.size.sm,
  lineHeight: 1.6,
  textAlign: 'center',
});

export const previewSection = style({
  display: 'grid',
  gap: vars.spacing.sm,
  padding: vars.spacing.md,
  borderRadius: vars.radius.lg,
  border: `1px solid ${nonUrlPalette.previewBorder}`,
  backgroundColor: nonUrlPalette.previewBackground,
});

export const previewTitle = style({
  margin: 0,
  color: nonUrlPalette.previewText,
  fontSize: vars.font.size.md,
  fontWeight: vars.font.weight.semibold,
  lineHeight: 1.5,
});

export const previewButtonList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.spacing.sm,
});

export const previewButton = style({
  border: `1px solid ${nonUrlPalette.sectionBorder}`,
  borderRadius: '999px',
  backgroundColor: vars.colors.white,
  color: nonUrlPalette.previewValueText,
  padding: '8px 14px',
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.medium,
  lineHeight: 1.2,
  cursor: 'pointer',
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${vars.colors.main}`,
      outlineOffset: '2px',
      boxShadow: `0 0 0 4px ${nonUrlPalette.focusRing}`,
    },
    '&:disabled': {
      opacity: 0.55,
      cursor: 'not-allowed',
      pointerEvents: 'none',
      boxShadow: 'none',
    },
  },
});

export const previewButtonActive = style({
  backgroundColor: vars.colors.warning,
  borderColor: nonUrlPalette.accentEnd,
  color: nonUrlPalette.previewActiveText,
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${vars.colors.main}`,
      outlineOffset: '2px',
      boxShadow: `0 0 0 4px ${nonUrlPalette.focusRing}`,
    },
    '&:disabled': {
      opacity: 0.55,
      cursor: 'not-allowed',
      pointerEvents: 'none',
      boxShadow: 'none',
    },
  },
});
