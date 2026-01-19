import { z } from 'zod';
import type { ComponentMeta } from '@swiftship/core';

// ============================================================================
// TextField
// ============================================================================

export const TextFieldPropsSchema = z.object({
  placeholder: z.string().default(''),
  label: z.string().optional(),
  axis: z.enum(['horizontal', 'vertical']).default('horizontal'),
  keyboardType: z.enum(['default', 'asciiCapable', 'numbersAndPunctuation', 'URL', 'numberPad', 'phonePad', 'emailAddress', 'decimalPad', 'twitter', 'webSearch']).default('default'),
  textContentType: z.enum(['none', 'name', 'namePrefix', 'givenName', 'middleName', 'familyName', 'nickname', 'organizationName', 'jobTitle', 'location', 'fullStreetAddress', 'streetAddressLine1', 'streetAddressLine2', 'addressCity', 'addressState', 'addressCityAndState', 'sublocality', 'countryName', 'postalCode', 'telephoneNumber', 'emailAddress', 'URL', 'creditCardNumber', 'username', 'password', 'newPassword', 'oneTimeCode']).default('none'),
  autocapitalization: z.enum(['never', 'words', 'sentences', 'characters']).default('sentences'),
  autocorrection: z.boolean().default(true),
});

export type TextFieldProps = z.infer<typeof TextFieldPropsSchema>;

export const TextFieldMeta: ComponentMeta = {
  name: 'TextField',
  type: 'textfield',
  description: 'A single-line text input',
  category: 'input',
  icon: 'character.cursor.ibeam',
  defaultProps: { placeholder: 'Enter text...', axis: 'horizontal' },
  propsSchema: TextFieldPropsSchema,
};

// ============================================================================
// SecureField (Password)
// ============================================================================

export const SecureFieldPropsSchema = z.object({
  placeholder: z.string().default(''),
  label: z.string().optional(),
  textContentType: z.enum(['password', 'newPassword']).default('password'),
});

export type SecureFieldProps = z.infer<typeof SecureFieldPropsSchema>;

export const SecureFieldMeta: ComponentMeta = {
  name: 'SecureField',
  type: 'securefield',
  description: 'A password input that hides its content',
  category: 'input',
  icon: 'eye.slash',
  defaultProps: { placeholder: 'Password' },
  propsSchema: SecureFieldPropsSchema,
};

// ============================================================================
// TextEditor (Multiline)
// ============================================================================

export const TextEditorPropsSchema = z.object({
  placeholder: z.string().optional(),
  minHeight: z.number().default(100),
});

export type TextEditorProps = z.infer<typeof TextEditorPropsSchema>;

export const TextEditorMeta: ComponentMeta = {
  name: 'TextEditor',
  type: 'texteditor',
  description: 'A multi-line text input',
  category: 'input',
  icon: 'text.alignleft',
  defaultProps: { minHeight: 100 },
  propsSchema: TextEditorPropsSchema,
};

// ============================================================================
// Toggle
// ============================================================================

export const TogglePropsSchema = z.object({
  label: z.string(),
  isOn: z.boolean().default(false),
});

export type ToggleProps = z.infer<typeof TogglePropsSchema>;

export const ToggleMeta: ComponentMeta = {
  name: 'Toggle',
  type: 'toggle',
  description: 'A switch for binary choices',
  category: 'input',
  icon: 'switch.2',
  defaultProps: { label: 'Toggle', isOn: false },
  propsSchema: TogglePropsSchema,
};

// ============================================================================
// Picker
// ============================================================================

export const PickerPropsSchema = z.object({
  label: z.string(),
  options: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ),
  style: z.enum(['automatic', 'menu', 'segmented', 'wheel', 'inline']).default('automatic'),
});

export type PickerProps = z.infer<typeof PickerPropsSchema>;

export const PickerMeta: ComponentMeta = {
  name: 'Picker',
  type: 'picker',
  description: 'A control for selecting from a list of options',
  category: 'input',
  icon: 'chevron.up.chevron.down',
  defaultProps: { label: 'Select', options: [], style: 'automatic' },
  propsSchema: PickerPropsSchema,
};

// ============================================================================
// DatePicker
// ============================================================================

export const DatePickerPropsSchema = z.object({
  label: z.string(),
  components: z.enum(['date', 'hourAndMinute', 'dateAndTime']).default('date'),
  displayedComponents: z.enum(['compact', 'wheel', 'graphical']).default('compact'),
});

export type DatePickerProps = z.infer<typeof DatePickerPropsSchema>;

export const DatePickerMeta: ComponentMeta = {
  name: 'DatePicker',
  type: 'datepicker',
  description: 'A control for selecting dates and/or times',
  category: 'input',
  icon: 'calendar',
  defaultProps: { label: 'Date', components: 'date', displayedComponents: 'compact' },
  propsSchema: DatePickerPropsSchema,
};

// ============================================================================
// Slider
// ============================================================================

export const SliderPropsSchema = z.object({
  label: z.string().optional(),
  minValue: z.number().default(0),
  maxValue: z.number().default(100),
  step: z.number().optional(),
});

export type SliderProps = z.infer<typeof SliderPropsSchema>;

export const SliderMeta: ComponentMeta = {
  name: 'Slider',
  type: 'slider',
  description: 'A control for selecting a value from a range',
  category: 'input',
  icon: 'slider.horizontal.3',
  defaultProps: { minValue: 0, maxValue: 100 },
  propsSchema: SliderPropsSchema,
};

// ============================================================================
// Stepper
// ============================================================================

export const StepperPropsSchema = z.object({
  label: z.string(),
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
  step: z.number().default(1),
});

export type StepperProps = z.infer<typeof StepperPropsSchema>;

export const StepperMeta: ComponentMeta = {
  name: 'Stepper',
  type: 'stepper',
  description: 'A control for incrementing/decrementing a value',
  category: 'input',
  icon: 'plus.forwardslash.minus',
  defaultProps: { label: 'Value', step: 1 },
  propsSchema: StepperPropsSchema,
};
