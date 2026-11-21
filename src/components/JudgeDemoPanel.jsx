import {
  WifiOff,
  Wifi,
  ImageDown,
  AlertTriangle,
  FastForward,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function JudgeDemoPanel() {
  const {
    isOffline,
    setIsOffline,
    forceBlurryError,
    setForceBlurryError,
    triggerActionNeeded,
    advanceTrackerStage,
    resetDemo,
    trackerStage,
    actionNeeded,
    currentStep,
    language,
    largeText,
    t,
  } = useApp();

  const stageNames = [
    t('stageName0'),
    t('stageName1'),
    t('stageName2'),
    t('stageName3'),
  ];

  return (
    <aside
      className="hidden lg:flex flex-col w-[350px] shrink-0 bg-surface-container-low border border-slate-300/80 rounded-3xl p-5 shadow-xl text-slate-800 gap-4.5 self-start sticky top-6"
      aria-label="Judge Demo Controls Panel"
    >
      {/* Panel Header */}
      <div className="border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-xs">
            <SlidersHorizontal size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-tight">
              {t('judgePanelTitle')}
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Material Design 3 • Live State Controls
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
          {t('judgePanelSubtitle')}
        </p>
      </div>

      {/* 5 Primary M3 Action Buttons */}
      <div className="flex flex-col gap-2.5">
        {/* 1. Toggle Offline / Slow 3G Mode */}
        <button
          onClick={() => setIsOffline(!isOffline)}
          className={`w-full min-h-12 px-4 rounded-full font-semibold text-xs flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer shadow-xs border ${
            isOffline
              ? 'bg-amber-600 text-white border-amber-700'
              : 'bg-white text-slate-800 border-slate-300 hover:border-slate-400'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {isOffline ? <WifiOff size={16} /> : <Wifi size={16} className="text-slate-500" />}
            <span className="text-left leading-tight">{t('btnToggleOffline')}</span>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isOffline ? 'bg-amber-800 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {isOffline ? t('activeState') : t('inactiveState')}
          </span>
        </button>

        {/* 2. Force Blurry Photo Error */}
        <button
          onClick={() => setForceBlurryError(!forceBlurryError)}
          className={`w-full min-h-12 px-4 rounded-full font-semibold text-xs flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer shadow-xs border ${
            forceBlurryError
              ? 'bg-error text-white border-red-800'
              : 'bg-white text-slate-800 border-slate-300 hover:border-slate-400'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <ImageDown size={16} className={forceBlurryError ? 'text-white' : 'text-slate-500'} />
            <span className="text-left leading-tight">{t('btnForceBlurry')}</span>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              forceBlurryError ? 'bg-red-900 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {forceBlurryError ? t('activeState') : t('inactiveState')}
          </span>
        </button>

        {/* 3. Trigger "Action Needed" Status */}
        <button
          onClick={triggerActionNeeded}
          className={`w-full min-h-12 px-4 rounded-full font-semibold text-xs flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer shadow-xs border ${
            actionNeeded
              ? 'bg-amber-100 text-amber-900 border-amber-300'
              : 'bg-white text-slate-800 border-slate-300 hover:border-slate-400'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <AlertTriangle size={16} className="text-amber-700" />
            <span className="text-left leading-tight">{t('btnTriggerActionNeeded')}</span>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              actionNeeded ? 'bg-amber-200 text-amber-900' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {actionNeeded ? t('activeState') : t('inactiveState')}
          </span>
        </button>

        {/* 4. Advance Application Stage */}
        <button
          onClick={advanceTrackerStage}
          className="w-full min-h-12 px-4 rounded-full bg-primary-container text-primary-container-text hover:bg-primary-container/80 border border-primary/20 font-semibold text-xs flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <FastForward size={16} className="text-primary" />
            <span className="text-left leading-tight">{t('btnAdvanceStage')}</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-primary">
            {stageNames[trackerStage] || `Stage ${trackerStage + 1}`}
          </span>
        </button>

        {/* 5. Reset Entire Demo */}
        <button
          onClick={resetDemo}
          className="w-full min-h-12 px-4 rounded-full bg-surface-container-high/70 hover:bg-surface-container-high text-slate-700 border border-slate-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-2xs mt-1"
        >
          <RotateCcw size={15} />
          <span>{t('btnResetDemo')}</span>
        </button>
      </div>

      {/* Live State Diagnostics Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 flex flex-col gap-2 text-xs shadow-2xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-600 text-[11px] uppercase tracking-wider">
          <Info size={13} className="text-primary" />
          <span>Live App Diagnostics</span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-[11px]">
          <div>
            <span className="text-slate-400 block">Screen:</span>
            <span className="font-bold text-slate-800 capitalize font-mono">
              {currentStep}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Language:</span>
            <span className="font-bold text-slate-800 uppercase font-mono">
              {language}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Font Scale:</span>
            <span className="font-bold text-slate-800 font-mono">
              {largeText ? '20px (A+)' : '16px (A)'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Timeline Stage:</span>
            <span className="font-bold text-primary font-mono">
              {stageNames[trackerStage] || `Stage ${trackerStage + 1}`}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
