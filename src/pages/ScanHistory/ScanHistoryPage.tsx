import { useScanHistoryPage } from './hooks/useScanHistoryPage';

const resultRouteByStatus = {
  safe: '/result/safe',
  warning: '/result/warning',
  critical: '/result/critical',
} as const;

export default function ScanHistoryPage() {
  const { handleSelectScanHistoryItem, scanHistoryPageData } = useScanHistoryPage();

  return (
    <main>
      <h1>스캔 이력 목록</h1>
      <p>최근 스캔 내역과 상태를 확인합니다.</p>

      {scanHistoryPageData.items.length === 0 ? (
        <p>연결된 UUID에 대한 스캔 이력이 없습니다.</p>
      ) : (
        <ul>
          {scanHistoryPageData.items.map((item) => (
            <li key={item.id}>
              <a
                href={`${resultRouteByStatus[item.status]}?url=${encodeURIComponent(item.url)}`}
                onClick={() => {
                  handleSelectScanHistoryItem(item);
                }}
              >
                <strong>{item.title}</strong>
                <p>{item.url}</p>
                <p>분석 시각: {item.scannedAt}</p>
                <p>상태: {item.status}</p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
