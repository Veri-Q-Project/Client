import { style, styleVariants } from '@vanilla-extract/css';

import { vars } from '@/vars.css';

const bpTablet = 'screen and (min-width: 768px)';
const bpDesktop = 'screen and (min-width: 1200px)';

export const page = style({
  minHeight: '100vh',
  backgroundColor: vars.colors.white,
});

export const shell = style({
  boxSizing: 'border-box',
  maxWidth: '1120px',
  width: '100%',
  margin: '0 auto',
  padding: `0 ${vars.spacing.md} ${vars.spacing.xl}`,
  '@media': {
    [bpTablet]: {
      padding: `0 ${vars.spacing.lg} 48px`,
    },
  },
});

export const content = style({
  width: '100%',
  maxWidth: '860px',
  margin: '0 auto',
  display: 'grid',
  gap: vars.spacing.lg,
  paddingTop: vars.spacing.xl,
  paddingBottom: vars.spacing.xl,
  '@media': {
    [bpDesktop]: {
      gap: vars.spacing.xl,
    },
  },
});

export const toneHeader = style({
  borderRadius: vars.radius.lg,
  border: '1px solid #D8E2F0',
  backgroundColor: '#F8FBFF',
  padding: vars.spacing.lg,
  display: 'grid',
  gap: vars.spacing.md,
  boxShadow: '0 8px 20px rgba(17, 29, 48, 0.06)',
});

export const toneHeaderTone = styleVariants({
  critical: {
    backgroundColor: '#FFF6F6',
    borderColor: '#F1CECE',
  },
  safe: {
    backgroundColor: '#F3FBF7',
    borderColor: '#CBEFDE',
  },
  warning: {
    backgroundColor: '#FFFCF2',
    borderColor: '#EFE4B8',
  },
});

export const toneHeaderTop = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: vars.spacing.sm,
  flexWrap: 'wrap',
});

export const toneTitleWrap = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.spacing.sm,
});

export const toneIconWrap = style({
  width: '42px',
  height: '42px',
  borderRadius: '999px',
  background:
    'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 1) 0%, rgba(245, 250, 255, 1) 80%)',
  border: '1px solid rgba(0, 106, 228, 0.12)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.95), 0 6px 12px rgba(0, 106, 228, 0.12)',
});

export const toneIconImage = style({
  width: '22px',
  height: '22px',
  objectFit: 'contain',
});

export const toneTitleBlock = style({
  display: 'grid',
  gap: '2px',
});

export const toneTitle = style({
  margin: 0,
  color: vars.colors.black,
  fontSize: vars.font.size['3xl'],
  fontWeight: vars.font.weight.bold,
  lineHeight: 1.2,
});

export const toneSubtitle = style({
  margin: 0,
  color: vars.colors.subText,
  fontSize: vars.font.size.md,
  lineHeight: 1.5,
});

export const levelBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '32px',
  padding: '0 14px',
  borderRadius: '999px',
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.semibold,
  lineHeight: 1,
  border: '1px solid transparent',
  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.4)',
});

export const levelBadgeTone = styleVariants({
  critical: {
    backgroundColor: 'rgba(242, 13, 13, 0.16)',
    borderColor: 'rgba(242, 13, 13, 0.32)',
    color: vars.colors.error,
  },
  safe: {
    backgroundColor: 'rgba(17, 212, 131, 0.16)',
    borderColor: 'rgba(17, 212, 131, 0.32)',
    color: vars.colors.success,
  },
  warning: {
    backgroundColor: 'rgba(242, 223, 13, 0.22)',
    borderColor: 'rgba(242, 223, 13, 0.4)',
    color: '#9A8600',
  },
});

