import BaseVirtualDriver from '../../lib/BaseVirtualDriver';
import { VirtualFlowConfig } from '../../lib/types';

class VirtualNumberDriver extends BaseVirtualDriver {
  protected readonly flowConfig: VirtualFlowConfig = {
    capabilityId: 'virtual_number',
    valueType: 'number',
    inRangeConditionId: 'number_in_range',
    setActionId: 'number_set',
  };
}

module.exports = VirtualNumberDriver;
