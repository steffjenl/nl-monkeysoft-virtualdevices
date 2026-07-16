import BaseVirtualDriver from '../../lib/BaseVirtualDriver';
import { VirtualFlowConfig } from '../../lib/types';

class VirtualHumidityDriver extends BaseVirtualDriver {
  protected readonly flowConfig: VirtualFlowConfig = {
    capabilityId: 'measure_humidity',
    valueType: 'number',
    inRangeConditionId: 'humidity_in_range',
    setActionId: 'humidity_set',
  };
}

module.exports = VirtualHumidityDriver;
