export async function POST() {
  const encoder = new TextEncoder();
  const customReadable = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode('Processing...'));
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      controller.enqueue(encoder.encode('Verifying hash...'));
      await new Promise(resolve => setTimeout(resolve, 1500));
      controller.enqueue(encoder.encode('Scanning file...'));
      await new Promise(resolve => setTimeout(resolve, 2000));
      controller.enqueue(encoder.encode('Generating link...'));
      controller.close(); // Signal end of stream
    },
  });

  return new Response(customReadable, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}