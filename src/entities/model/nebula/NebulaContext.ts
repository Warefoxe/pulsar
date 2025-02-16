import { invoke } from '@tauri-apps/api';
import { listen } from '@tauri-apps/api/event';

import { NebulaModel } from './NebulaModel.ts';

type NebulaPredictPayload = {
  model: string;
  context: string;
  token: string;
  finished: boolean;
};

type ContextOptions = {
  seed?: number;
  n_ctx?: number;
  n_threads?: number;
  user_format?: string;
  assistant_format?: string;
  prompt_format?: string;
  prompt_format_with_image?: string;
  stop_tokens?: string[];
  ctx?: {
    message: string;
    is_user: boolean;
  }[];
};

const DEFAULT_TEMP = 0.5;

export class NebulaContext {
  private model: NebulaModel;

  private contextId: string;

  public onToken?: (p: { token: string; finished: boolean }) => void;

  public onComplete?: (p: { finished: boolean }) => void;

  constructor(model: NebulaModel, ctx: string) {
    this.model = model;
    this.contextId = ctx;
  }

  public static async initContext({
    model,
    cctx = [],
    stopTokens,
  }: {
    model: NebulaModel;
    cctx: { message: string; is_user: boolean }[];
    stopTokens?: string[];
  }): Promise<NebulaContext> {
    let contextOptions: ContextOptions = { ctx: cctx, n_ctx: 20000 };
    if (stopTokens) {
      contextOptions = { ...contextOptions, stop_tokens: stopTokens };
    }
    const ctx = await invoke<string>('plugin:nebula|model_init_context', {
      modelPath: model.model,
      contextOptions,
    });

    return new NebulaContext(model, ctx);
  }

  public async drop() {
    await invoke('plugin:nebula|model_drop_context', {
      modelPath: this.model.model,
      contextId: this.contextId,
    });
  }

  public async evaluateString(data: string, useBos: boolean = false) {
    await invoke('plugin:nebula|model_context_eval_string', {
      modelPath: this.model.model,
      contextId: this.contextId,
      data,
      useBos,
    });
  }

  public async evaluateImage(base64EncodedImage: string, prompt: string) {
    await invoke('plugin:nebula|model_context_eval_image', {
      modelPath: this.model.model,
      contextId: this.contextId,
      base64EncodedImage,
      prompt,
    });
  }

  public async predict({
    maxLength,
    temp = DEFAULT_TEMP,
    topP,
  }: {
    maxLength: number;
    temp?: number;
    topP?: number;
  }) {
    const unsubscribe = await listen<NebulaPredictPayload>('nebula-predict', (event) => {
      if (event.payload.model === this.model.model && event.payload.context === this.contextId) {
        if (!event.payload.finished) {
          this.onToken?.({ token: event.payload.token, finished: event.payload.finished });
        } else {
          this.onComplete?.({ finished: event.payload.finished });
        }
      }
    });

    await invoke('plugin:nebula|model_context_predict', {
      modelPath: this.model.model,
      contextId: this.contextId,
      maxLen: maxLength,
      temp,
      topP,
    });

    unsubscribe();
  }
}
