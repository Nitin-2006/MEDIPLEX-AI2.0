import React from "react";
import { MessageSquare, BookOpen, CheckSquare, Pill, HelpCircle, Activity } from "lucide-react";

interface HeroProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

export const Hero: React.FC<HeroProps> = ({ activeTab, setActiveTab }) => {
  const scrollToDashboard = () => {
    const el = document.getElementById("dashboard-content");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
    setTimeout(scrollToDashboard, 100);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#eaf4f7]/70 via-white to-white py-16 px-6 md:px-12 border-b border-slate-100">
      {/* Dynamic blurred glow background assets */}
      <div className="absolute top-0 right-0 -z-10 translate-x-1/3 -translate-y-1/3 bg-teal-100/30 blur-3xl rounded-full h-96 w-96" />
      <div className="absolute top-1/2 left-0 -z-10 -translate-x-1/3 bg-blue-100/20 blur-3xl rounded-full h-96 w-96" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-1.5 bg-teal-50 border border-teal-100/50 rounded-full py-1 px-3">
            <span className="h-1.5 w-1.5 bg-[#008080] rounded-full animate-ping" />
            <span className="text-[10px] font-extrabold text-[#008080] uppercase tracking-wider font-mono">
              AI DRIVEN PUBLIC HEALTH AWARENESS
            </span>
          </div>

          <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-slate-900 tracking-tight leading-tight">
            MediPlex AI <span className="bg-gradient-to-r from-[#0b4e72] to-[#008080] bg-clip-text text-transparent">Health Intelligence</span> portal for disease awareness.
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
            A premium public health awareness database designed to help you understand common diseases, preventive guidelines, symptom red flags, and safe medication limits.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => {
                const el = document.getElementById("home-menu-header");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-[#0b4e72] hover:bg-[#083b57] text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-md transition duration-200 cursor-pointer"
            >
              View Services
            </button>
            <button
              onClick={() => handleTabClick("chatbot")}
              className="border border-slate-200 hover:border-[#0b4e72] text-[#0b4e72] hover:bg-slate-50 font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl transition duration-200 cursor-pointer"
            >
              Start Chat
            </button>
          </div>

          {/* Metric / Value Props Cards */}
          <div className="grid grid-cols-3 gap-4 pt-6 max-w-lg">
            <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm hover:shadow-md transition">
              <span className="block font-display font-black text-xl sm:text-2xl text-slate-800 leading-none mb-1">
                25+
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Diseases
              </span>
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm hover:shadow-md transition">
              <span className="block font-display font-black text-xl sm:text-2xl text-slate-800 leading-none mb-1">
                24/7
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                AI Copilot
              </span>
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm hover:shadow-md transition">
              <span className="block font-display font-black text-xl sm:text-2xl text-[#008080] leading-none mb-1">
                Safe
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Guidelines
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (Interactive Health Portal Mock Widget) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-[420px] bg-gradient-to-tr from-[#f3f9f9] to-[#eaf2f5] p-6 rounded-3xl border border-white/60 shadow-xl shadow-slate-100/50 relative overflow-hidden">
            {/* Health Risk Monitor Top Widget */}
            <div className="bg-white/90 backdrop-blur-sm border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center gap-3.5 mb-6">
              <div className="relative flex h-3.5 w-3.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
              </div>
              <div>
                <h4 className="font-sans font-bold text-slate-800 text-xs">
                  Health Risk Monitor
                </h4>
                <p className="text-[10px] text-slate-500 font-medium">
                  Awareness, prevention, triage alerts, support
                </p>
              </div>
            </div>

            {/* Shield Center Graphic Box */}
            <div className="flex justify-center my-6 relative">
              <div className="w-24 h-24 bg-[#0a667b] rounded-t-xl rounded-b-[45%] flex items-center justify-center shadow-lg relative border-4 border-white/40">
                <span className="text-white text-4xl font-extrabold leading-none">+</span>
              </div>
            </div>

            {/* Quick Navigation 2x2 Grid */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => handleTabClick("symptoms")}
                className="bg-white hover:bg-slate-50 p-4 rounded-xl shadow-sm border-t-4 border-t-[#008080] border-x border-b border-slate-100 text-left transition duration-200 cursor-pointer group"
              >
                <span className="block text-xs font-bold text-slate-800 group-hover:text-[#0b4e72]">
                  Symptoms
                </span>
                <span className="text-[9px] text-slate-400 mt-0.5 block font-medium">
                  Interactive checker
                </span>
              </button>

              <button
                onClick={() => handleTabClick("diseases")}
                className="bg-white hover:bg-slate-50 p-4 rounded-xl shadow-sm border-t-4 border-t-[#22c55e] border-x border-b border-slate-100 text-left transition duration-200 cursor-pointer group"
              >
                <span className="block text-xs font-bold text-slate-800 group-hover:text-[#0b4e72]">
                  Prevention
                </span>
                <span className="text-[9px] text-slate-400 mt-0.5 block font-medium">
                  Disease guidelines
                </span>
              </button>

              <button
                onClick={() => handleTabClick("medicines")}
                className="bg-white hover:bg-slate-50 p-4 rounded-xl shadow-sm border-t-4 border-t-[#eab308] border-x border-b border-slate-100 text-left transition duration-200 cursor-pointer group"
              >
                <span className="block text-xs font-bold text-slate-800 group-hover:text-[#0b4e72]">
                  Medicine Safety
                </span>
                <span className="text-[9px] text-slate-400 mt-0.5 block font-medium">
                  Dosages & limits
                </span>
              </button>

              <button
                onClick={() => handleTabClick("support")}
                className="bg-white hover:bg-slate-50 p-4 rounded-xl shadow-sm border-t-4 border-t-[#ef4444] border-x border-b border-slate-100 text-left transition duration-200 cursor-pointer group"
              >
                <span className="block text-xs font-bold text-slate-800 group-hover:text-[#0b4e72]">
                  Support
                </span>
                <span className="text-[9px] text-slate-400 mt-0.5 block font-medium">
                  Queue & contact
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Hero;
