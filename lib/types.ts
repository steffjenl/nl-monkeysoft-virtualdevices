export type VirtualValueType = 'boolean' | 'number' | 'string';

export type VirtualValue = boolean | number | string;

/**
 * Static configuration for a virtual device instance.
 */
export interface VirtualDeviceConfig {
  /** The capability that holds the virtual value. */
  capabilityId: string;
  valueType: VirtualValueType;
  /** Safe default applied when the device has no stored value yet. */
  defaultValue: VirtualValue;
  /** Device trigger card fired whenever the value changes (tokens: value, previous). */
  changedTriggerId?: string;
  /** Device trigger card fired when a boolean value changes to true (no tokens). */
  trueTriggerId?: string;
  /** Device trigger card fired when a boolean value changes to false (no tokens). */
  falseTriggerId?: string;
  /** Lower bound applied to numeric values (e.g. 0 for battery/meters). */
  clampMin?: number;
  /** Upper bound applied to numeric values (e.g. 100 for percentages). */
  clampMax?: number;
}

/**
 * Flow cards a virtual driver wants registered. Only the ids that are set
 * are registered, so every driver declares exactly the cards it defines in
 * its driver.flow.compose.json.
 */
export interface VirtualFlowConfig {
  capabilityId: string;
  valueType: VirtualValueType;
  /** Condition (numeric): min <= value <= max. Args: min, max. */
  inRangeConditionId?: string;
  /** Condition (boolean): value is true. */
  isTrueConditionId?: string;
  /** Condition (string): value equals argument. Args: value. */
  equalsConditionId?: string;
  /** Condition (string): value contains argument. Args: value. */
  containsConditionId?: string;
  /** Action: set the value. Args: value. */
  setActionId?: string;
  /** Action (boolean): set the value from a dropped flow tag. Droptoken: boolean. */
  setFromTagActionId?: string;
  /** Action (number): add the argument to the current value. Args: value. */
  addActionId?: string;
  /** Action (boolean): set to true. */
  turnOnActionId?: string;
  /** Action (boolean): set to false. */
  turnOffActionId?: string;
  /** Action (boolean): invert the current value. */
  toggleActionId?: string;
}
