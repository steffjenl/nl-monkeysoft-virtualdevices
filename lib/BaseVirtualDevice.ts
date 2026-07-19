import Homey from 'homey';
import {
  extractJsonPollValue,
  fetchJsonPollPayload,
  getJsonPollSettings,
  JsonPollSettingsInput,
  JsonPollValidationError,
} from './jsonPoll';
import { VirtualDeviceConfig, VirtualValue } from './types';
import { isFiniteNumber, parseNumber } from './validators';

/**
 * Shared behavior for all virtual devices:
 * - loads the persisted capability value on init and applies a safe default
 *   when none exists yet (Homey persists capability values across restarts),
 * - funnels every value change (capability listener, flow action, API)
 *   through a single setValue() path that validates, normalizes, updates the
 *   capability and fires the "changed" trigger with value/previous tokens.
 */
export default abstract class BaseVirtualDevice extends Homey.Device {
  protected abstract readonly config: VirtualDeviceConfig;
  private jsonPollTimer: NodeJS.Timeout | null = null;
  private jsonPollRunInFlight = false;
  private jsonPollRunQueued = false;
  private jsonPollGeneration = 0;

  async onInit(): Promise<void> {
    await this.ensureInitialValue();

    // Fired when the value is set from the Homey UI, the API or a standard
    // (built-in) flow card. Homey applies the value itself after this
    // listener resolves; we validate and fire our triggers.
    this.registerCapabilityListener(this.config.capabilityId, async (value) => {
      const normalized = await this.normalizeValue(value);
      await this.handleChange(this.getValue(), normalized);
    });

    await this.applyJsonPolling(this.getSettings() as JsonPollSettingsInput);

    this.log(`${this.getName()} initialized (${this.config.capabilityId})`);
  }

  async onSettings({
    newSettings,
  }: {
    oldSettings: { [key: string]: unknown };
    newSettings: { [key: string]: unknown };
    changedKeys: string[];
  }): Promise<void> {
    await this.applyJsonPolling(newSettings as JsonPollSettingsInput);
  }

  async onDeleted(): Promise<void> {
    this.stopJsonPolling();
  }

  /** Current value of the virtual capability (null when never set). */
  getValue(): VirtualValue | null {
    return this.getCapabilityValue(this.config.capabilityId) as VirtualValue | null;
  }

  /**
   * Sets the value programmatically (flow actions call this). Validates and
   * normalizes the input, persists it and fires triggers when it changed.
   * Returns the value that was actually applied.
   */
  async setValue(rawValue: unknown): Promise<VirtualValue> {
    const normalized = await this.normalizeValue(rawValue);
    await this.writeValue(normalized);
    return normalized;
  }

  /**
   * Persists an already-normalized value and fires triggers when it changed.
   * Use setValue() unless normalization has been done by the caller (e.g.
   * re-clamping in onSettings, where getSettings() would still be stale).
   */
  protected async writeValue(normalized: VirtualValue): Promise<void> {
    const previous = this.getValue();
    if (previous !== normalized) {
      await this.setCapabilityValue(this.config.capabilityId, normalized);
      await this.handleChange(previous, normalized);
    }
  }

  /**
   * Validates and normalizes raw input to a value of the configured type.
   * Throws a user-facing (localized) error for invalid input. Subclasses
   * override this to apply extra constraints (range, rounding, clamping).
   */
  protected async normalizeValue(rawValue: unknown): Promise<VirtualValue> {
    switch (this.config.valueType) {
      case 'boolean':
        if (typeof rawValue !== 'boolean') {
          throw new Error(this.homey.__('errors.invalid_boolean'));
        }
        return rawValue;
      case 'number': {
        let parsed = parseNumber(rawValue);
        if (parsed === null) {
          throw new Error(this.homey.__('errors.invalid_number'));
        }
        if (this.config.clampMin !== undefined) parsed = Math.max(parsed, this.config.clampMin);
        if (this.config.clampMax !== undefined) parsed = Math.min(parsed, this.config.clampMax);
        return parsed;
      }
      case 'string':
        if (typeof rawValue !== 'string') {
          throw new Error(this.homey.__('errors.invalid_text'));
        }
        return rawValue;
    }
  }

