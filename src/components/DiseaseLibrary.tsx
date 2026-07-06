import React, { useState, useEffect } from "react";
import { Search, Info, ShieldAlert, Sparkles } from "lucide-react";
import { Disease } from "../types.ts";
import { STATIC_DISEASES } from "../data/diseases.ts";

interface DiseaseLibraryProps {
  diseasesUpdatedKey: number; // Trigger reload when admin submits a new disease
}

export const DiseaseLibrary: React.FC<DiseaseLibraryProps> = ({ diseasesUpdatedKey }) => {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDiseases = async () => {
      setIsLoading(true);
      let success = false;
      try {
        const queryParam = search ? `?search=${encodeURIComponent(search)}` : "";
        const res = await fetch(`/api/diseases${queryParam}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setDiseases(data);
            success = true;
          }
        }
      } catch (err) {
        console.warn("API `/api/diseases` failed or database is disconnected. Using offline static disease database:", err);
      } finally {
        // If the server failed or has no items, perform client-side filtering on our static database
        if (!success) {
          const searchLower = search.toLowerCase().trim();
          if (!searchLower) {
            setDiseases(STATIC_DISEASES);
          } else {
            const filtered = STATIC_DISEASES.filter((d) => {
              return (
                d.name.toLowerCase().includes(searchLower) ||
                d.overview.toLowerCase().includes(searchLower) ||
                d.aliases.some((alias) => alias.toLowerCase().includes(searchLower)) ||
                d.symptoms.some((s) => s.toLowerCase().includes(searchLower))
              );
            });
            setDiseases(filtered);
          }
        }
        setIsLoading(false);
      }
    };

    fetchDiseases();
  }, [search, diseasesUpdatedKey]);

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-sans font-extrabold text-xl text-slate-900 tracking-tight">Disease Awareness Portal</h3>
          <p className="text-slate-500 text-sm mt-0.5">Explore medical overviews, symptom profiles, and protective protocols.</p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search symptoms, diseases, causes..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition duration-150"
          />
        </div>
      </div>

      {/* Disease Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-slate-50 border border-slate-100 rounded-2xl h-56" />
          ))}
        </div>
      ) : diseases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {diseases.map((d) => (
            <article
              key={d.id}
              className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Title & Badge */}
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-sans font-bold text-lg text-slate-900 leading-tight">
                    {d.name}
                  </h4>
                  {d.isCustom ? (
                    <span className="shrink-0 bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-teal-100">
                      <Sparkles className="h-2.5 w-2.5" />
                      Custom
                    </span>
                  ) : (
                    <span className="shrink-0 bg-slate-50 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-100">
                      Standard
                    </span>
                  )}
                </div>

                {/* Overview */}
                <p className="text-slate-600 text-sm leading-relaxed">{d.overview}</p>

                {/* Symptoms & Prevention split */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-50 pt-4">
                  <div>
                    <h5 className="font-semibold text-xs text-slate-900 mb-2 uppercase tracking-wide">Common Signs</h5>
                    <ul className="space-y-1.5">
                      {d.symptoms.map((s, idx) => (
                        <li key={idx} className="text-xs text-slate-500 flex items-start gap-1.5 leading-relaxed">
                          <span className="text-teal-500 mt-1 shrink-0">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-xs text-slate-900 mb-2 uppercase tracking-wide">Prevention</h5>
                    <ul className="space-y-1.5">
                      {d.prevention.map((p, idx) => (
                        <li key={idx} className="text-xs text-slate-500 flex items-start gap-1.5 leading-relaxed">
                          <span className="text-teal-500 mt-1 shrink-0">•</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Warning panel */}
              <div className="bg-rose-50/70 border border-rose-100/50 rounded-xl p-3.5 mt-5 flex items-start gap-2.5">
                <ShieldAlert className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />
                <div>
                  <h6 className="font-bold text-[11px] text-rose-950 uppercase tracking-wider mb-0.5">Critical Red Flags</h6>
                  <p className="text-xs text-rose-800 leading-relaxed font-medium">{d.warning}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-10 text-center">
          <Info className="h-8 w-8 text-slate-400 mx-auto mb-3" />
          <h4 className="font-bold text-slate-800 text-sm">No matched diseases found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Try typing another query or keyword, such as dengue, malaria, fever, or sugar.</p>
        </div>
      )}
    </div>
  );
};
export default DiseaseLibrary;
