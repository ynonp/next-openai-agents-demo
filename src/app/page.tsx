'use client';
import { FormEvent, useState } from "react";

export default function Home() {
  const [streamedText, setStreamedText] = useState('');

  async function startStreaming(ev: FormEvent) {
    ev.preventDefault();

    try {
      const response = await fetch('/chat', {
        method: "POST"
      });
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setStreamedText(prev => prev + decoder.decode(value));
      }
    } catch (error) {
      console.error('Streaming error:', error);
    }
    setStreamedText(prev => prev + 'Done!');
  }

  return (
    <div >
      <main >
        <p>{streamedText}</p>
        <form onSubmit={startStreaming}>
          <input type="text" />
          <input type="submit" value="Send" />
        </form>
      </main>
    </div>
  );
}
