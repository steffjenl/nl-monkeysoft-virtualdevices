import HomeyInstance from 'homey/lib/Homey';
import BaseVirtualDevice from './BaseVirtualDevice';
import { VirtualFlowConfig } from './types';
import { inRange, parseBoolean, parseNumber, textContains, textEquals } from './validators';

interface DeviceArgs {
  device: BaseVirtualDevice;
}

/**
 * Registers run listeners for the flow cards a virtual driver declared in
 * its driver.flow.compose.json. Trigger cards need no run listener: they are
 * fired from BaseVirtualDevice when the value changes.
 */
export function registerVirtualFlowCards(homey: HomeyInstance, config: VirtualFlowConfig): void {
  const { capabilityId } = config;

  if (config.inRangeConditionId) {
    homey.flow
      .getConditionCard(config.inRangeConditionId)
      .registerRunListener(async (args: DeviceArgs & { min: number; max: number }) => {
        const value = args.device.getCapabilityValue(capabilityId);
        return inRange(value, args.min, args.max);
      });
  }

  if (config.isTrueConditionId) {
    homey.flow
      .getConditionCard(config.isTrueConditionId)
      .registerRunListener(async (args: DeviceArgs) => {
        return args.device.getCapabilityValue(capabilityId) === true;
      });
  }

  if (config.equalsConditionId) {
    homey.flow
      .getConditionCard(config.equalsConditionId)
      .registerRunListener(async (args: DeviceArgs & { value: string }) => {
        const caseSensitive = args.device.getSetting('case_sensitive') === true;
        return textEquals(args.device.getCapabilityValue(capabilityId), args.value, caseSensitive);
      });
  }

  if (config.containsConditionId) {
    homey.flow
      .getConditionCard(config.containsConditionId)
      .registerRunListener(async (args: DeviceArgs & { value: string }) => {
        const caseSensitive = args.device.getSetting('case_sensitive') === true;
        return textContains(
          args.device.getCapabilityValue(capabilityId),
          args.value,
          caseSensitive,
        );
      });
  }

  if (config.setActionId) {
    homey.flow
      .getActionCard(config.setActionId)
      .registerRunListener(async (args: DeviceArgs & { value: unknown }) => {
        const value =
          config.valueType === 'boolean' ? parseBoolean(args.value) : (args.value as never);
        await args.device.setValue(value);
      });
  }

  if (config.setFromTagActionId) {
    homey.flow
      .getActionCard(config.setFromTagActionId)
      .registerRunListener(async (args: DeviceArgs & { droptoken?: unknown }) => {
        // Droptokens can be null when the source tag has no value yet.
        if (typeof args.droptoken !== 'boolean') {
          throw new Error(homey.__('errors.invalid_boolean'));
        }
        await args.device.setValue(args.droptoken);
      });
  }

  if (config.addActionId) {
    homey.flow
      .getActionCard(config.addActionId)
      .registerRunListener(async (args: DeviceArgs & { value: number }) => {
        const current = parseNumber(args.device.getCapabilityValue(capabilityId)) ?? 0;
        const delta = parseNumber(args.value);
        if (delta === null) {
          throw new Error(homey.__('errors.invalid_number'));
        }
        await args.device.setValue(current + delta);
      });
  }

  if (config.turnOnActionId) {
    homey.flow
      .getActionCard(config.turnOnActionId)
      .registerRunListener(async (args: DeviceArgs) => {
        await args.device.setValue(true);
      });
  }

  if (config.turnOffActionId) {
    homey.flow
      .getActionCard(config.turnOffActionId)
      .registerRunListener(async (args: DeviceArgs) => {
        await args.device.setValue(false);
      });
  }

  if (config.toggleActionId) {
    homey.flow
      .getActionCard(config.toggleActionId)
      .registerRunListener(async (args: DeviceArgs) => {
        const current = args.device.getCapabilityValue(capabilityId) === true;
        await args.device.setValue(!current);
      });
  }
}
