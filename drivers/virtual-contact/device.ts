import BaseVirtualDevice from '../../lib/BaseVirtualDevice';
import { VirtualDeviceConfig } from '../../lib/types';

class VirtualContactDevice extends BaseVirtualDevice {
  protected readonly config: VirtualDeviceConfig = {
    capabilityId: 'alarm_contact',
    valueType: 'boolean',
    defaultValue: false,
    trueTriggerId: 'contact_opened',
    falseTriggerId: 'contact_closed',
  };
}

module.exports = VirtualContactDevice;
