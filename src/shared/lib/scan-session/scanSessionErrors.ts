export class ScanSessionRequiredError extends Error {
  constructor() {
    super('SCAN_SESSION_REQUIRED');
    this.name = 'ScanSessionRequiredError';
  }
}
