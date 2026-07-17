import BaseVirtualDriver from '../../lib/BaseVirtualDriver';
import { VirtualFlowConfig } from '../../lib/types';

class VirtualButtonDriver extends BaseVirtualDriver {
  protected readonly flowConfig: VirtualFlowConfig = {
    capabilityId: 'onoff',
    valueType: 'boolean',
    isTrueConditionId: 'button_is_on',
    turnOnActionId: 'button_turn_on',
    turnOffActionId: 'button_turn_off',
    toggleActionId: 'button_toggle',
    setFromTagActionId: 'button_set_from_tag',
  };
}

module.exports = VirtualButtonDriver;