export const toneMetaGrid = style({
  display: 'grid',
  gap: vars.spacing.xs,
  '@media': {
    [bpTablet]: {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
  },
});

export const toneMeta = style({
  margin: 0,
  borderRadius: vars.radius.md,
  border: '1px solid rgba(0, 106, 228, 0.14)',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  padding: `${vars.spacing.sm} ${vars.spacing.md}`,
  display: 'grid',
  gap: '2px',
});

export const toneMetaKey = style({
  color: vars.colors.subDark,
  fontSize: vars.font.size.xs,
  fontWeight: vars.font.weight.semibold,
});

export const toneMetaValue = style({
  color: vars.colors.black,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.medium,
  lineHeight: 1.4,
  wordBreak: 'break-all',
});

export const metricsGrid = style({
  display: 'grid',
  gap: vars.spacing.md,
  '@media': {
    [bpTablet]: {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
  },
});

export const sectionCard = style({
  borderRadius: vars.radius.lg,
  border: '1px solid #F0E4BE',
  backgroundColor: '#FFFEFA',
  padding: vars.spacing.lg,
  display: 'grid',
  gap: vars.spacing.md,
  boxShadow: '0 6px 16px rgba(138, 113, 0, 0.08)',
});

export const sectionHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.spacing.sm,
  flexWrap: 'wrap',
});

export const sectionTitleGroup = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: vars.spacing.sm,
});

export const sectionNumber = style({
  width: '30px',
  height: '30px',
  borderRadius: '8px',
  backgroundColor: '#FFE9A8',
  color: '#7A6400',
  border: '1px solid #F2D86A',
  fontSize: vars.font.size.md,
  fontWeight: vars.font.weight.bold,
  lineHeight: 1,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

export const sectionTitle = style({
  margin: 0,
  color: '#1C2F4A',
  fontSize: vars.font.size.xl,
  fontWeight: vars.font.weight.semibold,
});

export const sectionSubtitle = style({
  margin: 0,
  color: '#5E6D83',
  fontSize: vars.font.size.sm,
  lineHeight: 1.5,
});

export const riskBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '30px',
  padding: '0 14px 0 12px',
  borderRadius: '999px',
  border: '1px solid #E9D77A',
  backgroundColor: '#FFF8D8',
  color: '#6F5A00',
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.semibold,
  lineHeight: 1,
  gap: '8px',
  margin: 0,
  selectors: {
    '&::before': {
      content: '""',
      width: '7px',
      height: '7px',
      borderRadius: '999px',
      backgroundColor: 'currentColor',
      display: 'inline-block',
      opacity: 0.8,
    },
  },
});

export const urlCompareGrid = style({
  display: 'grid',
  gap: vars.spacing.sm,
  '@media': {
    [bpTablet]: {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
  },
});

export const urlBox = style({
  borderRadius: vars.radius.md,
  border: '1px solid rgba(0, 106, 228, 0.16)',
  backgroundColor: '#F8FBFF',
  padding: vars.spacing.md,
  display: 'grid',
  gap: vars.spacing.xs,
});

export const urlLabelRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.spacing.xs,
  flexWrap: 'wrap',
});

export const destinationUrlBox = style({
  borderColor: 'rgba(242, 223, 13, 0.62)',
  backgroundColor: 'rgba(242, 223, 13, 0.1)',
});

export const urlLabel = style({
  margin: 0,
  color: vars.colors.subDark,
  fontSize: vars.font.size.xs,
  fontWeight: vars.font.weight.semibold,
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
});

export const urlValue = style({
  margin: 0,
  color: vars.colors.black,
  fontSize: vars.font.size.sm,
  lineHeight: 1.5,
  wordBreak: 'break-all',
});

export const protocolBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '24px',
  padding: '0 10px 0 8px',
  borderRadius: '999px',
  fontSize: vars.font.size.xs,
  fontWeight: vars.font.weight.semibold,
  lineHeight: 1,
  border: '1px solid transparent',
  gap: '6px',
  margin: 0,
  selectors: {
    '&::before': {
      content: '""',
      width: '6px',
      height: '6px',
      borderRadius: '999px',
      backgroundColor: 'currentColor',
      display: 'inline-block',
      opacity: 0.8,
    },
  },
});

