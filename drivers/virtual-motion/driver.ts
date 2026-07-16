import BaseVirtualDriver from '../../lib/BaseVirtualDriver';
import { VirtualFlowConfig } from '../../lib/types';

class VirtualMotionDriver extends BaseVirtualDriver {
  protected readonly flowConfig: VirtualFlowConfig = {
    capabilityId: 'alarm_motion',
    valueType: 'boolean',
    isTrueConditionId: 'motion_is_active',
    turnOnActionId: 'motion_start',
    turnOffActionId: 'motion_stop',
  };
}

module.exports = VirtualMotionDriver;
