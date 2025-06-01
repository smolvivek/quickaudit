import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { Logo } from '../components/Logo';

export const HomeScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Logo size="large" color="#2196F3" />
        <Text style={styles.subtitle}>Your Safety Audit Companion</Text>
      </View>

      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>New Audit</Text>
            <Text style={styles.cardDescription}>
              Start a new safety audit inspection
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={() => {}}>
              Begin
            </Button>
          </Card.Actions>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Recent Audits</Text>
            <Text style={styles.cardDescription}>
              View and manage your recent safety audits
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="outlined" onPress={() => {}}>
              View All
            </Button>
          </Card.Actions>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Reports</Text>
            <Text style={styles.cardDescription}>
              Generate and export audit reports
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="outlined" onPress={() => {}}>
              View Reports
            </Button>
          </Card.Actions>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    color: '#666',
    marginBottom: 16,
  },
}); 