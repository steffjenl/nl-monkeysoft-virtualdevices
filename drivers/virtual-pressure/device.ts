import BaseVirtualDevice from '../../lib/BaseVirtualDevice';
import { VirtualDeviceConfig } from '../../lib/types';

class VirtualPressureDevice extends BaseVirtualDevice {
  protected readonly config: VirtualDeviceConfig = {
    capabilityId: 'measure_pressure',
    valueType: 'number',
    defaultValue: 1013,
    changedTriggerId: 'pressure_changed',
    clampMin: 0,
  };
}

module.exports = VirtualPressureDevice;
