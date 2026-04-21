import { useMemo } from 'react';

import {
  aiAnalysisDoneIcon,
  aiAnalysisReadyIcon,
  analysisDoneIcon,
  analysisPendingIcon,
  analysisReadyIcon,
  completedShieldIcon,
  decodingDoneIcon,
  decodingReadyIcon,
  reportDoneIcon,
  reportReadyIcon,
  riskScoreDoneIcon,
  riskScoreReadyIcon,
  shieldPercentIcon,
  totalAnalysisReadyIcon,
} from '@/shared/icon/loadingIcons';
import { qrBlackIcon } from '@/shared/icon/resultIcons';
import AppHeader from '@/shared/ui/app-header';

import { useLoadingPage } from './hooks/useLoadingPage';
import { useLoadingProgress } from './hooks/useLoadingProgress';
import * as styles from './styles/loadingPage.css';

import type { LoadingState, LoadingStepId } from './types/loadingPage.types';

type StepIconSet = {
  active: string;
  done: string;
  pending: string;
};

const availableLoadingCases = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const progressRadius = 100;
const progressCircumference = 2 * Math.PI * progressRadius;

const stateLabel: Record<LoadingState, string> = {
  active: '진행 중',
  done: '완료',
  pending: '준비',
};

const analysisIconSet: StepIconSet = {
  active: analysisReadyIcon,
  done: analysisDoneIcon,
  pending: analysisPendingIcon,
};

const stepIconMap: Record<LoadingStepId, StepIconSet> = {
  aiAnalysis: {
    active: aiAnalysisReadyIcon,
    done: aiAnalysisDoneIcon,
    pending: aiAnalysisReadyIcon,
  },
  completed: analysisIconSet,
  decode: {
    active: decodingReadyIcon,
    done: decodingDoneIcon,
    pending: decodingReadyIcon,
  },
  externalApi: analysisIconSet,
  internalDb: analysisIconSet,
  redirect: analysisIconSet,
  report: {
    active: reportReadyIcon,
    done: reportDoneIcon,
    pending: reportReadyIcon,
  },
  riskScore: {
    active: riskScoreReadyIcon,
    done: riskScoreDoneIcon,
    pending: riskScoreReadyIcon,
  },
  ruleAnalysis: analysisIconSet,
  shortUrlCheck: analysisIconSet,
  urlNormalize: analysisIconSet,
};

