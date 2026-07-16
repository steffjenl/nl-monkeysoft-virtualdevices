import BaseVirtualDriver from '../../lib/BaseVirtualDriver';
import { VirtualFlowConfig } from '../../lib/types';

class VirtualStringDriver extends BaseVirtualDriver {
  protected readonly flowConfig: VirtualFlowConfig = {
    capabilityId: 'virtual_text',
    valueType: 'string',
    equalsConditionId: 'text_equals',
    containsConditionId: 'text_contains',
    setActionId: 'text_set',
  };
}

module.exports = VirtualStringDriver;
