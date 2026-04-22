export const mappedLoadingStepOrder = [
  'decode',
  'shortUrlCheck',
  'urlNormalize',
  'redirect',
  'internalDb',
  'externalApi',
  'ruleAnalysis',
  'aiAnalysis',
  'riskScore',
  'report',
  'completed',
] as const;

export type MappedLoadingStepId = (typeof mappedLoadingStepOrder)[number];

const mappedLoadingStepMap: Record<string, MappedLoadingStepId> = {
  ai: 'aiAnalysis',
  aianalysis: 'aiAnalysis',
  analysis: 'aiAnalysis',
  analysisdone: 'report',
  analysisreport: 'report',
  apicheck: 'externalApi',
  buildreport: 'report',
  certificate: 'report',
  completed: 'completed',
  complete: 'completed',
  database: 'internalDb',
  databasecheck: 'internalDb',
  db: 'internalDb',
  dbcheck: 'internalDb',
  decode: 'decode',
  decoding: 'decode',
  dns: 'report',
  done: 'completed',
  external: 'externalApi',
  externalapi: 'externalApi',
  externalcheck: 'externalApi',
  externalverification: 'externalApi',
  finish: 'completed',
  finished: 'completed',
  final: 'completed',
  finalize: 'completed',
  finalresult: 'completed',
  https: 'report',
  httpscheck: 'report',
  internal: 'internalDb',
  internaldb: 'internalDb',
  linkexpand: 'redirect',
  ml: 'aiAnalysis',
  mlanalysis: 'aiAnalysis',
  modelinference: 'aiAnalysis',
  normalize: 'urlNormalize',
  normalizeurl: 'urlNormalize',
  parameteranalysis: 'ruleAnalysis',
  parameterrule: 'ruleAnalysis',
  pipelineinit: 'decode',
  qrcode: 'decode',
  qrdecode: 'decode',
  qrparse: 'decode',
  reputation: 'externalApi',
  reputationcheck: 'externalApi',
  redirect: 'redirect',
  redirectanalysis: 'redirect',
  redirectcheck: 'redirect',
  redirecttrace: 'redirect',
  report: 'report',
  reportgeneration: 'report',
  reportgenerate: 'report',
  rule: 'ruleAnalysis',
  ruleanalysis: 'ruleAnalysis',
  rulebased: 'ruleAnalysis',
  rulebasedanalysis: 'ruleAnalysis',
  result: 'completed',
  riskanalysis: 'riskScore',
  riskcalculation: 'riskScore',
  riskscore: 'riskScore',
  score: 'riskScore',
  scorecalculation: 'riskScore',
  scoring: 'riskScore',
  server: 'report',
  serverinfo: 'report',
  safebrowsing: 'externalApi',
  shortlinkcheck: 'shortUrlCheck',
  shorturlanalysis: 'shortUrlCheck',
  ssl: 'report',
  test: 'decode',
  threatintel: 'externalApi',
  shorturl: 'shortUrlCheck',
  shorturlcheck: 'shortUrlCheck',
  status: 'completed',
  urldecode: 'decode',
  urlnormalize: 'urlNormalize',
  urlnormalization: 'urlNormalize',
  urlscan: 'decode',
  whois: 'report',
};

function normalizeStepKey(rawStepId: string): string {
  return rawStepId
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

export function mapSseStepId(rawStepId: string | null | undefined): MappedLoadingStepId | null {
  if (!rawStepId) {
    return null;
  }

  return mappedLoadingStepMap[normalizeStepKey(rawStepId)] ?? null;
}

export function mapSseStepIds(rawStepIds: unknown): MappedLoadingStepId[] {
  if (!Array.isArray(rawStepIds)) {
    return [];
  }

  return rawStepIds
    .map((rawStepId) => {
      return typeof rawStepId === 'string' ? mapSseStepId(rawStepId) : null;
    })
    .filter((stepId): stepId is MappedLoadingStepId => stepId !== null);
}