  /**
   * Fires the configured "changed" trigger and gives subclasses a hook for
   * extra triggers (e.g. the button's turned on/off/toggled cards).
   */
  private async handleChange(previous: VirtualValue | null, value: VirtualValue): Promise<void> {
    if (previous === value) return;
    if (this.config.changedTriggerId) {
      await this.fireTrigger(this.config.changedTriggerId, {
        value,
        previous: previous ?? this.config.defaultValue,
      });
    }
    if (value === true && this.config.trueTriggerId) {
      await this.fireTrigger(this.config.trueTriggerId, {});
    }
    if (value === false && this.config.falseTriggerId) {
      await this.fireTrigger(this.config.falseTriggerId, {});
    }
    await this.onValueChanged(previous, value);
  }

  /** Subclass hook, called after the value changed. Default: no-op. */
  protected async onValueChanged(_previous: VirtualValue | null, _value: VirtualValue) {
    // no-op by default
  }

  protected async fireTrigger(
    triggerId: string,
    tokens: Record<string, VirtualValue>,
  ): Promise<void> {
    try {
      await this.homey.flow.getDeviceTriggerCard(triggerId).trigger(this, tokens);
    } catch (err) {
      this.error(`Failed to fire trigger '${triggerId}':`, err);
    }
  }

  /**
   * Applies the safe default when the device has no stored value yet
   * (first init after pairing). Existing values are left untouched, which is
   * what keeps them across app/Homey restarts.
   */
  private async ensureInitialValue(): Promise<void> {
    const current = this.getCapabilityValue(this.config.capabilityId);
    const isValid =
      this.config.valueType === 'number'
        ? isFiniteNumber(current)
        : typeof current === this.config.valueType;
    if (!isValid) {
      await this.setCapabilityValue(this.config.capabilityId, this.config.defaultValue).catch(
        (err) => this.error('Failed to apply default value:', err),
      );
    }
  }

  private async applyJsonPolling(settings: JsonPollSettingsInput): Promise<void> {
    const generation = this.jsonPollGeneration + 1;

    let pollSettings;
    try {
      pollSettings = getJsonPollSettings(settings);
    } catch (err) {
      if (err instanceof JsonPollValidationError) {
        throw new Error(this.homey.__(`errors.${err.code}`));
      }
      throw err;
    }

    this.stopJsonPolling();
    this.jsonPollGeneration = generation;

    if (pollSettings === null) return;

    await this.runJsonPoll(generation, pollSettings);
    this.jsonPollTimer = setInterval(() => {
      void this.runJsonPoll(generation, pollSettings);
    }, pollSettings.intervalSeconds * 1000);
  }

  private stopJsonPolling(): void {
    if (this.jsonPollTimer !== null) {
      clearInterval(this.jsonPollTimer);
      this.jsonPollTimer = null;
    }
    this.jsonPollRunQueued = false;
  }

  private async runJsonPoll(
    generation: number,
    settings: ReturnType<typeof getJsonPollSettings> extends infer T ? Exclude<T, null> : never,
  ): Promise<void> {
    if (generation !== this.jsonPollGeneration) return;

    if (this.jsonPollRunInFlight) {
      this.jsonPollRunQueued = true;
      return;
    }

    this.jsonPollRunInFlight = true;
    try {
      const payload = await fetchJsonPollPayload(settings);
      if (generation !== this.jsonPollGeneration) return;

      const nextValue = extractJsonPollValue(payload, settings);
      if (nextValue === undefined) {
        this.error(`JSON poll mapping returned no value for ${this.getName()}`);
        return;
      }

      await this.setValue(nextValue);
    } catch (err) {
      this.error(`JSON poll failed for ${this.getName()}:`, err);
    } finally {
      this.jsonPollRunInFlight = false;
      if (this.jsonPollRunQueued && generation === this.jsonPollGeneration) {
        this.jsonPollRunQueued = false;
        await this.runJsonPoll(generation, settings);
      }
    }
  }
}
