import BaseVirtualDevice from '../../lib/BaseVirtualDevice';
import { VirtualDeviceConfig } from '../../lib/types';

class VirtualPowerDevice extends BaseVirtualDevice {
  protected readonly config: VirtualDeviceConfig = {
    capabilityId: 'measure_power',
    valueType: 'number',
    defaultValue: 0,
    changedTriggerId: 'power_changed',
  };
}

module.exports = VirtualPowerDevice;