export const protocolBadgeTone = styleVariants({
  secure: {
    backgroundColor: '#DDF4EA',
    borderColor: '#B4E8D0',
    color: '#128E63',
  },
  warning: {
    backgroundColor: '#FFF7DB',
    borderColor: '#EDD982',
    color: '#8D7200',
  },
  unknown: {
    backgroundColor: '#EEF1F5',
    borderColor: '#D4DCE7',
    color: '#5D6B80',
  },
});

export const protocolSummary = style({
  margin: 0,
  borderRadius: vars.radius.md,
  border: '1px solid transparent',
  padding: `${vars.spacing.sm} ${vars.spacing.md}`,
  fontSize: vars.font.size.sm,
  lineHeight: 1.6,
  fontWeight: vars.font.weight.medium,
});

export const protocolSummarySecure = style({
  backgroundColor: '#F1FAF5',
  borderColor: '#CBEAD9',
  color: '#2F6A4F',
});

export const protocolSummaryWarning = style({
  backgroundColor: '#FFF8E9',
  borderColor: '#F0D8A5',
  color: '#7A6023',
});

export const domainCompareGrid = style({
  display: 'grid',
  gap: vars.spacing.sm,
});

export const domainCompareRow = style({
  borderRadius: vars.radius.md,
  border: '1px solid rgba(242, 223, 13, 0.32)',
  backgroundColor: '#FFFDF3',
  padding: vars.spacing.sm,
  display: 'grid',
  gap: vars.spacing.xs,
});

export const domainCompareLabel = style({
  margin: 0,
  color: vars.colors.subText,
  fontSize: vars.font.size.xs,
  fontWeight: vars.font.weight.semibold,
});

export const domainCompareSuspicious = style({
  margin: 0,
  color: vars.colors.error,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.bold,
  lineHeight: 1.5,
  wordBreak: 'break-all',
});

export const domainCompareOfficial = style({
  margin: 0,
  color: vars.colors.success,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.bold,
  lineHeight: 1.5,
  wordBreak: 'break-all',
});

export const domainCompareSummary = style({
  margin: 0,
  color: vars.colors.subText,
  fontSize: vars.font.size.sm,
  lineHeight: 1.6,
});

export const riskDetectionGrid = style({
  display: 'grid',
  gap: vars.spacing.md,
});

export const riskDetectionCard = style({
  borderRadius: vars.radius.xl,
  border: '1px solid #F0E5BF',
  backgroundColor: '#FFFEFA',
  boxShadow: '0 8px 18px rgba(138, 113, 0, 0.08)',
  overflow: 'hidden',
});

export const riskDetectionCardHeader = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: vars.spacing.sm,
  padding: `${vars.spacing.lg} ${vars.spacing.lg} ${vars.spacing.md}`,
});

export const riskDetectionIcon = style({
  width: '48px',
  height: '48px',
  borderRadius: '999px',
  display: 'inline-flex',
  flexShrink: 0,
  background:
    'radial-gradient(circle at 30% 30%, rgba(255, 92, 128, 0.34) 0%, rgba(255, 59, 104, 0.2) 62%, rgba(255, 59, 104, 0.12) 100%)',
  border: '1px solid rgba(255, 59, 104, 0.3)',
});

export const riskDetectionHeaderTextBlock = style({
  display: 'grid',
  gap: '2px',
  borderLeft: '4px solid #F2DF0D',
  paddingLeft: vars.spacing.sm,
});

export const riskDetectionTitle = style({
  margin: 0,
  color: '#1E314D',
  fontSize: vars.font.size['2xl'],
  fontWeight: vars.font.weight.semibold,
  lineHeight: 1.3,
});

export const riskDetectionEnglishLabel = style({
  margin: 0,
  color: '#72829A',
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.semibold,
  letterSpacing: '0.06em',
});

export const riskDetectionBody = style({
  margin: `0 ${vars.spacing.lg} ${vars.spacing.lg}`,
  borderRadius: vars.radius.lg,
  border: '1px solid #F3E8BE',
  backgroundColor: '#FFFBF0',
  padding: vars.spacing.lg,
  display: 'grid',
  gap: vars.spacing.md,
});

