import BaseVirtualDevice from '../../lib/BaseVirtualDevice';
import { VirtualDeviceConfig } from '../../lib/types';

class VirtualBatteryDevice extends BaseVirtualDevice {
  protected readonly config: VirtualDeviceConfig = {
    capabilityId: 'measure_battery',
    valueType: 'number',
    defaultValue: 100,
    changedTriggerId: 'battery_changed',
    clampMin: 0,
    clampMax: 100,
  };
}

module.exports = VirtualBatteryDevice;
