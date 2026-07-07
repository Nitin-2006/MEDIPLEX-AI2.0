
# 🏥 Mediplex AI — Public Health Intelligence Platform
Link : https://mediplex-ai2-0.onrender.com/


Mediplex AI is a modern, professional, and fully interactive public health awareness platform designed to educate individuals, promote preventive care, and facilitate smart health guidance. By combining server-side AI intelligence, high-fidelity responsive user interfaces, and structured relational database tracking, the platform serves as an intuitive digital entrypoint for health awareness and public safety.

> ⚠️ **IMPORTANT SAFETY DISCLAIMER:** Mediplex AI provides educational and general awareness material only. It is **not** a diagnostic utility, does not prescribe prescription medicine, and does not replace professional medical consult or treatment. Users experiencing acute symptoms (such as chest pain, extreme breathlessness, severe bleeding, or sudden confusion) are instructed to seek emergency medical attention immediately.

---

## ✨ Key Interactive Modules

### 💬 1. Smart AI Health Chatbot
An interactive, server-side conversational AI assistant designed to handle public health queries dynamically.
- **Model Integration:** Communicates with Gemini models via the official `@google/genai` SDK.
- **Strict Guidelines:** Configured with a system-instruction layer that prioritizes medical safety, emphasizes professional triage, and explicitly advises against self-diagnosis and self-medication.
- **Aesthetic Chat Box:** Features typing indicators, quick health prompts, and elegant message structures.

### 📖 2. Disease Awareness Library
A curated database of common public health challenges (e.g., Influenza, Dengue, Diabetes, Hypertension) providing structured guidance.
- **Clear Information:** Provides symptoms, transmission modes, risk groups, and actionable lifestyle remedies.
- **Prevention Measures:** Prompts and step-by-step recommendations for vaccines, clean sanitation, and nutrition.

### ⚠️ 3. Interactive Symptom Warning Checker
A multi-step structured diagnostic awareness questionnaire.
- **Symptom Triage:** Helps users categorize their current discomfort (mild, moderate, or acute).
- **Emergency Warnings:** Detects red-flag warning signs and alerts users with high-contrast banners instructing them to seek urgent offline care.

### 💊 4. Medicine Info & Safety Utility
An educational registry detailing pharmaceutical guidelines and safe handling procedures.
- **Dosage Guidance:** Provides clear, non-prescriptive, informative dosage descriptions, side-effect warning logs, and drug interactions.
- **Self-Medication Guard:** A dedicated checking tool that reinforces safe usage guidelines and warns users about the dangers of using medications without a prescription.

### 📞 5. Support Queue & Contact Center
A direct support messaging system for users seeking educational clarification or program assistance.
- **Structured Intake:** Users can enter their profile details, state their medical inquiries, and submit tickets to the queue.
- **State Management:** Fully integrated into our local state and relational database pipelines to simulate queue processing.

### 🛡️ 6. Public Health Admin Panel
A specialized control panel for system operators and healthcare workers.
- **Interactive Metrics:** Analyzes submitted support tickets, tracks common symptom trend logs, and manages active disease library profiles.
- **Role Validation:** Restricts sensitive administrative toggles to verified administrative accounts.

---

## 🛠️ Full-Stack Technical Architecture

