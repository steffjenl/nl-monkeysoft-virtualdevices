import BaseVirtualDevice from '../../lib/BaseVirtualDevice';
import { VirtualDeviceConfig } from '../../lib/types';

class VirtualButtonDevice extends BaseVirtualDevice {
  protected readonly config: VirtualDeviceConfig = {
    capabilityId: 'onoff',
    valueType: 'boolean',
    defaultValue: false,
    changedTriggerId: 'button_toggled',
    trueTriggerId: 'button_turned_on',
    falseTriggerId: 'button_turned_off',
  };
}

module.exports = VirtualButtonDevice;
