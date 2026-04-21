import { afterEach, describe, expect, it } from 'vitest';

import { useScanProgressStore } from './scanProgressStore';

describe('scanProgressStore', () => {
  afterEach(() => {
    useScanProgressStore.getState().reset();
  });

  it('maps backend pipeline step names into loading state', () => {
    useScanProgressStore.getState().updateFromProgressEvent({
      message: '파이프라인 진입 성공',
      status: 'IN_PROGRESS',
      step: 'TEST',
    });
    useScanProgressStore.getState().updateFromProgressEvent({
      message: '단축 URL 여부 확인이 완료되었습니다.',
      status: 'COMPLETED',
      step: 'SHORT_URL_CHECK',
    });
    useScanProgressStore.getState().updateFromProgressEvent({
      message: 'URL 정규화가 완료되었습니다.',
      status: 'COMPLETED',
      step: 'URL_NORMALIZE',
    });
    useScanProgressStore.getState().updateFromProgressEvent({
      message: '내부 DB에서 기존 분석 이력을 조회하고 있습니다.',
      status: 'IN_PROGRESS',
      step: 'DB_CHECK',
    });

    const state = useScanProgressStore.getState();

    expect(state.status).toBe('active');
    expect(state.backendMessage).toBe('내부 DB에서 기존 분석 이력을 조회하고 있습니다.');
    expect(state.backendStatus).toBe('in_progress');
    expect(state.backendStep).toBe('DB_CHECK');
    expect(state.currentStepId).toBe('internalDb');
    expect(state.completedStepIds).toEqual(['decode', 'shortUrlCheck', 'urlNormalize']);
    expect(state.completedStepIds).not.toContain('redirect');
    expect(state.percent).toBeGreaterThan(0);
  });

  it('marks the current step done only when backend status is completed', () => {
    useScanProgressStore.getState().updateFromProgressEvent({
      status: 'IN_PROGRESS',
      step: 'RULE_ANALYSIS',
    });

    expect(useScanProgressStore.getState().completedStepIds).not.toContain('ruleAnalysis');

    useScanProgressStore.getState().updateFromProgressEvent({
      status: 'COMPLETED',
      step: 'RULE_ANALYSIS',
    });

    expect(useScanProgressStore.getState().completedStepIds).toContain('ruleAnalysis');
  });

  it('marks the flow completed when the backend sends a terminal step', () => {
    useScanProgressStore.getState().updateFromProgressEvent({
      status: 'COMPLETED',
      step: 'completed',
    });

    const state = useScanProgressStore.getState();

    expect(state.status).toBe('completed');
    expect(state.currentStepId).toBe('completed');
    expect(state.completedStepIds.at(-1)).toBe('completed');
    expect(state.percent).toBe(100);
  });

  it('marks every mapped step done when detail polling completes the flow', () => {
    useScanProgressStore.getState().setCompleted();

    const state = useScanProgressStore.getState();

    expect(state.status).toBe('completed');
    expect(state.completedStepIds).toContain('decode');
    expect(state.completedStepIds).toContain('shortUrlCheck');
    expect(state.completedStepIds).toContain('urlNormalize');
    expect(state.completedStepIds).toContain('completed');
  });
});
