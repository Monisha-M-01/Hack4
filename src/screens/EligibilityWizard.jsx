import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QUESTIONS } from '../data/schemes';

export default function EligibilityWizard() {
  const { answers, setAnswers, setCurrentStep, t } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);

  const currentQ = QUESTIONS[currentIdx];
  const totalQuestions = QUESTIONS.length;
  const currentAnswer = answers[currentQ.id];

  const handleSelectOption = (optionId) => {
    setAnswers({ [currentQ.id]: optionId });
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    } else {
      setCurrentStep('onboarding');
    }
  };

  const handleNext = () => {
    if (!currentAnswer) return;

    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setCurrentStep('results');
    }
  };

  const progressPercent = ((currentIdx + 1) / totalQuestions) * 100;

  const progressText = t('stepProgress')
    .replace('{current}', currentIdx + 1)
    .replace('{total}', totalQuestions);

  const isLastQuestion = currentIdx === totalQuestions - 1;

  return (
    <div className="flex flex-col min-h-full">
      {/* M3 Linear Progress Bar Header */}
      <div className="px-4 pt-3 pb-2 bg-surface">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
          <span>{progressText}</span>
          <span className="text-primary font-bold">{Math.round(progressPercent)}%</span>
        </div>
        {/* 4px M3 Linear Progress bar */}
        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Body */}
      <div className="flex-1 px-4 py-4 flex flex-col gap-4">
        {/* Question Heading */}
        <div className="pt-1">
          <h2 className="text-lg font-bold text-slate-900 leading-relaxed">
            {t(currentQ.titleKey)}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            {t(currentQ.descKey)}
          </p>
        </div>

        {/* M3 Tonal Selection Cards */}
        <div className="flex flex-col gap-2.5">
          {currentQ.options.map((opt) => {
            const isSelected = currentAnswer === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className={`w-full min-h-14 flex items-center justify-between p-3.5 rounded-2xl border-2 text-left transition-all active:scale-[0.98] cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-primary-container/40 shadow-xs'
                    : 'border-slate-200 bg-surface-container-low hover:border-slate-300'
                }`}
              >
                <div className="flex-1 pr-3">
                  <div className="font-semibold text-sm text-slate-900 leading-relaxed">
                    {t(opt.labelKey)}
                  </div>
                  {opt.descKey && t(opt.descKey) && (
                    <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {t(opt.descKey)}
                    </div>
                  )}
                </div>

                {/* Trailing Checkmark in M3 Style */}
                <div
                  className={`w-6 h-6 min-w-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'border-primary bg-primary text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <Check size={14} className="stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sticky M3 Bottom Action Bar */}
      <div className="sticky bottom-0 bg-surface/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 flex items-center gap-3">
        {/* M3 Tonal Back Button */}
        <button
          onClick={handleBack}
          className="min-h-12 px-5 flex items-center justify-center gap-1.5 rounded-full bg-surface-container-high/80 text-slate-700 font-semibold text-sm hover:bg-surface-container-high active:scale-[0.98] transition-all cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>{t('back')}</span>
        </button>

        {/* M3 Filled Next Button */}
        <button
          onClick={handleNext}
          disabled={!currentAnswer}
          className={`flex-1 min-h-12 px-5 flex items-center justify-center gap-2 rounded-full font-semibold text-sm transition-all cursor-pointer ${
            currentAnswer
              ? 'bg-primary text-white shadow-xs hover:bg-primary-light active:scale-[0.98]'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-75'
          }`}
        >
          <span>{isLastQuestion ? t('viewSchemes') : t('next')}</span>
          {isLastQuestion ? <Sparkles size={16} /> : <ArrowRight size={16} />}
        </button>
      </div>
    </div>
  );
}
