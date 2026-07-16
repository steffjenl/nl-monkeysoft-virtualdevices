import BaseVirtualDevice from '../../lib/BaseVirtualDevice';
import { VirtualDeviceConfig } from '../../lib/types';

class VirtualEnergyDevice extends BaseVirtualDevice {
  protected readonly config: VirtualDeviceConfig = {
    capabilityId: 'meter_power',
    valueType: 'number',
    defaultValue: 0,
    changedTriggerId: 'energy_changed',
    clampMin: 0,
  };
}

module.exports = VirtualEnergyDevice;
