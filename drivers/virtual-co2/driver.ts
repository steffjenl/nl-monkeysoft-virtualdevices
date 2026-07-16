import BaseVirtualDriver from '../../lib/BaseVirtualDriver';
import { VirtualFlowConfig } from '../../lib/types';

class VirtualCo2Driver extends BaseVirtualDriver {
  protected readonly flowConfig: VirtualFlowConfig = {
    capabilityId: 'measure_co2',
    valueType: 'number',
    inRangeConditionId: 'co2_in_range',
    setActionId: 'co2_set',
  };
}

module.exports = VirtualCo2Driver;
