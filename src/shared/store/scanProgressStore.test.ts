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

  it('clears stale progress when starting a new connection', () => {
    useScanProgressStore.getState().updateFromProgressEvent({
      percent: 80,
      status: 'IN_PROGRESS',
      step: 'DB_CHECK',
    });

    useScanProgressStore.getState().setConnecting();

    const state = useScanProgressStore.getState();

    expect(state.status).toBe('connecting');
    expect(state.percent).toBe(0);
    expect(state.currentStepId).toBeNull();
    expect(state.completedStepIds).toEqual([]);
    expect(state.errorMessage).toBeNull();
  });

  it('clears stale errors when a retry completes', () => {
    useScanProgressStore.getState().setError('temporary failure');
    useScanProgressStore.getState().setCompleted();

    expect(useScanProgressStore.getState().errorMessage).toBeNull();
  });

  it('clears stale progress when an error is set', () => {
    useScanProgressStore.getState().updateFromProgressEvent({
      percent: 70,
      status: 'IN_PROGRESS',
      step: 'DB_CHECK',
    });

    useScanProgressStore.getState().setError('network failure');

    const state = useScanProgressStore.getState();

    expect(state.status).toBe('error');
    expect(state.backendMessage).toBe('network failure');
    expect(state.backendStatus).toBe('error');
    expect(state.percent).toBe(0);
    expect(state.currentStepId).toBeNull();
    expect(state.completedStepIds).toEqual([]);
  });

  it('marks the flow completed when backend sends only a terminal status', () => {
    useScanProgressStore.getState().updateFromProgressEvent({
      status: 'COMPLETED',
    });

    const state = useScanProgressStore.getState();

    expect(state.status).toBe('completed');
    expect(state.currentStepId).toBe('completed');
    expect(state.percent).toBe(100);
  });

  it('keeps unknown in-progress steps as raw metadata and completes on terminal status', () => {
    useScanProgressStore.getState().updateFromProgressEvent({
      message: 'new step started',
      status: 'IN_PROGRESS',
      step: 'NEW_BACKEND_STEP',
    });

    let state = useScanProgressStore.getState();

    expect(state.status).toBe('active');
    expect(state.backendStep).toBe('NEW_BACKEND_STEP');
    expect(state.backendStatus).toBe('in_progress');
    expect(state.backendMessage).toBe('new step started');
    expect(state.currentStepId).toBeNull();
    expect(state.completedStepIds).toEqual([]);

    useScanProgressStore.getState().updateFromProgressEvent({
      message: 'new step completed',
      status: 'COMPLETED',
      step: 'NEW_BACKEND_STEP',
    });

    state = useScanProgressStore.getState();

    expect(state.status).toBe('completed');
    expect(state.backendStep).toBe('NEW_BACKEND_STEP');
    expect(state.backendStatus).toBe('completed');
    expect(state.backendMessage).toBe('new step completed');
    expect(state.currentStepId).toBe('completed');
    expect(state.completedStepIds.at(-1)).toBe('completed');
    expect(state.percent).toBe(100);
  });
});
