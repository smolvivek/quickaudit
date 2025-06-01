// Generate screenshots for Field Auditor journey
import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {captureRef} from 'react-native-view-shot';
import {useRef} from 'react';
import {Button, Text, Card, Title, Paragraph} from 'react-native-paper';

// Import screens to capture
import LoginScreen from '../screens/auth/LoginScreen';
import FieldAuditorDashboard from '../screens/field_auditor/DashboardScreen';
import AuditCreationScreen from '../screens/field_auditor/AuditCreationScreen';
import AuditConfigurationScreen from '../screens/field_auditor/AuditConfigurationScreen';
import AuditExecutionScreen from '../screens/field_auditor/AuditExecutionScreen';
import ReportSummaryScreen from '../screens/field_auditor/ReportSummaryScreen';

const ScreenshotGenerator = () => {
  const loginRef = useRef(null);
  const dashboardRef = useRef(null);
  const creationRef = useRef(null);
  const configRef = useRef(null);
  const executionRef = useRef(null);
  const reportRef = useRef(null);

  const captureScreenshots = async () => {
    try {
      // Capture login screen
      const loginUri = await captureRef(loginRef, {
        format: 'jpg',
        quality: 0.8,
      });
      console.log('Login screenshot saved to:', loginUri);

      // Capture dashboard
      const dashboardUri = await captureRef(dashboardRef, {
        format: 'jpg',
        quality: 0.8,
      });
      console.log('Dashboard screenshot saved to:', dashboardUri);

      // Capture audit creation
      const creationUri = await captureRef(creationRef, {
        format: 'jpg',
        quality: 0.8,
      });
      console.log('Audit creation screenshot saved to:', creationUri);

      // Capture audit configuration
      const configUri = await captureRef(configRef, {
        format: 'jpg',
        quality: 0.8,
      });
      console.log('Audit configuration screenshot saved to:', configUri);

      // Capture audit execution
      const executionUri = await captureRef(executionRef, {
        format: 'jpg',
        quality: 0.8,
      });
      console.log('Audit execution screenshot saved to:', executionUri);

      // Capture report summary
      const reportUri = await captureRef(reportRef, {
        format: 'jpg',
        quality: 0.8,
      });
      console.log('Report summary screenshot saved to:', reportUri);

      alert('All screenshots captured successfully!');
    } catch (error) {
      console.error('Error capturing screenshots:', error);
      alert('Failed to capture screenshots: ' + error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Field Auditor Journey Screenshots</Text>
      <Button
        mode="contained"
        onPress={captureScreenshots}
        style={styles.button}>
        Capture All Screenshots
      </Button>

      <Card style={styles.card}>
        <Card.Content>
          <Title>1. Login Screen</Title>
          <View ref={loginRef} style={styles.screenshotContainer}>
            <LoginScreen />
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>2. Dashboard</Title>
          <View ref={dashboardRef} style={styles.screenshotContainer}>
            <FieldAuditorDashboard />
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>3. Audit Creation</Title>
          <View ref={creationRef} style={styles.screenshotContainer}>
            <AuditCreationScreen />
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>4. Audit Configuration</Title>
          <View ref={configRef} style={styles.screenshotContainer}>
            <AuditConfigurationScreen />
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>5. Audit Execution</Title>
          <View ref={executionRef} style={styles.screenshotContainer}>
            <AuditExecutionScreen />
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>6. Report Summary</Title>
          <View ref={reportRef} style={styles.screenshotContainer}>
            <ReportSummaryScreen />
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    marginBottom: 24,
  },
  card: {
    marginBottom: 24,
  },
  screenshotContainer: {
    height: 600,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default ScreenshotGenerator;
