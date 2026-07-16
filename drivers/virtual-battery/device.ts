import BaseVirtualDevice from '../../lib/BaseVirtualDevice';
import { VirtualDeviceConfig, VirtualValue } from '../../lib/types';
import { clamp, parseNumber } from '../../lib/validators';

class VirtualBatteryDevice extends BaseVirtualDevice {
  protected readonly config: VirtualDeviceConfig = {
    capabilityId: 'measure_battery',
    valueType: 'number',
    defaultValue: 100,
    changedTriggerId: 'battery_changed',
  };

  /** Battery levels are always a percentage; clamp to 0..100. */
  protected async normalizeValue(rawValue: unknown): Promise<VirtualValue> {
    const parsed = parseNumber(rawValue);
    if (parsed === null) {
      throw new Error(this.homey.__('errors.invalid_number'));
    }
    return clamp(parsed, 0, 100);
  }
}

module.exports = VirtualBatteryDevice;
