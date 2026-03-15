import ResultHero from '@/shared/ui/resultHero';

export default function ResultCriticalHero() {
  return (
    <ResultHero
      description="Veri-Q 분석 결과, 해당 QR 코드는 악성 위험 사이트로 분류되었습니다."
      title="위험! 악성 코드가 감지되어 접속을 권장하지 않는 사이트입니다."
      tone="critical"
    />
  );
}