export const riskDetectionBodyLabel = style({
  margin: 0,
  color: '#7B6700',
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.semibold,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  selectors: {
    '&::before': {
      content: '""',
      width: '8px',
      height: '8px',
      borderRadius: '999px',
      backgroundColor: '#D3B600',
      display: 'inline-block',
      boxShadow: '0 0 0 3px rgba(242, 223, 13, 0.24)',
    },
  },
});

export const riskDetectionDescription = style({
  margin: 0,
  color: '#23354E',
  fontSize: vars.font.size.md,
  fontWeight: vars.font.weight.medium,
  lineHeight: 1.7,
});

export const riskDetectionRisk = style({
  margin: 0,
  paddingTop: vars.spacing.md,
  borderTop: '1px solid #EFE2B9',
  color: '#5A6880',
  fontSize: vars.font.size.sm,
  lineHeight: 1.65,
  selectors: {
    '&::before': {
      content: '"위험성: "',
      color: '#9B7200',
      fontWeight: vars.font.weight.semibold,
    },
  },
});

export const reputationBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '30px',
  padding: '0 14px 0 12px',
  borderRadius: '999px',
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.semibold,
  lineHeight: 1,
  border: '1px solid transparent',
  gap: '8px',
  margin: 0,
  selectors: {
    '&::before': {
      content: '""',
      width: '7px',
      height: '7px',
      borderRadius: '999px',
      backgroundColor: 'currentColor',
      display: 'inline-block',
      opacity: 0.8,
    },
  },
});

export const reputationBadgeTone = styleVariants({
  clean: {
    backgroundColor: '#DDF4EA',
    borderColor: '#B4E8D0',
    color: '#128E63',
  },
  warning: {
    backgroundColor: '#FFF7DB',
    borderColor: '#EDD982',
    color: '#8D7200',
  },
});

export const reputationStatGrid = style({
  display: 'grid',
  gap: vars.spacing.sm,
  '@media': {
    [bpTablet]: {
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    },
  },
});

export const reputationStatCard = style({
  borderRadius: vars.radius.md,
  border: '1px solid rgba(0, 106, 228, 0.14)',
  backgroundColor: vars.colors.white,
  padding: vars.spacing.md,
  display: 'grid',
  gap: vars.spacing.xs,
  justifyItems: 'center',
});

export const reputationStatLabel = style({
  margin: 0,
  color: vars.colors.subText,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.semibold,
});

export const reputationStatValue = style({
  margin: 0,
  color: vars.colors.success,
  fontSize: vars.font.size['2xl'],
  fontWeight: vars.font.weight.bold,
  lineHeight: 1.1,
});

export const providerCard = style({
  borderRadius: vars.radius.md,
  border: '1px solid rgba(11, 11, 11, 0.08)',
  backgroundColor: vars.colors.white,
  padding: vars.spacing.sm,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.spacing.md,
  '@media': {
    [bpTablet]: {
      padding: vars.spacing.md,
    },
  },
});

export const providerPanel = style({
  display: 'grid',
  gap: vars.spacing.md,
});

export const providerMain = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.spacing.md,
  minWidth: 0,
});

export const providerIconWrap = style({
  width: '76px',
  height: '76px',
  borderRadius: vars.radius.md,
  backgroundColor: '#F7F8FA',
  border: '1px solid rgba(11, 11, 11, 0.06)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: vars.spacing.xs,
  flexShrink: 0,
  '@media': {
    [bpTablet]: {
      width: '96px',
      height: '96px',
    },
  },
});

export const providerIconImage = style({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
});

export const providerTextBlock = style({
  display: 'grid',
  gap: '4px',
  minWidth: 0,
});

export const providerName = style({
  margin: 0,
  color: vars.colors.black,
  fontSize: vars.font.size.xl,
  fontWeight: vars.font.weight.semibold,
  lineHeight: 1.35,
});

