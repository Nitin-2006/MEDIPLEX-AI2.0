import { Disease } from "../types.ts";

export const STATIC_DISEASES: Disease[] = [
  {
    id: 1,
    name: "Dengue Fever",
    overview: "A mosquito-borne viral infection causing severe flu-like illness, transmitted by Aedes mosquitoes. It is prevalent in tropical and sub-tropical climates.",
    aliases: ["dengue", "breakbone fever", "mosquito fever", "platelets"],
    symptoms: [
      "Sudden high fever (up to 104°F/40°C)",
      "Severe headache and pain behind the eyes",
      "Muscle and joint pains (breakbone feeling)",
      "Nausea, vomiting, and skin rash"
    ],
    prevention: [
      "Use insect repellent containing DEET or Picaridin",
      "Eliminate standing water around the home to prevent breeding",
      "Wear protective long-sleeved clothing",
      "Install window screens and sleep under mosquito nets"
    ],
    warning: "Seek immediate emergency care if you experience severe abdominal pain, persistent vomiting, bleeding gums, or rapid breathing (Signs of Dengue Hemorrhagic Fever).",
    isCustom: false,
    createdAt: "2026-07-03T00:00:00.000Z"
  },
  {
    id: 2,
    name: "Malaria",
    overview: "A life-threatening disease caused by Plasmodium parasites transmitted through the bites of infected female Anopheles mosquitoes.",
    aliases: ["malaria", "shivering fever", "chills", "mosquito bites"],
    symptoms: [
      "Shaking chills and high fever",
      "Profuse sweating as body temperature falls",
      "Fatigue, headache, and body aches",
      "Mild jaundice and enlargement of the spleen"
    ],
    prevention: [
      "Take prescribed antimalarial prophylaxis when traveling",
      "Sleep under insecticide-treated bed nets",
      "Spray indoor walls with residual insecticides",
      "Avoid outdoor activities during peak mosquito biting times (dusk to dawn)"
    ],
    warning: "Malaria can quickly progress to severe illness and cerebral malaria causing seizures, confusion, or coma if not treated within 24 hours.",
    isCustom: false,
    createdAt: "2026-07-03T00:00:00.000Z"
  },
  {
    id: 3,
    name: "Typhoid Fever",
    overview: "A life-threatening bacterial infection caused by Salmonella Typhi, usually spread through contaminated food or water.",
    aliases: ["typhoid", "salmonella", "contaminated water", "enteric fever"],
    symptoms: [
      "Prolonged high fever that increases stepwise daily",
      "Extreme fatigue, weakness, and headache",
      "Abdominal pain, constipation, or diarrhea",
      "Rose-colored spots on the chest or abdomen"
    ],
    prevention: [
      "Get vaccinated before traveling to endemic areas",
      "Drink only boiled, bottled, or chemically treated water",
      "Eat thoroughly cooked, hot food; avoid raw street food",
      "Practice meticulous handwashing with soap after using restrooms"
    ],
    warning: "Untreated typhoid can lead to severe intestinal perforation, internal bleeding, and septic shock. Consult a doctor for antibiotics immediately.",
    isCustom: false,
    createdAt: "2026-07-03T00:00:00.000Z"
  },
  {
    id: 4,
    name: "Seasonal Influenza (Flu)",
    overview: "An acute respiratory infection caused by influenza viruses. It spreads easily through droplets from coughing or sneezing.",
    aliases: ["flu", "influenza", "seasonal flu", "cold", "viral cough"],
    symptoms: [
      "Abrupt onset of high fever and dry cough",
      "Sore throat and runny or stuffed nose",
      "Severe muscle, joint, and body aches",
      "Pervasive exhaustion lasting up to two weeks"
    ],
    prevention: [
      "Receive an annual seasonal influenza vaccine",
      "Wash hands frequently with soap and water or alcohol-based rubs",
      "Avoid close contact with people who are coughing or sick",
      "Cover your mouth and nose with a tissue when coughing"
    ],
    warning: "Watch for difficulty breathing, shortness of breath, bluish lips, or chest pain, which indicate severe respiratory compromise or secondary pneumonia.",
    isCustom: false,
    createdAt: "2026-07-03T00:00:00.000Z"
  },
  {
    id: 5,
    name: "Type 2 Diabetes",
    overview: "A chronic metabolic condition characterized by high blood sugar levels due to insulin resistance or insufficient insulin production.",
    aliases: ["diabetes", "sugar", "type 2 diabetes", "high blood sugar", "insulin"],
    symptoms: [
      "Increased thirst (polydipsia) and frequent urination",
      "Unexplained weight loss despite increased appetite",
      "Blurry vision and slow-healing sores or cuts",
      "Tingling or numbness in the hands or feet"
    ],
    prevention: [
      "Maintain a balanced diet rich in whole grains, fiber, and lean protein",
      "Engage in at least 150 minutes of moderate physical activity weekly",
      "Manage weight and avoid excessive intake of simple sugars",
      "Monitor blood sugar levels and schedule routine physical checkups"
    ],
    warning: "Extremely high blood sugar can cause Diabetic Ketoacidosis (DKA) or Hyperosmolar State, leading to rapid breathing, fruity breath, confusion, and unconsciousness.",
    isCustom: false,
    createdAt: "2026-07-03T00:00:00.000Z"
  },
  {
    id: 6,
    name: "Hypertension (High Blood Pressure)",
    overview: "A common condition where the long-term force of the blood against your artery walls is high enough to eventually cause cardiovascular disease.",
    aliases: ["hypertension", "high blood pressure", "bp", "silent killer"],
    symptoms: [
      "Usually asymptomatic ('silent killer') until severe",
      "Dull headaches or dizzy spells",
      "Shortness of breath or nosebleeds under extreme pressure",
      "Irregular heartbeats or chest discomfort"
    ],
    prevention: [
      "Reduce dietary sodium/salt intake to under 2,000 mg daily",
      "Eat a diet rich in fruits, vegetables, and low-fat dairy (DASH diet)",
      "Limit alcohol consumption and avoid smoking",
      "Exercise regularly and manage psychological stress levels"
    ],
    warning: "Seek emergency attention if blood pressure spikes above 180/120 mmHg accompanied by chest pain, severe headache, numbness/weakness, or visual changes.",
    isCustom: false,
    createdAt: "2026-07-03T00:00:00.000Z"
  },
  {
    id: 7,
    name: "Asthma",
    overview: "A chronic condition that affects the airways in the lungs, causing them to become inflamed, narrow, and lined with excess mucus.",
    aliases: ["asthma", "wheezing", "breathing issue", "shortness of breath"],
    symptoms: [
      "Shortness of breath and chest tightness",
      "Wheezing or whistling sound when exhaling",
      "Trouble sleeping caused by shortness of breath",
      "Coughing fits that worsen with cold air or exercise"
    ],
    prevention: [
      "Identify and avoid environmental triggers (dust, pollen, smoke, pet dander)",
      "Take prescribed daily controller medications consistently",
      "Monitor your breathing patterns using a peak flow meter",
      "Get vaccinated against respiratory infections like flu and pneumonia"
    ],
    warning: "An asthma attack that does not respond to a quick-relief rescue inhaler, accompanied by struggling to talk or chest retractions, requires immediate emergency care.",
    isCustom: false,
    createdAt: "2026-07-03T00:00:00.000Z"
  },
  {
    id: 8,
    name: "Tuberculosis (TB)",
    overview: "A serious, potentially infectious bacterial disease caused by Mycobacterium tuberculosis that mainly affects the lungs.",
    aliases: ["tuberculosis", "tb", "chronic cough", "blood in cough"],
    symptoms: [
      "Persistent cough lasting 3 or more weeks",
      "Coughing up blood or sputum (phlegm)",
      "Unexplained weight loss and loss of appetite",
      "Drenching night sweats and low-grade fever"
    ],
    prevention: [
      "BCG vaccination in infants in high-burden countries",
      "Ensure proper ventilation in rooms and crowded spaces",
      "Practice good cough etiquette (cover mouth, wear masks if active)",
      "Identify and complete treatment for Latent TB Infection early"
    ],
    warning: "Active pulmonary TB is highly contagious. Failing to complete the full 6-to-9 month course of antibiotics can lead to dangerous, drug-resistant strain mutations.",
    isCustom: false,
    createdAt: "2026-07-03T00:00:00.000Z"
  },
  {
    id: 9,
    name: "Gastroenteritis",
    overview: "An inflammation of the stomach and intestines, typically resulting from bacterial toxins, viral infections, or food contamination.",
    aliases: ["gastroenteritis", "food poisoning", "diarrhea", "stomach bug", "vomiting"],
    symptoms: [
      "Watery diarrhea and abdominal cramps",
      "Nausea, vomiting, and loss of appetite",
      "Low-grade fever and mild muscle aches",
      "Headache and lightheadedness from dehydration"
    ],
    prevention: [
      "Wash hands thoroughly after handling raw meats and using toilets",
      "Ensure food is cooked to safe minimum internal temperatures",
      "Refrigerate perishable foodstuffs promptly (within 2 hours)",
      "Sanitize kitchen surfaces, cutting boards, and utensils frequently"
    ],
    warning: "Severe dehydration is the primary danger. Seek medical aid if you cannot keep fluids down for 24 hours, have blood in stools, or experience extreme thirst and dry mouth.",
    isCustom: false,
    createdAt: "2026-07-03T00:00:00.000Z"
  },
  {
    id: 10,
    name: "Cholera",
    overview: "An acute diarrheal infection caused by ingestion of food or water contaminated with the bacterium Vibrio cholerae.",
    aliases: ["cholera", "vibrio", "severe diarrhea", "rice water stools"],
    symptoms: [
      "Profuse, painless, watery diarrhea resembling 'rice water'",
      "Rapid and severe vomiting",
      "Extreme dehydration (sunken eyes, dry skin, muscle cramps)",
      "Hypovolemic shock if fluids are not aggressively replaced"
    ],
    prevention: [
      "Drink and use safe, purified water (chlorinated or boiled)",
      "Practice strict hand hygiene before food preparation and eating",
      "Avoid raw or undercooked shellfish and seafood",
      "Use sanitary waste disposal systems to prevent water source contamination"
    ],
    warning: "Cholera can dehydrate a healthy adult to death within hours if untreated. Immediate oral rehydration salts (ORS) or intravenous fluids are life-saving.",
    isCustom: false,
    createdAt: "2026-07-03T00:00:00.000Z"
  },
  {
    id: 11,
    name: "Migraine",
    overview: "A neurological condition characterized by intense, debilitating throbbing headaches, often accompanied by extreme sensitivity to light and sound.",
    aliases: ["migraine", "headache", "throbbing head", "aura", "sensory sensitivity"],
    symptoms: [
      "Severe throbbing or pulsing pain, typically on one side of the head",
      "Extreme sensitivity to light (photophobia) and sound (phonophobia)",
      "Nausea and vomiting",
      "Visual disturbances or 'auras' (flashing lights, zigzag lines) before pain starts"
    ],
    prevention: [
      "Keep a headache journal to identify specific triggers (stress, aged cheeses, skipping meals)",
      "Establish a consistent sleep schedule and manage daily stress",
      "Stay hydrated and avoid high amounts of caffeine or artificial sweeteners",
      "Consult a doctor about preventative medications or magnesium supplements"
    ],
    warning: "Seek immediate medical attention if you experience a sudden, explosive headache like a 'thunderclap', or if it is accompanied by fever, neck stiffness, confusion, or weakness.",
    isCustom: false,
    createdAt: "2026-07-04T00:00:00.000Z"
  },
  {
    id: 12,
    name: "COVID-19",
    overview: "A highly contagious respiratory disease caused by the SARS-CoV-2 coronavirus. It spreads mainly from person to person through respiratory droplets.",
    aliases: ["covid", "coronavirus", "covid-19", "sars-cov-2", "loss of smell"],
    symptoms: [
      "Fever or chills, dry cough, and shortness of breath",
      "Fatigue, muscle or body aches, and headaches",
      "New, sudden loss of taste or smell",
      "Sore throat, congestion, runny nose, or diarrhea"
    ],
    prevention: [
      "Stay up-to-date with approved COVID-19 vaccines and booster doses",
      "Wear a high-filtering mask (N95/KN95) in crowded, poorly ventilated indoor areas",
      "Wash hands frequently with soap and water or use hand sanitizer",
      "Maintain physical distance from individuals displaying symptoms"
    ],
    warning: "Seek emergency medical help immediately if you experience trouble breathing, persistent chest pain or pressure, new confusion, or pale, gray, or blue skin/lips.",
    isCustom: false,
    createdAt: "2026-07-04T00:00:00.000Z"
  },
  {
    id: 13,
    name: "GERD (Acid Reflux)",
    overview: "Gastroesophageal Reflux Disease is a chronic digestive disorder where stomach acid repeatedly flows back into the tube connecting your mouth and stomach (esophagus).",
    aliases: ["gerd", "acid reflux", "heartburn", "indigestion", "sour throat"],
    symptoms: [
      "A burning sensation in your chest (heartburn), usually after eating",
      "Chest pain or difficulty swallowing (dysphagia)",
      "Regurgitation of food or sour/bitter liquid",
      "A sensation of a lump in your throat, or a chronic dry cough"
    ],
    prevention: [
      "Eat smaller, more frequent meals instead of large portions",
      "Avoid lying down for at least 3 hours after eating a meal",
      "Elevate the head of your bed by 6 to 9 inches",
      "Limit trigger foods such as fatty foods, spicy dishes, chocolate, caffeine, and mint"
    ],
    warning: "Severe chest pain, especially if it radiates to your arm or jaw and is accompanied by shortness of breath, can be a sign of a heart attack rather than acid reflux. Seek emergency care.",
    isCustom: false,
    createdAt: "2026-07-04T00:00:00.000Z"
  },
  {
    id: 14,
    name: "Coronary Artery Disease",
    overview: "A prevalent cardiovascular condition where the major blood vessels supplying your heart struggle to deliver enough blood, oxygen, and nutrients.",
    aliases: ["heart disease", "cad", "coronary disease", "chest pain", "angina"],
    symptoms: [
      "Chest pain, tightness, or pressure (angina)",
      "Shortness of breath, especially during physical activity",
      "Pervasive fatigue and weakness",
      "Pain or discomfort radiating to the shoulders, arms, neck, or jaw"
    ],
    prevention: [
      "Adopt a heart-healthy diet low in saturated fats, trans fats, and cholesterol",
      "Engage in regular aerobic exercise and maintain a healthy weight",
      "Quit smoking and avoid secondhand smoke exposure",
      "Keep blood pressure, cholesterol levels, and diabetes strictly managed"
    ],
    warning: "An sudden worsening of chest discomfort accompanied by sweating, nausea, dizziness, or shortness of breath suggests an acute heart attack. Call emergency services immediately.",
    isCustom: false,
    createdAt: "2026-07-04T00:00:00.000Z"
  },
  {
    id: 15,
    name: "Osteoarthritis",
    overview: "The most common form of arthritis, occurring when the protective cartilage that cushions the ends of your bones wears down over time, primarily in joints.",
    aliases: ["arthritis", "osteoarthritis", "joint pain", "stiffness", "bone pain"],
    symptoms: [
      "Pain in joints during or after movement",
      "Joint stiffness, particularly noticeable upon awakening or after inactivity",
      "Loss of flexibility and range of motion in affected joint areas",
      "Grating sensation or hearing pops/crackles when using the joint"
    ],
    prevention: [
      "Maintain a healthy weight to reduce mechanical stress on knees and hips",
      "Stay active with low-impact exercises like swimming, cycling, or walking",
      "Protect your joints from repetitive strain and injuries",
      "Practice good posture and avoid prolonged stationary positions"
    ],
    warning: "Joint swelling accompanied by redness, warmth, or a sudden fever indicates a possible infection (septic arthritis), which is a medical emergency.",
    isCustom: false,
    createdAt: "2026-07-04T00:00:00.000Z"
  },
  {
    id: 16,
    name: "Fatty Liver Disease (NAFLD)",
    overview: "Non-Alcoholic Fatty Liver Disease is a condition in which excess fat builds up in liver cells, closely linked to obesity, high cholesterol, and insulin resistance.",
    aliases: ["fatty liver", "nafld", "liver fat", "metabolic liver"],
    symptoms: [
      "Usually has no symptoms in the early stages",
      "Fatigue or general physical weakness",
      "Mild discomfort or full ache in the upper right side of the abdomen",
      "Abdominal swelling or jaundice (yellowing skin/eyes) in advanced stages"
    ],
    prevention: [
      "Choose a healthy plant-based diet rich in fruits, vegetables, and whole grains",
      "Limit consumption of processed sugars, high-fructose corn syrup, and saturated fats",
      "Aim for at least 30 minutes of physical exercise most days of the week",
      "Work with a healthcare team to manage metabolic syndromes or obesity"
    ],
    warning: "Advanced fatty liver can progress to liver cirrhosis, characterized by fluid in the abdomen (ascites), mental confusion (encephalopathy), or vomiting of blood.",
    isCustom: false,
    createdAt: "2026-07-04T00:00:00.000Z"
  },
  {
    id: 17,
    name: "Chronic Kidney Disease",
    overview: "A gradual, progressive loss of kidney function over time. The kidneys filter wastes and excess fluids from your blood, which are then excreted in urine.",
    aliases: ["ckd", "kidney disease", "renal failure", "kidneys", "proteinuria"],
    symptoms: [
      "Nausea, vomiting, loss of appetite, and fatigue",
      "Changes in urination frequency or blood in urine",
      "Swelling of feet, ankles, hands, or eyes due to fluid retention",
      "Persistent itching and muscle cramps"
    ],
    prevention: [
      "Keep blood pressure below 130/80 mmHg and control blood sugar meticulously",
      "Limit excessive intake of over-the-counter painkillers (NSAIDs like ibuprofen)",
      "Adopt a balanced low-sodium diet and avoid smoking",
      "Schedule regular blood and urine tests if you have diabetes or hypertension"
    ],
    warning: "Severe shortness of breath, chest pain, uncontrollable vomiting, confusion, or a near-total cessation of urination indicate acute uremia or kidney failure requiring immediate emergency dialysis.",
    isCustom: false,
    createdAt: "2026-07-04T00:00:00.000Z"
  },
  {
    id: 18,
    name: "Clinical Depression",
    overview: "A serious mental health disorder characterized by persistently depressed mood, loss of interest in activities, causing significant impairment in daily life.",
    aliases: ["depression", "mdd", "clinical depression", "mental health", "sadness"],
    symptoms: [
      "Persistent feelings of sadness, emptiness, hopelessness, or tearfulness",
      "Loss of interest or pleasure in normal hobbies and activities",
      "Significant weight changes or altered sleep patterns (insomnia/hypersomnia)",
      "Feelings of worthlessness, guilt, fatigue, and difficulty concentrating"
    ],
    prevention: [
      "Cultivate a strong social support network of family, friends, or groups",
      "Incorporate physical activity and a structured routine into your day",
      "Practice mindfulness, journaling, and stress management strategies",
      "Seek counseling or cognitive behavioral therapy (CBT) early during distress"
    ],
    warning: "If you or someone you know is experiencing thoughts of self-harm or suicide, please seek immediate crisis intervention support or call a local emergency/suicide prevention hotline.",
    isCustom: false,
    createdAt: "2026-07-04T00:00:00.000Z"
  },
  {
    id: 19,
    name: "General Anxiety Disorder",
    overview: "A chronic mental health condition characterized by excessive, persistent, and unrealistic worry about everyday life events and circumstances.",
    aliases: ["anxiety", "gad", "panic", "worry", "stress"],
    symptoms: [
      "Constant feelings of dread, restlessness, or being wound-up or on edge",
      "Being easily fatigued, irritable, or having muscle tension",
      "Difficulty concentrating or mind going blank",
      "Sleep disturbances (trouble falling or staying asleep)"
    ],
    prevention: [
      "Limit consumption of stimulants like caffeine, nicotine, and energy drinks",
      "Practice deep breathing exercises, progressive muscle relaxation, or yoga",
      "Challenge negative thoughts and prioritize manageable daily tasks",
      "Participate in support groups or talk therapy sessions"
    ],
    warning: "Anxiety can present as an intense panic attack featuring rapid heart rate, shaking, chest tightness, and a feeling of impending doom. Seek emergency triage if chest pain is severe to rule out cardiac events.",
    isCustom: false,
    createdAt: "2026-07-04T00:00:00.000Z"
  },
  {
    id: 20,
    name: "Iron Deficiency Anemia",
    overview: "A common condition in which blood lacks adequate healthy red blood cells, caused by a shortage of iron needed to produce hemoglobin.",
    aliases: ["anemia", "iron deficiency", "low iron", "pale skin", "fatigue"],
    symptoms: [
      "Extreme fatigue, weakness, and lightheadedness",
      "Pale skin, cold hands and feet, or brittle nails",
      "Chest pain, fast heartbeat, or shortness of breath during exertion",
      "Cravings for non-nutritive substances like ice or dirt (pica)"
    ],
    prevention: [
      "Eat iron-rich foods like spinach, lentils, beans, poultry, and red meat",
      "Combine iron intake with Vitamin C (e.g., citrus fruits) to enhance absorption",
      "Limit intake of coffee and tea during meals as they inhibit iron absorption",
      "Take prenatal or standard iron supplements if recommended by a clinician"
    ],
    warning: "Chronic severe anemia can lead to a rapid, irregular heartbeat (arrhythmia) and cardiac enlargement or congestive heart failure. Seek care for severe fatigue.",
    isCustom: false,
    createdAt: "2026-07-04T00:00:00.000Z"
  },
  {
    id: 21,
    name: "Hypothyroidism",
    overview: "An underactive thyroid condition where your thyroid gland doesn't produce enough crucial thyroid hormones to keep metabolic rates normal.",
    aliases: ["hypothyroidism", "underactive thyroid", "thyroid", "cold sensitivity"],
    symptoms: [
      "Fatigue, unexpected weight gain, and increased sensitivity to cold",
      "Dry skin, thinning hair, and muscle weakness",
      "Constipation and a puffy face",
      "Slower heart rate, joint swelling, and hoarse voice"
    ],
    prevention: [
      "Ensure adequate dietary iodine intake (using iodized salt, eating seafood)",
      "Avoid excess consumption of raw goitrogens (like cabbage/kale) if at risk",
      "Monitor thyroid levels regularly if you have a family history of autoimmune disorders",
      "Take prescribed thyroid hormone replacement (levothyroxine) exactly as directed"
    ],
    warning: "Severe, untreated hypothyroidism can lead to Myxedema Coma, a rare life-threatening condition marked by extreme cold intolerance, drowsiness, confusion, and lethargy.",
    isCustom: false,
    createdAt: "2026-07-04T00:00:00.000Z"
  },
  {
    id: 22,
    name: "Chickenpox (Varicella)",
    overview: "A highly contagious viral infection caused by the Varicella-Zoster virus, leading to an itchy, blister-like skin rash.",
    aliases: ["chickenpox", "varicella", "itchy blisters", "spots", "pox"],
    symptoms: [
      "An itchy rash of fluid-filled pink or red blisters",
      "Fever, loss of appetite, and headache",
      "Tiredness and a general feeling of being unwell",
      "Crusting and scabbing over of popped blisters"
    ],
    prevention: [
      "Receive two doses of the Varicella (chickenpox) vaccine",
      "Isolate infected individuals to prevent spreading to vulnerable people",
      "Avoid scratching blisters to prevent secondary bacterial skin infections",
      "Wash hands thoroughly with soap after contact with rashes or fluids"
    ],
    warning: "Seek urgent care if the rash spreads to the eyes, or is accompanied by extreme drowsiness, confusion, rapid breathing, or severe vomiting.",
    isCustom: false,
    createdAt: "2026-07-04T00:00:00.000Z"
  },
  {
    id: 23,
    name: "Appendicitis",
    overview: "An acute inflammation of the appendix, a small finger-shaped pouch that projects from your colon on the lower right side of your abdomen.",
    aliases: ["appendicitis", "appendix", "abdominal pain", "belly ache"],
    symptoms: [
      "Sudden pain that starts near the navel and shifts to the lower right abdomen",
      "Pain that worsens with coughing, walking, or jarred movements",
      "Nausea, vomiting, and low-grade fever",
      "Loss of appetite and abdominal bloating or flatulence"
    ],
    prevention: [
      "While not fully preventable, eating foods rich in fiber (fruits, vegetables) may reduce risks",
      "Avoid delays in seeking professional evaluation for acute stomach pains",
      "Maintain active bowel habits and report persistent local pains"
    ],
    warning: "A ruptured appendix is life-threatening and causes widespread abdominal infection (peritonitis). Seek emergency surgical care immediately if abdominal pain is sudden and severe.",
    isCustom: false,
    createdAt: "2026-07-04T00:00:00.000Z"
  },
  {
    id: 24,
    name: "Peptic Ulcer Disease",
    overview: "Sores that develop on the inside lining of your stomach, upper small intestine (duodenum), often caused by H. pylori bacterial infections or long-term NSAID painkiller use.",
    aliases: ["peptic ulcer", "stomach ulcer", "ulcer", "stomach burn"],
    symptoms: [
      "Burning stomach pain, especially between meals or at night",
      "Feeling of fullness, bloating, or belching",
      "Intolerance to fatty foods and acid reflux",
      "Nausea or vomiting in severe instances"
    ],
    prevention: [
      "Limit the frequent or unprescribed use of NSAID pain relievers (aspirin, ibuprofen)",
      "Avoid smoking, excess alcohol, and high-stress factors that irritate stomach linings",
      "Practice good food and water sanitation to prevent H. pylori infections",
      "Eat smaller, well-timed meals to neutralize stomach acid"
    ],
    warning: "Vomiting blood (which may look like coffee grounds), dark tarry black stools, or sudden, sharp abdominal pain indicate a bleeding or perforated ulcer. Seek emergency care immediately.",
    isCustom: false,
    createdAt: "2026-07-04T00:00:00.000Z"
  },
  {
    id: 25,
    name: "Insomnia",
    overview: "A common sleep disorder where you have persistent trouble falling asleep, staying asleep, or getting high-quality, restorative sleep.",
    aliases: ["insomnia", "sleep disorder", "sleeplessness", "restless sleep", "fatigue"],
    symptoms: [
      "Difficulty falling asleep at night or waking up during the night",
      "Waking up too early and still feeling tired or unrefreshed",
      "Daytime sleepiness, irritability, anxiety, or depression",
      "Increased errors, accidents, or difficulty focusing on daily tasks"
    ],
    prevention: [
      "Keep your bedtime and waking time consistent every single day, including weekends",
      "Avoid screens (phones, computers, TVs) for at least 1 hour before sleeping",
      "Keep your bedroom dark, quiet, and cool (around 65°F / 18°C)",
      "Avoid large meals, caffeine, and alcohol close to bedtime"
    ],
    warning: "Chronic sleep deprivation significantly increases the risk of automobile/occupational accidents, high blood pressure, type 2 diabetes, and severe cognitive distress. Consult a doctor if insomnia persists over a month.",
    isCustom: false,
    createdAt: "2026-07-04T00:00:00.000Z"
  }
];
