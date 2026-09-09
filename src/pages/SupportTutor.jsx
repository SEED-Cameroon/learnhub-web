import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle, CheckCircle2, Loader2, ShieldCheck, X } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useAuth } from "../hooks/useAuth";
import { createSubscription, PROVIDERS, SUPPORT_TIERS } from "../services/subscriptionsApi";
import { MOCK_TUTORS } from "../data/mockCourses";

// Cameroon mobile numbers: 9 digits, starting with 6 (excluding the +237 prefix)
const PHONE_REGEX = /^6\d{8}$/;

// Screen states this page can be in
const STEP = {
  FORM: "form",
  CONFIRMING: "confirming",
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
};

export default function SupportTutor() {
  const { tutorId: routeTutorId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();

  const [selectedTutorId, setSelectedTutorId] = useState(routeTutorId || "");
  const [amountFcfa, setAmountFcfa] = useState(SUPPORT_TIERS[0].amountFcfa);
  const [customAmount, setCustomAmount] = useState("");
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [provider, setProvider] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [step, setStep] = useState(STEP.FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [resultMessage, setResultMessage] = useState(null);

  const selectedTutor = useMemo(
    () => MOCK_TUTORS.find((t) => t.id === selectedTutorId) || null,
    [selectedTutorId]
  );

  const effectiveAmount = isCustomAmount ? Number(customAmount) : amountFcfa;

  const validate = () => {
    const errors = {};
    if (!selectedTutorId) errors.tutor = "Please select a tutor to support.";
    if (!effectiveAmount || effectiveAmount <= 0) errors.amount = "Enter an amount greater than 0.";
    else if (effectiveAmount < 500) errors.amount = "Minimum support amount is 500 FCFA.";
    if (!provider) errors.provider = "Select a payment provider.";
    if (!phoneNumber) errors.phone = "Enter your mobile money number.";
    else if (!PHONE_REGEX.test(phoneNumber.replace(/\s+/g, ""))) {
      errors.phone = "Enter a valid Cameroon number (e.g. 6XX XX XX XX).";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleReviewClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setApiError("Log in to support a tutor.");
      return;
    }
    setApiError(null);
    if (validate()) setStep(STEP.CONFIRMING);
  };

  const handleConfirmPayment = async () => {
    setStep(STEP.PENDING);
    setApiError(null);
    try {
      const result = await createSubscription({
        tutorId: selectedTutorId,
        amountFcfa: effectiveAmount,
        provider,
        phoneNumber: phoneNumber.replace(/\s+/g, ""),
        token,
      });
      setResultMessage(result.message);
      setStep(result.status === "success" ? STEP.SUCCESS : STEP.FAILED);
    } catch (err) {
      setResultMessage(err.message || "Something went wrong. Please try again.");
      setStep(STEP.FAILED);
    }
  };

  const handleTryAgain = () => {
    setApiError(null);
    setResultMessage(null);
    setStep(STEP.FORM);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header activePage="tutors" />

      <main className="mx-auto w-full max-w-md flex-1 px-4 py-8 sm:px-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 text-sm text-slate-500 hover:text-[#12234F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#12234F] rounded"
        >
          ← Back
        </button>

        <h1 className="text-xl font-bold text-slate-900">
          Support {selectedTutor ? selectedTutor.name : "a Tutor"}
        </h1>

        {step === STEP.FORM && (
          <form onSubmit={handleReviewClick} className="mt-5 space-y-5" noValidate>
            {/* Tutor selection */}
            <div>
              <label htmlFor="tutor" className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Select Tutor
              </label>
              <select
                id="tutor"
                value={selectedTutorId}
                onChange={(e) => setSelectedTutorId(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-[#12234F]"
              >
                <option value="">Choose a tutor...</option>
                {MOCK_TUTORS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} — {t.subject}
                  </option>
                ))}
              </select>
              {fieldErrors.tutor && <FieldError message={fieldErrors.tutor} />}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Select Monthly Support Tier
              </label>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                {SUPPORT_TIERS.map((tier) => (
                  <button
                    key={tier.amountFcfa}
                    type="button"
                    onClick={() => {
                      setIsCustomAmount(false);
                      setAmountFcfa(tier.amountFcfa);
                    }}
                    aria-pressed={!isCustomAmount && amountFcfa === tier.amountFcfa}
                    className={
                      "relative rounded-md border px-3 py-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#12234F] " +
                      (!isCustomAmount && amountFcfa === tier.amountFcfa
                        ? "border-[#12234F] bg-[#12234F]/5"
                        : "border-slate-300 hover:border-slate-400")
                    }
                  >
                    {tier.popular && (
                      <span className="absolute -top-2 right-2 rounded bg-[#F0A93B] px-1.5 py-0.5 text-[9px] font-semibold text-white">
                        Popular
                      </span>
                    )}
                    <p className="text-sm font-bold text-slate-900">
                      {tier.amountFcfa.toLocaleString()} CFA
                      <span className="ml-0.5 text-xs font-normal text-slate-500">/month</span>
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500">{tier.description}</p>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setIsCustomAmount(true)}
                className={
                  "mt-2 text-xs font-medium " +
                  (isCustomAmount ? "text-[#12234F]" : "text-slate-400 hover:text-[#12234F]")
                }
              >
                Or enter a custom amount
              </button>

              {isCustomAmount && (
                <div className="mt-2">
                  <div className="flex items-center rounded-md border border-slate-300 px-3 py-2 focus-within:border-[#12234F]">
                    <input
                      type="number"
                      min="0"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="e.g. 3000"
                      className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                    />
                    <span className="ml-2 shrink-0 text-xs text-slate-400">CFA / month</span>
                  </div>
                </div>
              )}
              {fieldErrors.amount && <FieldError message={fieldErrors.amount} />}
            </div>

            {/* Provider */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Payment Method
              </label>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                {PROVIDERS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setProvider(p.value)}
                    aria-pressed={provider === p.value}
                    className={
                      "flex flex-col items-center gap-1.5 rounded-md border px-3 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#12234F] " +
                      (provider === p.value ? "border-[#12234F] bg-[#12234F]/5" : "border-slate-300 hover:border-slate-400")
                    }
                  >
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold"
                      style={{ backgroundColor: p.accent, color: p.textColor }}
                    >
                      {p.value === "mtn" ? "MTN" : "O"}
                    </span>
                    <span className="text-xs font-medium text-slate-700">{p.label}</span>
                  </button>
                ))}
              </div>
              {fieldErrors.provider && <FieldError message={fieldErrors.provider} />}
            </div>

            {/* Phone number */}
            <div>
              <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Mobile Money Number
              </label>
              <div className="mt-1.5 flex items-center rounded-md border border-slate-300 px-3 py-2 focus-within:border-[#12234F]">
                <span className="shrink-0 text-sm text-slate-500">+237</span>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="6XX XX XX XX"
                  className="ml-2 w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                <ShieldCheck className="h-3 w-3" />
                Secure transaction via local operators.
              </p>
              {fieldErrors.phone && <FieldError message={fieldErrors.phone} />}
            </div>

            {apiError && <FieldError message={apiError} />}

            <button
              type="submit"
              className="w-full rounded-md bg-[#F0A93B] py-2.5 text-sm font-semibold text-white hover:bg-[#D9931E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F0A93B] focus-visible:ring-offset-2"
            >
              Review Payment
            </button>
            <p className="text-center text-[11px] text-slate-400">This is a direct contribution to the tutor.</p>
          </form>
        )}

        {step === STEP.PENDING && (
          <div className="mt-10 flex flex-col items-center gap-3 py-10 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#12234F]" />
            <p className="text-sm font-medium text-slate-700">Waiting for confirmation on your phone...</p>
            <p className="text-xs text-slate-400">Approve the Mobile Money prompt sent to +237 {phoneNumber}</p>
          </div>
        )}

        {step === STEP.SUCCESS && (
          <div className="mt-10 flex flex-col items-center gap-3 py-10 text-center">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
            <p className="text-sm font-semibold text-slate-900">Payment Successful</p>
            <p className="text-xs text-slate-500">{resultMessage}</p>
            <button
              type="button"
              onClick={() => navigate("/courses")}
              className="mt-3 rounded-md bg-[#12234F] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0D1938] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#12234F] focus-visible:ring-offset-2"
            >
              Back to Courses
            </button>
          </div>
        )}

        {step === STEP.FAILED && (
          <div className="mt-10 flex flex-col items-center gap-3 py-10 text-center">
            <AlertCircle className="h-10 w-10 text-red-500" />
            <p className="text-sm font-semibold text-slate-900">Payment Failed</p>
            <p className="text-xs text-slate-500">{resultMessage}</p>
            <button
              type="button"
              onClick={handleTryAgain}
              className="mt-3 rounded-md border border-[#12234F] px-5 py-2 text-sm font-semibold text-[#12234F] hover:bg-[#12234F] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#12234F] focus-visible:ring-offset-2"
            >
              Try Again
            </button>
          </div>
        )}
      </main>

      <Footer />

      {/* Confirmation modal — required before any financial action fires */}
      {step === STEP.CONFIRMING && (
        <ConfirmationModal
          tutorName={selectedTutor?.name}
          amountFcfa={effectiveAmount}
          providerLabel={PROVIDERS.find((p) => p.value === provider)?.label}
          phoneNumber={phoneNumber}
          onCancel={() => setStep(STEP.FORM)}
          onConfirm={handleConfirmPayment}
        />
      )}
    </div>
  );
}

function FieldError({ message }) {
  return (
    <p role="alert" className="mt-1 flex items-center gap-1 text-xs text-red-600">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      {message}
    </p>
  );
}

function ConfirmationModal({ tutorName, amountFcfa, providerLabel, phoneNumber, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Confirm Your Support</h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cancel"
            className="text-slate-400 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#12234F] rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <dl className="mt-4 space-y-2 text-sm">
          <Row label="Tutor" value={tutorName} />
          <Row label="Amount" value={`${amountFcfa.toLocaleString()} CFA / month`} />
          <Row label="Payment method" value={providerLabel} />
          <Row label="Phone number" value={`+237 ${phoneNumber}`} />
        </dl>

        <p className="mt-4 text-[11px] text-slate-400">
          You'll be charged {amountFcfa.toLocaleString()} CFA every month via {providerLabel} until you cancel.
        </p>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-md border border-slate-300 py-2 text-sm font-medium text-slate-700 hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#12234F]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-md bg-[#F0A93B] py-2 text-sm font-semibold text-white hover:bg-[#D9931E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F0A93B] focus-visible:ring-offset-2"
          >
            Confirm & Pay
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-900">{value}</dd>
    </div>
  );
}