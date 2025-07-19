import { withBetterStack, BetterStackRequest } from '@logtail/next';
import { NextResponse } from 'next/server';
import { generateContent } from '@/lib/genai';

export const POST = withBetterStack(async (req: BetterStackRequest) => {
  const endpoint = '/api/chat';
  const method = 'POST';
  const start = Date.now();

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      const duration = Date.now() - start;
      req.log.info(`${method} ${endpoint} 400 in ${duration}ms`);
      return NextResponse.json({ text: 'No prompt provided.' }, { status: 400 });
    }

    const text = await generateContent(prompt);
    const duration = Date.now() - start;
    req.log.info(`${method} ${endpoint} 200 in ${duration}ms`);
    return NextResponse.json({ text });
  } catch (e) {
    const duration = Date.now() - start;
    req.log.info(`${method} ${endpoint} 500 in ${duration}ms`);
    req.log.error('Error in /api/chat', { error: e, endpoint, status: 500 });
    return NextResponse.json({ text: 'Error generating response.' }, { status: 500 });
  }
});