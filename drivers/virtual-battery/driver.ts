import BaseVirtualDriver from '../../lib/BaseVirtualDriver';
import { VirtualFlowConfig } from '../../lib/types';

class VirtualBatteryDriver extends BaseVirtualDriver {
  protected readonly flowConfig: VirtualFlowConfig = {
    capabilityId: 'measure_battery',
    valueType: 'number',
    inRangeConditionId: 'battery_in_range',
    setActionId: 'battery_set',
  };
}

module.exports = VirtualBatteryDriver;
