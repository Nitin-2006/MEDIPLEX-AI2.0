import React, { useState } from "react";
import { PlusCircle, CheckCircle2, ShieldAlert, Sparkles, BookOpen } from "lucide-react";
import { DbUser } from "../types.ts";

interface AdminModuleProps {
  dbUser: DbUser | null;
  getAuthToken: () => Promise<string | null>;
  onDiseaseAdded: () => void;
}

export const AdminModule: React.FC<AdminModuleProps> = ({ dbUser, getAuthToken, onDiseaseAdded }) => {
  const [name, setName] = useState("");
  const [overview, setOverview] = useState("");
  const [aliasesInput, setAliasesInput] = useState("");
  const [symptomsInput, setSymptomsInput] = useState("");
  const [preventionInput, setPreventionInput] = useState("");
  const [warning, setWarning] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !overview.trim()) return;

    setIsSubmitting(true);
    setError(null);
    setSubmitSuccess(false);

    // Parse comma-separated inputs
    const aliases = aliasesInput
      .split(",")
      .map(item => item.trim().toLowerCase())
      .filter(Boolean);

    if (!aliases.includes(name.toLowerCase())) {
      aliases.push(name.toLowerCase());
    }

    const symptoms = symptomsInput
      .split(",")
      .map(item => item.trim())
      .filter(Boolean);

    const prevention = preventionInput
      .split(",")
      .map(item => item.trim())
      .filter(Boolean);

    try {
      const token = await getAuthToken();
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("/api/diseases", {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: name.trim(),
          overview: overview.trim(),
          aliases,
          symptoms: symptoms.length > 0 ? symptoms : ["Details managed by admin"],
          prevention: prevention.length > 0 ? prevention : ["Consult a health practitioner"],
          warning: warning.trim() || "Consult a qualified healthcare professional for formal diagnosis and treatment advice.",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add custom disease topic.");
      }

      setSubmitSuccess(true);
      setName("");
      setOverview("");
      setAliasesInput("");
      setSymptomsInput("");
      setPreventionInput("");
      setWarning("");
      
      onDiseaseAdded(); // Trigger refresh on other panels!
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h4 className="font-sans font-bold text-lg text-slate-900 leading-tight">Admin Content Module</h4>
          <p className="text-xs text-slate-500 mt-1">Register custom public health awareness profiles inside the Cloud SQL database.</p>
        </div>
        <div className="bg-teal-50 text-teal-700 p-2 rounded-xl border border-teal-100">
          <Sparkles className="h-4 w-4" />
        </div>
      </div>

      {!dbUser ? (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 text-center">
          <BookOpen className="h-7 w-7 text-slate-400 mx-auto mb-2" />
          <h5 className="font-bold text-slate-700 text-sm">Authentication Required</h5>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Please connect your Google account to authorize administrative submissions to the health awareness database.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {submitSuccess && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-0.5">Disease Profile Registered</p>
                <p className="text-xs text-emerald-700">The disease topic was successfully saved to Cloud SQL and loaded into the chatbot context.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-800 p-3.5 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Disease / Condition Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Dengue Fever"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition duration-150"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Search Aliases / Tags (comma-separated)</label>
              <input
                type="text"
                value={aliasesInput}
                onChange={(e) => setAliasesInput(e.target.value)}
                placeholder="e.g., mosquito, fever, platelet"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition duration-150"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Condition Overview</label>
            <textarea
              required
              rows={3}
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              placeholder="Describe the condition, causes, and primary public health impact..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition duration-150"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Common Symptoms (comma-separated)</label>
              <input
                type="text"
                value={symptomsInput}
                onChange={(e) => setSymptomsInput(e.target.value)}
                placeholder="e.g., High fever, Joint pain, Rash"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition duration-150"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Prevention Tips (comma-separated)</label>
              <input
                type="text"
                value={preventionInput}
                onChange={(e) => setPreventionInput(e.target.value)}
                placeholder="e.g., Use mosquito nets, Remove standing water"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition duration-150"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Critical Warnings / Red Flags</label>
            <input
              type="text"
              required
              value={warning}
              onChange={(e) => setWarning(e.target.value)}
              placeholder="e.g., Seek urgent care for severe abdominal pain or persistent vomiting."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition duration-150"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center space-x-2 shadow-md shadow-slate-900/10 cursor-pointer disabled:opacity-50"
          >
            <PlusCircle className="h-4 w-4 text-teal-400" />
            <span>{isSubmitting ? "Saving to SQL..." : "Register Disease Topic"}</span>
          </button>
        </form>
      )}
    </div>
  );
};
export default AdminModule;
