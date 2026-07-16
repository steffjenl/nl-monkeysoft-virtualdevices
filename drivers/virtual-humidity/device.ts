import BaseVirtualDevice from '../../lib/BaseVirtualDevice';
import { VirtualDeviceConfig } from '../../lib/types';

class VirtualHumidityDevice extends BaseVirtualDevice {
  protected readonly config: VirtualDeviceConfig = {
    capabilityId: 'measure_humidity',
    valueType: 'number',
    defaultValue: 50,
    changedTriggerId: 'humidity_changed',
    clampMin: 0,
    clampMax: 100,
  };
}

module.exports = VirtualHumidityDevice;
