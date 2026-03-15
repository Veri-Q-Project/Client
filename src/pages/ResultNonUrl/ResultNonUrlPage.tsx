import { useMemo, useState } from 'react';

import { ResultActionButtons } from '@/shared/component';
import { qrIconByTone } from '@/shared/icon/resultIcons';
import { openExternalLink } from '@/shared/lib/browser/openExternalLink';
import AppHeader from '@/shared/ui/app-header';
import ResultHero from '@/shared/ui/resultHero';

import { nonUrlActionPreviewItems } from './constants/nonUrlActionCatalog';
import { useResultNonUrlPage } from './hooks/useResultNonUrlPage';
import { resolveNonUrlActionExecution } from './lib/resolveNonUrlActionExecution';
import * as styles from './styles/resultNonUrlPage.css';
import DetectedNonUrlActionSection from './ui/DetectedNonUrlActionSection';
import * as warningStyles from '../ResultWarning/styles/resultWarningPage.css';

import type { NonUrlActionType } from './types/resultNonUrlPage.types';

export default function ResultNonUrlPage() {
  const { handleRescan, handleShareResult, resultNonUrlPageData } = useResultNonUrlPage();
  const [selectedPreviewActionType, setSelectedPreviewActionType] =
    useState<NonUrlActionType | null>(null);
  const [executionFeedbackMessage, setExecutionFeedbackMessage] = useState<string | null>(null);

  const selectedPreviewItem = useMemo(
    () =>
      selectedPreviewActionType
        ? (nonUrlActionPreviewItems.find((item) => item.actionType === selectedPreviewActionType) ??
          null)
        : null,
    [selectedPreviewActionType],
  );

  const displayedActionType =
    selectedPreviewItem?.actionType ?? resultNonUrlPageData.detectedActionType;
  const displayedTargetValue =
    selectedPreviewItem?.sampleTargetValue ?? resultNonUrlPageData.targetValue;

  const handleExecuteAction = () => {
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
    <main className={warningStyles.page}>
      <AppHeader iconSrc={qrIconByTone.warning} />

      <div className={warningStyles.shell}>
        <section className={warningStyles.content}>
          <ResultHero
            description="Veri-Q 분석 결과, 해당 QR 코드는 비 URL로 분류되었습니다."
            title={
              <>
                주의하세요!
                <br />
                URL이 아닌 어떠한 것이 실행되는 것이에요!
              </>
            }
            tone="warning"
          />

          <section className={styles.futureContent}>
            <DetectedNonUrlActionSection
              actionType={displayedActionType}
              sectionDescription={resultNonUrlPageData.sectionDescription}
              sectionNumber={resultNonUrlPageData.sectionNumber}
              sectionTitle={resultNonUrlPageData.sectionTitle}
              targetValue={displayedTargetValue}
            />

            <button className={styles.executionButton} onClick={handleExecuteAction} type="button">
              주의하여 실행하기
            </button>

            {executionFeedbackMessage ? (
              <p className={styles.executionFeedback}>{executionFeedbackMessage}</p>
            ) : null}

            <ResultActionButtons
              onRescanClick={handleRescan}
              onShareClick={() => {
                void handleShareResult();
              }}
            />

            <section className={styles.previewSection}>
              <h2 className={styles.previewTitle}>모든 비 URL 경우의 수 보기</h2>

              <div className={styles.previewButtonList}>
                {nonUrlActionPreviewItems.map((previewItem) => (
                  <button
                    className={`${styles.previewButton} ${
                      displayedActionType === previewItem.actionType
                        ? styles.previewButtonActive
                        : ''
                    }`}
                    key={previewItem.actionType}
                    onClick={() => {
                      setSelectedPreviewActionType(previewItem.actionType);
                      setExecutionFeedbackMessage(null);
                    }}
                    type="button"
                  >
                    {previewItem.label}
                  </button>
                ))}
              </div>
            </section>
          </section>
        </section>
      </div>
    </main>
  );
}
