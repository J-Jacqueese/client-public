import HeroSection from './home/HeroSection';
import EcosystemSection from './home/EcosystemSection';
import ModelsSection from './home/ModelsSection';
import AppsSection from './home/AppsSection';
import CommunitySection from './home/CommunitySection';
import CTASection from './home/CTASection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900">
      <main>
        <HeroSection />
        <EcosystemSection />
        <ModelsSection />
        <AppsSection />
        <CommunitySection />
        <CTASection />
      </main>
    </div>
  );
}

