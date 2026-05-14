import { pickString } from '@/shared/api/responseAccess/payloadAccess';
import { mapSseStepId } from '@/shared/api/sse/sseStepMapper';

const terminalDetailStepIds = new Set(['riskScore', 'report', 'completed']);

export function shouldResolveDetailAfterTerminalProgress(
  payload: Record<string, unknown>,
): boolean {
  const rawStatus = pickString(payload, ['status', 'state'])?.trim().toLowerCase();
  const rawStep = pickString(payload, [
    'currentStepId',
    'current_step_id',
    'step',
    'stepId',
    'step_id',
  ]);
  const mappedStepId = mapSseStepId(rawStep);

  return (
    rawStatus === 'completed' && Boolean(mappedStepId && terminalDetailStepIds.has(mappedStepId))
  );
}
