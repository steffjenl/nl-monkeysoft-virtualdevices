import BaseVirtualDriver from '../../lib/BaseVirtualDriver';
import { VirtualFlowConfig } from '../../lib/types';

class VirtualContactDriver extends BaseVirtualDriver {
  protected readonly flowConfig: VirtualFlowConfig = {
    capabilityId: 'alarm_contact',
    valueType: 'boolean',
    isTrueConditionId: 'contact_is_open',
    turnOnActionId: 'contact_open',
    turnOffActionId: 'contact_close',
    setFromTagActionId: 'contact_set_from_tag',
  };
}

module.exports = VirtualContactDriver;
