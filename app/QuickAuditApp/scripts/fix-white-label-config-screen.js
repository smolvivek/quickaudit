/**
 * Script to fix TypeScript errors in WhiteLabelConfigScreen
 */

const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
const ensureDirectoryExists = (dirPath) => {
  if (!dirPath || dirPath === '') return;
  
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch (error) {
    console.error(`Error creating directory ${dirPath}:`, error);
  }
};

// Fix WhiteLabelConfigScreen.tsx
const fixWhiteLabelConfigScreen = () => {
  const dirPath = path.join(process.cwd(), 'src/screens/admin');
  ensureDirectoryExists(dirPath);
  
  const content = `/**
 * White Label Configuration Screen
 * Allows enterprise customers to customize the app's appearance
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  Divider,
  TextInput,
  Switch,
  HelperText,
  IconButton,
  Subheading,
  Chip
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { appTheme } from '../../theme/webAppTheme';
import * as ImagePicker from 'react-native-image-picker';
import ColorPicker from '../../components/ColorPicker';

// Mock data for the white label configuration
const whiteLabelConfig = {
  companyName: 'Acme Corporation',
  logoUrl: 'https://via.placeholder.com/150',
  primaryColor: '#2196F3',
  secondaryColor: '#FF9800',
  accentColor: '#4CAF50',
  fontFamily: 'Roboto',
  customDomain: 'audits.acmecorp.com',
  customEmailDomain: 'acmecorp.com',
  enableCustomBranding: true,
  enableCustomReports: true,
  enableCustomDomain: false
};

const WhiteLabelConfigScreen = ({ navigation }) => {
  const [config, setConfig] = useState(whiteLabelConfig);
  const [errors, setErrors] = useState({});
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeColorField, setActiveColorField] = useState('');
  
  const updateConfig = (field, value) => {
    setConfig({
      ...config,
      [field]: value
    });
    
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    if (!config.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
      isValid = false;
    }
    
    if (config.enableCustomDomain && !config.customDomain.trim()) {
      newErrors.customDomain = 'Custom domain is required when enabled';
      isValid = false;
    }
    
    if (config.enableCustomDomain && config.customDomain.trim() && !config.customDomain.includes('.')) {
      newErrors.customDomain = 'Please enter a valid domain';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSave = () => {
    if (validateForm()) {
      // In a real app, this would save the configuration to the server
      Alert.alert('Success', 'White label configuration saved successfully');
    }
  };
  
  const handleSelectLogo = () => {
    const options = {
      title: 'Select Logo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        Alert.alert('Error', 'Failed to select image');
      } else if (response.assets && response.assets.length > 0) {
        const source = { uri: response.assets[0].uri };
        updateConfig('logoUrl', source.uri);
      }
    });
  };
  
  const handleSelectColor = (field) => {
    setActiveColorField(field);
    setShowColorPicker(true);
  };
  
  const handleColorSelected = (color) => {
    updateConfig(activeColorField, color);
    setShowColorPicker(false);
  };
  
  const handleResetDefaults = () => {
    Alert.alert(
      'Reset to Defaults',
      'Are you sure you want to reset all white label settings to default values?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Reset',
          onPress: () => {
            setConfig({
              companyName: 'QuickAudit',
              logoUrl: 'https://via.placeholder.com/150',
              primaryColor: appTheme.colors.primary,
              secondaryColor: appTheme.colors.secondary,
              accentColor: appTheme.colors.accent,
              fontFamily: 'System',
              customDomain: '',
              customEmailDomain: '',
              enableCustomBranding: false,
              enableCustomReports: false,
              enableCustomDomain: false
            });
            Alert.alert('Success', 'Settings reset to default values');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Company Branding</Title>
            <Divider style={styles.divider} />
            
            <TextInput
              label="Company Name"
              value={config.companyName}
              onChangeText={(text) => updateConfig('companyName', text)}
              style={styles.input}
              error={!!errors.companyName}
              mode="outlined"
              outlineColor={appTheme.colors.outline}
              activeOutlineColor={appTheme.colors.primary}
            />
            {!!errors.companyName && (
              <HelperText type="error" visible={!!errors.companyName}>
                {errors.companyName}
              </HelperText>
            )}
            
            <Subheading style={styles.sectionSubtitle}>Company Logo</Subheading>
            <View style={styles.logoContainer}>
              <Image 
                source={{ uri: config.logoUrl }} 
                style={styles.logo}
                resizeMode="contain"
              />
              <Button 
                mode="outlined" 
                onPress={handleSelectLogo}
                style={styles.logoButton}
              >
                Select Logo
              </Button>
            </View>
          </Card.Content>
        </Card>
        
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Color Scheme</Title>
            <Divider style={styles.divider} />
            
            <View style={styles.colorRow}>
              <Text style={styles.colorLabel}>Primary Color</Text>
              <TouchableOpacity 
                style={[styles.colorPreview, { backgroundColor: config.primaryColor }]}
                onPress={() => handleSelectColor('primaryColor')}
              />
              <Text style={styles.colorValue}>{config.primaryColor}</Text>
            </View>
            
            <View style={styles.colorRow}>
              <Text style={styles.colorLabel}>Secondary Color</Text>
              <TouchableOpacity 
                style={[styles.colorPreview, { backgroundColor: config.secondaryColor }]}
                onPress={() => handleSelectColor('secondaryColor')}
              />
              <Text style={styles.colorValue}>{config.secondaryColor}</Text>
            </View>
            
            <View style={styles.colorRow}>
              <Text style={styles.colorLabel}>Accent Color</Text>
              <TouchableOpacity 
                style={[styles.colorPreview, { backgroundColor: config.accentColor }]}
                onPress={() => handleSelectColor('accentColor')}
              />
              <Text style={styles.colorValue}>{config.accentColor}</Text>
            </View>
            
            <Subheading style={styles.sectionSubtitle}>Font Family</Subheading>
            <View style={styles.fontSelection}>
              <Chip 
                selected={config.fontFamily === 'System'}
                onPress={() => updateConfig('fontFamily', 'System')}
                style={styles.fontChip}
              >
                System
              </Chip>
              <Chip 
                selected={config.fontFamily === 'Roboto'}
                onPress={() => updateConfig('fontFamily', 'Roboto')}
                style={styles.fontChip}
              >
                Roboto
              </Chip>
              <Chip 
                selected={config.fontFamily === 'Open Sans'}
                onPress={() => updateConfig('fontFamily', 'Open Sans')}
                style={styles.fontChip}
              >
                Open Sans
              </Chip>
            </View>
          </Card.Content>
        </Card>
        
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Domain Configuration</Title>
            <Divider style={styles.divider} />
            
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Enable Custom Domain</Text>
              <Switch
                value={config.enableCustomDomain}
                onValueChange={(value) => updateConfig('enableCustomDomain', value)}
                color={appTheme.colors.primary}
              />
            </View>
            
            <TextInput
              label="Custom Domain"
              value={config.customDomain}
              onChangeText={(text) => updateConfig('customDomain', text)}
              style={styles.input}
              error={!!errors.customDomain}
              mode="outlined"
              outlineColor={appTheme.colors.outline}
              activeOutlineColor={appTheme.colors.primary}
              disabled={!config.enableCustomDomain}
            />
            {!!errors.customDomain && (
              <HelperText type="error" visible={!!errors.customDomain}>
                {errors.customDomain}
              </HelperText>
            )}
            
            <TextInput
              label="Custom Email Domain"
              value={config.customEmailDomain}
              onChangeText={(text) => updateConfig('customEmailDomain', text)}
              style={styles.input}
              mode="outlined"
              outlineColor={appTheme.colors.outline}
              activeOutlineColor={appTheme.colors.primary}
              disabled={!config.enableCustomDomain}
            />
          </Card.Content>
        </Card>
        
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Feature Configuration</Title>
            <Divider style={styles.divider} />
            
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Custom Branding in App</Text>
              <Switch
                value={config.enableCustomBranding}
                onValueChange={(value) => updateConfig('enableCustomBranding', value)}
                color={appTheme.colors.primary}
              />
            </View>
            
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Custom Branding in Reports</Text>
              <Switch
                value={config.enableCustomReports}
                onValueChange={(value) => updateConfig('enableCustomReports', value)}
                color={appTheme.colors.primary}
              />
            </View>
          </Card.Content>
        </Card>
        
        <View style={styles.buttonContainer}>
          <Button 
            mode="outlined" 
            onPress={handleResetDefaults}
            style={styles.resetButton}
          >
            Reset to Defaults
          </Button>
          <Button 
            mode="contained" 
            onPress={handleSave}
            style={styles.saveButton}
          >
            Save Configuration
          </Button>
        </View>
      </ScrollView>
      
      {showColorPicker && (
        <View style={styles.colorPickerContainer}>
          <View style={styles.colorPickerHeader}>
            <Text style={styles.colorPickerTitle}>Select Color</Text>
            <IconButton
              icon="close"
              size={24}
              onPress={() => setShowColorPicker(false)}
            />
          </View>
          <ColorPicker
            onColorSelected={handleColorSelected}
            initialColor={config[activeColorField]}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appTheme.colors.primary,
  },
  divider: {
    marginVertical: 12,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    marginBottom: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 80,
    height: 80,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  logoButton: {
    borderColor: appTheme.colors.primary,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  colorLabel: {
    flex: 1,
    fontSize: 16,
  },
  colorPreview: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  colorValue: {
    width: 80,
    fontSize: 14,
    color: '#666',
  },
  fontSelection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  fontChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16,
  },
  resetButton: {
    flex: 1,
    marginRight: 8,
    borderColor: '#f44336',
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: appTheme.colors.primary,
  },
  colorPickerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 8,
    padding: 16,
  },
  colorPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  colorPickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WhiteLabelConfigScreen;`;

  fs.writeFileSync(path.join(dirPath, 'WhiteLabelConfigScreen.tsx'), content, 'utf8');
  console.log('Fixed WhiteLabelConfigScreen.tsx');
};

// Run the function
console.log('Fixing WhiteLabelConfigScreen...');
fixWhiteLabelConfigScreen();
console.log('WhiteLabelConfigScreen fixed successfully!');
