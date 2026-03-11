import type { ResultTone } from '@/shared/types/resultTone';

import qrBlackIcon from './result/qrBlack.svg';
import qrGreenIcon from './result/qrGreen.svg';
import qrRedIcon from './result/qrRed.svg';
import qrYellowIcon from './result/qrYellow.svg';
import shieldCriticalIcon from './result/shieldCritical.svg';
import shieldSafeIcon from './result/shieldSafe.svg';
import shieldWarningIcon from './result/shieldWarning.svg';
import statusCriticalIcon from './result/statusCritical.svg';
import statusSafeIcon from './result/statusSafe.svg';
import statusWarningIcon from './result/statusWarning.svg';

export { qrBlackIcon };

export const qrIconByTone: Record<ResultTone, string> = {
  safe: qrGreenIcon,
  warning: qrYellowIcon,
  critical: qrRedIcon,
};

export const shieldIconByTone: Record<ResultTone, string> = {
  safe: shieldSafeIcon,
  warning: shieldWarningIcon,
  critical: shieldCriticalIcon,
};

export const statusMarkIconByTone: Record<ResultTone, string> = {
  safe: statusSafeIcon,
  warning: statusWarningIcon,
  critical: statusCriticalIcon,
};
