import { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Copy,
  Check,
  ShieldCheck,
  Building2,
  CreditCard,
  FileText,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SCHEMES } from '../data/schemes';

export default function StatusTracker() {
  const { application, setCurrentStep, t } = useApp();
  const [copied, setCopied] = useState(false);

  // Fallback application if accessed directly without submission
  const app = application || {
    trackingId: 'SS-2026-48921',
    schemeId: 'pm_kisan',
    schemeNameKey: 'pmKisanTitle',
    schemeBenefitKey: 'pmKisanBenefit',
    schemeIcon: '🌾',
    submittedAt: new Date().toISOString(),
    status: 'submitted',
    documents: {},
  };

  const handleCopyId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(app.trackingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBackHome = () => {
    setCurrentStep('onboarding');
  };

  const stages = [
    {
      id: 1,
      titleKey: 'stage1',
      descKey: 'stage1Desc',
      status: 'completed',
      date: new Date(app.submittedAt).toLocaleDateString([], {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      icon: CheckCircle2,
    },
    {
      id: 2,
      titleKey: 'stage2',
      descKey: 'stage2Desc',
      status: 'in_progress',
      date: t('estimatedTimeline'),
      icon: Clock,
    },
    {
      id: 3,
      titleKey: 'stage3',
      descKey: 'stage3Desc',
      status: 'upcoming',
      date: 'Step 3 of 4',
      icon: Building2,
    },
    {
      id: 4,
      titleKey: 'stage4',
      descKey: 'stage4Desc',
      status: 'upcoming',
      date: t('payoutDirectNotice'),
      icon: CreditCard,
    },
  ];

  return (
    <div className="flex flex-col min-h-full px-4 py-4 gap-4">
      {/* Success Badge & Header */}
      <div className="text-center pt-2">
        <div className="w-16 h-16 mx-auto mb-2.5 rounded-full bg-verified-container text-verified flex items-center justify-center shadow-xs">
          <CheckCircle2 size={36} className="stroke-[2.5]" />
        </div>
        <h1 className="text-lg font-bold text-slate-900 leading-snug">
          {t('appSubmittedSuccess')}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
          {t(app.schemeNameKey || 'pmKisanTitle')}
        </p>
      </div>

      {/* M3 Primary Container: Tracking ID Card */}
      <div className="bg-primary-container/40 border-2 border-primary/30 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
            {t('trackingIdLabel')}
          </p>
          <p className="text-xl font-extrabold text-primary-container-text font-mono tracking-wide mt-0.5">
            {app.trackingId}
          </p>
        </div>

        <button
          onClick={handleCopyId}
          className="min-h-10 px-3.5 rounded-full bg-primary text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs hover:bg-primary-light active:scale-[0.98] transition-all cursor-pointer shrink-0"
        >
          {copied ? (
            <>
              <Check size={14} className="stroke-[2.5]" />
              <span>{t('idCopied')}</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>{t('copyId')}</span>
            </>
          )}
        </button>
      </div>

      {/* 4-Stage Live Progress Tracker */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3.5">
          {t('trackingTimeline')}
        </h2>

        <div className="flex flex-col gap-4">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isCompleted = stage.status === 'completed';
            const isInProgress = stage.status === 'in_progress';
            const isUpcoming = stage.status === 'upcoming';

            return (
              <div key={stage.id} className="flex items-start gap-3">
                {/* Timeline node & line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-verified-container text-verified border-2 border-verified'
                        : isInProgress
                        ? 'bg-primary text-white ring-4 ring-primary-container/50 animate-pulse'
                        : 'bg-surface-container-high text-slate-400'
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  {idx < stages.length - 1 && (
                    <div
                      className={`w-0.5 h-7 mt-1 ${
                        isCompleted ? 'bg-verified' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>

                {/* Stage Info */}
                <div className="pt-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-sm font-bold leading-tight ${
                        isCompleted
                          ? 'text-slate-900'
                          : isInProgress
                          ? 'text-primary'
                          : 'text-slate-500'
                      }`}
                    >
                      {t(stage.titleKey)}
                    </p>
                    {isCompleted && (
                      <span className="text-[10px] font-bold text-verified bg-verified-container px-2 py-0.5 rounded-full">
                        Done
                      </span>
                    )}
                    {isInProgress && (
                      <span className="text-[10px] font-bold text-primary bg-primary-container px-2 py-0.5 rounded-full">
                        In Review
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {t(stage.descKey)}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                    {stage.date}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verified Documents Attached */}
      <div className="bg-surface-container-low rounded-2xl border border-slate-200/80 p-3.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-verified" />
          <span>
            {t('attachedDocuments').replace(
              '{count}',
              Object.keys(app.documents || {}).length || 3
            )}
          </span>
        </h3>
        <div className="flex flex-col gap-1.5">
          {Object.entries(app.documents || {}).length > 0 ? (
            Object.entries(app.documents).map(([docKey, data]) => (
              <div
                key={docKey}
                className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs"
              >
                <span className="font-semibold text-slate-800">{t(docKey)}</span>
                <span className="text-verified font-bold flex items-center gap-1">
                  <CheckCircle2 size={13} />
                  {data.method === 'digilocker' ? 'DigiLocker' : 'Uploaded'}
                </span>
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-500 italic p-1">
              All 3 identity & scheme documents verified and sealed.
            </div>
          )}
        </div>
      </div>

      {/* Back to Home Button */}
      <div className="pt-2 pb-4">
        <button
          onClick={handleBackHome}
          className="w-full min-h-12 rounded-full bg-surface-container-high/80 text-slate-800 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-surface-container-high active:scale-[0.98] transition-all cursor-pointer"
        >
          <RotateCcw size={16} />
          <span>{t('backToHome')}</span>
        </button>
      </div>
    </div>
  );
}
