import { google } from '@ai-sdk/google';
import { streamText, convertToCoreMessages } from 'ai';

// Permitir respuestas de hasta 30 segundos
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    // CAMBIO FINAL: Usamos el modelo que SÍ tienes en tu lista
    model: google('gemini-2.5-flash'), 
    
    messages: convertToCoreMessages(messages),
    onError: ({ error }) => {
      console.error("🔥 Error de Google:", error);
    },
  });

  return result.toDataStreamResponse();
}