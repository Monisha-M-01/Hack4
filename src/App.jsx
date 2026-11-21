import { WifiOff } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import TopBar from './components/TopBar';
import OnboardingScreen from './screens/OnboardingScreen';
import EligibilityWizard from './screens/EligibilityWizard';
import SchemeResults from './screens/SchemeResults';
import DocumentUpload from './screens/DocumentUpload';
import ApplicationTracker from './screens/ApplicationTracker';
import JudgeDemoPanel from './components/JudgeDemoPanel';

function ScreenRouter() {
  const { currentStep } = useApp();

  switch (currentStep) {
    case 'eligibility':
      return <EligibilityWizard />;
    case 'results':
      return <SchemeResults />;
    case 'upload':
      return <DocumentUpload />;
    case 'tracker':
      return <ApplicationTracker />;
    case 'onboarding':
    default:
      return <OnboardingScreen />;
  }
}

function MobileShell() {
  const { isOffline, t } = useApp();

  return (
    <div className="flex flex-col w-full min-h-dvh md:min-h-[844px] md:max-w-[412px] md:rounded-[28px] md:shadow-2xl md:border md:border-slate-300 bg-surface overflow-hidden relative">
      <TopBar />

      {/* Sticky Amber Offline / Slow 3G Banner */}
      {isOffline && (
        <div className="sticky top-[57px] z-40 bg-amber-500 text-white px-3.5 py-2 text-xs font-bold flex items-center justify-center gap-2 shadow-sm animate-fade-in">
          <WifiOff size={15} className="shrink-0 stroke-[2.5]" />
          <span className="text-center leading-snug">{t('offlineBanner')}</span>
        </div>
      )}

      <main className="flex-1 overflow-y-auto">
        <ScreenRouter />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      {/* Desktop Shell: Centers mobile frame and positions JudgeDemoPanel alongside on desktop */}
      <div className="min-h-dvh flex items-center justify-center p-0 md:p-6 lg:gap-8 bg-slate-200">
        <MobileShell />
        <JudgeDemoPanel />
      </div>
    </AppProvider>
  );
}
