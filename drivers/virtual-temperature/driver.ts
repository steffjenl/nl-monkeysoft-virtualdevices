import BaseVirtualDriver from '../../lib/BaseVirtualDriver';
import { VirtualFlowConfig } from '../../lib/types';

class VirtualTemperatureDriver extends BaseVirtualDriver {
  protected readonly flowConfig: VirtualFlowConfig = {
    capabilityId: 'measure_temperature',
    valueType: 'number',
    inRangeConditionId: 'temperature_in_range',
    setActionId: 'temperature_set',
  };
}

module.exports = VirtualTemperatureDriver;
