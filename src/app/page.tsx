import HeroSection from '@/widgets/hero-section/HeroSection';
import SiteFooter from '@/widgets/site-footer/SiteFooter';
import SiteHeader from '@/widgets/site-header/SiteHeader';

export default function HomePage() {
  return (
    <div className="app-shell">
      <SiteHeader />
      <main>
        <HeroSection />
      </main>
      <SiteFooter />
    </div>
  );
}
