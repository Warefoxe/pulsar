import { Child, Command } from '@tauri-apps/api/shell';

export default class Llamafile {
  private command: Command;

  private process: Child | null;

  constructor(model = 'dolphin-2.6-mistral-7b.Q4_K_M.gguf') {
    this.command = Command.sidecar('bin/llamafile', [
      '-m',
      `models/${model}`,
      '--port',
      '52514',
      '--nobrowser',
    ]);
    this.process = null;

    this.command.on('error', console.error);
    this.command.stdout.on('data', console.log);
    this.command.stderr.on('data', console.error);
  }

  async spawn() {
    this.process = await this.command.spawn();
    return this.process;
  }

  // eslint-disable-next-line consistent-return
  async kill() {
    if (this.process) {
      return this.process.kill();
    }
  }
}
