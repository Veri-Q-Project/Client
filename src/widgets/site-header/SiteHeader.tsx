export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="site-header__brand" href="#top">
          <span className="site-header__mark">QG</span>
          <span className="site-header__text">
            <span className="site-header__eyebrow">Quishing Response</span>
            <span className="site-header__title">Quishing Guard</span>
          </span>
        </a>

        <nav aria-label="주요 섹션" className="site-header__nav">
          <a href="#top">소개</a>
          <a href="#scan">링크 점검</a>
          <a href="#guide">안내</a>
        </nav>
      </div>
    </header>
  );
}
