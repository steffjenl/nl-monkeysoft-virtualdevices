import BaseVirtualDriver from '../../lib/BaseVirtualDriver';
import BaseVirtualDevice from '../../lib/BaseVirtualDevice';
import { VirtualFlowConfig } from '../../lib/types';
import { inRange, parseNumber } from '../../lib/validators';

/**
 * The dimmer's cards work in percentages while the dim capability stores
 * 0..1, so this driver registers its own run listeners instead of using the
 * generic percentage-less ones from lib/flow.ts.
 */
class VirtualDimmerDriver extends BaseVirtualDriver {
  protected readonly flowConfig: VirtualFlowConfig = {
    capabilityId: 'dim',
    valueType: 'number',
  };

  async onInit(): Promise<void> {
    await super.onInit();

    this.homey.flow
      .getConditionCard('dimmer_in_range')
      .registerRunListener(
        async (args: { device: BaseVirtualDevice; min: number; max: number }) => {
          const dim = parseNumber(args.device.getCapabilityValue('dim'));
          if (dim === null) return false;
          return inRange(dim * 100, args.min, args.max);
        },
      );

    this.homey.flow
      .getActionCard('dimmer_set')
      .registerRunListener(async (args: { device: BaseVirtualDevice; value: number }) => {
        const percent = parseNumber(args.value);
        if (percent === null) {
          throw new Error(this.homey.__('errors.invalid_number'));
        }
        await args.device.setValue(percent / 100);
      });
  }
}

module.exports = VirtualDimmerDriver;
