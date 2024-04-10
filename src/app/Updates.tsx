import { emit } from '@tauri-apps/api/event';
import { checkUpdate } from '@tauri-apps/api/updater';

import { loge, logi } from '@/shared/lib/Logger';

export async function checkUpdates() {
  try {
    if (process.env.NODE_ENV === 'development')
      logi('Updates', 'Development mode, skipping updates check');
    const { shouldUpdate } = await checkUpdate();

    if (shouldUpdate) {
      emit('tauri://update');
    }
  } catch (error: any) {
    loge('Updates', error.toString());
  }
}

