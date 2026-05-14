import { pickSourceString } from '@/shared/api/responseAccess/payloadAccess';

const scannedUrlKeys = [
  'originalUrl',
  'original_url',
  'sourceUrl',
  'source_url',
  'scannedUrl',
  'scanned_url',
  'decodedUrl',
  'decoded_url',
  'url',
  'typeInfo',
  'type_info',
  'targetValue',
  'target_value',
];

const originalUrlKeys = ['originalUrl', 'original_url', 'sourceUrl', 'source_url'];

const destinationUrlKeys = [
  'finalUrl',
  'final_url',
  'destinationUrl',
  'destination_url',
  'visitUrl',
  'visit_url',
];

const previewUrlKeys = ['previewUrl', 'preview_url'];

const scannedAtKeys = [
  'analysisTime',
  'analysis_time',
  'scannedAt',
  'scanned_at',
  'createdAt',
  'created_at',
];

export type ResolveScanUrlsOptions = {
  decodedUrl?: string | null;
  historyScannedAt?: string | null;
  historyUrl?: string | null;
  sources: unknown[];
};

export type ResolvedScanUrls = {
  destinationUrl: string;
  originalUrl: string;
  previewUrl: string;
  scannedAt: string | null;
  scannedUrl: string;
};

export function resolveScanUrls({
  decodedUrl,
  historyScannedAt,
  historyUrl,
  sources,
}: ResolveScanUrlsOptions): ResolvedScanUrls {
  const scannedUrl =
    pickSourceString(sources, scannedUrlKeys) ??
    decodedUrl ??
    historyUrl ??
    pickSourceString(sources, destinationUrlKeys) ??
    '';
  const originalUrl = pickSourceString(sources, originalUrlKeys) ?? scannedUrl;
  const destinationUrl = pickSourceString(sources, destinationUrlKeys) ?? scannedUrl;
  const previewUrl = pickSourceString(sources, previewUrlKeys) ?? destinationUrl;
  const scannedAt = pickSourceString(sources, scannedAtKeys) ?? historyScannedAt ?? null;

  return {
    destinationUrl,
    originalUrl,
    previewUrl,
    scannedAt,
    scannedUrl,
  };
}
