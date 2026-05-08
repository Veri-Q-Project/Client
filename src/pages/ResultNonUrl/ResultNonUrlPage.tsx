import { useMemo, useState } from 'react';

import { ResultActionButtons } from '@/shared/component';
import { qrIconByTone } from '@/shared/icon/resultIcons';
import { openExternalLink } from '@/shared/lib/browser/openExternalLink';
import AppHeader from '@/shared/ui/app-header';
import ResultHero from '@/shared/ui/resultHero';
import { resultPageStyles } from '@/shared/ui/resultPage';

import { nonUrlActionPreviewItems, resolveNonUrlSectionCopy } from './constants/nonUrlActionText';
import { useResultNonUrlPage } from './hooks/useResultNonUrlPage';
import { resolveNonUrlActionExecution } from './lib/resolveNonUrlActionExecution';
import * as styles from './styles/resultNonUrlPage.css';
import DetectedNonUrlActionSection from './ui/DetectedNonUrlActionSection';

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

  if (!resultNonUrlPageData) {
    return null;
  }

  const displayedActionType =
    selectedPreviewItem?.actionType ?? resultNonUrlPageData.detectedActionType;
  const displayedActionLabel =
    selectedPreviewItem?.label ??
    nonUrlActionPreviewItems.find((item) => item.actionType === displayedActionType)?.label ??
    displayedActionType;
  const displayedSectionCopy = resolveNonUrlSectionCopy(displayedActionType);
  const displayedTargetValue =
    displayedActionType === resultNonUrlPageData.detectedActionType
      ? resultNonUrlPageData.targetValue
      : undefined;
  const isExecutable =
    displayedActionType === resultNonUrlPageData.detectedActionType &&
    displayedTargetValue !== undefined &&
    displayedTargetValue !== null;

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

            <section className={styles.previewSection}>
              <h2 className={styles.previewTitle}>전체 URL 스키마 타입 보기</h2>

              <div className={styles.previewButtonList}>
                {nonUrlActionPreviewItems.map((previewItem) => (
                  <button
                    aria-pressed={displayedActionType === previewItem.actionType}
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
