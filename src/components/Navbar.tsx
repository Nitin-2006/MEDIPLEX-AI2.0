import React from "react";
import { LogIn, LogOut, User, Menu, Home, MessageSquare, BookOpen, CheckSquare, Pill, HelpCircle } from "lucide-react";
import { DbUser } from "../types.ts";

interface NavbarProps {
  dbUser: DbUser | null;
  onLogin: () => void;
  onLogout: () => void;
  isLoading: boolean;
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  dbUser,
  onLogin,
  onLogout,
  isLoading,
  activeTab,
  setActiveTab,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleMobileNavClick = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo left */}
        <div 
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => {
            setActiveTab("home");
          }}
        >
          <div className="bg-[#0b4e72] text-white p-2 rounded-lg shadow-md flex items-center justify-center font-bold text-lg w-9 h-9">
            +
          </div>
          <div>
            <h1 className="font-display font-extrabold text-lg text-slate-900 tracking-tight leading-none mb-0.5">
              MediPlex <span className="text-[#0b4e72]">AI</span>
            </h1>
            <p className="font-sans text-[9px] text-slate-400 uppercase tracking-widest font-extrabold">
              Public Health Intelligence
            </p>
          </div>
        </div>

        {/* Center Links */}
        <div className="hidden lg:flex items-center space-x-6 text-sm font-semibold text-slate-600">
          <button
            onClick={() => {
              setActiveTab("home");
            }}
            className={`transition flex items-center gap-1 cursor-pointer ${
              activeTab === "home" ? "text-[#0b4e72] font-bold" : "hover:text-[#0b4e72]"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => {
              setActiveTab("home");
              setTimeout(() => {
                const el = document.getElementById("home-menu-header");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className="hover:text-[#0b4e72] transition flex items-center gap-1 cursor-pointer"
          >
            Menu
          </button>
          <button
            onClick={() => setActiveTab("chatbot")}
            className={`transition flex items-center gap-1 cursor-pointer ${
              activeTab === "chatbot" ? "text-[#0b4e72] font-bold" : "hover:text-[#0b4e72]"
            }`}
          >
            Chatbot
          </button>
          <button
            onClick={() => setActiveTab("diseases")}
            className={`transition flex items-center gap-1 cursor-pointer ${
              activeTab === "diseases" ? "text-[#0b4e72] font-bold" : "hover:text-[#0b4e72]"
            }`}
          >
            Diseases
          </button>
          <button
            onClick={() => setActiveTab("symptoms")}
            className={`transition flex items-center gap-1 cursor-pointer ${
              activeTab === "symptoms" ? "text-[#0b4e72] font-bold" : "hover:text-[#0b4e72]"
            }`}
          >
            Symptoms
          </button>
          <button
            onClick={() => setActiveTab("medicines")}
            className={`transition flex items-center gap-1 cursor-pointer ${
              activeTab === "medicines" ? "text-[#0b4e72] font-bold" : "hover:text-[#0b4e72]"
            }`}
          >
            Medicine Info
          </button>
          <button
            onClick={() => setActiveTab("support")}
            className={`transition flex items-center gap-1 cursor-pointer ${
              activeTab === "support" ? "text-[#0b4e72] font-bold" : "hover:text-[#0b4e72]"
            }`}
          >
            Support
          </button>
        </div>

        {/* Auth section right & Mobile Menu Trigger */}
        <div className="flex items-center space-x-3">
          {isLoading ? (
            <div className="animate-pulse bg-slate-100 h-9 w-24 rounded-lg" />
          ) : dbUser ? (
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2 bg-slate-50 border border-slate-100 rounded-lg py-1.5 px-3">
                <User className="h-4 w-4 text-[#0b4e72]" />
                <span className="text-xs font-semibold text-slate-700">Hi, {dbUser.name}</span>
                {dbUser.role === "admin" && (
                  <span className="bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    Admin
                  </span>
                )}
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-1 text-slate-500 hover:text-slate-800 text-xs font-bold py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition duration-200"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={onLogin}
                className="border border-[#0b4e72] text-[#0b4e72] hover:bg-slate-50 text-xs font-bold py-2 px-3 rounded-lg transition duration-200"
              >
                Login
              </button>
              <button
                onClick={onLogin}
                className="hidden sm:block bg-[#0b4e72] hover:bg-[#083b57] text-white text-xs font-bold py-2 px-4 rounded-lg transition duration-200 shadow-sm"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile hamburger menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-[#0b4e72] hover:bg-slate-100/60 rounded-xl transition cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile navigation panel */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 mt-4 pt-3 pb-2 space-y-1 animate-in slide-in-from-top-4 duration-200">
          <button
            onClick={() => handleMobileNavClick("home")}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition cursor-pointer ${
              activeTab === "home" ? "bg-[#0b4e72]/10 text-[#0b4e72] font-bold" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Home className="h-4 w-4" />
            <span>Home Portal</span>
          </button>
          
          <button
            onClick={() => handleMobileNavClick("chatbot")}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition cursor-pointer ${
              activeTab === "chatbot" ? "bg-[#0b4e72]/10 text-[#0b4e72] font-bold" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>AI Chatbot</span>
          </button>

          <button
            onClick={() => handleMobileNavClick("diseases")}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition cursor-pointer ${
              activeTab === "diseases" ? "bg-[#0b4e72]/10 text-[#0b4e72] font-bold" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Diseases Library</span>
          </button>

          <button
            onClick={() => handleMobileNavClick("symptoms")}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition cursor-pointer ${
              activeTab === "symptoms" ? "bg-[#0b4e72]/10 text-[#0b4e72] font-bold" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <CheckSquare className="h-4 w-4" />
            <span>Symptom Checker</span>
          </button>

          <button
            onClick={() => handleMobileNavClick("medicines")}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition cursor-pointer ${
              activeTab === "medicines" ? "bg-[#0b4e72]/10 text-[#0b4e72] font-bold" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Pill className="h-4 w-4" />
            <span>Medicine Safety</span>
          </button>

          <button
            onClick={() => handleMobileNavClick("support")}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition cursor-pointer ${
              activeTab === "support" ? "bg-[#0b4e72]/10 text-[#0b4e72] font-bold" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <HelpCircle className="h-4 w-4" />
            <span>Support Desk</span>
          </button>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
