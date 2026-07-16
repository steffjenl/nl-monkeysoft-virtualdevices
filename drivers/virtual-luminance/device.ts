import BaseVirtualDevice from '../../lib/BaseVirtualDevice';
import { VirtualDeviceConfig } from '../../lib/types';

class VirtualLuminanceDevice extends BaseVirtualDevice {
  protected readonly config: VirtualDeviceConfig = {
    capabilityId: 'measure_luminance',
    valueType: 'number',
    defaultValue: 0,
    changedTriggerId: 'luminance_changed',
    clampMin: 0,
  };
}

module.exports = VirtualLuminanceDevice;
