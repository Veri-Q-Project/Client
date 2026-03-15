import { style } from '@vanilla-extract/css';

import { vars } from '@/vars.css';

export const futureContent = style({
  display: 'grid',
  gap: vars.spacing.md,
});

export const analysisSection = style({
  display: 'grid',
  gap: vars.spacing.md,
  padding: vars.spacing.lg,
  borderRadius: '24px',
  border: '1px solid rgba(242, 223, 13, 0.45)',
  backgroundColor: '#FFFDF6',
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
  backgroundColor: '#FFF1B8',
  border: '1px solid rgba(242, 223, 13, 0.72)',
  color: '#A27200',
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
  color: '#1D3557',
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
  border: '1px solid rgba(242, 223, 13, 0.34)',
  backgroundColor: vars.colors.white,
  boxShadow: '0 20px 48px rgba(242, 223, 13, 0.08)',
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
  background: 'linear-gradient(180deg, #F2DF0D 0%, #D9B800 100%)',
});

export const actionHeaderTextBlock = style({
  display: 'grid',
  gap: vars.spacing.xs,
});

export const actionTitle = style({
  margin: 0,
  color: '#16345B',
  fontSize: 'clamp(20px, 2.8vw, 34px)',
  fontWeight: vars.font.weight.bold,
  lineHeight: 1.25,
  wordBreak: 'keep-all',
});

export const actionEnglishLabel = style({
  margin: 0,
  color: '#7D8FB3',
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
  backgroundColor: '#FFF9E8',
  border: '1px solid rgba(242, 223, 13, 0.4)',
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
  backgroundColor: '#D9B800',
});

export const detailLabel = style({
  margin: 0,
  color: '#B28300',
  fontSize: vars.font.size.md,
  fontWeight: vars.font.weight.bold,
  lineHeight: 1.4,
});

export const actionDescription = style({
  margin: 0,
  color: '#16345B',
  fontSize: 'clamp(16px, 1.7vw, 22px)',
  fontWeight: vars.font.weight.medium,
  lineHeight: 1.7,
  wordBreak: 'keep-all',
});

export const actionDivider = style({
  width: '100%',
  height: '1px',
  backgroundColor: 'rgba(217, 184, 0, 0.32)',
});

export const actionCaution = style({
  margin: 0,
  color: '#50637C',
  fontSize: 'clamp(15px, 1.5vw, 20px)',
  lineHeight: 1.75,
  wordBreak: 'keep-all',
});

export const actionCautionLabel = style({
  color: '#B28300',
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
  boxShadow: '0 14px 32px rgba(242, 223, 13, 0.18)',
});

export const executionFeedback = style({
  margin: 0,
  color: '#7D6200',
  fontSize: vars.font.size.sm,
  lineHeight: 1.6,
  textAlign: 'center',
});

export const previewSection = style({
  display: 'grid',
  gap: vars.spacing.sm,
  padding: vars.spacing.md,
  borderRadius: vars.radius.lg,
  border: '1px solid rgba(242, 223, 13, 0.28)',
  backgroundColor: '#FFFBEF',
});

export const previewTitle = style({
  margin: 0,
  color: '#7D6200',
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
  border: '1px solid rgba(242, 223, 13, 0.45)',
  borderRadius: '999px',
  backgroundColor: vars.colors.white,
  color: '#6F5A00',
  padding: '8px 14px',
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.medium,
  lineHeight: 1.2,
  cursor: 'pointer',
});

export const previewButtonActive = style({
  backgroundColor: '#F2DF0D',
  borderColor: '#D9B800',
  color: '#3D3200',
});
