const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
let activeModelName = null;

const MODEL_CANDIDATES = [
  process.env.GEMINI_MODEL,
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash-latest",
  "gemini-1.5-pro-latest",
].filter(Boolean);

const getModel = (modelName) => genAI.getGenerativeModel({ model: modelName });

const generateAiResponse = async (prompt) => {
  const tried = [];

  if (activeModelName) {
    try {
      const result = await getModel(activeModelName).generateContent(prompt);
      return result.response.text();
    } catch (error) {
      tried.push(`${activeModelName}: ${error.message}`);
      activeModelName = null;
    }
  }

  for (const modelName of MODEL_CANDIDATES) {
    try {
      const result = await getModel(modelName).generateContent(prompt);
      activeModelName = modelName;
      return result.response.text();
    } catch (error) {
      tried.push(`${modelName}: ${error.message}`);
    }
  }

  throw new Error(
    `All Gemini model candidates failed. Tried: ${tried.join(" | ")}. Configure GEMINI_MODEL in .env with a supported model.`
  );
};

module.exports = { generateAiResponse };
