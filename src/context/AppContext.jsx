import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import translations from '../i18n/translations';

const AppContext = createContext();

const STORAGE_KEY = 'sahayatasetu_state';

const DEFAULT_STATE = {
  language: 'en',
  largeText: false,
  currentStep: 'onboarding',
  answers: {},
  selectedSchemeId: null,
  documents: {},
  application: null,
  forceBlurryError: false,
  trackerStage: 1, // 0: Submitted, 1: Verification, 2: Approval, 3: DBT Credited
  actionNeeded: false,
  isOffline: false,
};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_STATE, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Failed to load saved state:', e);
  }
  return DEFAULT_STATE;
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save state:', e);
  }
}

export function AppProvider({ children }) {
  const [state, setState] = useState(loadState);

  // Persist to localStorage on every change
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Apply large-text class to <html>
  useEffect(() => {
    const html = document.documentElement;
    if (state.largeText) {
      html.classList.add('large-text');
    } else {
      html.classList.remove('large-text');
    }
  }, [state.largeText]);

  const setLanguage = useCallback((lang) => {
    setState((prev) => ({ ...prev, language: lang }));
  }, []);

  const toggleLargeText = useCallback(() => {
    setState((prev) => ({ ...prev, largeText: !prev.largeText }));
  }, []);

  const setCurrentStep = useCallback((step) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const setAnswers = useCallback((answers) => {
    setState((prev) => ({ ...prev, answers: { ...prev.answers, ...answers } }));
  }, []);

  const setSelectedSchemeId = useCallback((id) => {
    setState((prev) => ({ ...prev, selectedSchemeId: id }));
  }, []);

  const setDocuments = useCallback((docs) => {
    setState((prev) => ({
      ...prev,
      documents: typeof docs === 'function' ? docs(prev.documents) : { ...prev.documents, ...docs },
    }));
  }, []);

  const setApplication = useCallback((app) => {
    setState((prev) => ({ ...prev, application: app }));
  }, []);

  const setForceBlurryError = useCallback((flag) => {
    setState((prev) => ({
      ...prev,
      forceBlurryError: typeof flag === 'function' ? flag(prev.forceBlurryError) : flag,
    }));
  }, []);

  const setTrackerStage = useCallback((stage) => {
    setState((prev) => ({ ...prev, trackerStage: stage }));
  }, []);

  const setActionNeeded = useCallback((val) => {
    setState((prev) => ({
      ...prev,
      actionNeeded: typeof val === 'function' ? val(prev.actionNeeded) : val,
    }));
  }, []);

  const setIsOffline = useCallback((val) => {
    setState((prev) => ({
      ...prev,
      isOffline: typeof val === 'function' ? val(prev.isOffline) : val,
    }));
  }, []);

  // Demo Control 3: Trigger Action Needed (loads sample application if needed)
  const triggerActionNeeded = useCallback(() => {
    setState((prev) => {
      const app = prev.application || {
        trackingId: 'SS-2026-84921',
        schemeId: 'pm_kisan',
        schemeNameKey: 'pmKisanTitle',
        schemeBenefitKey: 'pmKisanBenefit',
        schemeIcon: '🌾',
        submittedAt: new Date().toISOString(),
        status: 'submitted',
        answers: { ageGroup: '36_59', income: 'under_1l', occupation: 'farmer', rationCard: 'bpl' },
        documents: {},
      };
      return {
        ...prev,
        application: app,
        currentStep: 'tracker',
        trackerStage: 1,
        actionNeeded: true,
      };
    });
  }, []);

  // Demo Control 4: Advance Application Stage
  const advanceTrackerStage = useCallback(() => {
    setState((prev) => {
      const app = prev.application || {
        trackingId: 'SS-2026-84921',
        schemeId: 'pm_kisan',
        schemeNameKey: 'pmKisanTitle',
        schemeBenefitKey: 'pmKisanBenefit',
        schemeIcon: '🌾',
        submittedAt: new Date().toISOString(),
        status: 'submitted',
        answers: {},
        documents: {},
      };
      const currentStage = prev.trackerStage ?? 0;
      const nextStage = currentStage >= 3 ? 0 : currentStage + 1;
      return {
        ...prev,
        application: app,
        currentStep: 'tracker',
        trackerStage: nextStage,
        actionNeeded: nextStage === 1 ? prev.actionNeeded : false,
      };
    });
  }, []);

  // Demo Control 5: Reset Entire Demo
  const resetDemo = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear storage:', e);
    }
    setState({ ...DEFAULT_STATE });
  }, []);

  // Translation helper
  const t = useCallback(
    (key) => {
      const lang = state.language || 'en';
      return translations[lang]?.[key] || translations.en?.[key] || key;
    },
    [state.language]
  );

  const hasSavedApplication = Boolean(state.application);

  const value = {
    ...state,
    setLanguage,
    toggleLargeText,
    setCurrentStep,
    setAnswers,
    setSelectedSchemeId,
    setDocuments,
    setApplication,
    setForceBlurryError,
    setTrackerStage,
    setActionNeeded,
    setIsOffline,
    triggerActionNeeded,
    advanceTrackerStage,
    resetDemo,
    t,
    hasSavedApplication,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
}
