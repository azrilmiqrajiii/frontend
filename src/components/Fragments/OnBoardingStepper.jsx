export default function OnboardingStepper({ step }) {
  return (
    <div className="mb-8 flex items-center justify-center">
      <div className="flex items-center gap-4">
        <StepItem
          number={1}
          label="Ganti Password"
          active={step === 1}
          done={step > 1}
        />
        <div className="h-px w-16 bg-slate-300" />
        <StepItem number={2} label="Lengkapi Profil" active={step === 2} />
      </div>
    </div>
  );
}

function StepItem({ number, label, active, done }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
          done
            ? "bg-green-600 text-white"
            : active
              ? "bg-blue-600 text-white"
              : "bg-slate-200 text-slate-500"
        }`}
      >
        {done ? "✓" : number}
      </div>
      <span
        className={`text-xs ${
          active || done ? "text-slate-700" : "text-slate-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
