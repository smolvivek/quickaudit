import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export default function HomeScreen() {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
      <Text style={[styles.title, { color: colors.TEXT_PRIMARY }]}>
        Welcome to QuickAudit
      </Text>
      <Text style={[styles.subtitle, { color: colors.TEXT_SECONDARY }]}>
        Your audit management solution
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
  },
});
