import BaseVirtualDriver from '../../lib/BaseVirtualDriver';
import { VirtualFlowConfig } from '../../lib/types';

class VirtualLuminanceDriver extends BaseVirtualDriver {
  protected readonly flowConfig: VirtualFlowConfig = {
    capabilityId: 'measure_luminance',
    valueType: 'number',
    inRangeConditionId: 'luminance_in_range',
    setActionId: 'luminance_set',
  };
}

module.exports = VirtualLuminanceDriver;
