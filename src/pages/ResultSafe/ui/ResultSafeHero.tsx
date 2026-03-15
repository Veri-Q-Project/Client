import ResultHero from '@/shared/ui/resultHero';

export default function ResultSafeHero() {
  return (
    <ResultHero
      description="Veri-Q 분석 결과, 해당 QR 코드는 검증된 안전한 웹사이트로 연결됩니다."
      title={
        <>
          안심하세요!
          <br />
          안전한 사이트입니다
        </>
      }
      tone="safe"
    />
  );
}
