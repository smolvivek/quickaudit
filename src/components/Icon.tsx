import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: ViewStyle;
  onPress?: () => void;
}

const iconMap: { [key: string]: string } = {
  add: 'add',
  close: 'close',
  edit: 'edit',
  delete: 'delete',
  search: 'search',
  refresh: 'refresh',
  chevronLeft: 'chevron-left',
  chevronRight: 'chevron-right',
  error: 'error',
  warning: 'warning',
  info: 'info',
  success: 'check-circle',
  camera: 'camera-alt',
  location: 'location-on',
  date: 'event',
  time: 'access-time',
  user: 'person',
  password: 'lock',
  email: 'email',
  phone: 'phone',
  menu: 'menu',
  settings: 'settings',
  logout: 'logout',
  back: 'arrow-back',
  forward: 'arrow-forward',
  check: 'check',
  cancel: 'cancel',
  save: 'save',
  upload: 'cloud-upload',
  download: 'cloud-download',
  share: 'share',
  filter: 'filter-list',
  sort: 'sort',
  visibility: 'visibility',
  visibilityOff: 'visibility-off',
};

export const Icon: React.FC<IconProps> = ({ name, size = 24, color = '#000', style, onPress }) => {
  const iconName = iconMap[name] || name;
  const iconElement = (
    <MaterialIcons name={iconName} size={size} color={color} />
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
        {iconElement}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {iconElement}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 