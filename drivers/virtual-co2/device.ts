import BaseVirtualDevice from '../../lib/BaseVirtualDevice';
import { VirtualDeviceConfig } from '../../lib/types';

class VirtualCo2Device extends BaseVirtualDevice {
  protected readonly config: VirtualDeviceConfig = {
    capabilityId: 'measure_co2',
    valueType: 'number',
    defaultValue: 400,
    changedTriggerId: 'co2_changed',
    clampMin: 0,
  };
}

module.exports = VirtualCo2Device;
