import type { ResultTone } from '@/shared/types/resultTone';

import {
  threatTextCatalog,
  unknownThreatTextByTone,
  type RiskDetectionContent,
} from './threatText';

function normalizeRiskType(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s\-_/.,:%@()]/g, '');
}

const riskDetectionLookup = threatTextCatalog.reduce<Map<string, RiskDetectionContent>>(
  (accumulator, catalogItem) => {
    catalogItem.names.forEach((name) => {
      accumulator.set(normalizeRiskType(name), {
        description: catalogItem.description,
        englishLabel: catalogItem.englishLabel,
        risk: catalogItem.risk,
        title: catalogItem.title,
      });
    });

    return accumulator;
  },
  new Map(),
);

export function resolveRiskDetectionContent(
  riskType: string,
  riskLevel: ResultTone,
): RiskDetectionContent {
  const resolved = riskDetectionLookup.get(normalizeRiskType(riskType));

  if (resolved) {
    return resolved;
  }

  const riskTypeLabel = riskType.trim();
  const fallbackContent = unknownThreatTextByTone[riskLevel];

  return {
    ...fallbackContent,
    title: riskTypeLabel ? `${riskTypeLabel} 감지` : fallbackContent.title,
  };
}