export default function LoadingPage() {
  const {
    handleCaseChange,
    handleRandomCaseChange,
    handleSequentialDemoStart,
    isSequentialDemoMode,
    loadingCaseNumber,
    loadingPageData,
    showCaseControls,
    useMockProgressDemo,
  } = useLoadingPage();
  const {
    getDetailStepState,
    getStepState,
    progress,
    progressLabel,
    progressMetaText,
    statusDescription,
    visibleStepIds,
  } = useLoadingProgress(loadingPageData.steps, {
    progressIntervalMs: loadingPageData.progressIntervalMs,
    revealStepsSequentially: isSequentialDemoMode,
    useMockProgressDemo,
  });
  const visibleSteps = useMemo(
    () => loadingPageData.steps.filter((step) => visibleStepIds.includes(step.id)),
    [loadingPageData.steps, visibleStepIds],
  );
  const dashOffset = progressCircumference - (progress / 100) * progressCircumference;

  return (
    <main className={styles.page}>
      <AppHeader iconSrc={qrBlackIcon} />

      <section className={styles.container}>
        <header className={styles.progressSection}>
          <div className={styles.progressRingWrap}>
            <svg aria-hidden className={styles.progressSvg} viewBox="0 0 240 240">
              <circle className={styles.progressTrack} cx="120" cy="120" r={progressRadius} />
              <circle
                className={styles.progressValue}
                cx="120"
                cy="120"
                r={progressRadius}
                strokeDasharray={progressCircumference}
                strokeDashoffset={dashOffset}
              />
            </svg>

            <div className={styles.progressCenter}>
              <img
                alt=""
                aria-hidden
                className={progress === 100 ? styles.centerIconDone : styles.centerIconPreparing}
                src={progress === 100 ? shieldPercentIcon : totalAnalysisReadyIcon}
              />
              <p className={styles.percentText}>{progressLabel}</p>
              <p className={styles.progressMetaText}>{progressMetaText}</p>
            </div>
          </div>

          <h1 className={styles.title}>보안 분석 중...</h1>
          <p className={styles.description}>{statusDescription}</p>
        </header>

        <section className={styles.flowSection}>
          <ol className={styles.flowList}>
            {visibleSteps.map((step, index) => {
              const state = getStepState(index);
              const iconSet = stepIconMap[step.id];
              const iconSrc = iconSet[state];
              const flowItemClassName =
                index < visibleSteps.length - 1
                  ? `${styles.flowItem} ${styles.flowItemWithLine}`
                  : styles.flowItem;

              return (
                <li className={flowItemClassName} key={step.id}>
                  <span className={`${styles.flowIcon} ${styles.flowIconState[state]}`}>
                    <img alt="" className={styles.flowIconImage} src={iconSrc} />
                  </span>

                  <div className={styles.flowContent}>
                    <div className={styles.flowTitleRow}>
                      <p className={styles.flowTitle}>{step.title}</p>
                    </div>
                    <p className={styles.flowDescription}>
                      {state === 'done'
                        ? step.doneDescription
                        : state === 'active'
                          ? step.activeDescription
                          : step.pendingDescription}
                    </p>
                    <p className={`${styles.stateText} ${styles.stateTextState[state]}`}>
                      {stateLabel[state]}
                    </p>

                    {step.details && step.details.length > 0 ? (
                      <ul className={styles.detailList}>
                        {step.details.map((detailStep, detailIndex) => {
                          const detailState = getDetailStepState(index, detailIndex);
                          const detailIconSrc =
                            detailState === 'done'
                              ? completedShieldIcon
                              : detailState === 'active'
                                ? analysisReadyIcon
                                : analysisPendingIcon;

                          return (
                            <li className={styles.detailItem} key={detailStep.title}>
                              <span
                                className={`${styles.detailIcon} ${styles.detailIconState[detailState]}`}
                              >
                                <img
                                  alt=""
                                  className={styles.detailIconImage}
                                  src={detailIconSrc}
                                />
                              </span>

                              <div className={styles.detailContent}>
                                <p className={styles.detailTitle}>{detailStep.title}</p>
                                <p
                                  className={`${styles.detailState} ${styles.detailStateTone[detailState]}`}
                                >
                                  {stateLabel[detailState]}
                                </p>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {showCaseControls ? (
          <section className={styles.caseControlSection}>
            <div className={styles.caseControlHeader}>
              <p className={styles.caseControlTitle}>테스트 케이스 선택</p>
              <p className={styles.caseControlCurrent}>
                현재 case {loadingCaseNumber}
                {isSequentialDemoMode ? ' · 순차 흐름 보기' : ' · 전체 흐름 보기'}
              </p>
            </div>

            <div className={styles.caseButtonList}>
              {availableLoadingCases.map((caseNumber) => (
                <button
                  className={
                    caseNumber === loadingCaseNumber
                      ? `${styles.caseButton} ${styles.caseButtonActive}`
                      : styles.caseButton
                  }
                  key={caseNumber}
                  onClick={() => handleCaseChange(caseNumber)}
                  type="button"
                >
                  case {caseNumber}
                </button>
              ))}

              <button
                className={`${styles.caseButton} ${styles.randomCaseButton}`}
                onClick={handleRandomCaseChange}
                type="button"
              >
                랜덤
              </button>

              <button
                className={
                  isSequentialDemoMode
                    ? `${styles.caseButton} ${styles.branchDemoButton} ${styles.branchDemoButtonActive}`
                    : `${styles.caseButton} ${styles.branchDemoButton}`
                }
                onClick={handleSequentialDemoStart}
                type="button"
              >
                순차 흐름 보기
              </button>
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}
