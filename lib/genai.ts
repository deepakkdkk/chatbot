import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GENAI_API_KEY! });

export async function generateContent(prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  return response.text || "";
}

// New streaming function
export async function* generateContentStream(prompt: string) {
  const stream = await ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  for await (const chunk of stream) {
    const chunkText = chunk.text;
    if (chunkText) {
      yield chunkText;
    }
  }
} 