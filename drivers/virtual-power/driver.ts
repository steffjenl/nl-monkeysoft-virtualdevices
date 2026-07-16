import BaseVirtualDriver from '../../lib/BaseVirtualDriver';
import { VirtualFlowConfig } from '../../lib/types';

class VirtualPowerDriver extends BaseVirtualDriver {
  protected readonly flowConfig: VirtualFlowConfig = {
    capabilityId: 'measure_power',
    valueType: 'number',
    inRangeConditionId: 'power_in_range',
    setActionId: 'power_set',
  };
}

module.exports = VirtualPowerDriver;
