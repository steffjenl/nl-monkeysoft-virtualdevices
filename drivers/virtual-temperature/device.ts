import BaseVirtualDevice from '../../lib/BaseVirtualDevice';
import { VirtualDeviceConfig } from '../../lib/types';

class VirtualTemperatureDevice extends BaseVirtualDevice {
  protected readonly config: VirtualDeviceConfig = {
    capabilityId: 'measure_temperature',
    valueType: 'number',
    defaultValue: 20,
    changedTriggerId: 'temperature_changed',
  };
}

module.exports = VirtualTemperatureDevice;
