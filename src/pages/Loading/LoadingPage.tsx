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

import { useLoadingProgress } from './hooks/useLoadingProgress';
import * as styles from './styles/loadingPage.css';

type LoadingStepMessage = {
  activeDescription: string;
  doneDescription: string;
  pendingDescription: string;
  title: string;
};

const mainSteps: LoadingStepMessage[] = [
  {
    activeDescription: '주소를 읽어오고 있습니다...',
    doneDescription: '주소 읽기가 완료되었습니다.',
    pendingDescription: '주소 디코딩을 준비 중입니다...',
    title: 'QR 코드 디코딩',
  },
  {
    activeDescription: '딥러닝 엔진이 위험 요소를 탐지 중입니다...',
    doneDescription: '위험 요소 탐지가 완료되었습니다.',
    pendingDescription: '위험 분석을 준비 중입니다...',
    title: 'AI 위험 분석',
  },
  {
    activeDescription: '위험 지표를 종합하는 중입니다...',
    doneDescription: '종합 위험도 산출이 완료되었습니다.',
    pendingDescription: '위험도 산출을 준비 중입니다...',
    title: '종합 위험도 산출',
  },
  {
    activeDescription: '상세 보안 리포트를 구성 중입니다...',
    doneDescription: '보안 리포트 작성이 완료되었습니다.',
    pendingDescription: '리포트 작성을 준비 중입니다...',
    title: '리포트 작성',
  },
  {
    activeDescription: '곧 결과 페이지로 이동합니다...',
    doneDescription: '결과 페이지로 이동합니다.',
    pendingDescription: '최종 결과 정리를 준비 중입니다...',
    title: '분석 완료',
  },
];

const analysisDetailSteps = [
  {
    title: '리다이렉트 경로 분석',
  },
  {
    title: '글로벌 보안 DB 대조',
  },
  {
    title: '도메인 사칭 분석',
  },
  {
    title: '서버 및 인증서 검사',
  },
] as const;

const progressRadius = 100;
const progressCircumference = 2 * Math.PI * progressRadius;

const stateLabel = {
  active: '진행 중',
  done: '완료',
  pending: '준비',
} as const;

const stepIcons = [
  {
    done: decodingDoneIcon,
    pending: decodingReadyIcon,
    ready: decodingReadyIcon,
  },
  {
    done: aiAnalysisDoneIcon,
    pending: aiAnalysisReadyIcon,
    ready: aiAnalysisReadyIcon,
  },
  {
    done: riskScoreDoneIcon,
    pending: riskScoreReadyIcon,
    ready: riskScoreReadyIcon,
  },
  {
    done: reportDoneIcon,
    pending: reportReadyIcon,
    ready: reportReadyIcon,
  },
  {
    done: analysisDoneIcon,
    pending: analysisPendingIcon,
    ready: analysisReadyIcon,
  },
] as const;

export default function LoadingPage() {
  const { getAnalysisDetailState, getMainStepState, progress, statusDescription } =
    useLoadingProgress();

  const dashOffset = progressCircumference - (progress / 100) * progressCircumference;

  return (
    <main className={styles.page}>
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
              <p className={styles.percentText}>{progress}%</p>
            </div>
          </div>

          <h1 className={styles.title}>보안 분석 중...</h1>
          <p className={styles.description}>{statusDescription}</p>
        </header>

        <section className={styles.flowSection}>
          <ol className={styles.flowList}>
            {mainSteps.map((step, index) => {
              const state = getMainStepState(index);
              const iconSet = stepIcons[index];
              const iconSrc =
                state === 'done'
                  ? iconSet.done
                  : state === 'active'
                    ? iconSet.ready
                    : iconSet.pending;
              const flowItemClassName =
                index < mainSteps.length - 1
                  ? `${styles.flowItem} ${styles.flowItemWithLine}`
                  : styles.flowItem;

              return (
                <li className={flowItemClassName} key={step.title}>
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

                    {index === 1 ? (
                      <ul className={styles.detailList}>
                        {analysisDetailSteps.map((detailStep, detailIndex) => {
                          const detailState = getAnalysisDetailState(detailIndex);
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
      </section>
    </main>
  );
}
