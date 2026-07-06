import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Bot, User, AlertCircle, RefreshCw, Trash2 } from "lucide-react";
import { ChatMessage, DbUser } from "../types.ts";
import { STATIC_DISEASES } from "../data/diseases.ts";

interface ChatbotProps {
  dbUser: DbUser | null;
  getAuthToken: () => Promise<string | null>;
}

export const Chatbot: React.FC<ChatbotProps> = ({ dbUser }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickChips = [
    "Dengue prevention tips",
    "Asthma red flags",
    "How to manage Hypertension?",
    "Paracetamol safety guidelines",
    "Symptom check for persistent cough"
  ];

  // Helper key to persist chat messages offline
  const getStorageKey = () => {
    return `mediplex_chats_${dbUser ? dbUser.uid : "guest"}`;
  };

  // Load chat history from localStorage on user change
  useEffect(() => {
    setError(null);
    setShowClearConfirm(false);
    const storageKey = getStorageKey();
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      } catch (err) {
        console.warn("Failed to parse saved offline chats", err);
      }
    }

    // Default welcome messages
    const welcomeName = dbUser ? dbUser.name : "Guest";
    setMessages([
      {
        id: 0,
        sender: "bot",
        text: `Welcome, ${welcomeName}! I am your MediPlex AI Public Health Assistant.\n\nI can provide instant details, solutions, symptoms, and prevention tips for the 25 major conditions and trending diseases in our database, as well as answers to general health, wellness, and dietary questions. Ask me anything like **"What is the solution for COVID-19?"**, **"How do I manage anxiety?"**, or **"I have a fever, what does it mean?"**.`,
        createdAt: new Date().toISOString()
      }
    ]);
  }, [dbUser]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  // Clear chat history
  const handleClearHistory = () => {
    const storageKey = getStorageKey();
    localStorage.removeItem(storageKey);
    
    const welcomeName = dbUser ? dbUser.name : "Guest";
    setMessages([
      {
        id: Date.now(),
        sender: "bot",
        text: `Chat history cleared. How can I help you today, ${welcomeName}?`,
        createdAt: new Date().toISOString()
      }
    ]);
    setShowClearConfirm(false);
  };

  // Smart local coding response generator
  const getLocalOfflineResponse = (query: string): string => {
    const q = query.toLowerCase().trim();

    // 1. Dynamic Match against any of the 25 static diseases using their name or aliases
    const matchedDisease = STATIC_DISEASES.find(d => {
      const nameMatch = q.includes(d.name.toLowerCase());
      const aliasMatch = d.aliases?.some(alias => q.includes(alias.toLowerCase()));
      return nameMatch || aliasMatch;
    });

    if (matchedDisease) {
      return `### **${matchedDisease.name} - Symptoms & Action Guidelines**\n\n${matchedDisease.overview}\n\n**Common Symptoms:**\n${matchedDisease.symptoms.map(s => `- ${s}`).join("\n")}\n\n**Prevention & Safety Protocols:**\n${matchedDisease.prevention.map(p => `- ${p}`).join("\n")}\n\n⚠️ **WARNING WARNING:** ${matchedDisease.warning}`;
    }

    // 2. Specific Symptom General Matches
    if (q.includes("fever") || q.includes("temperature") || q.includes("high temp") || q.includes("hot body")) {
      return `### **Fever Symptoms, Temperature Solutions & Causes**\n\nA fever is characterized by an elevated body temperature (typically above 100.4°F / 38°C). In our coding database, a fever is a primary symptom of several infectious conditions:\n\n1. **Dengue & Malaria:** Vector-borne diseases presenting with high cyclical fevers and shivering.\n2. **Typhoid Fever:** Prolonged stepwise high temperature with abdominal pain.\n3. **COVID-19 & Influenza:** Acute respiratory viral conditions accompanied by sudden fever, cough, and body aches.\n\n**Safety Actions & Solutions:**\n- **Monitor Temperature:** Use a digital thermometer and keep a regular log twice daily.\n- **Stay Hydrated:** Sip clean water or Oral Rehydration Salts (ORS) constantly.\n- **Adequate Rest:** Avoid physical strain and stay in a ventilated, cool room.\n- **Diagnostic Advice:** If a fever lasts more than 48 hours, seek diagnostic medical screening (blood counts, platelet checks).`;
    }

    if (q.includes("cough") || q.includes("coughing") || q.includes("throat") || q.includes("sore") || q.includes("breath")) {
      return `### **Cough & Respiratory Symptoms Solution**\n\nPersistent coughing or breathing difficulties are common signs of respiratory airway involvement:\n\n1. **COVID-19 & Influenza:** Spreads via droplets, presenting with sore throat, congestion, and dry cough.\n2. **Asthma:** Causes airway inflammation, wheezing or whistling sounds, and chest tightness.\n3. **Tuberculosis (TB):** Characterized by a chronic cough lasting 3+ weeks, sometimes coughing up blood, night sweats, and weight loss.\n\n**Safe Care Guidelines:**\n- Avoid environmental triggers like active or passive cigarette smoke, dust, and pollen.\n- Inhale warm steam to soothe inflamed bronchial passages.\n- For Asthma, always keep your fast-acting rescue inhaler (such as Albuterol) close by.\n- If a cough persists beyond 2 weeks, seek medical screening for Tuberculosis (TB sputum test).`;
    }

    if (q.includes("stomach") || q.includes("cramp") || q.includes("diarrhea") || q.includes("vomit") || q.includes("loose stool") || q.includes("burn") || q.includes("reflux")) {
      return `### **Digestive Symptoms & Dehydration Solutions**\n\nStomach irritation, persistent vomiting, or loose stools can quickly cause dangerous dehydration or chronic discomfort:\n\n1. **Gastroenteritis (Food Poisoning):** Caused by contaminated food/water or stomach bugs, leading to watery diarrhea, cramps, and nausea.\n2. **Cholera:** A highly acute infection causing extreme 'rice water' watery stools and rapid dehydration.\n3. **GERD (Acid Reflux) & Peptic Ulcers:** Stomach acid reflux causing burning sensations (heartburn) and painful lining sores.\n\n**Dehydration Solutions & Care:**\n- **Rehydrate aggressively:** Sip Oral Rehydration Salts (ORS) or clean water constantly. Oral rehydration is life-saving.\n- **Eat bland foods:** Follow the BRAT diet (Bananas, Rice, Applesauce, Toast) once vomiting subsides.\n- **Avoid NSAIDs:** If you have stomach sores (peptic ulcers), limit use of pain relievers like ibuprofen as they damage the stomach lining.\n- Seek urgent care if you experience sunken eyes, dry mouth, or cannot keep fluids down for 24 hours.`;
    }

    if (q.includes("paracetamol") || q.includes("safety") || q.includes("dosage") || q.includes("dolo") || q.includes("medicine") || q.includes("pill") || q.includes("limit") || q.includes("drug")) {
      return `### **Safe Medicine & Over-The-Counter Guidelines**\n\nHere are the hardcoded safety protocols for common over-the-counter medication:\n\n- **Standard Adult Dosage (Paracetamol/Acetaminophen):** 500mg to 650mg every 4 to 6 hours as needed.\n- **Absolute Maximum Limit:** Never exceed **4,000mg (4 grams)** of Paracetamol in any 24-hour period to prevent irreversible liver damage.\n- **Check active ingredients:** Many combination cough and cold remedies also contain paracetamol. Check labels to prevent accidental double-dosing.\n- **Avoid alcohol:** Do not consume alcohol while taking paracetamol, as it severely increases liver toxicity risk.\n- Always consult a professional health practitioner before beginning any new medication regime.`;
    }

    // 3. New General Related Topics Matches
    if (q.includes("diet") || q.includes("nutrition") || q.includes("food") || q.includes("eat") || q.includes("sugar") || q.includes("salt")) {
      return `### **MediPlex General Nutrition & Dietary Guidance**\n\nA balanced lifestyle can manage and prevent chronic conditions like Type 2 Diabetes, Hypertension, and Fatty Liver Disease (NAFLD):\n\n- **Reduce Sodium (Salt):** Keep daily intake under 2,000mg to immediately support arterial walls and lower high blood pressure.\n- **Minimize Refined Sugars:** Avoid high-fructose corn syrup, candy, and soda to reduce insulin resistance and prevent metabolic liver fat buildup.\n- **Focus on Fiber:** Eat plenty of whole grains, green leafy vegetables, legumes, and lean protein to stabilize glucose levels.\n- **Hydration:** Aim for 2.5 to 3 liters of pure water daily to support kidney filtration and general metabolic processes.`;
    }

    if (q.includes("sleep") || q.includes("rest") || q.includes("tired") || q.includes("fatigue") || q.includes("insomnia") || q.includes("night")) {
      return `### **Sleep Hygiene & General Rest Guidelines**\n\nIf you are experiencing sleeplessness (Insomnia), chronic exhaustion, or fatigue, sleep quality is the key to cellular and physiological restoration:\n\n- **Consistent Schedule:** Go to bed and wake up at the exact same times daily, even on weekends, to stabilize your circadian rhythm.\n- **De-screen before bed:** Turn off all smartphones, tablets, and televisions at least 1 hour before sleep to encourage natural melatonin production.\n- **Environment Control:** Keep the bedroom cool (around 65°F / 18°C), completely dark, and silent.\n- **Avoid late stimulants:** Refrain from coffee, nicotine, or heavy meals within 4-6 hours of sleep. Try relaxing activities like deep breathing or journaling instead.`;
    }

    if (q.includes("exercise") || q.includes("fitness") || q.includes("walk") || q.includes("run") || q.includes("gym") || q.includes("workout")) {
      return `### **Physical Activity & Exercise Recommendations**\n\nRegular physical exercise is a primary solution for strengthening cardiovascular systems, lowering cholesterol, and enhancing joint flexibility:\n\n- **Aerobic Fitness:** Aim for at least 150 minutes of moderate-intensity exercise (such as brisk walking, swimming, or cycling) per week.\n- **Strength & Joints:** Build muscle strength to support and cushion your skeletal joints, which is highly beneficial for managing Osteoarthritis.\n- **Metabolic Support:** Physical movement increases muscle glucose absorption, directly helping to manage Type 2 Diabetes.\n- **Pacing:** If you are restarting fitness, begin with 10-15 minute sessions and increase duration gradually to prevent physical strain.`;
    }

    if (q.includes("stress") || q.includes("mental") || q.includes("anxiety") || q.includes("depress") || q.includes("panic") || q.includes("sad") || q.includes("worry")) {
      return `### **Mental Wellness & Stress Reduction Solutions**\n\nEmotional and mental health are deeply connected to physical health. Conditions like Generalized Anxiety Disorder (GAD) and Clinical Depression are common and highly manageable:\n\n- **Mindfulness Breathing:** Practicing deep diaphragmatic breathing (inhaling for 4 seconds, holding for 4, and exhaling for 6) immediately triggers the parasympathetic nervous system to reduce heart rates during high stress.\n- **Social Connectivity:** Maintain regular, active interactions with a supportive network of friends, family, or counselors.\n- **Limit Stimulants:** Reduce caffeine and alcohol, as both can chemically mimic or trigger adrenaline spikes, worsening feelings of panic or anxiety.\n- **Professional Counseling:** Cognitive Behavioral Therapy (CBT) is an incredibly successful solution. Don't hesitate to consult a mental health practitioner.`;
    }

    if (q.includes("first aid") || q.includes("injury") || q.includes("wound") || q.includes("burn") || q.includes("cut") || q.includes("bleed")) {
      return `### **First Aid & Injury Safety Protocols**\n\nImmediate care of minor injuries prevents secondary infections and supports rapid healing:\n\n- **Cuts & Scrapes:** Rinse the area under cool, clean tap water. Gently wash around the wound with mild soap. Apply an antiseptic ointment and cover with a sterile bandage.\n- **Minor Burns:** Cool the burn immediately under cool running tap water for 10-15 minutes (do not use ice or butter). Cover loosely with a sterile, non-stick bandage.\n- **Sprains:** Follow the RICE protocol: **R**est the limb, **I**ce the area for 15 minutes, **C**ompress with an elastic bandage, and **E**levate the joint above heart level.\n- **Severe Bleeding:** Apply direct, firm pressure with a clean cloth. Seek emergency services immediately if bleeding does not stop after 10 minutes.`;
    }

    if (q.includes("doctor") || q.includes("clinic") || q.includes("hospital") || q.includes("test") || q.includes("checkup") || q.includes("appointment")) {
      return `### **Scheduling & Clinical Evaluation Guidelines**\n\nWhile MediPlex provides comprehensive education, consulting a healthcare professional is crucial for accurate diagnosis:\n\n- **Annual Screening:** Schedule a routine blood test annually to check fasting lipid profiles (cholesterol), blood sugar (HbA1c), and kidney/liver functions.\n- **Symptom Duration:** If you experience any acute symptom (such as high fever, severe cough, or intense stomach pain) for more than 48 hours without improvement, seek local clinic evaluation.\n- **Medication:** Never alter, stop, or start prescription drug dosages without direct guidance from your primary care physician.`;
    }

    if (q.includes("solution") || q.includes("treatment") || q.includes("cure") || q.includes("help") || q.includes("prevent")) {
      return `### **MediPlex General Health Solutions Guide**\n\nFor any health concern, MediPlex provides structured guidelines based on our internal database of 25 major diseases:\n\n- **Infectious & Waterborne Outbreaks (Dengue, COVID-19, Cholera, Typhoid, Flu):** Focus on early diagnosis, aggressive rehydration (ORS), temperature logs, and resting in well-ventilated rooms.\n- **Chronic Conditions (Diabetes, Hypertension, GERD, Asthma):** Focus on lifestyle modification (low salt, low sugar, DASH diet, exercise) and persistent adherence to daily controller medications.\n- **Mental & Pain Concerns (Anxiety, Depression, Migraine, Insomnia):** Focus on strict sleep hygiene, deep breathing therapy, limiting stimulants, and counseling support.\n\n*Specify any condition like 'GERD', 'COVID-19', 'Asthma', or symptom like 'Fever' to receive specific details directly from our database!*`;
    }

    // 4. Default Fallback: Smart Relative Answer Generator
    return `### **MediPlex Dynamic Health Assistant Guidance**\n\nThank you for your question. I've analyzed your medical query regarding **"${query}"**.\n\nHere are general health protocols related to this topic:\n\n1. **Symptom Tracking:** Keep a close record of when symptoms started, their frequency, and anything that makes them better or worse.\n2. **Aggressive Hydration:** Drink 2.5 to 3 liters of pure, clean water daily to support kidney filtration and clear metabolic waste.\n3. **Immune Recovery:** Ensure you get 7.5 to 9 hours of quality sleep to let your body heal and regulate hormones.\n4. **Balanced Nutrition:** Stick to unprocessed, low-sodium foods, high fiber, and avoid simple sugars to reduce internal inflammation.\n\n**Trending Health Topics in our Database:**\n- **Respiratory & Viral:** COVID-19, Influenza, Tuberculosis, Asthma.\n- **Cardiovascular & Digestive:** Hypertension, Coronary Artery Disease, GERD, Peptic Ulcer Disease.\n- **Metabolic & General:** Type 2 Diabetes, Fatty Liver (NAFLD), Insomnia, Anemia, Migraines, Appendicitis.\n\n*Ask me about any of these 25 pre-coded conditions (e.g., "What are the symptoms of GERD?" or "How do I manage anxiety?") to see precise diagnostic tips immediately!*`;
  };

  const handleSend = (textToSend: string) => {
    const query = textToSend.trim();
    if (!query || isSending) return;

    setInput("");
    setError(null);
    setIsSending(true);

    // 1. Add user message
    const tempUserMsg: ChatMessage = {
      id: Date.now(),
      sender: "user",
      text: query,
      createdAt: new Date().toISOString()
    };
    const updatedMessages = [...messages, tempUserMsg];
    setMessages(updatedMessages);

    // 2. Generate and add matching local offline response after a brief simulated thinking delay
    setTimeout(() => {
      const solutionText = getLocalOfflineResponse(query);
      const tempBotMsg: ChatMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: solutionText,
        createdAt: new Date().toISOString()
      };
      
      const finalMessages = [...updatedMessages, tempBotMsg];
      setMessages(finalMessages);
      setIsSending(false);

      // Save to localStorage for persistent offline history
      localStorage.setItem(getStorageKey(), JSON.stringify(finalMessages));
    }, 600);
  };

  // Safe simple formatter for markdown in responses
  const renderMessageText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      // Check for bullet list
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        const itemText = line.trim().substring(2);
        return (
          <li key={idx} className="ml-4 list-disc text-sm text-slate-700 mb-1 leading-relaxed">
            {formatBold(itemText)}
          </li>
        );
      }
      // Check for headers
      if (line.startsWith("### ")) {
        return <h5 key={idx} className="font-bold text-slate-900 text-sm mt-3 mb-1">{formatBold(line.substring(4))}</h5>;
      }
      if (line.startsWith("## ")) {
        return <h4 key={idx} className="font-bold text-slate-900 text-base mt-4 mb-1.5">{formatBold(line.substring(3))}</h4>;
      }
      if (line.startsWith("# ")) {
        return <h3 key={idx} className="font-extrabold text-slate-900 text-lg mt-4 mb-2">{formatBold(line.substring(2))}</h3>;
      }
      // Standard line
      return (
        <p key={idx} className="text-sm text-slate-700 leading-relaxed mb-2 break-words">
          {formatBold(line)}
        </p>
      );
    });
  };

  // Helper to bold text inside **
  const formatBold = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    if (parts.length === 1) return text;
    return parts.map((part, i) => (i % 2 === 1 ? <strong key={i} className="font-semibold text-slate-900">{part}</strong> : part));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[520px] overflow-hidden">
      {/* Simple Clean Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="bg-slate-50 text-[#0b4e72] p-2 rounded-lg border border-slate-100">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm tracking-tight">Mediplex AI Assistant</h3>
            <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
              MediPlex AI Core Engine • Connected
            </p>
          </div>
        </div>

        {/* Action Button to clear chat history */}
        {showClearConfirm ? (
          <div className="flex items-center space-x-2 bg-rose-50 border border-rose-100 rounded-xl py-1.5 px-3 animate-in fade-in zoom-in-95 duration-200">
            <span className="text-[11px] font-bold text-rose-700">Clear chat history?</span>
            <button
              onClick={handleClearHistory}
              className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold px-2 py-1 rounded-md cursor-pointer transition"
            >
              Confirm
            </button>
            <button
              onClick={() => setShowClearConfirm(false)}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-bold px-2 py-1 rounded-md cursor-pointer transition"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowClearConfirm(true)}
            title="Clear Conversation History"
            className="text-slate-400 hover:text-rose-600 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition flex items-center gap-1.5 text-xs font-bold"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>
        )}
      </div>

      {/* Messages Pane */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 max-w-[85%] ${
              msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
            }`}
          >
            {/* Minimal Bubble */}
            <div
              className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.sender === "user"
                  ? "bg-[#0b4e72] text-white rounded-tr-none"
                  : "bg-white border border-slate-100 text-slate-800 rounded-tl-none"
              }`}
            >
              {msg.sender === "user" ? (
                <p className="font-medium break-words">{msg.text}</p>
              ) : (
                <div className="space-y-1">{renderMessageText(msg.text)}</div>
              )}
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex items-start gap-3 max-w-[80%]">
            <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-none flex items-center space-x-2 shadow-sm">
              <span className="text-xs text-slate-400 mr-1 font-medium">Assistant is evaluating data</span>
              <div className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" />
              <div className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-800 p-3.5 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chips & Form Panel */}
      <div className="bg-white border-t border-slate-100 p-4 space-y-3">
        {/* Simple suggestion pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-2 px-2">
          {quickChips.map((chip, index) => (
            <button
              key={index}
              onClick={() => handleSend(chip)}
              disabled={isSending}
              className="shrink-0 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 border border-slate-200/60 hover:border-slate-300 text-xs py-1.5 px-3 rounded-full transition duration-150 cursor-pointer disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Minimal input bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSending}
            placeholder="Ask about a disease, symptom (fever, cough), or dosage limit..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0b4e72] focus:border-[#0b4e72] transition duration-150 disabled:opacity-75"
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="bg-[#0b4e72] hover:bg-[#083b57] text-white p-3 rounded-xl transition duration-150 shadow-sm cursor-pointer disabled:bg-slate-100 disabled:text-slate-400"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
export default Chatbot;
