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
    .replace(/[\s\-_/.,:%@()\[\]'"]/g, '');
}

export function resolveRiskTypeLookupKeys(value: string): string[] {
  const trimmedValue = value.trim();
  const candidates = [trimmedValue];
  const colonSeparatedParts = trimmedValue
    .split(':')
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  if (colonSeparatedParts.length > 1) {
    for (let partIndex = 1; partIndex < colonSeparatedParts.length; partIndex += 1) {
      candidates.push(colonSeparatedParts.slice(partIndex).join(':'));
    }
  }

  return Array.from(new Set(candidates.map((candidate) => normalizeRiskType(candidate))));
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
  const resolved = resolveRiskTypeLookupKeys(riskType)
    .map((lookupKey) => riskDetectionLookup.get(lookupKey))
    .find((content): content is RiskDetectionContent => content !== undefined);

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
