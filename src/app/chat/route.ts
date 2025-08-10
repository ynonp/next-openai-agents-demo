import { Agent, run } from '@openai/agents';

const agent = new Agent({
  name: 'Assistant',
  instructions: 'You are a helpful assistant',
});

export async function POST() {
  const result = await run(agent, 'Tell me a story about a cat.', {
    stream: true,
  });

  // Convert the result to a standard ReadableStream
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      
      try {
        for await (const event of result) {
          if (event.type === 'raw_model_stream_event') {
            if (event.data.type === "output_text_delta") {
              controller.enqueue(encoder.encode(event.data.delta));
            }                        
          }          
        }
      } catch (error) {
        controller.error(error);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  });
}