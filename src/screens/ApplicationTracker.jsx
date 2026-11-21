import { useState, useRef } from 'react';
import {
  CheckCircle2,
  Clock,
  Copy,
  Check,
  Building2,
  CreditCard,
  PhoneCall,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Send,
  ShieldCheck,
  Camera,
  Loader2,
  SlidersHorizontal,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SCHEMES } from '../data/schemes';

export default function ApplicationTracker() {
  const {
    application,
    trackerStage,
    setTrackerStage,
    actionNeeded,
    setActionNeeded,
    setCurrentStep,
    t,
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(null);
  const [showFixModal, setShowFixModal] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const fileInputRef = useRef(null);

  // Fallback default application if accessed directly
  const app = application || {
    trackingId: 'SS-2026-84921',
    schemeId: 'pm_kisan',
    schemeNameKey: 'pmKisanTitle',
    schemeBenefitKey: 'pmKisanBenefit',
    schemeIcon: '🌾',
    submittedAt: new Date().toISOString(),
    status: 'submitted',
    documents: {},
  };

  const showSnackbar = (msg) => {
    setSnackbarMessage(msg);
    setTimeout(() => {
      setSnackbarMessage(null);
    }, 3200);
  };

  const handleCopyId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(app.trackingId);
      setCopied(true);
      showSnackbar(`${t('idCopied')} (${app.trackingId})`);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSendReceipt = () => {
    showSnackbar(t('receiptSentToast'));
  };

  // Inline Recovery: Handle DigiLocker fix
  const handleFixViaDigiLocker = () => {
    setIsFixing(true);
    setTimeout(() => {
      setIsFixing(false);
      setShowFixModal(false);
      setActionNeeded(false);
      showSnackbar(t('docUpdatedToast'));
    }, 1200);
  };

  // Inline Recovery: Handle Camera/Photo fix
  const handleFixViaCamera = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsFixing(true);
    setTimeout(() => {
      setIsFixing(false);
      setShowFixModal(false);
      setActionNeeded(false);
      showSnackbar(t('docUpdatedToast'));
    }, 1000);
  };

  const handleCheckAnotherScheme = () => {
    setCurrentStep('eligibility');
  };

  const stages = [
    {
      id: 0,
      titleKey: 'stage1Title',
      descKey: 'stage1Desc',
      icon: CheckCircle2,
      time: new Date(app.submittedAt).toLocaleDateString([], {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    },
    {
      id: 1,
      titleKey: 'stage2Title',
      descKey: 'stage2Desc',
      icon: Building2,
      time: t('estimatedTimeline'),
    },
    {
      id: 2,
      titleKey: 'stage3Title',
      descKey: 'stage3Desc',
      icon: Clock,
      time: 'Taluk Welfare Board',
    },
    {
      id: 3,
      titleKey: 'stage4Title',
      descKey: 'stage4Desc',
      icon: CreditCard,
      time: t('payoutDirectNotice'),
    },
  ];

  return (
    <div className="flex flex-col min-h-full px-4 py-4 gap-4 relative pb-10">
      {/* 1. Top Confirmation & Tracking Card: M3 Primary Container (#D6E3FF) */}
      <div className="bg-primary-container text-primary-container-text rounded-2xl p-4.5 border border-primary/20 shadow-xs flex flex-col gap-3">
        {/* Scheme Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl p-1 bg-white/70 rounded-xl shadow-2xs">
              {app.schemeIcon || '🏛️'}
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                {t('appSubmittedSuccess')}
              </p>
              <h1 className="text-sm font-bold text-slate-900 leading-tight">
                {t(app.schemeNameKey || 'pmKisanTitle')}
              </h1>
            </div>
          </div>
          <span className="text-xs font-bold bg-white/90 text-primary px-2.5 py-1 rounded-full shrink-0 shadow-2xs">
            {t(app.schemeBenefitKey || 'pmKisanBenefit')}
          </span>
        </div>

        {/* Application ID + Copy */}
        <div className="bg-white/80 rounded-xl p-3 flex items-center justify-between border border-primary/15">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {t('trackingIdLabel')}
            </p>
            <p className="text-lg font-black text-slate-900 font-mono tracking-wide">
              {app.trackingId}
            </p>
          </div>

          <button
            onClick={handleCopyId}
            className="min-h-9 px-3.5 rounded-full bg-primary text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs hover:bg-primary-light active:scale-[0.98] transition-all cursor-pointer"
          >
            {copied ? <Check size={13} className="stroke-[3]" /> : <Copy size={13} />}
            <span>{copied ? t('idCopied') : t('copyId')}</span>
          </button>
        </div>

        {/* Send Receipt on WhatsApp / SMS Tonal Button */}
        <button
          onClick={handleSendReceipt}
          className="w-full min-h-11 rounded-full bg-white/90 hover:bg-white text-primary font-semibold text-xs flex items-center justify-center gap-2 border border-primary/20 shadow-2xs active:scale-[0.98] transition-all cursor-pointer"
        >
          <Send size={14} className="text-primary" />
          <span>{t('sendReceiptBtn')}</span>
        </button>
      </div>

      {/* Demo Simulation Strip: Allows judge/reviewer to test all 4 stages & Action Needed */}
      <div className="bg-surface-container-low rounded-xl border border-slate-200/90 p-2.5 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 px-1">
          <span className="flex items-center gap-1">
            <SlidersHorizontal size={12} />
            <span>{t('demoSimulation')}</span>
          </span>
          <button
            onClick={() => setActionNeeded(!actionNeeded)}
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
              actionNeeded
                ? 'bg-error-container text-error-container-text border-error/30'
                : 'bg-white text-slate-600 border-slate-300'
            }`}
          >
            Action Needed: {actionNeeded ? 'ON' : 'OFF'}
          </button>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {[
            { label: 'Stage 1', stage: 0 },
            { label: 'Stage 2', stage: 1 },
            { label: 'Stage 3', stage: 2 },
            { label: 'Stage 4', stage: 3 },
          ].map((item) => (
            <button
              key={item.stage}
              onClick={() => setTrackerStage(item.stage)}
              className={`py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                trackerStage === item.stage
                  ? 'bg-primary text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Delivery-Style Vertical Timeline (4 Stages) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
          {t('trackingTimeline')}
        </h2>

        <div className="flex flex-col gap-4">
          {stages.map((stageItem, idx) => {
            const Icon = stageItem.icon;
            const isCompleted = trackerStage > stageItem.id;
            const isCurrent = trackerStage === stageItem.id;
            const isUpcoming = trackerStage < stageItem.id;
            const isStage2ActionNeeded = stageItem.id === 1 && actionNeeded;

            return (
              <div key={stageItem.id} className="flex items-start gap-3 relative">
                {/* Timeline node icon & vertical connector line */}
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isStage2ActionNeeded
                        ? 'bg-error-container text-error border-2 border-error ring-4 ring-error-container/60 animate-bounce'
                        : isCompleted
                        ? 'bg-verified-container text-verified border-2 border-verified'
                        : isCurrent
                        ? 'bg-primary text-white ring-4 ring-primary-container/60 shadow-xs'
                        : 'bg-surface-container-high text-slate-400'
                    }`}
                  >
                    {isStage2ActionNeeded ? (
                      <AlertTriangle size={18} />
                    ) : isCompleted ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <Icon size={18} />
                    )}
                  </div>

                  {idx < stages.length - 1 && (
                    <div
                      className={`w-0.5 h-12 mt-1.5 transition-all ${
                        trackerStage > stageItem.id ? 'bg-verified' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>

                {/* Stage Info */}
                <div className="flex-1 pt-0.5 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3
                      className={`text-sm font-bold leading-tight ${
                        isStage2ActionNeeded
                          ? 'text-error'
                          : isCompleted
                          ? 'text-slate-900'
                          : isCurrent
                          ? 'text-primary'
                          : 'text-slate-400'
                      }`}
                    >
                      {t(stageItem.titleKey)}
                    </h3>

                    {/* Status Badge */}
                    {isStage2ActionNeeded ? (
                      <span className="text-[10px] font-bold text-error bg-error-container border border-error/30 px-2 py-0.5 rounded-full shrink-0">
                        {t('stageActionNeededBadge')}
                      </span>
                    ) : isCompleted ? (
                      <span className="text-[10px] font-bold text-verified bg-verified-container border border-verified/30 px-2 py-0.5 rounded-full shrink-0">
                        {t('stageCompletedBadge')}
                      </span>
                    ) : isCurrent ? (
                      <span className="text-[10px] font-bold text-primary bg-primary-container border border-primary/20 px-2 py-0.5 rounded-full shrink-0">
                        {t('stageInProgressBadge')}
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-400 bg-surface-container-high px-2 py-0.5 rounded-full shrink-0">
                        {t('stageUpcomingBadge')}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {t(stageItem.descKey)}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    {stageItem.time}
                  </p>

                  {/* 3. "Action Needed" Error Callout & Inline Recovery (Stage 2) */}
                  {isStage2ActionNeeded && (
                    <div className="mt-2.5 bg-error-container/60 border border-error/30 rounded-xl p-3 flex flex-col gap-2.5 animate-fade-in">
                      <div className="flex items-start gap-2">
                        <AlertTriangle size={15} className="text-error shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-error">
                            {t('actionNeededTitle')}
                          </p>
                          <p className="text-xs text-error-container-text leading-relaxed mt-0.5">
                            {t('actionNeededDesc')}
                          </p>
                        </div>
                      </div>

                      {!showFixModal ? (
                        <button
                          onClick={() => setShowFixModal(true)}
                          className="self-start min-h-10 px-4 rounded-full bg-error text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs hover:bg-red-800 active:scale-[0.98] transition-all cursor-pointer"
                        >
                          <RotateCcw size={13} />
                          <span>{t('fixReuploadBtn')}</span>
                        </button>
                      ) : (
                        /* Inline Recovery Actions */
                        <div className="bg-white rounded-xl p-2.5 border border-error/20 flex flex-col gap-2">
                          <p className="text-[11px] font-semibold text-slate-700">
                            {t('chooseUploadMethod')}
                          </p>

                          <div className="flex flex-col gap-1.5">
                            <button
                              onClick={handleFixViaDigiLocker}
                              disabled={isFixing}
                              className="w-full min-h-10 px-3 rounded-full bg-secondary-container text-secondary-container-text font-semibold text-xs flex items-center justify-center gap-1.5 border border-secondary/20 hover:bg-secondary-container/80 active:scale-[0.98] transition-all cursor-pointer"
                            >
                              {isFixing ? (
                                <Loader2 size={14} className="animate-spin text-secondary" />
                              ) : (
                                <ShieldCheck size={14} className="text-secondary" />
                              )}
                              <span>{t('reuploadDigiLocker')}</span>
                            </button>

                            <button
                              onClick={() => fileInputRef.current?.click()}
                              disabled={isFixing}
                              className="w-full min-h-10 px-3 rounded-full border border-slate-300 bg-white text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 hover:border-primary active:scale-[0.98] transition-all cursor-pointer"
                            >
                              <Camera size={14} className="text-primary" />
                              <span>{t('reuploadCamera')}</span>
                            </button>

                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              capture="environment"
                              className="hidden"
                              onChange={handleFixViaCamera}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Completion & Celebration Card (when Stage 4 reached) */}
      {trackerStage === 3 && (
        <div className="bg-secondary-container text-secondary-container-text rounded-2xl p-4.5 border-2 border-secondary/30 shadow-xs flex flex-col gap-2.5 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-white/80 rounded-xl shadow-2xs">
              <Sparkles size={20} className="text-secondary" />
            </span>
            <h3 className="font-bold text-sm leading-tight text-secondary-container-text">
              {t('benefitCreditedTitle')}
            </h3>
          </div>

          <p className="text-xs text-secondary-container-text/90 leading-relaxed">
            {t('benefitCreditedSub')}
          </p>

          <div className="bg-white/80 rounded-xl p-2.5 text-xs flex items-center justify-between border border-secondary/20">
            <span className="font-semibold text-slate-600">{t('transactionRef')}</span>
            <span className="font-mono font-bold text-slate-900">UTR-2026-9814275</span>
          </div>
        </div>
      )}

      {/* 5. Help Footer: M3 Outlined Help Card */}
      <div className="bg-surface-container-low rounded-2xl border border-slate-200/90 p-4 flex flex-col gap-2.5 shadow-2xs">
        <div>
          <h4 className="text-xs font-bold text-slate-900 leading-snug">
            {t('needHelpTitle')}
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {t('tollFreeHours')}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/60">
          <span className="text-xs font-bold text-primary font-mono">
            {t('callTollFree')}
          </span>

          <a
            href="tel:18001801551"
            className="min-h-9 px-3.5 rounded-full bg-primary text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs hover:bg-primary-light active:scale-[0.98] transition-all cursor-pointer"
          >
            <PhoneCall size={13} />
            <span>{t('callNow')}</span>
          </a>
        </div>
      </div>

      {/* Check Another Scheme Button */}
      <div className="pt-1">
        <button
          onClick={handleCheckAnotherScheme}
          className="w-full min-h-12 rounded-full border border-slate-300 bg-white text-slate-800 font-semibold text-sm flex items-center justify-center gap-2 hover:border-slate-400 active:scale-[0.98] transition-all cursor-pointer shadow-2xs"
        >
          <RotateCcw size={16} />
          <span>{t('checkAnotherScheme')}</span>
        </button>
      </div>

      {/* M3 Dark Snackbar (#2E3135) for Toasts */}
      {snackbarMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[380px] z-50 bg-[#2E3135] text-white px-4 py-3 rounded-2xl shadow-2xl font-medium text-xs flex items-center justify-between gap-3 animate-fade-in border border-slate-700">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-teal-400 shrink-0" />
            <span>{snackbarMessage}</span>
          </div>
          <button
            onClick={() => setSnackbarMessage(null)}
            className="text-slate-400 hover:text-white text-xs font-bold shrink-0 ml-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
