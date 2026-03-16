import Navbar            from '@/components/Navbar';
import HeroSection        from '@/components/HeroSection';
import ClassifierSection  from '@/components/ClassifierSection';
import CategoriesSection  from '@/components/CategoriesSection';
import HowItWorksSection  from '@/components/HowItWorksSection';
import StatsSection       from '@/components/StatsSection';
import Footer             from '@/components/Footer';

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <ClassifierSection />
      <CategoriesSection />
      <HowItWorksSection />
      <StatsSection />
      <Footer />
    </main>
  );
}
