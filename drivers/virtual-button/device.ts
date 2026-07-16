import BaseVirtualDevice from '../../lib/BaseVirtualDevice';
import { VirtualDeviceConfig, VirtualValue } from '../../lib/types';

class VirtualButtonDevice extends BaseVirtualDevice {
  protected readonly config: VirtualDeviceConfig = {
    capabilityId: 'onoff',
    valueType: 'boolean',
    defaultValue: false,
  };

  protected async onValueChanged(previous: VirtualValue | null, value: VirtualValue) {
    await this.fireTrigger(value === true ? 'button_turned_on' : 'button_turned_off', {});
    await this.fireTrigger('button_toggled', {
      value: value === true,
      previous: previous === true,
    });
  }
}

module.exports = VirtualButtonDevice;
