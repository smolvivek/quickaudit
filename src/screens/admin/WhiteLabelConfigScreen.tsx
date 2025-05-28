import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Card, TextInput, Button, List, Switch } from 'react-native-paper';
import { useConfig } from '../../config/ConfigProvider';
import { WhiteLabelConfig } from '../../config/whiteLabelConfig';

const WhiteLabelConfigScreen: React.FC = () => {
  const { config, updateConfig } = useConfig();
  const [localConfig, setLocalConfig] = useState<WhiteLabelConfig>(config);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateConfig(localConfig);
      Alert.alert('Success', 'Configuration saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleColorChange = (key: keyof WhiteLabelConfig['colors'], value: string) => {
    setLocalConfig(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: value,
      },
    }));
  };

  const handleFeatureToggle = (key: keyof WhiteLabelConfig['features'], value: boolean) => {
    setLocalConfig(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [key]: value,
      },
    }));
  };

  const handleAuthConfig = (key: keyof WhiteLabelConfig['auth'], value: any) => {
    setLocalConfig(prev => ({
      ...prev,
      auth: {
        ...prev.auth,
        [key]: value,
      },
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>White Label Configuration</Text>

        <Card style={styles.card}>
          <Card.Title title="Branding" />
          <Card.Content>
            <TextInput
              label="Brand Name"
              value={localConfig.brandName}
              onChangeText={(value) => setLocalConfig(prev => ({ ...prev, brandName: value }))}
              style={styles.input}
            />
            <TextInput
              label="Logo URL"
              value={localConfig.logo}
              onChangeText={(value) => setLocalConfig(prev => ({ ...prev, logo: value }))}
              style={styles.input}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Colors" />
          <Card.Content>
            <TextInput
              label="Primary Color"
              value={localConfig.colors.primary}
              onChangeText={(value) => handleColorChange('primary', value)}
              style={styles.input}
            />
            <TextInput
              label="Secondary Color"
              value={localConfig.colors.secondary}
              onChangeText={(value) => handleColorChange('secondary', value)}
              style={styles.input}
            />
            <TextInput
              label="Background Color"
              value={localConfig.colors.background}
              onChangeText={(value) => handleColorChange('background', value)}
              style={styles.input}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Features" />
          <Card.Content>
            {Object.entries(localConfig.features).map(([key, value]) => (
              <List.Item
                key={key}
                title={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                right={() => (
                  <Switch
                    value={value}
                    onValueChange={(value) => handleFeatureToggle(key as keyof WhiteLabelConfig['features'], value)}
                  />
                )}
              />
            ))}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Authentication" />
          <Card.Content>
            {Object.entries(localConfig.auth).map(([key, value]) => {
              if (typeof value === 'boolean') {
                return (
                  <List.Item
                    key={key}
                    title={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    right={() => (
                      <Switch
                        value={value}
                        onValueChange={(newValue) => handleAuthConfig(key as keyof WhiteLabelConfig['auth'], newValue)}
                      />
                    )}
                  />
                );
              }
              return null;
            })}
            <TextInput
              label="Password Min Length"
              value={localConfig.auth.passwordRequirements.minLength.toString()}
              onChangeText={(value) => handleAuthConfig('passwordRequirements', {
                ...localConfig.auth.passwordRequirements,
                minLength: parseInt(value, 10),
              })}
              keyboardType="numeric"
              style={styles.input}
            />
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleSave}
          loading={loading}
          style={styles.button}
        >
          Save Configuration
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
  },
});

export default WhiteLabelConfigScreen;
