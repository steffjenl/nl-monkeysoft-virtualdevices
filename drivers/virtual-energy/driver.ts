import BaseVirtualDriver from '../../lib/BaseVirtualDriver';
import { VirtualFlowConfig } from '../../lib/types';

class VirtualEnergyDriver extends BaseVirtualDriver {
  protected readonly flowConfig: VirtualFlowConfig = {
    capabilityId: 'meter_power',
    valueType: 'number',
    inRangeConditionId: 'energy_in_range',
    setActionId: 'energy_set',
    addActionId: 'energy_add',
  };
}

module.exports = VirtualEnergyDriver;
