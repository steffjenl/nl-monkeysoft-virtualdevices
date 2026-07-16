import Homey from 'homey';

/**
 * Virtual Devices.
 * All logic lives in the drivers; flow card run listeners are registered
 * per driver in BaseVirtualDriver.
 */
export default class VirtualDevicesApp extends Homey.App {
  async onInit(): Promise<void> {
    this.log('Virtual Devices is running');
  }
}

module.exports = VirtualDevicesApp;
