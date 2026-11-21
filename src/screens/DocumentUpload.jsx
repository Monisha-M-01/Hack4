import { useState, useRef } from 'react';
import {
  FileText,
  ShieldCheck,
  Camera,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Trash2,
  ExternalLink,
  Bug,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SCHEMES } from '../data/schemes';

export default function DocumentUpload() {
  const {
    selectedSchemeId,
    documents,
    setDocuments,
    setCurrentStep,
    setApplication,
    answers,
    forceBlurryError,
    setForceBlurryError,
    t,
  } = useApp();

  const [verifyingDoc, setVerifyingDoc] = useState(null);
  const fileInputRefs = useRef({});

  // Find the selected scheme or fallback to the first scheme
  const currentScheme =
    SCHEMES.find((s) => s.id === selectedSchemeId) || SCHEMES[0];

  const requiredDocs = currentScheme.docs;

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) return `${mb.toFixed(1)} MB`;
    return `${Math.round(bytes / 1024)} KB`;
  };

  // Option A: Fetch from DigiLocker (1-Tap simulation with 1.2s delay)
  const handleDigiLockerFetch = (docKey) => {
    setVerifyingDoc(docKey);

    // Clear any previous error
    setDocuments((prev) => ({
      ...prev,
      [docKey]: { status: 'verifying', method: 'digilocker' },
    }));

    setTimeout(() => {
      setDocuments((prev) => ({
        ...prev,
        [docKey]: {
          status: 'verified',
          method: 'digilocker',
          verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          file: {
            name: `${t(docKey)}_DigiLocker_Verified.pdf`,
            size: '1.2 MB',
            isDigiLocker: true,
          },
        },
      }));
      setVerifyingDoc(null);
    }, 1200);
  };

  // Option B: File Upload / Camera
  const handleFileUpload = (docKey, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so re-selecting same file triggers onChange
    e.target.value = '';

    // Error Validation 1: Size > 5MB
    if (file.size > 5 * 1024 * 1024) {
      setDocuments((prev) => ({
        ...prev,
        [docKey]: {
          status: 'error',
          errorType: 'size',
          errorMessage: t('fileTooLarge'),
        },
      }));
      return;
    }

    // Error Validation 2: Unsupported type
    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';
    if (!isImage && !isPdf) {
      setDocuments((prev) => ({
        ...prev,
        [docKey]: {
          status: 'error',
          errorType: 'format',
          errorMessage: t('invalidFileType'),
        },
      }));
      return;
    }

    // Error Validation 3: Blurry Photo Detection (using forceBlurryError flag)
    if (forceBlurryError && isImage) {
      // Simulate reading dataUrl to show the blurry thumbnail in error state
      const reader = new FileReader();
      reader.onload = (event) => {
        setDocuments((prev) => ({
          ...prev,
          [docKey]: {
            status: 'error',
            errorType: 'blurry',
            errorMessage: t('photoBlurry'),
            previewUrl: event.target.result,
            fileName: file.name,
            fileSize: formatFileSize(file.size),
          },
        }));
      };
      reader.readAsDataURL(file);
      return;
    }

    // Valid file upload
    const reader = new FileReader();
    reader.onload = (event) => {
      setDocuments((prev) => ({
        ...prev,
        [docKey]: {
          status: 'verified',
          method: 'upload',
          previewUrl: isImage ? event.target.result : null,
          fileName: file.name,
          fileSize: formatFileSize(file.size),
          fileType: file.type,
          verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRetake = (docKey) => {
    // Clear error state and open file picker
    setDocuments((prev) => {
      const next = { ...prev };
      delete next[docKey];
      return next;
    });

    if (fileInputRefs.current[docKey]) {
      fileInputRefs.current[docKey].click();
    }
  };

  const handleRemoveDoc = (docKey) => {
    setDocuments((prev) => {
      const next = { ...prev };
      delete next[docKey];
      return next;
    });
  };

  // Check how many documents are verified
  const verifiedCount = requiredDocs.filter(
    (docKey) => documents[docKey]?.status === 'verified'
  ).length;

  const totalRequired = requiredDocs.length;
  const isAllVerified = verifiedCount === totalRequired;
  const remainingCount = totalRequired - verifiedCount;

  // Submit Application
  const handleSubmit = () => {
    if (!isAllVerified) return;

    // Generate Tracking ID: SS-2026-XXXXX
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const trackingId = `SS-2026-${randomDigits}`;

    const newApplication = {
      trackingId,
      schemeId: currentScheme.id,
      schemeNameKey: currentScheme.nameKey,
      schemeBenefitKey: currentScheme.benefitKey,
      schemeIcon: currentScheme.icon,
      submittedAt: new Date().toISOString(),
      status: 'submitted',
      answers,
      documents,
    };

    setApplication(newApplication);
    setCurrentStep('tracker');
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Screen Header */}
      <div className="px-4 pt-3 pb-2 bg-surface">
        <div className="flex items-center justify-between gap-2 mb-2">
          <button
            onClick={() => setCurrentStep('results')}
            className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-primary transition-all cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>{t('back')}</span>
          </button>

          {/* Demo Blurry Mode Toggle Pill */}
          <button
            onClick={() => setForceBlurryError(!forceBlurryError)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
              forceBlurryError
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-surface-container-low text-slate-500 border-slate-300 hover:text-slate-700'
            }`}
            title="Toggle to test blurry photo error detection"
          >
            <Bug size={12} className={forceBlurryError ? 'text-amber-700' : 'text-slate-400'} />
            <span>{t('testBlurryToggle')}: {forceBlurryError ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Selected Scheme Badge */}
        <div className="flex items-center gap-2 p-2.5 bg-surface-container-low rounded-xl border border-slate-200/80 mb-2">
          <span className="text-xl">{currentScheme.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {t('selectedSchemeBadge')}
            </p>
            <p className="text-xs font-bold text-slate-900 truncate">
              {t(currentScheme.nameKey)}
            </p>
          </div>
          <span className="text-[11px] font-bold text-secondary-container-text bg-secondary-container px-2 py-0.5 rounded-full shrink-0">
            {t(currentScheme.benefitKey)}
          </span>
        </div>

        <h1 className="text-lg font-bold text-slate-900 leading-tight">
          {t('uploadHeader')}
        </h1>
        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
          {t('uploadSubtitle').replace('{scheme}', t(currentScheme.nameKey))}
        </p>
      </div>

      {/* Documents List */}
      <div className="flex-1 px-4 py-3 flex flex-col gap-3.5">
        {requiredDocs.map((docKey, index) => {
          const docState = documents[docKey] || { status: 'pending' };
          const isVerifyingThis = verifyingDoc === docKey;
          const isVerified = docState.status === 'verified';
          const isError = docState.status === 'error';

          return (
            <div
              key={docKey}
              className={`p-4 rounded-2xl border-2 transition-all bg-white flex flex-col gap-3 ${
                isVerified
                  ? 'border-verified/40 shadow-xs'
                  : isError
                  ? 'border-error/40 shadow-xs'
                  : 'border-slate-200 shadow-xs'
              }`}
            >
              {/* Card Header: Doc Number, Title, M3 Status Assist Chip */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-surface-container-high/70 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 leading-snug">
                      {t(docKey)}
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Required for identity / scheme verification
                    </p>
                  </div>
                </div>

                {/* M3 Status Assist Chip */}
                {isVerified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-verified-container text-verified-container-text font-bold text-xs border border-verified/30 shrink-0">
                    <CheckCircle2 size={13} className="text-verified" />
                    <span>{t('statusVerified')}</span>
                  </span>
                )}
                {isError && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-error-container text-error-container-text font-bold text-xs border border-error/30 shrink-0">
                    <AlertTriangle size={13} className="text-error" />
                    <span>{t('statusError')}</span>
                  </span>
                )}
                {!isVerified && !isError && isVerifyingThis && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-secondary-container-text font-semibold text-xs border border-secondary/30 shrink-0">
                    <Loader2 size={12} className="animate-spin text-secondary" />
                    <span>{t('statusVerifying')}</span>
                  </span>
                )}
                {!isVerified && !isError && !isVerifyingThis && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium text-xs border border-slate-300 shrink-0">
                    <Clock size={12} />
                    <span>{t('statusPending')}</span>
                  </span>
                )}
              </div>

              {/* State A: Document is VERIFIED */}
              {isVerified && (
                <div className="bg-verified-container/30 border border-verified/20 rounded-xl p-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {docState.previewUrl ? (
                      <img
                        src={docState.previewUrl}
                        alt="Preview"
                        className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-lg bg-verified-container text-verified flex items-center justify-center shrink-0">
                        <FileText size={20} />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {docState.fileName || (docState.method === 'digilocker' ? `${t(docKey)} (DigiLocker)` : 'Document')}
                      </p>
                      <p className="text-[11px] text-verified font-medium">
                        {docState.method === 'digilocker'
                          ? t('verifiedViaDigiLocker')
                          : t('verifiedViaUpload')}
                        {docState.fileSize ? ` • ${docState.fileSize}` : ''}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveDoc(docKey)}
                    className="p-1.5 rounded-full text-slate-400 hover:text-error hover:bg-error-container/30 transition-all cursor-pointer"
                    title={t('removeFile')}
                    aria-label={t('removeFile')}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              )}

              {/* State B: Document is in ERROR (Blurry Photo or Size/Format error) */}
              {isError && (
                <div className="bg-error-container/50 border border-error/30 rounded-xl p-3.5 flex flex-col gap-2.5 animate-fade-in">
                  <div className="flex items-start gap-2.5">
                    {docState.previewUrl && (
                      <img
                        src={docState.previewUrl}
                        alt="Blurry Preview"
                        className="w-12 h-12 rounded-lg object-cover filter blur-[1px] opacity-75 border border-error/40 shrink-0"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 text-error font-bold text-xs mb-0.5">
                        <AlertTriangle size={14} className="shrink-0" />
                        <span>{t('statusError')}</span>
                      </div>
                      <p className="text-xs text-error-container-text leading-relaxed">
                        {docState.errorMessage}
                      </p>
                    </div>
                  </div>

                  {/* Recoverable Action: Retake Button */}
                  <button
                    onClick={() => handleRetake(docKey)}
                    className="self-start min-h-10 px-4 rounded-full bg-error text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs hover:bg-red-800 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <RotateCcw size={14} />
                    <span>{t('retakeUpload')}</span>
                  </button>
                </div>
              )}

              {/* State C: Document is PENDING (Show Upload Options A and B) */}
              {!isVerified && !isError && (
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  {/* Option A: DigiLocker Button (1-Tap) */}
                  <button
                    onClick={() => handleDigiLockerFetch(docKey)}
                    disabled={isVerifyingThis}
                    className="flex-1 min-h-12 px-3 rounded-full bg-secondary-container/70 hover:bg-secondary-container text-secondary-container-text font-semibold text-xs flex items-center justify-center gap-2 border border-secondary/20 shadow-2xs active:scale-[0.98] transition-all cursor-pointer"
                  >
                    {isVerifyingThis ? (
                      <>
                        <Loader2 size={16} className="animate-spin text-secondary" />
                        <span>{t('statusVerifying')}</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={16} className="text-secondary" />
                        <span>{t('fetchDigiLocker')}</span>
                      </>
                    )}
                  </button>

                  {/* Option B: Photo / Camera Button */}
                  <button
                    onClick={() => fileInputRefs.current[docKey]?.click()}
                    disabled={isVerifyingThis}
                    className="flex-1 min-h-12 px-3 rounded-full border-2 border-slate-300 hover:border-primary text-slate-800 bg-white font-semibold text-xs flex items-center justify-center gap-2 shadow-2xs active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Camera size={16} className="text-primary" />
                    <span>{t('uploadPhoto')}</span>
                  </button>

                  {/* Hidden native file input */}
                  <input
                    ref={(el) => (fileInputRefs.current[docKey] = el)}
                    type="file"
                    accept="image/*,.pdf"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => handleFileUpload(docKey, e)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Action Bar with Incomplete Submission Guard */}
      <div className="sticky bottom-0 bg-surface/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 flex flex-col gap-2">
        {/* Helper Chip showing remaining documents */}
        <div className="flex items-center justify-center">
          {isAllVerified ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-verified-container text-verified-container-text font-bold text-xs border border-verified/30">
              <CheckCircle2 size={14} className="text-verified" />
              <span>{t('allDocsVerified').replace('{total}', totalRequired)}</span>
            </span>
          ) : remainingCount === 1 ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 font-semibold text-xs border border-amber-200">
              <Clock size={13} className="text-amber-600" />
              <span>{t('oneDocRemaining')}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-slate-600 font-medium text-xs border border-slate-300">
              <Clock size={13} />
              <span>
                {t('docsRemaining')
                  .replace('{count}', remainingCount)
                  .replace('{total}', totalRequired)}
              </span>
            </span>
          )}
        </div>

        {/* M3 Filled Submit Application Button */}
        <button
          onClick={handleSubmit}
          disabled={!isAllVerified}
          className={`w-full min-h-12 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            isAllVerified
              ? 'bg-primary text-white shadow-sm hover:bg-primary-light active:scale-[0.98]'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-75'
          }`}
        >
          <span>{t('submitApplication')}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
