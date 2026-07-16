import BaseVirtualDevice from '../../lib/BaseVirtualDevice';
import { VirtualDeviceConfig } from '../../lib/types';

class VirtualBooleanDevice extends BaseVirtualDevice {
  protected readonly config: VirtualDeviceConfig = {
    capabilityId: 'onoff',
    valueType: 'boolean',
    defaultValue: false,
    changedTriggerId: 'boolean_changed',
  };
}

module.exports = VirtualBooleanDevice;
