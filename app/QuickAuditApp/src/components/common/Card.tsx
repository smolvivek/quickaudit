import React, {ReactNode} from 'react';
import {View, Text, ViewStyle, TextStyle} from 'react-native';
import {useTheme} from '../../theme/ThemeProvider';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  contentStyle?: ViewStyle;
  footerStyle?: ViewStyle;
}

/**
 * Card component that follows the web app design
 * Used for displaying content in a card layout with optional header and footer
 */
const Card = ({
  title,
  subtitle,
  children,
  footer,
  style,
  titleStyle,
  subtitleStyle,
  contentStyle,
  footerStyle,
}: CardProps) => {
  const {styles} = useTheme();

  return (
    <View style={[styles.card, style]}>
      {(title || subtitle) && (
        <View style={styles.cardHeader}>
          <View>
            {title && <Text style={[styles.cardTitle, titleStyle]}>{title}</Text>}
            {subtitle && (
              <Text
                style={[
                  {fontSize: 14, color: '#757575', marginTop: 2},
                  subtitleStyle,
                ]}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>
      )}
      <View style={[styles.cardContent, contentStyle]}>{children}</View>
      {footer && <View style={[styles.cardFooter, footerStyle]}>{footer}</View>}
    </View>
  );
};

export default Card;
