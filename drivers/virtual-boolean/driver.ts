import BaseVirtualDriver from '../../lib/BaseVirtualDriver';
import { VirtualFlowConfig } from '../../lib/types';

class VirtualBooleanDriver extends BaseVirtualDriver {
  protected readonly flowConfig: VirtualFlowConfig = {
    capabilityId: 'onoff',
    valueType: 'boolean',
    isTrueConditionId: 'boolean_is_true',
    setActionId: 'boolean_set',
    setFromTagActionId: 'boolean_set_from_tag',
  };
}

module.exports = VirtualBooleanDriver;
