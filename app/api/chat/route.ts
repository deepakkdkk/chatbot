import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/genai";
import { logtail } from "@/lib/logtail";

export async function POST(req: NextRequest) {
  try {
    logtail.info("/api/chat route hit");
    const { prompt } = await req.json();
    logtail.info("Prompt received", { prompt });
    if (!prompt) {
      logtail.warn("No prompt provided");
      return NextResponse.json({ text: "No prompt provided." }, { status: 400 });
    }
    const text = await generateContent(prompt);
    logtail.info("GenAI response", { text });
    return NextResponse.json({ text });
  } catch (e) {
    logtail.error("Error in /api/chat", { error: e });
    return NextResponse.json({ text: "Error generating response." }, { status: 500 });
  }
} 