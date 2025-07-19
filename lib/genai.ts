import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GENAI_API_KEY! });

export async function generateContent(prompt: string): Promise<string> {
  console.log("Calling GenAI with prompt:", prompt);
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  console.log("GenAI raw response:", response);
  return response.text || "";
} 