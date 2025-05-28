declare module '@react-native-community/datetimepicker' {
  import { ViewStyle } from 'react-native';

  export interface DateTimePickerEvent {
    type: 'set' | 'dismissed';
    nativeEvent: {
      timestamp?: number;
    };
  }

  export interface DateTimePickerProps {
    value: Date;
    mode?: 'date' | 'time' | 'datetime';
    display?: 'default' | 'spinner' | 'calendar' | 'clock';
    onChange?: (event: DateTimePickerEvent, date?: Date) => void;
    minimumDate?: Date;
    maximumDate?: Date;
    timeZoneOffsetInMinutes?: number;
    timeZoneOffsetInSeconds?: number;
    minuteInterval?: number;
    style?: ViewStyle;
    textColor?: string;
    accentColor?: string;
    neutralButton?: {
      label: string;
      textColor?: string;
    };
    positiveButton?: {
      label: string;
      textColor?: string;
    };
    negativeButton?: {
      label: string;
      textColor?: string;
    };
  }

  export default class DateTimePicker extends React.Component<DateTimePickerProps> {}
} 