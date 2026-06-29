import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Maps the voice keys to exact requested description strings.
 */
function getVoiceName(voiceMode) {
  return {
    doctor: "Dramatic Doctor who loves medical drama",
    mom: "Worried Indian Mom who thinks everything causes death",
    comedian: "Stand-up comedian roasting this product on stage",
    professor: "Nerdy chemistry professor who makes puns",
    news: "Breaking news anchor treating this chip packet as a national emergency"
  }[voiceMode] || "Worried Indian Mom who thinks everything causes death";
}

/**
 * Parsers plain-text response from Gemini into structured schema fields.
 */
function parseGeminiTextResponse(text) {
  const result = {
    dangerLevel: "concerning",
    ratingLabel: "Concerning",
    description: "",
    roast: "",
    suspiciousIngredients: [],
    healthySwap: { name: "Indian Swap", description: "A healthier alternative." },
    damageReport: { depleted: [], diseases: [] }
  };

  const extractField = (labelText) => {
    const idx = text.indexOf(labelText);
    if (idx === -1) return "";
    
    const labels = ["DANGER_LEVEL:", "FUNNY_ONELINER:", "INGREDIENT_BREAKDOWN:", "HEALTH_RISKS:", "INDIAN_ALTERNATIVE:"];
    let endIdx = text.length;
    
    labels.forEach(l => {
      if (l !== labelText) {
        const lIdx = text.indexOf(l, idx + labelText.length);
        if (lIdx !== -1 && lIdx < endIdx && lIdx > idx) {
          endIdx = lIdx;
        }
      }
    });
    
    let val = text.substring(idx + labelText.length, endIdx).trim();
    // Remove brackets if model wraps them in [brackets]
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val.substring(1, val.length - 1).trim();
    }
    return val;
  };

  // 1. Danger Level
  const dangerVal = extractField("DANGER_LEVEL:").toLowerCase();
  if (dangerVal.includes("safe")) {
    result.dangerLevel = "safe";
    result.ratingLabel = "Safe";
  } else if (dangerVal.includes("meh")) {
    result.dangerLevel = "meh";
    result.ratingLabel = "Meh";
  } else if (dangerVal.includes("doctor") || dangerVal.includes("see a doctor") || dangerVal.includes("call your doctor")) {
    result.dangerLevel = "danger";
    result.ratingLabel = "See a Doctor";
  } else {
    result.dangerLevel = "concerning";
    result.ratingLabel = "Concerning";
  }

  // 2. Funny One-Liner (Roast)
  const oneLiner = extractField("FUNNY_ONELINER:");
  result.description = oneLiner;
  result.roast = oneLiner;

  // 3. Ingredient Breakdown
  const breakdown = extractField("INGREDIENT_BREAKDOWN:");
  if (breakdown) {
    result.suspiciousIngredients = [{
      name: "Top Suspicious Ingredients",
      info: breakdown
    }];
  }

  // 4. Health Risks
  const risks = extractField("HEALTH_RISKS:");
  if (risks) {
    result.damageReport.diseases = [risks];
  }

  // 5. Indian Alternative
  const swap = extractField("INDIAN_ALTERNATIVE:");
  if (swap) {
    const hyphenIdx = swap.indexOf("-");
    if (hyphenIdx !== -1) {
      result.healthySwap.name = swap.substring(0, hyphenIdx).trim();
      result.healthySwap.description = swap.substring(hyphenIdx + 1).trim();
    } else {
      result.healthySwap.name = swap;
      result.healthySwap.description = "A healthier traditional choice.";
    }
  }

  return result;
}

/**
 * Generates the full product analysis in the selected voice and language.
 */
export async function generateSnackAnalysis(apiKey, productName, ingredientsText, voiceMode, lang, profile) {
  if (!apiKey) {
    throw new Error("Missing Gemini API Key. Go to Settings to add one.");
  }

  const ai = new GoogleGenerativeAI(apiKey);
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

  const voiceDescription = getVoiceName(voiceMode);
  
  const langContext = lang === 'hi' 
    ? "Hinglish (conversational Hindi written in English letters, e.g. 'Beta ye kachra mat khao, Ramesh ko dekho')"
    : "English";

  const prompt = `
You are a ${voiceDescription}.
Analyse the real ingredients of "${productName}": ${ingredientsText}

Give response in this exact format:
DANGER_LEVEL: [Safe / Meh / Concerning / See a Doctor]
FUNNY_ONELINER: [one funny sentence about this product in ${langContext}]
INGREDIENT_BREAKDOWN: [explain top 3 suspicious ingredients in simple words in ${langContext}]
HEALTH_RISKS: [what deficiency or disease can regular eating cause in ${langContext}]
INDIAN_ALTERNATIVE: [a healthier, affordable Indian food swap in ${langContext}]

Keep it entertaining and educational.
`;

  try {
    const result = await model.generateContent([prompt]);
    const responseText = result.response.text();
    return parseGeminiTextResponse(responseText);
  } catch (error) {
    console.error("Gemini Snack Analysis Error:", error);
    throw new Error(`AI Analysis Failed: ${error.message}`);
  }
}

/**
 * Re-generates only the roast (funny one-liner) for a new voice mode and language.
 */
export async function generateVoiceRoast(apiKey, productName, ingredientsText, voiceMode, lang, profile) {
  if (!apiKey) {
    throw new Error("Missing Gemini API Key.");
  }

  const ai = new GoogleGenerativeAI(apiKey);
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

  const voiceDescription = getVoiceName(voiceMode);
  const langContext = lang === 'hi' 
    ? "Hinglish (conversational Hindi written in English letters, e.g. 'Beta ye kachra mat khao')"
    : "English";

  const prompt = `
You are a ${voiceDescription}.
Analyse the ingredients of "${productName}": ${ingredientsText}

Provide only the one funny sentence roast about this product in ${langContext} conforming to this exact template:
FUNNY_ONELINER: [one funny sentence about this product]
`;

  try {
    const result = await model.generateContent([prompt]);
    const text = result.response.text();
    
    const idx = text.indexOf("FUNNY_ONELINER:");
    if (idx === -1) return text.trim();
    
    let val = text.substring(idx + "FUNNY_ONELINER:".length).trim();
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val.substring(1, val.length - 1).trim();
    }
    return val;
  } catch (error) {
    console.error("Gemini Roast Re-generation Error:", error);
    throw new Error(`AI Roast Failed: ${error.message}`);
  }
}

/**
 * Explains a specific food additive (E-number) in the active voice and language.
 */
export async function explainAdditive(apiKey, additiveCode, voiceMode, lang) {
  if (!apiKey) {
    throw new Error("Missing Gemini API Key.");
  }

  const ai = new GoogleGenerativeAI(apiKey);
  const model = ai.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" }
  });

  const voiceDescription = getVoiceName(voiceMode);
  const langContext = lang === 'hi' ? "Hinglish (Hindi written in English letters)." : "Plain English.";

  const prompt = `
Explain what the food additive "${additiveCode}" actually is, its health risks, and whether it is safe/moderate/avoid.
Keep it strictly under 2 sentences.
Adopt the voice of: "${voiceDescription}".
Translate into: "${langContext}".

You MUST return a JSON object with this exact schema:
{
  "explanation": "2-sentence humorous explanation.",
  "safetyClass": "safe" | "moderate" | "avoid"
}
`;

  try {
    const result = await model.generateContent([prompt]);
    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Gemini Additive Explanation Error:", error);
    return {
      explanation: `That is food additive ${additiveCode}. It is chemically processed and generally used to preserve shelf life.`,
      safetyClass: "moderate"
    };
  }
}
