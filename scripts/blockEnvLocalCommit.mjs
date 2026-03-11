import { execSync } from 'node:child_process';

const forbiddenFiles = new Set(['.env', '.env.local', '.env.server', '.env.server.local']);

function getStagedFiles() {
  const output = execSync('git diff --cached --name-only --diff-filter=ACMR', {
    encoding: 'utf8',
  });

  return output
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

const stagedFiles = getStagedFiles();
const blockedFiles = stagedFiles.filter((file) => forbiddenFiles.has(file));

if (blockedFiles.length === 0) {
  process.exit(0);
}

console.error('[block-env] 커밋이 차단되었습니다. 아래 파일은 커밋할 수 없습니다:');
for (const file of blockedFiles) {
  console.error(`- ${file}`);
}
console.error('[block-env] 예시 파일(.env.example, .env.server.example)만 커밋해 주세요.');

process.exit(1);
