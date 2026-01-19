/**
 * @swiftship/preview
 *
 * iOS-styled React components for previewing SwiftShip apps in the browser.
 */

// Simulator frame
export { SimulatorFrame } from './simulator/frame.js';

// Component renderer
export { ComponentRenderer, type RendererProps } from './renderer.js';

// Primitives
export {
  IOSText,
  IOSButton,
  IOSIcon,
  IOSSpacer,
  IOSDivider,
  type IOSTextProps,
  type IOSButtonProps,
  type IOSIconProps,
  type IOSSpacerProps,
  type IOSDividerProps,
} from './components/primitives.js';

// Layout
export {
  IOSVStack,
  IOSHStack,
  IOSZStack,
  IOSScrollView,
  IOSList,
  IOSGrid,
  IOSSection,
  type IOSVStackProps,
  type IOSHStackProps,
  type IOSZStackProps,
  type IOSScrollViewProps,
  type IOSListProps,
  type IOSGridProps,
  type IOSSectionProps,
} from './components/layout.js';

// Navigation
export {
  IOSNavigationStack,
  IOSNavigationLink,
  IOSTabView,
  IOSSheet,
  IOSAlert,
  type IOSNavigationStackProps,
  type IOSNavigationLinkProps,
  type IOSTabViewProps,
  type IOSSheetProps,
  type IOSAlertProps,
} from './components/navigation.js';

// Input
export {
  IOSTextField,
  IOSSecureField,
  IOSToggle,
  IOSPicker,
  IOSSlider,
  IOSStepper,
  type IOSTextFieldProps,
  type IOSSecureFieldProps,
  type IOSToggleProps,
  type IOSPickerProps,
  type IOSSliderProps,
  type IOSStepperProps,
} from './components/input.js';
