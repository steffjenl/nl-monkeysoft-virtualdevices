import BaseVirtualDevice from '../../lib/BaseVirtualDevice';
import { VirtualDeviceConfig, VirtualValue } from '../../lib/types';
import { roundTo } from '../../lib/validators';

/**
 * The dim capability stores 0..1; all flow cards work in percentages.
 * Setting the dim level also syncs the onoff capability (>0 = on).
 */
class VirtualDimmerDevice extends BaseVirtualDevice {
  protected readonly config: VirtualDeviceConfig = {
    capabilityId: 'dim',
    valueType: 'number',
    defaultValue: 0,
    clampMin: 0,
    clampMax: 1,
  };

  async onInit(): Promise<void> {
    await super.onInit();
    if (typeof this.getCapabilityValue('onoff') !== 'boolean') {
      await this.setCapabilityValue('onoff', false).catch((err) => this.error(err));
    }
    // Turning the light on/off from the UI keeps the stored dim level.
    this.registerCapabilityListener('onoff', async () => {
      // no-op: the value itself is handled by Homey
    });
  }

  protected async onValueChanged(previous: VirtualValue | null, value: VirtualValue) {
    const toPercent = (dim: unknown) => roundTo((typeof dim === 'number' ? dim : 0) * 100, 0);
    await this.fireTrigger('dimmer_changed', {
      value: toPercent(value),
      previous: toPercent(previous),
    });
    await this.setCapabilityValue('onoff', (value as number) > 0).catch((err) => this.error(err));
  }
}

module.exports = VirtualDimmerDevice;
