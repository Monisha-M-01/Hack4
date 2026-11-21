import { useState, useMemo } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  RotateCcw,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { evaluateEligibility } from '../data/schemes';

export default function SchemeResults() {
  const { answers, setCurrentStep, setSelectedSchemeId, t } = useApp();
  const [showIneligible, setShowIneligible] = useState(false);

  // Evaluate user answers
  const evaluation = useMemo(() => {
    return evaluateEligibility(answers);
  }, [answers]);

  const eligibleSchemes = evaluation.filter((item) => item.eligible);
  const ineligibleSchemes = evaluation.filter((item) => !item.eligible);

  const handleApply = (schemeId) => {
    setSelectedSchemeId(schemeId);
    setCurrentStep('upload');
  };

  const handleEditAnswers = () => {
    setCurrentStep('eligibility');
  };

  // 0-MATCH ERROR STATE
  if (eligibleSchemes.length === 0) {
    return (
      <div className="flex flex-col min-h-full px-4 py-5 gap-5">
        {/* Error / Warning Card */}
        <div className="bg-error-container/40 border-2 border-error/30 rounded-2xl p-5 text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-error-container flex items-center justify-center text-error mb-3">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-lg font-bold text-error-container-text leading-relaxed">
            {t('zeroMatchTitle')}
          </h2>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            {t('zeroMatchDesc')}
          </p>

          <button
            onClick={handleEditAnswers}
            className="mt-5 w-full min-h-12 rounded-full bg-primary text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs hover:bg-primary-light active:scale-[0.98] transition-all cursor-pointer"
          >
            <RotateCcw size={16} />
            <span>{t('editMyAnswers')}</span>
          </button>
        </div>

        {/* Collapsible View of Why Other Schemes Were Not Matched */}
        {ineligibleSchemes.length > 0 && (
          <div className="bg-surface-container-low rounded-2xl border border-slate-200/80 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              {t('otherSchemesToggle').replace('{count}', ineligibleSchemes.length)}
            </h3>
            <div className="flex flex-col gap-3">
              {ineligibleSchemes.map(({ scheme, reasonKey }) => (
                <div
                  key={scheme.id}
                  className="bg-white rounded-xl border border-slate-200 p-3.5 flex flex-col gap-1.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{scheme.icon}</span>
                    <span className="font-semibold text-sm text-slate-800">
                      {t(scheme.nameKey)}
                    </span>
                  </div>
                  <div className="bg-amber-50 text-amber-800 border border-amber-200/70 rounded-lg p-2 text-xs leading-relaxed">
                    <span className="font-bold">{t('unmetReasonLabel')} </span>
                    {t(reasonKey)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full px-4 py-4 gap-4">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-verified-container/70 text-verified-container-text font-bold text-xs mb-2">
          <CheckCircle2 size={14} className="text-verified" />
          <span>{t('resultsHeaderBadge')}</span>
        </div>
        <h1 className="text-lg font-bold text-slate-900 leading-relaxed">
          {t('resultsTitle')}
        </h1>
        <p className="text-xs text-slate-600 leading-relaxed">
          {t('resultsSubtitle').replace('{count}', eligibleSchemes.length)}
        </p>
      </div>

      {/* Eligible Schemes List: M3 Elevated / Tonal Cards */}
      <div className="flex flex-col gap-3.5">
        {eligibleSchemes.map(({ scheme, reasonKey }) => (
          <div
            key={scheme.id}
            className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col gap-3 transition-all"
          >
            {/* Card Top: Icon + Title + Benefit Pill */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <span className="text-2xl p-1 bg-surface-container-low rounded-xl">
                  {scheme.icon}
                </span>
                <div>
                  <h2 className="font-bold text-sm text-slate-900 leading-snug">
                    {t(scheme.nameKey)}
                  </h2>
                  <span className="text-[11px] font-medium text-slate-500">
                    {t(scheme.categoryKey)}
                  </span>
                </div>
              </div>
            </div>

            {/* M3 Secondary Container Benefit Pill */}
            <div className="inline-flex self-start items-center px-3 py-1 rounded-full bg-secondary-container text-secondary-container-text font-bold text-xs tracking-wide">
              {t(scheme.benefitKey)}
            </div>

            {/* Scheme Description */}
            <p className="text-xs text-slate-600 leading-relaxed">
              {t(scheme.descKey)}
            </p>

            {/* Plain-Language Eligibility Reason */}
            <div className="bg-verified-container/40 text-verified-container-text border border-verified/30 rounded-xl p-2.5 text-xs flex items-start gap-2 leading-relaxed">
              <CheckCircle2 size={15} className="text-verified shrink-0 mt-0.5" />
              <span>{t(reasonKey)}</span>
            </div>

            {/* Required Documents Preview */}
            <div className="pt-1 border-t border-slate-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                <FileText size={12} />
                <span>{t('requiredDocsLabel')}</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {scheme.docs.map((docKey) => (
                  <span
                    key={docKey}
                    className="text-[11px] font-medium text-slate-700 bg-surface-container-low border border-slate-200/80 px-2 py-0.5 rounded-full"
                  >
                    {t(docKey)}
                  </span>
                ))}
              </div>
            </div>

            {/* M3 Filled Apply Now Button */}
            <button
              onClick={() => handleApply(scheme.id)}
              className="mt-1 w-full min-h-12 rounded-full bg-primary text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs hover:bg-primary-light active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>{t('applyNow')}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Collapsible Non-Matching Schemes Section */}
      {ineligibleSchemes.length > 0 && (
        <div className="border border-slate-200 rounded-2xl overflow-hidden bg-surface-container-low/60">
          <button
            onClick={() => setShowIneligible(!showIneligible)}
            className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-bold text-slate-700 hover:bg-surface-container-low transition-all cursor-pointer"
          >
            <span>
              {t('otherSchemesToggle').replace('{count}', ineligibleSchemes.length)}
            </span>
            {showIneligible ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showIneligible && (
            <div className="p-3.5 pt-0 flex flex-col gap-2.5">
              {ineligibleSchemes.map(({ scheme, reasonKey }) => (
                <div
                  key={scheme.id}
                  className="bg-white rounded-xl border border-slate-200 p-3 flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{scheme.icon}</span>
                      <span className="font-semibold text-xs text-slate-800">
                        {t(scheme.nameKey)}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {t(scheme.benefitKey)}
                    </span>
                  </div>

                  <div className="bg-amber-50 text-amber-900 border border-amber-200 rounded-lg p-2 text-xs leading-relaxed flex items-start gap-1.5">
                    <AlertCircle size={14} className="text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">{t('unmetReasonLabel')} </span>
                      <span>{t(reasonKey)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modify Answers Action Button */}
      <div className="pt-2 pb-3">
        <button
          onClick={handleEditAnswers}
          className="w-full min-h-12 rounded-full border border-slate-300 bg-white text-slate-700 font-semibold text-sm flex items-center justify-center gap-2 hover:border-slate-400 active:scale-[0.98] transition-all cursor-pointer"
        >
          <RotateCcw size={16} />
          <span>{t('recheckAnswers')}</span>
        </button>
      </div>
    </div>
  );
}
