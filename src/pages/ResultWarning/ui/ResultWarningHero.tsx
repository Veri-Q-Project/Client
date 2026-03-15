import ResultHero from '@/shared/ui/resultHero';

export default function ResultWarningHero() {
  return (
    <ResultHero
      description="Veri-Q 분석 결과, 해당 QR 코드는 주의가 필요한 웹사이트로 분류되었습니다."
      title={
        <>
          주의하세요!
          <br />
          주의가 필요한 사이트입니다
        </>
      }
      tone="warning"
    />
  );
}
