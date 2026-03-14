import { useReportPage } from './hooks/useReportPage';

export default function ReportPage() {
  const { reportPageData } = useReportPage();

  return (
    <main>
      <h1>{reportPageData.reportTitle}</h1>
      <p>분석 대상: {reportPageData.scannedUrl}</p>
      <p>분석 시각: {reportPageData.scannedAt}</p>
      <p>위험 수준: {reportPageData.riskLevel}</p>

      {reportPageData.sections.map((section) => (
        <section key={section.id}>
          <h2>{section.title}</h2>
          <p>{section.summary}</p>
          <ul>
            {section.items.map((item, index) => (
              <li key={`${section.id}-${item}-${index}`}>{item}</li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
