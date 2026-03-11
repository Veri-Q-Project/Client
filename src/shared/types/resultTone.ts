export const resultTones = ['safe', 'warning', 'critical'] as const;

export type ResultTone = (typeof resultTones)[number];
