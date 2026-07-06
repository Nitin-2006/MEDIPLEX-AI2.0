import React, { useState } from "react";
import { ShieldCheck, AlertTriangle, ShieldAlert, Heart, Info } from "lucide-react";

export const SymptomChecker: React.FC = () => {
  const symptomList = [
    "Fever",
    "Cough",
    "Breathing difficulty",
    "Chest pain",
    "Severe headache",
    "Rash",
    "Vomiting",
    "Diarrhea",
    "Weight loss",
    "High blood pressure",
    "High blood sugar",
    "Weakness"
  ];

  const [selected, setSelected] = useState<string[]>([]);

  const handleToggle = (symptom: string) => {
    setSelected(prev =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const handleClear = () => setSelected([]);

  // Diagnosis logic
  const renderGuidance = () => {
    if (selected.length === 0) {
      return (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center text-slate-500 h-full flex flex-col justify-center items-center">
          <Info className="h-7 w-7 text-slate-400 mb-2" />
          <h5 className="font-bold text-slate-800 text-sm">Choose symptoms to begin</h5>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">Select one or more checkboxes on the left to receive educational awareness advice.</p>
        </div>
      );
    }

    const hasBreathingDifficulty = selected.includes("Breathing difficulty");
    const hasChestPain = selected.includes("Chest pain");

    if (hasBreathingDifficulty || hasChestPain) {
      return (
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 h-full space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-base">
            <ShieldAlert className="h-5 w-5 text-rose-600 shrink-0" />
            <span>Urgent Medical Care Required!</span>
          </div>
          <p className="text-sm text-rose-900 leading-relaxed font-semibold">
            Breathing difficulty or chest pain can be life-threatening.
          </p>
          <div className="bg-white/60 border border-rose-200/50 p-4 rounded-xl text-xs text-rose-800 leading-relaxed font-medium">
            Please seek professional emergency medical services immediately or go directly to the nearest hospital emergency department. Do not self-treat.
          </div>
        </div>
      );
    }

    if (selected.includes("Fever") && selected.includes("Rash")) {
      return (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 h-full space-y-3">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-base">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <span>Fever with Rash Awareness</span>
          </div>
          <p className="text-sm text-amber-900 leading-relaxed">
            Fever associated with a rash may indicate dengue, viral infections, or severe allergic responses.
          </p>
          <ul className="text-xs text-amber-800 space-y-1.5 list-disc ml-4 font-medium leading-relaxed">
            <li>Keep hydrated with clean water or ORS.</li>
            <li>Monitor for warning signs like extreme weakness or bleeding.</li>
            <li>Avoid self-medication (like Aspirin which increases bleeding risks) and see a doctor promptly.</li>
          </ul>
        </div>
      );
    }

    if (selected.includes("Fever") && selected.includes("Vomiting")) {
      return (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 h-full space-y-3">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-base">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <span>Fever with Vomiting Guidance</span>
          </div>
          <p className="text-sm text-amber-900 leading-relaxed">
            Prolonged fever coupled with vomiting can lead to dangerous dehydration. This pattern could indicate food-borne illnesses, typhoid, or dengue.
          </p>
          <ul className="text-xs text-amber-800 space-y-1.5 list-disc ml-4 font-medium leading-relaxed">
            <li>Drink small sips of Oral Rehydration Solution (ORS) frequently.</li>
            <li>Consult a health provider if vomiting persists beyond 24 hours.</li>
          </ul>
        </div>
      );
    }

    if (selected.includes("Cough") && selected.includes("Weight loss")) {
      return (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 h-full space-y-3">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-base">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <span>Persistent Cough Awareness</span>
          </div>
          <p className="text-sm text-amber-900 leading-relaxed">
            A lingering cough associated with unexplained weight loss or night sweats may represent a bacterial infection such as tuberculosis.
          </p>
          <ul className="text-xs text-amber-800 space-y-1.5 list-disc ml-4 font-medium leading-relaxed">
            <li>Seek professional diagnostic evaluation and testing (sputum checks, chest X-rays).</li>
            <li>Maintain hygienic ventilation in living quarters.</li>
          </ul>
        </div>
      );
    }

    if (selected.includes("High blood sugar")) {
      return (
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6 h-full space-y-3">
          <div className="flex items-center gap-2 text-teal-800 font-bold text-base">
            <ShieldCheck className="h-5 w-5 text-teal-600 shrink-0" />
            <span>Blood Sugar Management</span>
          </div>
          <p className="text-sm text-teal-950 leading-relaxed">
            Persistent thirst, frequent urination, and fatigue are common symptoms of high blood sugar.
          </p>
          <p className="text-xs text-teal-850 font-medium leading-relaxed bg-white/50 p-3 rounded-xl border border-teal-100">
            Ensure regular blood sugar checks, consume high-fiber diets, engage in aerobic exercise, and consult an endocrinologist or primary care physician.
          </p>
        </div>
      );
    }

    if (selected.includes("High blood pressure")) {
      return (
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6 h-full space-y-3">
          <div className="flex items-center gap-2 text-teal-800 font-bold text-base">
            <ShieldCheck className="h-5 w-5 text-teal-600 shrink-0" />
            <span>Blood Pressure Management</span>
          </div>
          <p className="text-sm text-teal-950 leading-relaxed">
            Hypertension is frequently silent, presenting with few to no symptoms unless blood pressure is highly elevated.
          </p>
          <p className="text-xs text-teal-850 font-medium leading-relaxed bg-white/50 p-3 rounded-xl border border-teal-100">
            Reduce dietary sodium intake, track readings, avoid tobacco use, and discuss results with your cardiologist or practitioner.
          </p>
        </div>
      );
    }

    return (
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 h-full space-y-3">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
          <Heart className="h-5 w-5 text-teal-600 shrink-0" />
          <span>General Care Advice</span>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">
          You selected: <span className="font-semibold text-slate-900">{selected.join(", ")}</span>.
        </p>
        <p className="text-xs text-slate-500 leading-relaxed mt-2">
          Rest, balanced nutrition, and safe fluid hydration can assist recovering from mild fatigue, but worsening symptoms, dizziness, or lingering sickness should always be evaluated by a medical physician.
        </p>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
      <div>
        <h4 className="font-sans font-bold text-lg text-slate-900 leading-tight">Symptom Awareness Check</h4>
        <p className="text-xs text-slate-500 mt-1">Select all active signs to view safety guidance. This is not a diagnosis tool.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Checkbox grid */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {symptomList.map((symptom, idx) => {
              const isChecked = selected.includes(symptom);
              return (
                <label
                  key={idx}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-xs font-semibold select-none cursor-pointer transition duration-200 ${
                    isChecked
                      ? "bg-teal-50/50 border-teal-300 text-teal-950 shadow-sm"
                      : "bg-white border-slate-100 hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggle(symptom)}
                    className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500/20"
                  />
                  <span>{symptom}</span>
                </label>
              );
            })}
          </div>

          {selected.length > 0 && (
            <button
              onClick={handleClear}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 underline"
            >
              Clear selections
            </button>
          )}
        </div>

        {/* Guidance Outcome */}
        <div className="flex flex-col justify-stretch">{renderGuidance()}</div>
      </div>
    </div>
  );
};
export default SymptomChecker;
