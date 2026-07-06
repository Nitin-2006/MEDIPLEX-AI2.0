import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Bot, X, Trash2, ShieldAlert } from "lucide-react";
import { ChatMessage, DbUser } from "../types.ts";
import { STATIC_DISEASES } from "../data/diseases.ts";

interface FloatingChatbotProps {
  dbUser: DbUser | null;
}

export const FloatingChatbot: React.FC<FloatingChatbotProps> = ({ dbUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Storage key for companion chat
  const getCompanionStorageKey = () => {
    return `mediplex_companion_chats_${dbUser ? dbUser.uid : "guest"}`;
  };

  // Load chats or set default welcome message
  useEffect(() => {
    const storageKey = getCompanionStorageKey();
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      } catch (e) {
        console.warn("Companion chats load error", e);
      }
    }

    const name = dbUser ? dbUser.name : "Guest";
    setMessages([
      {
        id: 0,
        sender: "bot",
        text: `Hi ${name}! I'm your quick MediPlex AI companion. 

I'm accessible on all pages! Ask me about symptoms, medicine safety, or any of the **25 pre-coded conditions** (like *COVID-19*, *GERD*, *Asthma*, *Anxiety*, etc.).`,
        createdAt: new Date().toISOString()
      }
    ]);
  }, [dbUser]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isThinking]);

  // Handle outside click toggle or escape key (optionally)
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    const storageKey = getCompanionStorageKey();
    localStorage.removeItem(storageKey);
    const name = dbUser ? dbUser.name : "Guest";
    setMessages([
      {
        id: Date.now(),
        sender: "bot",
        text: `Quick chat history cleared. How can I help you today, ${name}?`,
        createdAt: new Date().toISOString()
      }
    ]);
    setShowClearConfirm(false);
  };

  // Smart local offline matching logic (aligned with Chatbot.tsx but optimized for float)
  const getLocalOfflineResponse = (query: string): string => {
    const q = query.toLowerCase().trim();

    // 1. Dynamic Match against any of the 25 static diseases using their name or aliases
    const matchedDisease = STATIC_DISEASES.find(d => {
      const nameMatch = q.includes(d.name.toLowerCase());
      const aliasMatch = d.aliases?.some(alias => q.includes(alias.toLowerCase()));
      return nameMatch || aliasMatch;
    });

    if (matchedDisease) {
      return `### **${matchedDisease.name} - Action Guidelines**\n\n${matchedDisease.overview}\n\n**Key Symptoms:**\n${matchedDisease.symptoms.slice(0, 3).map(s => `- ${s}`).join("\n")}\n\n**Prevention & Safety:**\n${matchedDisease.prevention.slice(0, 3).map(p => `- ${p}`).join("\n")}\n\n⚠️ **WARNING:** ${matchedDisease.warning}`;
    }

    // 2. Specific Symptom General Matches
    if (q.includes("fever") || q.includes("temperature") || q.includes("high temp") || q.includes("hot body")) {
      return `### **Fever Causes & Quick Solutions**\n\nA fever is an elevated body temperature (above 100.4°F/38°C). In our database:\n- **Dengue/Malaria:** Present with cyclical high fevers and severe chills.\n- **Typhoid Fever:** Stepwise high temperature with abdominal pain.\n- **COVID-19 & Flu:** Respiratory viral conditions with sudden fever, dry cough.\n\n**Action Steps:**\n- **Track temperature** with a digital thermometer twice daily.\n- **Stay Hydrated:** Sip Oral Rehydration Salts (ORS) or water constantly.\n- Seek diagnostic screening if fever persists over 48 hours.`;
    }

    if (q.includes("cough") || q.includes("coughing") || q.includes("throat") || q.includes("sore") || q.includes("breath")) {
      return `### **Cough & Respiratory Airway Guidelines**\n\nPersistent coughing or breathing difficulties suggest airway involvement:\n- **COVID-19 & Flu:** Sore throat, congestion, dry cough.\n- **Asthma:** Wheezing sounds, chest tightness.\n- **Tuberculosis (TB):** Chronic cough lasting 3+ weeks, night sweats.\n\n**Quick Guidelines:**\n- Avoid active/passive cigarette smoke, dust, and pollen.\n- Inhale warm steam to soothe passages.\n- For Asthma, keep fast-acting rescue inhalers near.\n- Sputum tests are vital if cough lasts > 2 weeks.`;
    }

    if (q.includes("stomach") || q.includes("cramp") || q.includes("diarrhea") || q.includes("vomit") || q.includes("loose stool") || q.includes("burn") || q.includes("reflux")) {
      return `### **Digestive Health & Hydration Solutions**\n\nStomach irritation, vomiting, or diarrhea can cause rapid dehydration:\n- **Gastroenteritis (Food Poisoning):** Contaminated food, cramps, diarrhea.\n- **Cholera:** Acute 'rice water' stool, rapid extreme dehydration.\n- **GERD & Ulcers:** Heartburn and painful stomach sores.\n\n**Action Steps:**\n- **Aggressive Rehydration:** Drink Oral Rehydration Salts (ORS) or clean water constantly.\n- **BRAT Diet:** Eat Bananas, Rice, Applesauce, and Toast once stable.\n- **Avoid NSAIDs** (like ibuprofen) if ulcers are suspected to prevent lining irritation.`;
    }

    if (q.includes("paracetamol") || q.includes("safety") || q.includes("dosage") || q.includes("dolo") || q.includes("medicine") || q.includes("pill") || q.includes("limit") || q.includes("drug")) {
      return `### **Safe Medicine & Over-The-Counter Guidelines**\n\nHardcoded safety protocols for common over-the-counter pain/fever relief:\n- **Standard Adult Dosage:** 500mg to 650mg of Paracetamol every 4 to 6 hours as needed.\n- **Absolute Max Limit:** Never exceed **4,000mg (4 grams)** of Paracetamol in 24 hours to prevent liver damage.\n- Check labels of cold remedies to avoid double dosing.\n- Avoid alcohol while taking medicine. Always consult a healthcare doctor before starting new drugs.`;
    }

    // 3. New General Related Topics Matches
    if (q.includes("diet") || q.includes("nutrition") || q.includes("food") || q.includes("eat") || q.includes("sugar") || q.includes("salt")) {
      return `### **Diet & Nutrition Guidelines**\n\nA healthy diet controls conditions like Type 2 Diabetes, Hypertension, and Fatty Liver (NAFLD):\n- **Reduce Sodium (Salt):** Aim for under 2,000mg daily to immediately lower blood pressure.\n- **Avoid Refined Sugars:** Stay away from sugary soda and candy to stabilize insulin resistance.\n- **Focus on Fiber:** Eat leafy greens, legumes, whole grains, and lean proteins.\n- **Hydration:** Consume 2.5 to 3 liters of pure water daily.`;
    }

    if (q.includes("sleep") || q.includes("rest") || q.includes("tired") || q.includes("fatigue") || q.includes("insomnia") || q.includes("night")) {
      return `### **Sleep Hygiene & Fatigue Recovery**\n\nExhaustion or Insomnia are key indicators that your body needs sleep restoration:\n- **Consistent Times:** Go to bed and wake up at the exact same times daily.\n- **De-screen:** Turn off phones, tablets, and televisions at least 1 hour before sleep.\n- **Environment:** Keep the room cool, completely dark, and silent.\n- **No Stimulants:** Avoid caffeine, nicotine, or heavy meals within 4-6 hours of bed.`;
    }

    if (q.includes("exercise") || q.includes("fitness") || q.includes("walk") || q.includes("run") || q.includes("gym") || q.includes("workout")) {
      return `### **Physical Activity & Cardio Health**\n\nRegular movement strengthens cardiovascular systems and regulates blood sugar:\n- **Duration:** Try for 150 minutes of moderate-intensity activity (brisk walking, cycling) per week.\n- **Joint Support:** Muscle strengthening cushions joints, managing Osteoarthritis.\n- **Diabetes Management:** Movement increases direct muscle glucose absorption.\n- **Pacing:** Start slow (10-15 mins) and scale up gradually to prevent injury.`;
    }

    if (q.includes("stress") || q.includes("mental") || q.includes("anxiety") || q.includes("depress") || q.includes("panic") || q.includes("sad") || q.includes("worry")) {
      return `### **Mental Wellness & Stress Solutions**\n\nMental health is deeply linked to physical health. Anxiety and Depression are highly manageable:\n- **Mindfulness Breathing:** Inhale 4s, hold 4s, exhale 6s. This lowers heart rates immediately.\n- **Support System:** Connect regularly with supportive friends, family, or counselors.\n- **Limit Stimulants:** Cut down on caffeine and alcohol, as both trigger adrenaline spikes.\n- **Therapy:** Cognitive Behavioral Therapy (CBT) has high clinical success.`;
    }

    if (q.includes("first aid") || q.includes("injury") || q.includes("wound") || q.includes("burn") || q.includes("cut") || q.includes("bleed")) {
      return `### **First Aid & Injury Protocols**\n\nImmediate care for minor wounds prevents infections and speeds up healing:\n- **Cuts/Scrapes:** Wash with cool clean water and mild soap, apply ointment, and bandage.\n- **Minor Burns:** Run cool tap water over the area for 10-15 mins. Cover loosely (do not use ice/butter).\n- **Sprains (RICE):** **R**est, **I**ce, **C**ompression bandage, and **E**levate above heart level.\n- **Severe Bleeding:** Apply firm direct pressure. Seek emergency services immediately if bleeding persists past 10 minutes.`;
    }

    if (q.includes("doctor") || q.includes("clinic") || q.includes("hospital") || q.includes("test") || q.includes("checkup") || q.includes("appointment")) {
      return `### **Clinical Evaluation & Tests**\n\nAlways prioritize checking with a physician for accurate diagnosis:\n- **Annual Screening:** Get a blood panel yearly for cholesterol, HbA1c (sugar), and organ functions.\n- **Acute Duration:** If fever, cough, or severe pain lasts over 48 hours without progress, visit a local clinic.\n- **Medication:** Never adjust, stop, or start prescription medicine without doctor approval.`;
    }

    if (q.includes("solution") || q.includes("treatment") || q.includes("cure") || q.includes("help") || q.includes("prevent")) {
      return `### **General Health Solutions Summary**\n\nBased on our pre-coded database of 25 conditions:\n- **Infectious & Outbreaks (COVID-19, Cholera, Typhoid, Flu):** Focus on early diagnosis, hydration (ORS), resting, and tracking temperature.\n- **Chronic (Diabetes, Hypertension, GERD, Asthma):** Focus on lifestyle (salt reduction, DASH diet, workouts) and taking controller medicines.\n- **Mental & Comfort (Anxiety, Insomnia, Migraine):** Sleep hygiene, deep breathing therapy, limiting caffeine, and counseling.`;
    }

    // Default Smart Companion Answer
    return `### **MediPlex Companion Health Advice**\n\nI have analyzed your query: **"${query}"**.\n\nHere are some helpful guidelines:\n1. **Symptom Log:** Track when symptoms started and what triggers them.\n2. **Drink Water:** Consume 2.5 to 3 liters of pure water daily to support kidney filtration.\n3. **Quality Rest:** Ensure you get 7.5 to 9 hours of sleep to boost your immune system.\n4. **Unprocessed Diet:** Stick to high fiber and avoid sodium/sugars.\n\n*Ask me about any specific disease or wellness topic (e.g. "sore throat", "GERD treatment", "Hypertension diet", "stress relief") to get direct guidelines!*`;
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const query = input.trim();
    if (!query || isThinking) return;

    setInput("");
    setIsThinking(true);

    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: "user",
      text: query,
      createdAt: new Date().toISOString()
    };

    const updated = [...messages, userMsg];
    setMessages(updated);

    setTimeout(() => {
      const responseText = getLocalOfflineResponse(query);
      const botMsg: ChatMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: responseText,
        createdAt: new Date().toISOString()
      };

      const final = [...updated, botMsg];
      setMessages(final);
      setIsThinking(false);

      localStorage.setItem(getCompanionStorageKey(), JSON.stringify(final));
    }, 600);
  };

  // Quick formatting for bold and lists
  const formatText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      if (line.trim().startsWith("- ")) {
        const cleaned = line.trim().substring(2);
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-slate-700 mb-0.5 leading-relaxed">
            {boldPart(cleaned)}
          </li>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h5 key={idx} className="font-extrabold text-slate-950 text-xs mt-2 mb-1 border-b border-slate-100 pb-0.5">
            {boldPart(line.substring(4))}
          </h5>
        );
      }
      return (
        <p key={idx} className="text-xs text-slate-700 leading-relaxed mb-1.5 break-words">
          {boldPart(line)}
        </p>
      );
    });
  };

  const boldPart = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    if (parts.length === 1) return text;
    return parts.map((part, i) => (i % 2 === 1 ? <strong key={i} className="font-bold text-slate-900">{part}</strong> : part));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Mini Chat Window Popup */}
      {isOpen && (
        <div 
          id="floating-companion-chat" 
          className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl w-[350px] sm:w-[380px] h-[480px] mb-4 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200"
        >
          {/* Header */}
          <div className="bg-[#0b4e72] text-white px-4 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-2">
              <div className="bg-white/10 p-1.5 rounded-lg">
                <Bot className="h-4.5 w-4.5 text-teal-300" />
              </div>
              <div className="text-left">
                <h4 className="font-sans font-bold text-xs tracking-tight">MediPlex AI Copilot</h4>
                <p className="text-[9px] text-teal-200 font-medium flex items-center gap-1">
                  <span className="h-1 w-1 bg-teal-400 rounded-full animate-ping" />
                  Instant Core Engine • Connected
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              {showClearConfirm ? (
                <div className="flex items-center space-x-1 bg-white/10 px-2 py-1 rounded-lg text-[10px] font-bold animate-in fade-in slide-in-from-right-2 duration-200">
                  <span className="text-teal-200">Clear?</span>
                  <button
                    onClick={(e) => handleClear(e)}
                    className="bg-red-500 hover:bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded cursor-pointer transition"
                  >
                    Yes
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowClearConfirm(false);
                    }}
                    className="bg-white/20 hover:bg-white/30 text-white text-[9px] px-1.5 py-0.5 rounded cursor-pointer transition"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowClearConfirm(true);
                  }}
                  className="text-slate-200 hover:text-white p-1 hover:bg-white/10 rounded cursor-pointer transition"
                  title="Clear quick history"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-200 hover:text-white p-1 hover:bg-white/10 rounded cursor-pointer transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages List Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 space-y-3.5 text-left">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-sm leading-relaxed ${
                    m.sender === "user"
                      ? "bg-[#0b4e72] text-white rounded-tr-none"
                      : "bg-white border border-slate-100 text-slate-800 rounded-tl-none"
                  }`}
                >
                  {formatText(m.text)}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-slate-400 flex items-center space-x-1">
                  <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions chips inside the float */}
          <div className="px-3 py-1.5 bg-slate-100 border-t border-slate-200/60 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none scroll-smooth">
            <button
              onClick={() => { setInput("Fever symptoms"); }}
              className="bg-white hover:bg-slate-50 border border-slate-200/80 rounded-full px-2.5 py-1 text-[10px] font-bold text-slate-600 transition shrink-0 cursor-pointer"
            >
              Fever symptoms
            </button>
            <button
              onClick={() => { setInput("GERD treatment"); }}
              className="bg-white hover:bg-slate-50 border border-slate-200/80 rounded-full px-2.5 py-1 text-[10px] font-bold text-slate-600 transition shrink-0 cursor-pointer"
            >
              GERD guidelines
            </button>
            <button
              onClick={() => { setInput("Paracetamol dosage"); }}
              className="bg-white hover:bg-slate-50 border border-slate-200/80 rounded-full px-2.5 py-1 text-[10px] font-bold text-slate-600 transition shrink-0 cursor-pointer"
            >
              Medicine safety
            </button>
            <button
              onClick={() => { setInput("Anxiety management"); }}
              className="bg-white hover:bg-slate-50 border border-slate-200/80 rounded-full px-2.5 py-1 text-[10px] font-bold text-slate-600 transition shrink-0 cursor-pointer"
            >
              Stress / Anxiety
            </button>
          </div>

          {/* Quick Warning Footer */}
          <div className="bg-[#fef9c3]/60 px-3.5 py-1 text-[9px] text-[#713f12] font-semibold flex items-center gap-1.5 border-t border-slate-100 leading-normal">
            <ShieldAlert className="h-3 w-3 text-[#eab308] shrink-0" />
            <span>Educational guidance only. Not for medical diagnosis.</span>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-150 flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about symptoms, diseases, diet..."
              className="flex-1 bg-slate-50 border border-slate-200/80 rounded-xl py-2 px-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0b4e72] focus:border-[#0b4e72]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isThinking}
              className="bg-[#0b4e72] hover:bg-[#083b57] text-white p-2 rounded-xl transition cursor-pointer disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Trigger Ball (AI Button) */}
      <button
        onClick={handleToggle}
        className={`bg-[#008080] hover:bg-[#006666] text-white font-extrabold text-xs w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-2xl hover:scale-105 transition duration-200 cursor-pointer ${
          !isOpen ? "animate-bounce" : ""
        }`}
        style={{ animationDuration: '3.5s' }}
        title="Open MediPlex AI Copilot"
      >
        <span className="relative flex h-2 w-2 mb-0.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-200 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
        <span className="tracking-wider uppercase font-black text-[11px] leading-none">AI</span>
      </button>
    </div>
  );
};
