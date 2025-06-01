/**
 * DateTimePicker Types
 * Type definitions for date and time picker components
 */

declare module '@react-native-community/datetimepicker' {
  import { ComponentClass } from 'react';
  import { ViewProps } from 'react-native';

  export type AndroidMode = 'date' | 'time';
  export type IOSMode = 'date' | 'time' | 'datetime' | 'countdown';
  export type AndroidDisplay = 'default' | 'spinner' | 'calendar' | 'clock';
  export type IOSDisplay = 'default' | 'compact' | 'spinner' | 'inline';

  export type Event = {
    type: string;
    nativeEvent: {
      timestamp?: number;
      utcOffset?: number;
    };
  };

  export type DateTimePickerProps = ViewProps & {
    value: Date;
    mode?: AndroidMode | IOSMode;
    display?: AndroidDisplay | IOSDisplay;
    onChange?: (event: Event, date?: Date) => void;
    minimumDate?: Date;
    maximumDate?: Date;
    timeZoneOffsetInMinutes?: number;
    timeZoneOffsetInSeconds?: number;
    dayOfWeekFormat?: string;
    neutralButtonLabel?: string;
    minuteInterval?: 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12 | 15 | 20 | 30;
    locale?: string;
    is24Hour?: boolean;
    positiveButton?: { label: string; textColor?: number };
    negativeButton?: { label: string; textColor?: number };
    neutralButton?: { label: string; textColor?: number };
    textColor?: number;
    accentColor?: string;
    disabled?: boolean;
    testID?: string;
  };

  const DateTimePicker: ComponentClass<DateTimePickerProps>;

  export default DateTimePicker;
}