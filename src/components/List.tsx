import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  FlatList,
  FlatListProps,
  ListRenderItem,
} from 'react-native';
import { Divider } from './Divider';
import { colors } from '../theme/designSystem';

interface ListProps<T> extends Omit<FlatListProps<T>, 'renderItem'> {
  data: T[];
  renderItem: ListRenderItem<T>;
  containerStyle?: ViewStyle;
  showDivider?: boolean;
  dividerColor?: string;
  dividerSpacing?: number;
}

export function List<T>({
  data,
  renderItem,
  containerStyle,
  showDivider = true,
  dividerColor,
  dividerSpacing,
  ...props
}: ListProps<T>) {
  const renderItemWithDivider: ListRenderItem<T> = (itemProps) => {
    const { index } = itemProps;
    const isLastItem = index === data.length - 1;

    return (
      <View>
        {renderItem(itemProps)}
        {showDivider && !isLastItem && (
          <Divider
            color={dividerColor}
            spacing={dividerSpacing}
          />
        )}
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItemWithDivider}
      style={[styles.container, containerStyle]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.paper,
  },
}); 