import { withBetterStack, BetterStackRequest } from '@logtail/next';
import { NextResponse } from 'next/server';
import { generateContent } from '@/lib/genai';

export const POST = withBetterStack(async (req: BetterStackRequest) => {
  req.log.info('Chat API called', { timestamp: new Date().toISOString() });

  try {
    const { prompt } = await req.json();
    req.log.info('Prompt received', { prompt });

    if (!prompt) {
      req.log.warn('No prompt provided');
      return NextResponse.json({ text: 'No prompt provided.' }, { status: 400 });
    }

    const text = await generateContent(prompt);
    req.log.info('GenAI response', { text });

    return NextResponse.json({ text });
  } catch (e) {
    req.log.error('Error in /api/chat', { error: e });
    return NextResponse.json({ text: 'Error generating response.' }, { status: 500 });
  }
});