import BaseVirtualDriver from '../../lib/BaseVirtualDriver';
import { VirtualFlowConfig } from '../../lib/types';

class VirtualPressureDriver extends BaseVirtualDriver {
  protected readonly flowConfig: VirtualFlowConfig = {
    capabilityId: 'measure_pressure',
    valueType: 'number',
    inRangeConditionId: 'pressure_in_range',
    setActionId: 'pressure_set',
  };
}

module.exports = VirtualPressureDriver;
