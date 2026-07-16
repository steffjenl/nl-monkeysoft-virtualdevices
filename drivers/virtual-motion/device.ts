import BaseVirtualDevice from '../../lib/BaseVirtualDevice';
import { VirtualDeviceConfig } from '../../lib/types';

class VirtualMotionDevice extends BaseVirtualDevice {
  protected readonly config: VirtualDeviceConfig = {
    capabilityId: 'alarm_motion',
    valueType: 'boolean',
    defaultValue: false,
    trueTriggerId: 'motion_started',
    falseTriggerId: 'motion_ended',
  };
}

module.exports = VirtualMotionDevice;
