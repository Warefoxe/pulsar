import { BaseDirectory, createDir, exists, readDir } from '@tauri-apps/api/fs';

import { MODELS_DIR_NAME } from '@/entities/model/consts/model.const.ts';
import { supportedLlms } from '@/entities/model/consts/supported-llms.const.ts';
import { LlmName } from '@/entities/model/types/model.types.ts';

export async function modelExists(modelName: LlmName, isMmp = false) {
  if (!(await exists(MODELS_DIR_NAME, { dir: BaseDirectory.AppData }))) {
    await createDir(MODELS_DIR_NAME, { recursive: true, dir: BaseDirectory.AppData });
  }

  const entries = await readDir(MODELS_DIR_NAME, { dir: BaseDirectory.AppData });

  const { localName, mmp } = supportedLlms[modelName];

  const fileName = isMmp ? mmp?.localName : localName;

  return entries.some((entry) => entry.name === fileName);
}
