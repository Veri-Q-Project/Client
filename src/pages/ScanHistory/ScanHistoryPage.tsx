import { useScanHistoryPage } from './hooks/useScanHistoryPage';

export default function ScanHistoryPage() {
  const { scanHistoryPageData } = useScanHistoryPage();

  return (
    <main>
      <h1>스캔 이력 목록</h1>
      <p>최근 스캔 내역과 상태를 기준으로 백엔드 연동 전 mock 데이터를 보여줍니다.</p>

      <ul>
        {scanHistoryPageData.items.map((item) => (
          <li key={item.id}>
            <strong>{item.title}</strong>
            <p>{item.url}</p>
            <p>분석 시각: {item.scannedAt}</p>
            <p>상태: {item.status}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
