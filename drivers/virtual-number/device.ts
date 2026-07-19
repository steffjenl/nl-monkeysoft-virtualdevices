import BaseVirtualDevice from '../../lib/BaseVirtualDevice';
import { VirtualDeviceConfig, VirtualValue } from '../../lib/types';
import { clamp, isFiniteNumber, parseNumber, roundTo } from '../../lib/validators';

interface NumberSettings {
  decimals?: unknown;
  unit?: unknown;
  limit_range?: unknown;
  min?: unknown;
  max?: unknown;
}

class VirtualNumberDevice extends BaseVirtualDevice {
  protected readonly config: VirtualDeviceConfig = {
    capabilityId: 'virtual_number',
    valueType: 'number',
    defaultValue: 0,
    changedTriggerId: 'number_changed',
  };

  async onInit(): Promise<void> {
    await super.onInit();
    await this.applyCapabilityOptions(this.getSettings() as NumberSettings);
  }

  /** Rounds to the configured decimals and clamps when a range is enabled. */
  protected async normalizeValue(rawValue: unknown): Promise<VirtualValue> {
    const parsed = parseNumber(rawValue);
    if (parsed === null) {
      throw new Error(this.homey.__('errors.invalid_number'));
    }
    return this.constrain(parsed, this.getSettings() as NumberSettings);
  }

  async onSettings({
    oldSettings,
    newSettings,
    changedKeys,
  }: {
    oldSettings: { [key: string]: unknown };
    newSettings: { [key: string]: unknown };
    changedKeys: string[];
  }): Promise<void> {
    const settings = newSettings as NumberSettings;
    await this.applyCapabilityOptions(settings);

    // Re-apply the constraints of the new settings to the current value.
    const current = this.getValue();
    if (isFiniteNumber(current)) {
      const constrained = this.constrain(current, settings);
      if (constrained !== current) {
        await this.writeValue(constrained);
      }
    }

    await super.onSettings({ oldSettings, newSettings, changedKeys });
  }

  private constrain(value: number, settings: NumberSettings): number {
    const decimals = parseNumber(settings.decimals) ?? 2;
    let result = roundTo(value, decimals);
    if (settings.limit_range === true) {
      const min = parseNumber(settings.min) ?? 0;
      const max = parseNumber(settings.max) ?? 100;
      result = clamp(result, min, max);
    }
    return result;
  }

  /** Reflects unit/decimals settings in how Homey renders the capability. */
  private async applyCapabilityOptions(settings: NumberSettings): Promise<void> {
    try {
      await this.setCapabilityOptions(this.config.capabilityId, {
        units: typeof settings.unit === 'string' ? settings.unit : '',
        decimals: parseNumber(settings.decimals) ?? 2,
      });
    } catch (err) {
      this.error('Failed to apply capability options:', err);
    }
  }
}

module.exports = VirtualNumberDevice;
