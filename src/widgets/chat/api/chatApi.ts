import { NebulaModel } from './model.ts';

// import { ChatMsg } from '@/db/chat';

const model = await NebulaModel.init_model('./models/llava-v1.6-mistral-7b.Q4_K_M.gguf');

// const openai = new OpenAI({
//   baseURL: 'http://127.0.0.1:52514/v1',
//   apiKey: 'none',
//   dangerouslyAllowBrowser: true,
// });
//
// export interface AIChatMessage {
//   role: 'user' | 'assistant';
//   content: string;
// }
//
// function getAIChatMessages(messages: ChatMsg[]): AIChatMessage[] {
//   return messages
//     .slice(0, -1)
//     .map((msg) => ({ role: msg.isUser ? 'user' : 'assistant', content: msg.text }));
// }
//

export async function stream(
  config: {
    messages: string[];
    onStreamStart: () => void;
    onTextChunkReceived: (chunk: string) => void;
    onStreamEnd: () => void;
    onTitleUpdate: (title: string) => void;
  },
  maxPredictLen: number = 100
) {
  const { messages, onStreamStart, onTextChunkReceived, onTitleUpdate, onStreamEnd } = config;

  const context = await model.create_context();
  context.onToken = (p) => {
    if (p.token != null) {
      onTextChunkReceived(p.token);
    } else {
      console.warn('received null token from model');
    }
  };

  context.onComplete = () => {
    onStreamEnd();
  };

  const contextFeedQueue = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const m of messages) {
    contextFeedQueue.push(context.eval_string(m, true));
  }

  Promise.all(contextFeedQueue);

  onStreamStart();

  await context.predict(maxPredictLen);

  onStreamEnd();
  onTitleUpdate(messages[messages.length - 2]);
}

