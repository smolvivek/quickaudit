import React, {useState} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {useTheme} from '../theme/ThemeProvider';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import {TextInput} from 'react-native-paper';

/**
 * Sample screen demonstrating the web app-aligned UI components
 */
const SampleScreen = () => {
  const {theme, styles} = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleButtonPress = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: theme.colors.background}}
      contentContainerStyle={{padding: 16}}>
      <Text style={styles.screenTitle}>QuickAudit Components</Text>
      <Text style={styles.screenSubtitle}>
        Web app-aligned UI component showcase
      </Text>

      {/* Cards Section */}
      <View style={{marginVertical: 16}}>
        <Text style={styles.sectionTitle}>Cards</Text>
        
        <Card
          title="Basic Card"
          subtitle="Card with title and subtitle">
          <Text style={styles.bodyText}>
            This is a basic card component that matches the web app's design.
            Cards are used to group related content and actions.
          </Text>
        </Card>

        <Card
          title="Card with Footer"
          style={{marginTop: 16}}>
          <Text style={styles.bodyText}>
            This card includes a footer with actions that match the web app's button styles.
          </Text>
          <View style={{height: 16}} />
          <TextInput
            label="Sample Input"
            value={inputValue}
            onChangeText={setInputValue}
            mode="outlined"
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.primary}
            style={{backgroundColor: theme.colors.surface}}
          />
          <View style={{height: 8}} />
          <Text style={styles.caption}>
            Enter some text to see the input in action
          </Text>
          <footer
            style={{
              marginTop: 16,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              gap: 8,
            }}>
            <Button title="Cancel" variant="text" onPress={() => {}} />
            <Button title="Submit" onPress={() => {}} />
          </footer>
        </Card>
      </View>

      {/* Buttons Section */}
      <View style={{marginVertical: 16}}>
        <Text style={styles.sectionTitle}>Buttons</Text>
        
        <Card>
          <Text style={styles.cardTitle}>Button Variants</Text>
          <View style={{height: 16}} />
          
          <Text style={styles.label}>Primary Button</Text>
          <Button 
            title="Primary Action" 
            onPress={handleButtonPress}
            loading={loading}
            style={{marginBottom: 16}}
          />
          
          <Text style={styles.label}>Secondary Button</Text>
          <Button 
            title="Secondary Action" 
            variant="secondary" 
            onPress={() => {}}
            style={{marginBottom: 16}}
          />
          
          <Text style={styles.label}>Text Button</Text>
          <Button 
            title="Text Action" 
            variant="text" 
            onPress={() => {}}
            style={{marginBottom: 16}}
          />
          
          <Text style={styles.label}>Accent Button</Text>
          <Button 
            title="Accent Action" 
            variant="accent" 
            onPress={() => {}}
            style={{marginBottom: 16}}
          />
          
          <Text style={styles.label}>Disabled Button</Text>
          <Button 
            title="Disabled Action" 
            onPress={() => {}}
            disabled={true}
          />
        </Card>
      </View>

      {/* Typography Section */}
      <View style={{marginVertical: 16}}>
        <Text style={styles.sectionTitle}>Typography</Text>
        
        <Card>
          <Text style={styles.screenTitle}>Screen Title</Text>
          <Text style={styles.screenSubtitle}>Screen Subtitle</Text>
          <Text style={styles.sectionTitle}>Section Title</Text>
          <Text style={styles.cardTitle}>Card Title</Text>
          <Text style={styles.bodyText}>
            This is body text that matches the web app's typography. The text
            should be clear and readable with appropriate line height and letter
            spacing.
          </Text>
          <Text style={styles.caption}>
            This is caption text used for additional information
          </Text>
        </Card>
      </View>

      {/* Colors Section */}
      <View style={{marginVertical: 16}}>
        <Text style={styles.sectionTitle}>Color Palette</Text>
        
        <Card>
          <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
            <ColorSwatch color={theme.colors.primary} name="Primary" />
            <ColorSwatch color={theme.colors.secondary} name="Secondary" />
            <ColorSwatch color={theme.colors.accent} name="Accent" />
            <ColorSwatch color={theme.colors.background} name="Background" />
            <ColorSwatch color={theme.colors.surface} name="Surface" />
            <ColorSwatch color={theme.colors.text} name="Text" />
            <ColorSwatch color={theme.colors.error} name="Error" />
            <ColorSwatch color={theme.colors.success} name="Success" />
          </View>
        </Card>
      </View>
    </ScrollView>
  );
};

// Helper component for color swatches
interface ColorSwatchProps {
  color: string;
  name: string;
}

const ColorSwatch = ({color, name}: ColorSwatchProps) => {
  return (
    <View style={{alignItems: 'center', width: 80}}>
      <View
        style={{
          width: 50,
          height: 50,
          backgroundColor: color,
          borderRadius: 8,
          marginBottom: 4,
          borderWidth: color === '#FFFFFF' ? 1 : 0,
          borderColor: '#E0E0E0',
        }}
      />
      <Text style={{fontSize: 12, textAlign: 'center'}}>{name}</Text>
      <Text style={{fontSize: 10, textAlign: 'center', color: '#757575'}}>
        {color}
      </Text>
    </View>
  );
};

export default SampleScreen;
