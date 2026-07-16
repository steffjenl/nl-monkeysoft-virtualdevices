import Homey from 'homey';
import { randomUUID } from 'crypto';
import { registerVirtualFlowCards } from './flow';
import { VirtualFlowConfig } from './types';

/**
 * Shared behavior for all virtual drivers:
 * - registers the driver's flow card run listeners from a declarative config,
 * - implements the simplest possible pairing: every pairing session offers
 *   one fresh virtual device with a unique id; the user can rename it in
 *   the Homey UI afterwards.
 */
export default abstract class BaseVirtualDriver extends Homey.Driver {
  protected abstract readonly flowConfig: VirtualFlowConfig;

  async onInit(): Promise<void> {
    registerVirtualFlowCards(this.homey, this.flowConfig);
    this.log(`${this.constructor.name} initialized`);
  }

  async onPairListDevices(): Promise<Array<{ name: string; data: { id: string } }>> {
    return [
      {
        name: this.localizedDriverName(),
        data: { id: randomUUID() },
      },
    ];
  }

  /** Driver name from the manifest in the user's language, en as fallback. */
  private localizedDriverName(): string {
    const names = (this.manifest as { name?: Record<string, string> }).name ?? {};
    const language = this.homey.i18n.getLanguage();
    return names[language] ?? names.en ?? 'Virtual device';
  }
}
