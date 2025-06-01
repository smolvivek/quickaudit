import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export const AboutUsScreen = () => {
  const theme = useTheme();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text variant="headlineMedium" style={styles.title}>
          About QuickAudit
        </Text>
        <Text variant="bodyLarge" style={styles.paragraph}>
          QuickAudit is a modern, mobile-first audit management solution designed to streamline the audit process for businesses of all sizes. Our mission is to make audit management simple, efficient, and accessible to everyone.
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.subtitle}>
          Our Story
        </Text>
        <Text variant="bodyLarge" style={styles.paragraph}>
          Founded in 2024, QuickAudit was born from a simple observation: traditional audit processes were too complex and time-consuming. We set out to create a solution that would make audits faster, more accurate, and easier to manage.
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.subtitle}>
          Our Vision
        </Text>
        <Text variant="bodyLarge" style={styles.paragraph}>
          We envision a world where every business, regardless of size, can conduct professional audits with ease. By combining cutting-edge technology with user-friendly design, we're making this vision a reality.
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.subtitle}>
          Why Choose QuickAudit?
        </Text>
        <Text variant="bodyLarge" style={styles.paragraph}>
          • Mobile-first approach for on-the-go auditing{'\n'}
          • Real-time collaboration and reporting{'\n'}
          • Offline capabilities for remote locations{'\n'}
          • Customizable templates and forms{'\n'}
          • Secure and compliant data handling{'\n'}
          • Competitive pricing for all business sizes
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.subtitle}>
          Our Team
        </Text>
        <Text variant="bodyLarge" style={styles.paragraph}>
          Our team consists of experienced professionals from the audit, technology, and business sectors. We're passionate about creating solutions that make a real difference in how businesses operate.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 12,
  },
  paragraph: {
    lineHeight: 24,
  },
}); 