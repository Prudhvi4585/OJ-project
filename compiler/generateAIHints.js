const {GoogleGenAI} = require('@google/genai')
const dotenv = require('dotenv');
dotenv.config();

const ai =  new GoogleGenAI({apiKey : process.env.GEMINI_API_KEY});
async function generateAIHints(code, problem) {
    const prompt = process.env.PROMPT;
    const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
     contents: `${prompt}

Problem Description:
${problem}

User Code:
\`\`\`
${code}
\`\`\`

Respond with a short, helpful hint based on the user's code and the problem.`,
  });
  console.log(response.text);
   return response.text;
}

module.exports = generateAIHints;