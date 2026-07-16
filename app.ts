import Homey from 'homey';

/**
 * MonkeySoft Virtual Devices.
 * All logic lives in the drivers; flow card run listeners are registered
 * per driver in BaseVirtualDriver.
 */
export default class VirtualDevicesApp extends Homey.App {
  async onInit(): Promise<void> {
    this.log('MonkeySoft Virtual Devices is running');
  }
}

module.exports = VirtualDevicesApp;
