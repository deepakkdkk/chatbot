import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/genai";

export async function POST(req: NextRequest) {
  try {
    console.log("/api/chat route hit");
    const { prompt } = await req.json();
    console.log("Prompt received:", prompt);
    if (!prompt) return NextResponse.json({ text: "No prompt provided." }, { status: 400 });
    const text = await generateContent(prompt);
    console.log("GenAI response:", text);
    return NextResponse.json({ text });
  } catch (e) {
    console.error("Error in /api/chat:", e);
    return NextResponse.json({ text: "Error generating response." }, { status: 500 });
  }
} 