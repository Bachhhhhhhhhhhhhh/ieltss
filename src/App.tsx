import { useState, useEffect, useTransition, useCallback, lazy, Suspense, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'sonner';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProgressProvider, useProgress } from './context/ProgressContext';
import { AssistantProvider } from './context/AssistantContext';
import { LookupProvider } from './context/LookupContext';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { FeaturesShowcase } from './components/sections/FeaturesShowcase';
import { HowItWorks } from './components/sections/HowItWorks';
import { Testimonials } from './components/sections/Testimonials';
import { CTABanner } from './components/sections/CTABanner';
import { DailyChallenge } from './components/sections/DailyChallenge';
import { TrustMarquee } from './components/sections/TrustMarquee';
import { ProductShowcase } from './components/sections/ProductShowcase';
import { ComparisonSection } from './components/sections/ComparisonSection';
import { FAQSection } from './components/sections/FAQSection';
import { ScrollProgress } from './components/ui/ScrollProgress';
import { OnboardingFlow } from './components/ui/OnboardingFlow';

const PracticeSection = lazy(() => import('./components/sections/PracticeSection').then((m) => ({ default: m.PracticeSection })));
const MockTestSimulator = lazy(() => import('./components/mocktest/MockTestSimulator').then((m) => ({ default: m.MockTestSimulator })));
const LookupSection = lazy(() => import('./components/sections/LookupSection').then((m) => ({ default: m.LookupSection })));
const DashboardSection = lazy(() => import('./components/sections/DashboardSection').then((m) => ({ default: m.DashboardSection })));
const AboutSection = lazy(() => import('./components/sections/AboutSection').then((m) => ({ default: m.AboutSection })));
const ResourcesSection = lazy(() => import('./components/sections/ResourcesSection').then((m) => ({ default: m.ResourcesSection })));
import { IELTSAssistant } from './components/assistant/IELTSAssistant';
const LookupCommandPalette = lazy(() => import('./components/lookup/LookupCommandPalette').then((m) => ({ default: m.LookupCommandPalette })));
import { KeyboardShortcuts } from './components/ui/KeyboardShortcuts';
import { PageLoader } from './components/ui/PageLoader';
import type { Page } from './types';

function LazyPage({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

function AppContent() {
  const [page, setPage] = useState<Page>('home');
  const [isPending, startTransition] = useTransition();
  const { updateStreak } = useProgress();

  useEffect(() => { updateStreak(); }, [updateStreak]);

  const navigate = useCallback((p: Page) => {
    startTransition(() => {
      setPage(p);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }, [startTransition]);

  useEffect(() => {
    const onNavigate = (e: Event) => {
      const detail = (e as CustomEvent<{ page: Page }>).detail;
      if (detail?.page) navigate(detail.page);
    };
    window.addEventListener('ielts-navigate', onNavigate);
    return () => window.removeEventListener('ielts-navigate', onNavigate);
  }, [navigate]);

  const renderPage = () => {
    switch (page) {
      case 'home':
        return (
          <>
            <Hero onStartPractice={() => navigate('practice')} onViewMock={() => navigate('mock')} />
            <TrustMarquee />
            <FeaturesShowcase />
            <ProductShowcase />
            <DailyChallenge />
            <HowItWorks />
            <ComparisonSection />
            <LazyPage><PracticeSection /></LazyPage>
            <Testimonials />
            <FAQSection />
            <CTABanner onStart={() => navigate('mock')} />
          </>
        );
      case 'practice': return <LazyPage><PracticeSection /></LazyPage>;
      case 'mock': return <LazyPage><MockTestSimulator /></LazyPage>;
      case 'lookup': return <LazyPage><LookupSection /></LazyPage>;
      case 'dashboard': return <LazyPage><DashboardSection /></LazyPage>;
      case 'about': return <LazyPage><AboutSection /></LazyPage>;
      case 'resources': return <LazyPage><ResourcesSection /></LazyPage>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0f1e] text-slate-900 dark:text-slate-100 transition-colors duration-500">
      <ScrollProgress />
      <OnboardingFlow />
      {isPending && <PageLoader />}
      <Navbar currentPage={page} onNavigate={navigate} />
      <main className="flex-1 pt-16 pb-28 lg:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer onNavigate={navigate} />
      <MobileNav currentPage={page} onNavigate={navigate} />
      <IELTSAssistant />
      <Suspense fallback={null}><LookupCommandPalette /></Suspense>
      <KeyboardShortcuts />
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ProgressProvider>
          <AssistantProvider>
            <LookupProvider>
              <AppContent />
            </LookupProvider>
          </AssistantProvider>
        </ProgressProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}