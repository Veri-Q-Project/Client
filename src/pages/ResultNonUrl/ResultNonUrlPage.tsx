import { useState } from 'react';

import { ResultActionButtons } from '@/shared/component';
import { qrIconByTone } from '@/shared/icon/resultIcons';
import { openExternalLink } from '@/shared/lib/browser/openExternalLink';
import AppHeader from '@/shared/ui/app-header';
import ResultHero from '@/shared/ui/resultHero';
import { resultPageStyles } from '@/shared/ui/resultPage';

import { resolveNonUrlSectionCopy } from './constants/nonUrlActionText';
import { useResultNonUrlPage } from './hooks/useResultNonUrlPage';
import { resolveNonUrlActionExecution } from './lib/resolveNonUrlActionExecution';
import * as styles from './styles/resultNonUrlPage.css';
import DetectedNonUrlActionSection from './ui/DetectedNonUrlActionSection';

import type { NonUrlActionType } from './types/resultNonUrlPage.types';

const nonUrlActionLabelByType: Record<NonUrlActionType, string> = {
  APP_STORE: '앱 마켓',
  CONTACT: '연락처',
  CRYPTO: '가상자산',
  DEEP_LINK: '딥링크',
  EMAIL: '이메일',
  OTHER: '기타',
  OTP: 'OTP',
  SHORT_URL: '단축 URL',
  SMS: '문자',
  TEL: '전화',
  WEB: '웹',
  WIFI: 'Wi-Fi',
};

export default function ResultNonUrlPage() {
  const { handleRescan, handleShareResult, resultNonUrlPageData } = useResultNonUrlPage();
  const [executionFeedbackMessage, setExecutionFeedbackMessage] = useState<string | null>(null);

  if (!resultNonUrlPageData) {
    return null;
  }

  const displayedActionType = resultNonUrlPageData.detectedActionType;
  const displayedActionLabel = nonUrlActionLabelByType[displayedActionType];
  const displayedSectionCopy = resolveNonUrlSectionCopy(displayedActionType);
  const displayedTargetValue = resultNonUrlPageData.targetValue;
  const isExecutable = displayedTargetValue !== undefined && displayedTargetValue !== null;

  const handleExecuteAction = () => {
    if (!isExecutable) {
      return;
    }

    const executionPlan = resolveNonUrlActionExecution(displayedActionType, displayedTargetValue);
    setExecutionFeedbackMessage(executionPlan.message);

    if (executionPlan.kind === 'open') {
      openExternalLink(executionPlan.url);
      return;
    }

    if (executionPlan.kind === 'navigate') {
      window.location.href = executionPlan.href;
    }
  };

  return (
    <main className={resultPageStyles.page}>
      <AppHeader iconSrc={qrIconByTone.warning} />

      <div className={resultPageStyles.shell}>
        <section className={resultPageStyles.content}>
          <ResultHero
            description={`${displayedActionLabel} 유형으로 분류된 QR 코드입니다. 실행 전 연결 대상과 의도를 먼저 확인하세요.`}
            title={
              <>
                주의하세요
                <br />이 QR 코드는 {displayedActionLabel} 동작을 유도할 수 있어요.
              </>
            }
            tone="warning"
          />

          <section className={styles.futureContent}>
            <DetectedNonUrlActionSection
              actionType={displayedActionType}
              sectionDescription={displayedSectionCopy.sectionDescription}
              sectionNumber={resultNonUrlPageData.sectionNumber}
              sectionTitle={displayedSectionCopy.sectionTitle}
              targetValue={displayedTargetValue}
            />

            <button
              className={styles.executionButton}
              disabled={!isExecutable}
              onClick={handleExecuteAction}
              type="button"
            >
              주의하고 실행하기
            </button>

            {executionFeedbackMessage ? (
              <p aria-live="polite" className={styles.executionFeedback} role="status">
                {executionFeedbackMessage}
              </p>
            ) : null}

            <ResultActionButtons
              onRescanClick={handleRescan}
              onShareClick={() => {
                void handleShareResult();
              }}
            />
          </section>
        </section>
      </div>
    </main>
  );
}
