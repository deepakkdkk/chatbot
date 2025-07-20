import { withBetterStack, BetterStackRequest } from '@logtail/next';
import { NextResponse } from 'next/server';
import { generateContent, generateContentStream } from '@/lib/genai';

export const POST = withBetterStack(async (req: BetterStackRequest) => {
  const endpoint = '/api/chat';
  const method = 'POST';
  const start = Date.now();

  try {
    const { prompt, stream } = await req.json();
    const url = new URL(req.url);
    const forceStream = url.searchParams.get('stream') === 'true';

    if (!prompt) {
      const duration = Date.now() - start;
      req.log.info(`${method} ${endpoint} 400 in ${duration}ms`);
      return NextResponse.json({ text: 'No prompt provided.' }, { status: 400 });
    }

    // Check if streaming is requested (either via body or query param)
    if (stream || forceStream) {
      try {
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of generateContentStream(prompt)) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
              }
              controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
              controller.close();
            } catch (error) {
              req.log.error('Error in streaming response', { error });
              controller.error(error);
            }
          },
        });

        const duration = Date.now() - start;
        req.log.info(`${method} ${endpoint} 200 (stream) in ${duration}ms`);
        
        return new Response(stream, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        });
      } catch (streamError) {
        req.log.error('Streaming not supported, falling back to non-streaming', { error: streamError });
        // Fall back to non-streaming if streaming fails
      }
    }

    // Non-streaming response (fallback)
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