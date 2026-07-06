import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import * as dotenv from "dotenv";
import { db } from "./src/db/index.ts";
import { users, diseases, medicines, supportMessages, chatMessages } from "./src/db/schema.ts";
import { eq, desc, ilike, or, sql } from "drizzle-orm";
import { requireAuth, AuthRequest } from "./src/middleware/auth.ts";
import { getGeminiClient } from "./src/lib/gemini.ts";
import { STATIC_DISEASES } from "./src/data/diseases.ts";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isDbConfigured = !!(process.env.DATABASE_URL || process.env.SQL_HOST);

// Fallback registry data for localhost environments without PostgreSQL
const FALLBACK_DISEASES = STATIC_DISEASES;

const FALLBACK_MEDICINES = [
  {
    id: 1,
    name: "Paracetamol / Acetaminophen",
    use: "Commonly used for fever and mild pain.",
    safety: "Do not exceed label instructions. Avoid combining multiple products that contain the same ingredient. People with liver disease should ask a doctor.",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Oral Rehydration Solution",
    use: "Helps replace fluids and salts during dehydration from diarrhea, vomiting, or fever.",
    safety: "Use clean water and correct preparation. Severe dehydration, blood in stool, or persistent vomiting needs medical care.",
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "Antihistamines",
    use: "Used for allergy symptoms such as sneezing, itching, and runny nose.",
    safety: "Some cause sleepiness. Avoid driving if drowsy. Ask a doctor before use in children, pregnancy, or chronic illness.",
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    name: "Antibiotics",
    use: "Used for specific bacterial infections only when prescribed.",
    safety: "Do not self-start antibiotics. Wrong use can cause resistance, side effects, and treatment failure.",
    createdAt: new Date().toISOString()
  },
  {
    id: 5,
    name: "Inhalers",
    use: "Used in asthma or other breathing conditions based on a doctor's treatment plan.",
    safety: "Use only as prescribed. Severe breathing difficulty needs urgent medical help.",
    createdAt: new Date().toISOString()
  },
  {
    id: 6,
    name: "Aspirin / Blood Thinners",
    use: "Used for selected pain, fever, or heart-related conditions depending on medical advice.",
    safety: "Avoid self-use when dengue is suspected or if there is bleeding risk. Ask a doctor before use.",
    createdAt: new Date().toISOString()
  }
];

const FALLBACK_SUPPORT: any[] = [];

// Emergency keywords for health red-flags
const EMERGENCY_KEYWORDS = [
  "chest pain",
  "breathing difficulty",
  "cannot breathe",
  "faint",
  "unconscious",
  "confusion",
  "seizure",
  "heavy bleeding",
  "blue lips",
  "severe dehydration",
  "stroke",
  "heart attack",
  "emergency"
];

