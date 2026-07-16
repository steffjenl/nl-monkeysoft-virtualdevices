import BaseVirtualDevice from '../../lib/BaseVirtualDevice';
import { VirtualDeviceConfig } from '../../lib/types';

class VirtualStringDevice extends BaseVirtualDevice {
  protected readonly config: VirtualDeviceConfig = {
    capabilityId: 'virtual_text',
    valueType: 'string',
    defaultValue: '',
    changedTriggerId: 'text_changed',
  };
}

module.exports = VirtualStringDevice;
