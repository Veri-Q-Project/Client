import UrlScanForm from '@/features/scan-url/ui/UrlScanForm';

export default function HeroSection() {
  return (
    <section className="section hero" id="top">
      <div className="hero__grid">
        <div className="hero__panel panel">
          <div className="hero__content">
            <span className="eyebrow">Digital Safety Starter</span>
            <h1 className="hero__title">의심스러운 링크, 열어보기 전에 먼저 점검하세요.</h1>
            <p className="hero__description">
              초기 버전에서는 링크 입력과 기본 점검 결과를 먼저 제공합니다. 이후 신고, 교육 콘텐츠,
              실제 탐지 연동이 추가될 수 있도록 화면 구조를 가볍게 잡아둔 상태입니다.
            </p>

            <div className="hero__actions">
              <a className="button button--primary" href="#scan">
                링크 점검 시작
              </a>
              <a className="button button--secondary" href="#guide">
                확인 포인트 보기
              </a>
            </div>

            <div className="hero__stats">
              <div className="stat-card">
                <span className="stat-card__value">01</span>
                <span className="stat-card__label">의심 링크 입력</span>
              </div>
              <div className="stat-card">
                <span className="stat-card__value">02</span>
                <span className="stat-card__label">기본 위험 요소 점검</span>
              </div>
              <div className="stat-card">
                <span className="stat-card__value">03</span>
                <span className="stat-card__label">대응 가이드 확인</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hero__side">
          <UrlScanForm />

          <aside className="hero-note panel" id="guide">
            <h2 className="hero-note__title">이 화면에서 바로 보여주는 것</h2>
            <ul className="hero-note__list">
              <li>위험한 프로토콜이나 계정 정보가 포함된 URL 형식 차단</li>
              <li>사용자가 바로 확인해야 할 경고 포인트 안내</li>
              <li>다음 단계에서 신고와 교육 콘텐츠를 붙일 수 있는 기본 구조</li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