export const providerStatusText = style({
  margin: 0,
  color: vars.colors.subText,
  fontSize: vars.font.size.md,
  fontWeight: vars.font.weight.medium,
  lineHeight: 1.4,
});

export const providerResultIconWrap = style({
  width: '42px',
  height: '42px',
  borderRadius: '999px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

export const providerResultIconImage = style({
  width: '34px',
  height: '34px',
  objectFit: 'contain',
});

export const providerDescriptionCard = style({
  borderRadius: '20px',
  backgroundColor: '#DEE9E3',
  padding: `${vars.spacing.lg} ${vars.spacing.lg} ${vars.spacing.lg} ${vars.spacing.xl}`,
  position: 'relative',
  overflow: 'hidden',
  selectors: {
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: vars.spacing.sm,
      bottom: vars.spacing.sm,
      width: '6px',
      borderRadius: '999px',
      backgroundColor: vars.colors.success,
    },
  },
});

export const providerDescriptionText = style({
  margin: 0,
  color: '#34465D',
  fontSize: `clamp(${vars.font.size.sm}, 1.1vw, ${vars.font.size.md})`,
  fontWeight: vars.font.weight.medium,
  lineHeight: 1.65,
});

export const serverInfoGrid = style({
  display: 'grid',
  gap: vars.spacing.sm,
});

export const serverInfoRow = style({
  display: 'grid',
  gridTemplateColumns: '92px minmax(0, 1fr)',
  columnGap: vars.spacing.sm,
  alignItems: 'start',
  paddingBottom: vars.spacing.xs,
  borderBottom: '1px solid rgba(0, 106, 228, 0.14)',
  selectors: {
    '&:last-child': {
      borderBottom: 'none',
      paddingBottom: 0,
    },
  },
});

export const serverInfoKey = style({
  margin: 0,
  color: vars.colors.subText,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.semibold,
});

export const serverInfoValue = style({
  margin: 0,
  color: vars.colors.black,
  fontSize: vars.font.size.sm,
  lineHeight: 1.5,
});

export const certificateStatus = style({
  fontWeight: vars.font.weight.semibold,
});

export const certificateSuccess = style({
  color: vars.colors.success,
});

export const certificateWarning = style({
  color: '#8D7200',
});

export const certificateError = style({
  color: vars.colors.error,
});

export const exportActionWrap = style({
  width: '100%',
  maxWidth: '860px',
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'center',
});

export const exportPdfButton = style({
  minWidth: '220px',
  minHeight: '44px',
  borderRadius: vars.radius.md,
  border: '1px solid #E6C85D',
  backgroundColor: '#FFF6CF',
  color: '#6D5800',
  fontSize: vars.font.size.md,
  fontWeight: vars.font.weight.semibold,
  lineHeight: 1,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.spacing.xs,
  padding: `0 ${vars.spacing.md}`,
  cursor: 'pointer',
  transition: 'background-color 160ms ease, box-shadow 160ms ease, transform 120ms ease',
  boxShadow: '0 4px 12px rgba(138, 113, 0, 0.15)',
  selectors: {
    '&:hover:not(:disabled)': {
      backgroundColor: '#FDEFB6',
      boxShadow: '0 6px 14px rgba(138, 113, 0, 0.2)',
      transform: 'translateY(-1px)',
    },
    '&:active:not(:disabled)': {
      transform: 'translateY(0)',
    },
    '&:focus-visible': {
      outline: '2px solid #D9B300',
      outlineOffset: '2px',
    },
    '&:disabled': {
      opacity: 0.7,
      cursor: 'default',
      transform: 'none',
      boxShadow: 'none',
    },
  },
});

export const exportPdfButtonBadge = style({
  minWidth: '34px',
  height: '22px',
  padding: '0 8px',
  borderRadius: '999px',
  backgroundColor: '#6D5800',
  color: '#FFFFFF',
  fontSize: vars.font.size.xs,
  fontWeight: vars.font.weight.bold,
  lineHeight: 1,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});
