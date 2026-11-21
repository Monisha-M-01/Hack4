import { useState, useCallback } from 'react';
import { Volume2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const LANGUAGES = [
  { code: 'hi', label: 'हिन्दी' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'en', label: 'EN' },
];

const VOICE_LANG_MAP = {
  en: 'en-IN',
  hi: 'hi-IN',
  kn: 'kn-IN',
};

export default function TopBar() {
  const { language, setLanguage, largeText, toggleLargeText, t, currentStep } = useApp();
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const handleReadAloud = useCallback(() => {
    if (!window.speechSynthesis) {
      showToast(t('voiceNotAvailable'));
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Build text from current screen's title + instruction
    const titleKey = `${currentStep}Title`;
    const instrKey = `${currentStep}Instruction`;
    const text = `${t(titleKey)}. ${t(instrKey)}`;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = VOICE_LANG_MAP[language] || 'en-IN';
    utterance.rate = 0.9;

    // Try to find a matching voice
    const voices = window.speechSynthesis.getVoices();
    const targetLang = VOICE_LANG_MAP[language] || 'en-IN';
    const matchedVoice =
      voices.find((v) => v.lang === targetLang) ||
      voices.find((v) => v.lang && v.lang.startsWith(targetLang.split('-')[0]));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onerror = () => {
      showToast(t('voiceNotAvailable'));
    };

    window.speechSynthesis.speak(utterance);
  }, [language, currentStep, t, showToast]);

  return (
    <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-slate-200/80 px-3.5 py-2.5">
      <div className="flex items-center justify-between gap-2">
        {/* M3 Segmented Button for Language */}
        <nav
          className="inline-flex items-center rounded-full border border-slate-300 p-0.5 bg-surface-container-low shadow-xs"
          role="group"
          aria-label="Language selection"
        >
          {LANGUAGES.map((lang, idx) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`min-h-8 px-3 py-1 rounded-full text-xs font-semibold transition-all active:scale-[0.98] ${
                  isSelected
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-600 hover:text-primary hover:bg-slate-200/50'
                }`}
                aria-pressed={isSelected}
                aria-label={`${t('switchToLang')} ${lang.label}`}
              >
                {lang.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          {/* M3 Text Size Toggle Button */}
          <button
            onClick={toggleLargeText}
            className={`w-10 h-10 min-w-10 min-h-10 flex items-center justify-center rounded-full border transition-all active:scale-[0.98] font-bold text-sm ${
              largeText
                ? 'bg-primary text-white border-primary shadow-xs'
                : 'bg-surface-container-low text-primary border-slate-300 hover:border-primary'
            }`}
            aria-label={largeText ? t('normalTextSize') : t('largeTextSize')}
          >
            {largeText ? t('textSizeLarge') : t('textSizeNormal')}
          </button>

          {/* M3 Audio Read Aloud Button */}
          <button
            onClick={handleReadAloud}
            className="w-10 h-10 min-w-10 min-h-10 flex items-center justify-center rounded-full border border-slate-300 bg-surface-container-low text-primary hover:border-primary active:scale-[0.98] transition-all shadow-xs"
            aria-label={t('readAloud')}
          >
            <Volume2 size={18} />
          </button>
        </div>
      </div>

      {/* M3 Snackbar Toast */}
      {toast && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded-full shadow-lg z-50 whitespace-nowrap animate-fade-in">
          {toast}
        </div>
      )}
    </header>
  );
}
