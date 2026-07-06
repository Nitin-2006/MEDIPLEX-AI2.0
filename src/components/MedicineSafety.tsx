import React, { useState, useEffect } from "react";
import { Pill, AlertOctagon, Info } from "lucide-react";
import { Medicine } from "../types.ts";

export const MedicineSafety: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await fetch("/api/medicines");
        if (res.ok) {
          const data = await res.json();
          setMedicines(data);
        }
      } catch (err) {
        console.error("Failed to load medicines:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-sans font-bold text-lg text-slate-900 leading-tight">Safe Medicine Guidelines</h4>
        <p className="text-xs text-slate-500 mt-1">
          Explore educational notes and strict safety limits. Under no circumstances is this professional advice or a prescription.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-slate-50 border border-slate-100 rounded-2xl h-44" />
          ))}
        </div>
      ) : medicines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicines.map((m) => (
            <article
              key={m.id}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-teal-700">
                  <div className="bg-teal-50 p-2 rounded-xl border border-teal-100">
                    <Pill className="h-4.5 w-4.5 text-teal-600" />
                  </div>
                  <h5 className="font-bold text-sm text-slate-900 tracking-tight">{m.name}</h5>
                </div>

                <div>
                  <h6 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Common Use</h6>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{m.use}</p>
                </div>
              </div>

              <div className="bg-rose-50/50 border border-rose-100/50 rounded-xl p-3 mt-4 flex gap-2">
                <AlertOctagon className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h6 className="font-bold text-[10px] text-rose-950 uppercase tracking-wider mb-0.5">Safety Warning</h6>
                  <p className="text-[11px] text-rose-800 leading-relaxed font-medium">{m.safety}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-10 text-center">
          <Info className="h-8 w-8 text-slate-400 mx-auto mb-3" />
          <h4 className="font-bold text-slate-800 text-sm">No medicine guides found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Make sure the database seed script was executed successfully.</p>
        </div>
      )}
    </div>
  );
};
export default MedicineSafety;