async function initializeDatabase() {
  if (!isDbConfigured) {
    console.log("No SQL Database credentials detected in environment. Running with local offline simulated database.");
    return;
  }
  console.log("Checking and initializing database schema...");
  try {
    // 1. Create tables if they do not exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        uid TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT DEFAULT 'user' NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS diseases (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        overview TEXT NOT NULL,
        aliases JSONB DEFAULT '[]'::jsonb NOT NULL,
        symptoms JSONB DEFAULT '[]'::jsonb NOT NULL,
        prevention JSONB DEFAULT '[]'::jsonb NOT NULL,
        warning TEXT NOT NULL,
        is_custom BOOLEAN DEFAULT true NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS medicines (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        use TEXT NOT NULL,
        safety TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS support_messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        text TEXT NOT NULL,
        status TEXT DEFAULT 'Waiting for admin review' NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id SERIAL PRIMARY KEY,
        uid TEXT,
        sender TEXT NOT NULL,
        text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    console.log("Database tables created or verified successfully.");

    // 2. Seed diseases if empty
    const existingDiseases = await db.select().from(diseases).limit(1);
    if (existingDiseases.length === 0) {
      console.log("Seeding default diseases into database...");
      for (const d of FALLBACK_DISEASES) {
        await db.insert(diseases).values({
          name: d.name,
          overview: d.overview,
          aliases: d.aliases,
          symptoms: d.symptoms,
          prevention: d.prevention,
          warning: d.warning,
          isCustom: d.isCustom,
        }).onConflictDoNothing();
      }
    }

    // 3. Seed medicines if empty
    const existingMedicines = await db.select().from(medicines).limit(1);
    if (existingMedicines.length === 0) {
      console.log("Seeding default medicines into database...");
      for (const m of FALLBACK_MEDICINES) {
        await db.insert(medicines).values({
          name: m.name,
          use: m.use,
          safety: m.safety,
        }).onConflictDoNothing();
      }
    }

    console.log("Database seeding completed successfully.");
  } catch (error: any) {
    console.warn("Database initialization/seeding skipped (Offline or Connection String unavailable):", error.message);
  }
}

async function startServer() {
  // Initialize database schema and seed data
  await initializeDatabase();

  const app = express();
  app.use(express.json());

  // ---------------------------------------------------------
  // API Routes
  // ---------------------------------------------------------

  // 1. Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // 2. Sync user profile on Login/Signup
  app.post("/api/auth/sync", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { uid, email, name, picture } = req.user;
      
      // Determine role: default is 'user'. 
      // If user's email is nitinmaniarasan5403u@gmail.com, make them 'admin' automatically!
      const userRole = email === "nitinmaniarasan5403u@gmail.com" ? "admin" : "user";

      // Secure upsert of user profile in Cloud SQL
      try {
        if (!isDbConfigured) {
          throw new Error("Local offline database mode");
        }
        const result = await db.insert(users)
          .values({
            uid,
            email,
            name: name || email.split("@")[0],
            role: userRole,
          })
          .onConflictDoUpdate({
            target: users.uid,
            set: {
              email,
              name: name || email.split("@")[0],
              role: userRole,
            },
          })
          .returning();

        res.json({ user: result[0] });
      } catch (dbErr: any) {
        if (isDbConfigured) {
          console.warn("Database connection failed. Serving local offline user profile sync:", dbErr.message);
        }
        res.json({
          user: {
            id: 999,
            uid,
            email,
            name: name || email.split("@")[0],
            role: userRole,
            createdAt: new Date().toISOString()
          }
        });
      }
    } catch (error: any) {
      console.error("Failed to sync user:", error);
      res.status(500).json({ error: "Failed to sync user profile with database." });
    }
  });

  // 3. Get all diseases (with optional search)
  app.get("/api/diseases", async (req, res) => {
    const { search } = req.query;
    try {
      if (!isDbConfigured) {
        throw new Error("Local offline database mode");
      }
      let list;
      if (search && typeof search === "string") {
        list = await db.select()
          .from(diseases)
          .where(
            or(
              ilike(diseases.name, `%${search}%`),
              ilike(diseases.overview, `%${search}%`),
              sql`aliases::text ILIKE ${`%${search}%`}`
            )
          )
          .orderBy(diseases.name);
      } else {
        list = await db.select().from(diseases).orderBy(diseases.name);
      }
      res.json(list);
    } catch (error: any) {
      if (isDbConfigured) {
        console.warn("Database connection unavailable, falling back to local disease registry:", error.message);
      }
      let list = FALLBACK_DISEASES;
      if (search && typeof search === "string") {
        const query = search.toLowerCase();
        list = FALLBACK_DISEASES.filter(d => 
          d.name.toLowerCase().includes(query) ||
          d.overview.toLowerCase().includes(query) ||
          d.aliases.some(alias => alias.toLowerCase().includes(query))
        );
      }
      res.json(list);
    }
  });

  // 4. Create a custom disease (Authenticated)
  app.post("/api/diseases", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { name, overview, aliases, symptoms: diseaseSymptoms, prevention, warning } = req.body;

      if (!name || !overview || !warning) {
        return res.status(400).json({ error: "Name, overview, and warning are required fields." });
      }

      try {
        if (!isDbConfigured) {
          throw new Error("Local offline database mode");
        }
        const newDisease = await db.insert(diseases)
          .values({
            name,
            overview,
            aliases: Array.isArray(aliases) ? aliases : [name.toLowerCase()],
            symptoms: Array.isArray(diseaseSymptoms) ? diseaseSymptoms : ["Details managed by admin"],
            prevention: Array.isArray(prevention) ? prevention : [],
            warning,
            isCustom: true,
          })
          .onConflictDoUpdate({
            target: diseases.name,
            set: {
              overview,
              aliases: Array.isArray(aliases) ? aliases : [name.toLowerCase()],
              symptoms: Array.isArray(diseaseSymptoms) ? diseaseSymptoms : ["Details managed by admin"],
              prevention: Array.isArray(prevention) ? prevention : [],
              warning,
            }
          })
          .returning();

        res.status(201).json(newDisease[0]);
      } catch (dbErr: any) {
        if (isDbConfigured) {
          console.warn("Database connection failed. Saving custom disease in-memory for current session:", dbErr.message);
        }
        const existingIndex = FALLBACK_DISEASES.findIndex(d => d.name.toLowerCase() === name.toLowerCase());
        const newRecord = {
          id: existingIndex !== -1 ? FALLBACK_DISEASES[existingIndex].id : FALLBACK_DISEASES.length + 1,
          name,
          overview,
          aliases: Array.isArray(aliases) ? aliases : [name.toLowerCase()],
          symptoms: Array.isArray(diseaseSymptoms) ? diseaseSymptoms : ["Details managed by admin"],
          prevention: Array.isArray(prevention) ? prevention : [],
          warning,
          isCustom: true,
          createdAt: new Date().toISOString()
        };
        
        if (existingIndex !== -1) {
          FALLBACK_DISEASES[existingIndex] = newRecord;
        } else {
          FALLBACK_DISEASES.push(newRecord);
        }
        res.status(201).json(newRecord);
      }
    } catch (error: any) {
      console.error("Failed to create custom disease:", error);
      res.status(500).json({ error: "Failed to register custom disease." });
    }
  });

  // 5. Get all medicines
  app.get("/api/medicines", async (req, res) => {
    try {
      if (!isDbConfigured) {
        throw new Error("Local offline database mode");
      }
      const list = await db.select().from(medicines).orderBy(medicines.name);
      res.json(list);
    } catch (error: any) {
      if (isDbConfigured) {
        console.warn("Database connection unavailable, falling back to local medicine registry:", error.message);
      }
      res.json(FALLBACK_MEDICINES);
    }
  });

  // 6. Submit a support message (public/authenticated)
  app.post("/api/support/messages", async (req, res) => {
    try {
      const { name, email, text } = req.body;
      if (!name || !text) {
        return res.status(400).json({ error: "Name and message are required." });
      }

      try {
        if (!isDbConfigured) {
          throw new Error("Local offline database mode");
        }
        const msg = await db.insert(supportMessages)
          .values({
            name,
            email: email || null,
            text,
            status: "Waiting for admin review",
          })
          .returning();

        res.status(201).json(msg[0]);
      } catch (dbErr: any) {
        if (isDbConfigured) {
          console.warn("Database connection failed. Saving support ticket in-memory:", dbErr.message);
        }
        const newMsg = {
          id: FALLBACK_SUPPORT.length + 1,
          name,
          email: email || null,
          text,
          status: "Waiting for admin review",
          createdAt: new Date().toISOString()
        };
        FALLBACK_SUPPORT.push(newMsg);
        res.status(201).json(newMsg);
      }
    } catch (error: any) {
      console.error("Failed to submit support message:", error);
      res.status(500).json({ error: "Failed to place message in support queue." });
    }
  });

  // 7. Get support queue (Authenticated users only)
  app.get("/api/support/messages", requireAuth, async (req: AuthRequest, res) => {
    try {
      try {
        if (!isDbConfigured) {
          throw new Error("Local offline database mode");
        }
        const list = await db.select().from(supportMessages).orderBy(desc(supportMessages.createdAt));
        res.json(list);
      } catch (dbErr: any) {
        if (isDbConfigured) {
          console.warn("Database connection failed. Serving in-memory support queue:", dbErr.message);
        }
        res.json([...FALLBACK_SUPPORT].sort((a, b) => b.id - a.id));
      }
    } catch (error: any) {
      console.error("Failed to fetch support queue:", error);
      res.status(500).json({ error: "Failed to retrieve support queue." });
    }
  });

  // 8. Clear support queue (Authenticated users only)
  app.delete("/api/support/messages", requireAuth, async (req: AuthRequest, res) => {
    try {
      try {
        if (!isDbConfigured) {
          throw new Error("Local offline database mode");
        }
        await db.delete(supportMessages);
        res.json({ message: "Support queue cleared." });
      } catch (dbErr: any) {
        if (isDbConfigured) {
          console.warn("Database connection failed. Clearing in-memory support queue:", dbErr.message);
        }
        FALLBACK_SUPPORT.length = 0;
        res.json({ message: "Support queue cleared (in-memory)." });
      }
    } catch (error: any) {
      console.error("Failed to clear support queue:", error);
      res.status(500).json({ error: "Failed to clear support queue." });
    }
  });

  // 9. Get user chat history (Authenticated only)
  app.get("/api/chat/history", requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user.uid;
      try {
        if (!isDbConfigured) {
          throw new Error("Local offline database mode");
        }
        const history = await db.select()
          .from(chatMessages)
          .where(eq(chatMessages.uid, uid))
          .orderBy(chatMessages.createdAt);
        res.json(history);
      } catch (dbErr: any) {
        if (isDbConfigured) {
          console.warn("Database connection failed. Serving empty chat history for localhost dev:", dbErr.message);
        }
        res.json([]);
      }
    } catch (error: any) {
      console.error("Failed to fetch chat history:", error);
      res.status(500).json({ error: "Failed to load chat history." });
    }
  });

  // 10. Chatbot endpoint (Supports both guest and authenticated, powered by Gemini)
  app.post("/api/chat", async (req, res) => {
    try {
      const { text, uid } = req.body;
      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Message text is required." });
      }

      const cleanText = text.trim();
      const normalizedQuery = cleanText.toLowerCase();

      // Step 1: Log the user's message in database first
      let userMsgRecord;
      if (uid) {
        try {
          if (!isDbConfigured) {
            throw new Error("Local offline database mode");
          }
          userMsgRecord = await db.insert(chatMessages)
            .values({
              uid,
              sender: "user",
              text: cleanText,
            })
            .returning();
        } catch (dbErr: any) {
          if (isDbConfigured) {
            console.warn("Database connection failed. Skipping chat log storage:", dbErr.message);
          }
        }
      }

      // Step 2: Check for immediate emergency keywords
      const isEmergency = EMERGENCY_KEYWORDS.some(keyword => normalizedQuery.includes(keyword));
      if (isEmergency) {
        const emergencyReply = [
          "⚠️ **EMERGENCY MEDICAL WARNING** ⚠️",
          "",
          "Your query references critical symptoms or red-flag warning signs (such as chest pain, breathing difficulties, or severe trauma).",
          "",
          "**MediPlex AI cannot diagnose conditions or handle medical emergencies.**",
          "Please contact your local emergency services (e.g., 911, 112, 102) immediately or visit the nearest emergency hospital department.",
          "Do not delay seeking professional emergency care."
        ].join("\n");

        // Save bot response to database
        if (uid) {
          try {
            if (!isDbConfigured) {
              throw new Error("Local offline database mode");
            }
            await db.insert(chatMessages).values({
              uid,
              sender: "bot",
              text: emergencyReply,
            });
          } catch (dbErr: any) {
            if (isDbConfigured) {
              console.warn("Database connection failed. Skipping chat bot log storage:", dbErr.message);
            }
          }
        }

        return res.json({ text: emergencyReply });
      }

      // Step 3: Fetch diseases and medicines database to search for matches (Retrieval)
      let allDiseases: any[] = FALLBACK_DISEASES;
      let allMedicines: any[] = FALLBACK_MEDICINES;

      try {
        if (!isDbConfigured) {
          throw new Error("Local offline database mode");
        }
        allDiseases = await db.select().from(diseases);
        allMedicines = await db.select().from(medicines);
      } catch (dbErr: any) {
        if (isDbConfigured) {
          console.warn("Database connection failed during chat retrieval. Using local datasets:", dbErr.message);
        }
      }

      const matchedDiseases = allDiseases.filter(d => {
        const terms = [d.name.toLowerCase(), ...d.aliases.map(a => a.toLowerCase())];
        return terms.some(term => normalizedQuery.includes(term));
      });

      const matchedMedicines = allMedicines.filter(m => {
        return normalizedQuery.includes(m.name.toLowerCase()) || m.name.toLowerCase().split(" / ").some(part => normalizedQuery.includes(part));
      });

      // Step 4: Assemble Context (RAG)
      let databaseContext = "";
      if (matchedDiseases.length > 0) {
        databaseContext += "VERIFIED DISEASE CONTEXT FROM DATABASE:\n";
        matchedDiseases.forEach(d => {
          databaseContext += `- **Disease**: ${d.name}\n  * **Overview**: ${d.overview}\n  * **Common Symptoms**: ${d.symptoms.join(", ")}\n  * **Prevention**: ${d.prevention.join(", ")}\n  * **Red Flags**: ${d.warning}\n\n`;
        });
      }

      if (matchedMedicines.length > 0) {
        databaseContext += "VERIFIED MEDICINE SAFETY CONTEXT FROM DATABASE:\n";
        matchedMedicines.forEach(m => {
          databaseContext += `- **Medicine**: ${m.name}\n  * **Use**: ${m.use}\n  * **Safety Warning**: ${m.safety}\n\n`;
        });
      }

      // Step 5: Ask Gemini to answer using the prompt + context
      let replyText = "";
      try {
        const ai = getGeminiClient();

        const systemInstruction = [
          "You are MediPlex AI, an intelligent Public Health chatbot created to promote disease awareness, prevention guidance, and safety knowledge.",
          "",
          "CRITICAL SAFETY MANDATES:",
          "1. You are NOT a doctor, medical professional, or diagnostic system. You cannot diagnose conditions or prescribe medications.",
          "2. If the user asks for prescription recommendations, explain that you can only share general safety guidance and direct them to consult a qualified physician.",
          "3. Always include educational, preventive, and protective guidelines, and advise consulting a healthcare professional.",
          "4. Keep your responses structured, clear, empathetic, and formatted with clean markdown bullets.",
          "5. Speak directly as MediPlex AI, in a professional and reassuring tone.",
          "",
          databaseContext ? `Use the following verified local database context to formulate your answer if relevant. Remain consistent with this data:\n${databaseContext}` : "Provide general public health awareness information from reputable sources (like WHO and CDC) if no local database context is matched."
        ].join("\n");

        const prompt = `User says: "${cleanText}"\n\nGenerate an accurate public health response following your safety rules and guidelines.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            systemInstruction,
          }
        });

        replyText = response.text || "";
      } catch (aiError: any) {
        console.warn("Gemini model call failed or key missing. Using simulated local AI response fallback:", aiError.message);
        
        // Build a highly realistic, helpful fallback reply based on local matches!
        if (matchedDiseases.length > 0 || matchedMedicines.length > 0) {
          const parts = [
            `👋 Hello! I am **Mediplex AI Assistant** (simulated local backup mode). I found relevant public health entries in our local registry:`,
            ""
          ];
          
          matchedDiseases.forEach(d => {
            parts.push(`### 📋 Public Health Guideline: ${d.name}`);
            parts.push(`> **Overview**: ${d.overview}`);
            parts.push(`* 🩺 **Common Symptoms**: ${d.symptoms.join(", ")}`);
            parts.push(`* 🛡️ **Prevention Practices**: ${d.prevention.join(", ")}`);
            parts.push(`* ⚠️ **Emergency Signals**: ${d.warning}`);
            parts.push("");
          });
          
          matchedMedicines.forEach(m => {
            parts.push(`### 💊 Medicine Safety Details: ${m.name}`);
            parts.push(`* 📋 **Primary Use**: ${m.use}`);
            parts.push(`* ⚠️ **Safety Instructions**: ${m.safety}`);
            parts.push("");
          });

          parts.push("---");
          parts.push("*💡 Local Host Notice: To enable full conversational AI features with Google Gemini models on your localhost, make sure to add `GEMINI_API_KEY=\"your_key_here\"` inside your `.env` file and restart your local dev server.*");
          
          replyText = parts.join("\n");
        } else {
          replyText = [
            "👋 Hello! I am **Mediplex AI** (simulated local backup).",
            "",
            "I am ready to help you with public health information regarding common conditions (like Dengue, Malaria, Diabetes, Asthma, Influenza, Typhoid, Anemia, Hypertension) and basic medicine safety guidelines.",
            "",
            "### 💡 Local Host Configuration Guide",
            "To enable fully responsive conversational AI powered by Google Gemini, please complete the following step in your local environment:",
            "",
            "1. Create a `.env` file at the root of the project.",
            "2. Add your Gemini API key: `GEMINI_API_KEY=\"AIzaSy...\"`",
            "3. Restart the server using `npm run dev`.",
            "",
            "In the meantime, feel free to ask about any of our registry topics like **Dengue prevention**, **Asthma warning signs**, **Paracetamol safety guidelines**, or use our interactive **Symptom Checker**!"
          ].join("\n");
        }
      }

      if (!replyText) {
        replyText = "I apologize, but I could not formulate a response at this moment. Please consult a health professional for advice.";
      }

      // Step 6: Log bot reply
      if (uid) {
        try {
          if (!isDbConfigured) {
            throw new Error("Local offline database mode");
          }
          await db.insert(chatMessages)
            .values({
              uid,
              sender: "bot",
              text: replyText,
            });
        } catch (dbErr: any) {
          if (isDbConfigured) {
            console.warn("Database connection failed. Skipping bot message logging:", dbErr.message);
          }
        }
      }

      res.json({ text: replyText });
    } catch (error: any) {
      console.error("Chatbot failed:", error);
      res.status(500).json({ error: "The health assistant chatbot experienced an error. Please try again." });
    }
  });

  // ---------------------------------------------------------
  // Vite & Static File Serving
  // ---------------------------------------------------------

  if (process.env.NODE_ENV !== "production") {
    // In dev mode, mount Vite middleware to serve hot-reloaded SPA code
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production mode, serve compiled React files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Bind to 0.0.0.0 and port 3000
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MediPlex AI backend running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Critical server start failure:", error);
});