### 🚀 1. The Core Stack
- **Frontend Framework:** [React 19](https://react.dev/) inside [Vite](https://vite.dev/) build environment.
- **Styling Engine:** [Tailwind CSS v4](https://tailwindcss.com/) with a highly customized theme, beautiful typography layout, and unified branding (Cosmic Slate and Teal palette).
- **Animations:** Fully fluid UI layout transition animations and entrance effect patterns using [Motion (motion/react)](https://motion.dev/).
- **Icons:** High-quality vector iconography from [Lucide React](https://lucide.dev/).

### 🖥️ 2. The Node.js Express Backend
- **Express Server:** Implements server-side routes under `/api/*` to proxy sensitive requests (like Gemini AI API calls) keeping API keys safe from the client browser.
- **Compilation Tooling:** Built with a specialized production bundler:
  - **Dev Environment:** Runs directly on `tsx` for high-velocity TypeScript hot updates.
  - **Production Bundler:** Bundles backend typescript into a single, highly optimized CommonJS output (`dist/server.cjs`) using `esbuild`. This approach prevents runtime ES Module path conflicts and ensures instant startups.

### 🗄️ 3. Database Schema & ORM
- **Database Engine:** PostgreSQL (Cloud SQL developer edition).
- **Object-Relational Mapping (ORM):** Powered by [Drizzle ORM](https://orm.drizzle.team/), utilizing TypeScript-first schema modeling (`src/db/schema.ts`).
- **Persistence Layer:** Safely preserves user records, health metrics, and submitted support tickets across sessions.

---

## 📂 Project Structure Overview

```text
├── .env.example                # Config guidelines for secret environment variables
├── .gitignore                  # Prevents committing build/node_modules/temp outputs
├── metadata.json               # Manifest specifying app metadata and frame permissions
├── package.json                # Project dependencies and custom CLI script triggers
├── server.ts                   # Custom Express backend and Vite asset-serving entrypoint
├── tsconfig.json               # Unified TypeScript compilation properties
├── vite.config.ts              # Vite configurations including Tailwind support
│
└── src/                        # Client-side codebase
    ├── main.tsx                # React app DOM mounting entrypoint
    ├── App.tsx                 # Main application visual controller and router
    ├── index.css               # Global CSS importing Tailwind v4 & custom typography
    ├── types.ts                # Unified TypeScript type, interface, and enum declarations
    │
    ├── components/             # Subdivided, modular React interfaces
    │   ├── Navbar.tsx          # Dynamic responsive header, search toggles, and login actions
    │   ├── Hero.tsx            # Prominent visual brand header and portal quicklinks
    │   ├── Chatbot.tsx         # AI-powered public health assistant widget
    │   ├── DiseaseLibrary.tsx  # Dynamic list of public health guidelines
    │   ├── SymptomChecker.tsx  # Interactive triage diagnostic questionnaire
    │   ├── MedicineSafety.tsx  # Registry of pharmaceutical guidelines & dose limits
    │   ├── SupportForm.tsx     # Intake form for support submissions
    │   └── AdminModule.tsx     # Queue tracking panel for managers
    │
    ├── db/                     # Database schemas and Drizzle setup
    │   ├── schema.ts           # PostgreSQL schema mappings (Drizzle)
    │   ├── index.ts            # Client initializer for database connections
    │   └── drizzle.config.ts   # Configuration guidelines for schema migrations
    │
    └── middleware/             # Helper middleware modules (auth/routing checks)
```

---

## 💻 Local Development Setup

To run this application locally, ensure you have **Node.js (v18+)** and **npm** installed on your system.

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory based on the `.env.example` file:
```env
# Server secret (never exposed to client browser)
GEMINI_API_KEY="your-google-gemini-api-key"

# Cloud Run base URL
APP_URL="http://localhost:3000"
```

### 3. Run the Development Server
```bash
npm run dev
```
The server will boot and listen on **port 3000**. Open your browser and navigate to `http://localhost:3000` to preview the live full-stack app.

### 4. Build and Run in Production Mode
Compile the full application into static assets and a bundled production backend file:
```bash
npm run build
npm start
```

---

## 🛡️ Medical Content Guidelines & Sources

To ensure accuracy and public credibility, Mediplex AI's knowledge base is designed around guidelines issued by major global health agencies:
- **World Health Organization (WHO):** [https://www.who.int/health-topics/](https://www.who.int/health-topics/)
- **Centers for Disease Control and Prevention (CDC):** [https://www.cdc.gov/](https://www.cdc.gov/)
- **MedlinePlus Medicine Guidelines:** [https://medlineplus.gov/medicines.html](https://medlineplus.gov/medicines.html)
- **Indian Council of Medical Research (ICMR):** [https://www.icmr.gov.in/](https://www.icmr.gov.in/)

# MEDIPLEX-AI2.0
