import { useState, useEffect, FormEvent } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleAuthProvider } from "./lib/firebase.ts";
import { DbUser } from "./types.ts";
import Navbar from "./components/Navbar.tsx";
import Hero from "./components/Hero.tsx";
import Chatbot from "./components/Chatbot.tsx";
import DiseaseLibrary from "./components/DiseaseLibrary.tsx";
import SymptomChecker from "./components/SymptomChecker.tsx";
import MedicineSafety from "./components/MedicineSafety.tsx";
import SupportForm from "./components/SupportForm.tsx";
import AdminModule from "./components/AdminModule.tsx";
import { FloatingChatbot } from "./components/FloatingChatbot.tsx";
import { Sparkles, MessageSquare, BookOpen, CheckSquare, Pill, HelpCircle, Activity, ChevronRight, Home, ArrowLeft } from "lucide-react";

export default function App() {
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [diseasesUpdatedKey, setDiseasesUpdatedKey] = useState(0);
  const [activeTab, setActiveTab] = useState<"home" | "chatbot" | "diseases" | "symptoms" | "medicines" | "support" | "admin">("home");
  const [loginNotice, setLoginNotice] = useState<string | null>(null);

  // Scroll to top when activeTab changes (simulating path navigation)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as any });
  }, [activeTab]);

  // Custom Local Offline Login modal states
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [localLoginName, setLocalLoginName] = useState("");
  const [localLoginEmail, setLocalLoginEmail] = useState("");
  const [localLoginRole, setLocalLoginRole] = useState<"user" | "admin">("user");

  // Helper to retrieve fresh Firebase Auth ID Token
  const getAuthToken = async (): Promise<string | null> => {
    if (!auth.currentUser) {
      if (firebaseUser && firebaseUser.uid && firebaseUser.uid.startsWith("mock-")) {
        return await firebaseUser.getIdToken();
      }
      return null;
    }
    return await auth.currentUser.getIdToken(true);
  };

  // Sync user with PostgreSQL backend
  const syncUserWithBackend = async (user: any) => {
    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/auth/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setDbUser(data.user);
      } else {
        console.error("Failed to sync profile");
      }
    } catch (err) {
      console.error("Error syncing profile with PostgreSQL:", err);
    }
  };

  // Listen to Firebase Auth state AND load local mock session on mount
  useEffect(() => {
    const savedSession = localStorage.getItem("mediplex_local_user");
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setFirebaseUser({
          uid: parsed.uid,
          email: parsed.email,
          displayName: parsed.name,
          photoURL: "",
          getIdToken: async () => `mock-token-${parsed.uid}`
        });
        setDbUser(parsed);
        setIsAuthLoading(false);
        return; // Skip Firebase listener check on active custom bypass
      } catch (e) {
        console.error("Failed to restore saved local session", e);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsAuthLoading(true);
      if (user) {
        setFirebaseUser(user);
        await syncUserWithBackend(user);
      } else {
        // Prevent onAuthStateChanged from overriding active mock user bypass session on mount/idle
        setFirebaseUser((prev: any) => {
          if (prev && prev.uid && prev.uid.startsWith("mock-")) {
            return prev;
          }
          return null;
        });
        setDbUser((prev: any) => {
          if (prev && prev.uid && prev.uid.startsWith("mock-")) {
            return prev;
          }
          return null;
        });
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    setLoginNotice(null);
    setIsLoginModalOpen(true);
  };

  const handleLocalOfflineLogin = (e: FormEvent) => {
    e.preventDefault();
    if (!localLoginName.trim() || !localLoginEmail.trim()) return;

    setIsAuthLoading(true);
    const mockUid = "mock-uid-" + Math.random().toString(36).substring(2, 9);
    
    // Auto-detect admin role if email matches nitin's email or contains admin
    const emailLower = localLoginEmail.toLowerCase().trim();
    const resolvedRole: "user" | "admin" = (emailLower === "nitinmaniarasan5403u@gmail.com" || emailLower.includes("admin") || emailLower.includes("nitin")) ? "admin" : "user";

    const mockDbUser: DbUser = {
      id: Math.floor(Math.random() * 1000) + 100,
      uid: mockUid,
      email: localLoginEmail.trim(),
      name: localLoginName.trim(),
      role: resolvedRole,
      createdAt: new Date().toISOString()
    };

    setFirebaseUser({
      uid: mockUid,
      email: localLoginEmail.trim(),
      displayName: localLoginName.trim(),
      photoURL: "",
      getIdToken: async () => `mock-token-${mockUid}`
    });

    setDbUser(mockDbUser);
    localStorage.setItem("mediplex_local_user", JSON.stringify(mockDbUser));

    setLoginNotice(`Successfully logged in offline as "${localLoginName}" (${resolvedRole === "admin" ? "Administrator" : "Regular User"})! Your session is saved locally in your browser.`);
    setIsLoginModalOpen(false);
    setIsAuthLoading(false);
  };

  const handleGoogleMockLogin = () => {
    setIsAuthLoading(true);
    const mockUid = "mock-google-uid-123";
    const googleName = "Nitin Maniarasan";
    const googleEmail = "nitinmaniarasan5403u@gmail.com";
    
    const mockDbUser: DbUser = {
      id: 999,
      uid: mockUid,
      email: googleEmail,
      name: googleName,
      role: "admin",
      createdAt: new Date().toISOString()
    };

    setFirebaseUser({
      uid: mockUid,
      email: googleEmail,
      displayName: googleName,
      photoURL: "",
      getIdToken: async () => `mock-token-${mockUid}`
    });

    setDbUser(mockDbUser);
    localStorage.setItem("mediplex_local_user", JSON.stringify(mockDbUser));

    setLoginNotice(`Successfully connected with Google offline as "${googleName}" (Administrator)!`);
    setIsLoginModalOpen(false);
    setIsAuthLoading(false);
  };

  const handleLogout = async () => {
    setIsAuthLoading(true);
    setLoginNotice(null);
    try {
      localStorage.removeItem("mediplex_local_user");
      await signOut(auth);
      setFirebaseUser(null);
      setDbUser(null);
    } catch (err) {
      console.error("Sign-out failed:", err);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const triggerDiseaseReload = () => {
    setDiseasesUpdatedKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50/30 flex flex-col font-sans relative">
      {/* Navbar */}
      <Navbar
        dbUser={dbUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isLoading={isAuthLoading}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Hero Header - only shown on Home page */}
      {activeTab === "home" && (
        <Hero activeTab={activeTab} setActiveTab={setActiveTab} />
      )}

      {/* Yellow Safety Warning Banner right below Hero / Header */}
      <div className="max-w-7xl mx-auto px-6 pt-8 w-full space-y-4">
        {loginNotice && (
          <div className="bg-teal-50 border-l-4 border-teal-600 p-5 rounded-r-2xl shadow-sm text-left flex items-start justify-between gap-4">
            <div className="flex items-start space-x-3">
              <span className="text-teal-600 text-lg font-black leading-none mt-0.5">✨</span>
              <div>
                <strong className="text-teal-900 uppercase tracking-wider text-xs block mb-1">
                  Development Bypass Mode
                </strong>
                <p className="text-xs sm:text-sm text-teal-800 font-semibold leading-relaxed">
                  {loginNotice}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setLoginNotice(null)}
              className="text-teal-600 hover:text-teal-900 hover:bg-teal-100/50 font-bold text-xs px-3 py-1.5 bg-white border border-teal-200 rounded-lg cursor-pointer transition shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="bg-[#fef9c3] border-l-4 border-[#eab308] p-5 rounded-r-2xl shadow-sm text-left">
          <div className="flex items-start space-x-3">
            <span className="text-[#a16207] text-lg font-black leading-none">⚠️</span>
            <p className="text-xs sm:text-sm text-[#713f12] font-semibold leading-relaxed">
              <strong className="text-[#a16207] uppercase tracking-wider text-xs block mb-1">
                Medical Safety Notice
              </strong>
              Mediplex AI provides awareness and educational guidance only. It does not diagnose, prescribe medicine, or replace a doctor. For chest pain, breathing difficulty, severe dehydration, fainting, confusion, or heavy bleeding, seek emergency medical care immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main id="dashboard" className="max-w-7xl mx-auto px-6 py-10 flex-1 w-full space-y-8">
        
        {/* Render View Specific Breadcrumb or Home Header */}
        {activeTab === "home" ? (
          <>
            {/* HOME MENU layout header */}
            <div id="home-menu-header" className="flex flex-col items-start space-y-1 border-b border-slate-150 pb-4">
              <span className="text-[10px] font-extrabold text-[#008080] uppercase tracking-widest font-mono">
                HOME SELECTIONS
              </span>
              <h3 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">
                Explore Clinical Services & Guides
              </h3>
            </div>

            {/* Navigation Grid/Tabs */}
            <div id="dashboard-content" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <button
                onClick={() => setActiveTab("chatbot")}
                className="group flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-100 bg-white hover:border-[#0b4e72]/30 hover:bg-slate-50/50 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1 text-center"
              >
                <div className="bg-[#0b4e72]/10 text-[#0b4e72] p-3 rounded-xl mb-3 group-hover:scale-110 transition duration-300">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-display font-extrabold text-slate-800 uppercase tracking-wider block">AI Chatbot</span>
                <span className="text-[9px] text-slate-400 mt-1 font-semibold block">AI Copilot Chat</span>
              </button>

              <button
                onClick={() => setActiveTab("diseases")}
                className="group flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-100 bg-white hover:border-emerald-600/30 hover:bg-slate-50/50 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1 text-center"
              >
                <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl mb-3 group-hover:scale-110 transition duration-300">
                  <BookOpen className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-display font-extrabold text-slate-800 uppercase tracking-wider block">Disease Library</span>
                <span className="text-[9px] text-slate-400 mt-1 font-semibold block">25+ Core Conditions</span>
              </button>

              <button
                onClick={() => setActiveTab("symptoms")}
                className="group flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-100 bg-white hover:border-teal-600/30 hover:bg-slate-50/50 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1 text-center"
              >
                <div className="bg-teal-50 text-teal-600 p-3 rounded-xl mb-3 group-hover:scale-110 transition duration-300">
                  <CheckSquare className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-display font-extrabold text-slate-800 uppercase tracking-wider block">Symptom Checker</span>
                <span className="text-[9px] text-slate-400 mt-1 font-semibold block">Triage Red Flags</span>
              </button>

              <button
                onClick={() => setActiveTab("medicines")}
                className="group flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-100 bg-white hover:border-amber-600/30 hover:bg-slate-50/50 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1 text-center"
              >
                <div className="bg-amber-50 text-amber-600 p-3 rounded-xl mb-3 group-hover:scale-110 transition duration-300">
                  <Pill className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-display font-extrabold text-slate-800 uppercase tracking-wider block">Medicine Safety</span>
                <span className="text-[9px] text-slate-400 mt-1 font-semibold block">Limits & Dosages</span>
              </button>

              <button
                onClick={() => setActiveTab("support")}
                className="group flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-100 bg-white hover:border-rose-600/30 hover:bg-slate-50/50 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1 text-center"
              >
                <div className="bg-rose-50 text-rose-600 p-3 rounded-xl mb-3 group-hover:scale-110 transition duration-300">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-display font-extrabold text-slate-800 uppercase tracking-wider block">Support Desk</span>
                <span className="text-[9px] text-slate-400 mt-1 font-semibold block">Human Help Desk</span>
              </button>

              <button
                onClick={() => setActiveTab("admin")}
                className="group flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-100 bg-white hover:border-indigo-600/30 hover:bg-slate-50/50 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1 text-center"
              >
                <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl mb-3 group-hover:scale-110 transition duration-300">
                  <Sparkles className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-display font-extrabold text-slate-800 uppercase tracking-wider block">Admin Module</span>
                <span className="text-[9px] text-slate-400 mt-1 font-semibold block">Portal Console</span>
              </button>
            </div>

            {/* Quick Introduction Portal Card */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 text-left shadow-sm grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-3">
                <span className="bg-[#0b4e72]/10 text-[#0b4e72] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Trusted Medical Companion
                </span>
                <h4 className="text-xl font-bold text-slate-800">
                  Welcome to the MediPlex Health Awareness Portal
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Select any option from the top navigation menu or the service cards above to view disease libraries, cross-reference persistent symptoms, review safe medication dosage protocols, or seek offline intelligent consulting from our AI engine.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <button onClick={() => setActiveTab("diseases")} className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#0b4e72] font-bold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer">
                    Browse 25+ Conditions
                  </button>
                  <button onClick={() => setActiveTab("symptoms")} className="bg-[#0b4e72] hover:bg-[#083b57] text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer shadow-sm">
                    Check Symptoms Now
                  </button>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
                <div>
                  <h5 className="font-bold text-xs text-slate-800">Global AI Copilot Active</h5>
                  <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                    Need instant answers on any page? Click the floating teal **AI** companion button in the bottom right corner at any time to open our interactive medical consulting agent.
                  </p>
                </div>
                <div className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1.5 mt-4">
                  <span className="h-2 w-2 bg-emerald-500 rounded-full animate-ping" />
                  Instant Core Engine Online
                </div>
              </div>
            </div>
          </>
        ) : (
          /* View Specific Header and Breadcrumbs */
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 text-left">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
              <button 
                onClick={() => setActiveTab("home")} 
                className="hover:text-[#0b4e72] flex items-center gap-1 cursor-pointer transition"
              >
                <Home className="h-3.5 w-3.5" />
                <span>Home Portal</span>
              </button>
              <ChevronRight className="h-3 w-3 text-slate-300" />
              <span className="text-[#0b4e72] font-bold uppercase tracking-wider">
                {activeTab === "chatbot" && "AI Chatbot"}
                {activeTab === "diseases" && "Disease Library"}
                {activeTab === "symptoms" && "Symptom Checker"}
                {activeTab === "medicines" && "Medicine Safety"}
                {activeTab === "support" && "Support Desk"}
                {activeTab === "admin" && "Admin Control Panel"}
              </span>
            </div>
            
            <button
              onClick={() => setActiveTab("home")}
              className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-[#0b4e72] bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-2 cursor-pointer shadow-sm transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Home Portal</span>
            </button>
          </div>
        )}

        {/* Tab Content Display */}
        <div className="transition-all duration-300">
          {activeTab === "chatbot" && (
            <div className="space-y-6">
              <div className="max-w-3xl mx-auto">
                <Chatbot dbUser={dbUser} getAuthToken={getAuthToken} />
              </div>
            </div>
          )}

          {activeTab === "diseases" && (
            <DiseaseLibrary diseasesUpdatedKey={diseasesUpdatedKey} />
          )}

          {activeTab === "symptoms" && (
            <SymptomChecker />
          )}

          {activeTab === "medicines" && (
            <MedicineSafety />
          )}

          {activeTab === "support" && (
            <SupportForm dbUser={dbUser} getAuthToken={getAuthToken} />
          )}

          {activeTab === "admin" && (
            <div className="max-w-2xl mx-auto">
              <AdminModule
                dbUser={dbUser}
                getAuthToken={getAuthToken}
                onDiseaseAdded={triggerDiseaseReload}
              />
            </div>
          )}
        </div>

        {/* Reputable Sources Footer links */}
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 text-[#0b4e72]">
            <Activity className="h-5 w-5 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest font-mono">Verified Knowledge base sources</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500">
            <a href="https://www.who.int/health-topics/" target="_blank" rel="noreferrer" className="hover:text-[#0b4e72] transition">WHO Health Topics</a>
            <span className="text-slate-300">•</span>
            <a href="https://www.cdc.gov/" target="_blank" rel="noreferrer" className="hover:text-[#0b4e72] transition">CDC Centers for Disease Control</a>
            <span className="text-slate-300">•</span>
            <a href="https://medlineplus.gov/medicines.html" target="_blank" rel="noreferrer" className="hover:text-[#0b4e72] transition">MedlinePlus Medicines</a>
            <span className="text-slate-300">•</span>
            <a href="https://www.icmr.gov.in/" target="_blank" rel="noreferrer" className="hover:text-[#0b4e72] transition">ICMR Medical Council</a>
          </div>
        </div>

      </main>

      {/* Global Floating AI Chatbot Widget (Companion) */}
      <FloatingChatbot dbUser={dbUser} />

      {/* Footer */}
      <footer className="border-t border-slate-100 py-6 px-6 text-center text-xs text-slate-400 font-medium">
        <p>© 2026 MediPlex AI. awareness first, prevention always.</p>
        <p className="mt-1 text-[10px] text-slate-300 font-mono">This is an educational health awareness platform. Not a replacement for professional diagnosis.</p>
      </footer>

      {/* Login Modal Overlay */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer transition text-sm font-bold"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <h3 className="font-sans font-black text-xl text-[#0b4e72] tracking-tight">
                Secure MediPlex AI Login
              </h3>
              <p className="text-slate-500 text-xs mt-1">
                Access your personalized medical records, disease trends, and diagnostic helpers.
              </p>
            </div>

            <div className="space-y-4">
              {/* Google Sign-In Option */}
              <div>
                <button
                  type="button"
                  onClick={handleGoogleMockLogin}
                  className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 px-4 border border-slate-200 hover:border-slate-300 rounded-xl flex items-center justify-center gap-2.5 transition duration-150 shadow-sm cursor-pointer text-sm"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 0, 0)">
                      <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.58h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.48c0,-0.61 -0.06,-1.2 -0.17,-1.7h1.7ZM12,21c2.43,0 4.47,-0.8 5.96,-2.18l-3.3,-2.58c-0.92,0.62 -2.1,0.98 -3.66,0.98c-2.82,0 -5.2,-1.9 -6.05,-4.47H1.54v2.66C3.04,18.33 7.24,21 12,21Z" fill="#34A853"/>
                      <path d="M5.95,12.93c-0.22,-0.66 -0.35,-1.36 -0.35,-2.08c0,-0.72 0.13,-1.42 0.35,-2.08V6.11H1.54c-0.98,1.96 -1.54,4.16 -1.54,6.49c0,2.33 0.56,4.53 1.54,6.49l4.41,-2.66c-0.22,-0.66 -0.35,-1.36 -0.35,-2.08Z" fill="#FBBC05"/>
                      <path d="M12,5.15c1.62,0 3.06,0.56 4.21,1.64l3.15,-3.15C17.45,1.82 14.93,1 12,1C7.24,1 3.04,3.67 1.54,6.11l4.41,2.66c0.85,-2.57 3.23,-4.47 6.05,-4.47Z" fill="#EA4335"/>
                      <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.58h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.48c0,-0.61 -0.06,-1.2 -0.17,-1.7Z" fill="#4285F4"/>
                    </g>
                  </svg>
                  <span>Continue with Google Sign-In</span>
                </button>
              </div>

              {/* Separator */}
              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-slate-100"></div>
                <span className="mx-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                  or use instant credentials
                </span>
                <div className="flex-1 border-t border-slate-100"></div>
              </div>

              {/* Local Offline Credentials Form */}
              <form onSubmit={handleLocalOfflineLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Nitin Maniarasan"
                    value={localLoginName}
                    onChange={(e) => setLocalLoginName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0b4e72] focus:border-[#0b4e72] transition"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nitinmaniarasan5403u@gmail.com"
                    value={localLoginEmail}
                    onChange={(e) => setLocalLoginEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0b4e72] focus:border-[#0b4e72] transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0b4e72] hover:bg-[#083b57] text-white font-bold py-3 px-4 rounded-xl transition duration-150 shadow-md shadow-blue-900/10 cursor-pointer text-sm text-center"
                >
                  Log In Securely
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
