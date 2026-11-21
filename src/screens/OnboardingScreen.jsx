import { ClipboardCheck, FileUp, Radio, ChevronRight, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

const LANG_CARDS = [
  { code: 'hi', label: 'हिन्दी', subKey: 'langHindiSub' },
  { code: 'kn', label: 'ಕನ್ನಡ', subKey: 'langKannadaSub' },
  { code: 'en', label: 'English', subKey: 'langEnglishSub' },
];

const STEPS = [
  { icon: ClipboardCheck, titleKey: 'step1Title', descKey: 'step1Desc', color: 'text-secondary' },
  { icon: FileUp, titleKey: 'step2Title', descKey: 'step2Desc', color: 'text-primary' },
  { icon: Radio, titleKey: 'step3Title', descKey: 'step3Desc', color: 'text-verified' },
];

export default function OnboardingScreen() {
  const { language, setLanguage, setCurrentStep, t, hasSavedApplication } = useApp();

  return (
    <div className="flex flex-col px-4 py-5 gap-5 min-h-full">
      {/* Welcome Header */}
      <div className="text-center pt-2">
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-primary-container text-primary-container-text flex items-center justify-center shadow-xs">
          <span className="text-3xl">🏛️</span>
        </div>
        <h1 className="text-xl font-bold text-primary leading-relaxed">
          {t('welcome')}
        </h1>
        <p className="text-sm text-slate-600 mt-1 leading-relaxed">
          {t('welcomeSub')}
        </p>
      </div>

      {/* Language Selection: M3 Tonal Selection Cards */}
      <section>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 px-1">
          {t('selectLanguage')}
        </p>
        <div className="flex flex-col gap-2.5">
          {LANG_CARDS.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`min-h-12 w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 transition-all active:scale-[0.98] ${
                  isSelected
                    ? 'border-primary bg-primary-container/40 shadow-xs'
                    : 'border-slate-200 bg-surface-container-low hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-primary bg-primary text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check size={14} className="stroke-[3]" />}
                  </div>
                  <span className="text-base font-semibold text-slate-900">
                    {lang.label}
                  </span>
                </div>
                {t(lang.subKey) && (
                  <span className="text-xs font-medium text-slate-500 bg-white/70 px-2 py-0.5 rounded-full border border-slate-200/60">
                    {t(lang.subKey)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3-Step Summary: M3 Tonal Card */}
      <section className="bg-surface-container-low rounded-2xl border border-slate-200/80 p-4">
        <div className="flex flex-col gap-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-xl bg-white shadow-xs flex items-center justify-center ${step.color}`}>
                    <Icon size={18} />
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="w-0.5 h-5 bg-slate-300 mt-1" />
                  )}
                </div>
                <div className="pt-0.5">
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                    {t(step.titleKey)}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {t(step.descKey)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Resume Card (conditional): M3 Secondary Tonal Container */}
      {hasSavedApplication && (
        <button
          onClick={() => setCurrentStep('tracker')}
          className="w-full flex items-center justify-between gap-3 px-4 py-3.5 bg-secondary-container/40 border-2 border-secondary/30 rounded-2xl transition-all hover:border-secondary active:scale-[0.98]"
        >
          <div className="text-left">
            <p className="text-sm font-bold text-secondary-container-text leading-relaxed">
              {t('resumeApp')}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('resumeHint')}
            </p>
          </div>
          <ChevronRight size={18} className="text-secondary shrink-0" />
        </button>
      )}

      {/* Spacer */}
      <div className="flex-1 min-h-4" />

      {/* Primary CTA: M3 Filled Button */}
      <button
        onClick={() => setCurrentStep('eligibility')}
        className="w-full min-h-12 flex items-center justify-center gap-2 bg-primary text-white font-semibold text-base rounded-full shadow-sm hover:bg-primary-light active:scale-[0.98] transition-all cursor-pointer"
      >
        <span>{t('startCheck')}</span>
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
