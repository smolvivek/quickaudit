import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Checkbox, List, useTheme, Surface, IconButton, Divider, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const AuditConfigurationScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const { auditTitle, location, auditType, templateId } = route.params || {};
  
  const [sections, setSections] = useState([
    {
      id: 1,
      title: 'General Safety',
      selected: true,
      items: [
        { id: 1, text: 'Emergency exits are clearly marked', selected: true },
        { id: 2, text: 'Fire extinguishers are accessible and in working order', selected: true },
        { id: 3, text: 'First aid kits are fully stocked and accessible', selected: true },
        { id: 4, text: 'Emergency procedures are posted and visible', selected: true },
      ]
    },
    {
      id: 2,
      title: 'Electrical Safety',
      selected: true,
      items: [
        { id: 5, text: 'No exposed wiring is present', selected: true },
        { id: 6, text: 'Electrical panels are accessible and properly labeled', selected: true },
        { id: 7, text: 'Extension cords are used properly and not daisy-chained', selected: true },
      ]
    },
    {
      id: 3,
      title: 'Workplace Hazards',
      selected: true,
      items: [
        { id: 8, text: 'Walkways are clear of obstructions', selected: true },
        { id: 9, text: 'Proper lighting is maintained in all areas', selected: true },
        { id: 10, text: 'Hazardous materials are properly stored and labeled', selected: true },
        { id: 11, text: 'PPE is available and in good condition', selected: true },
      ]
    },
  ]);
  
  const [expandedSections, setExpandedSections] = useState({});
  
  const toggleSectionExpanded = (sectionId) => {
    setExpandedSections({
      ...expandedSections,
      [sectionId]: !expandedSections[sectionId]
    });
  };
  
  const toggleSectionSelected = (sectionId) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        const newSelectedState = !section.selected;
        return {
          ...section,
          selected: newSelectedState,
          items: section.items.map(item => ({
            ...item,
            selected: newSelectedState
          }))
        };
      }
      return section;
    }));
  };
  
  const toggleItemSelected = (sectionId, itemId) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        const updatedItems = section.items.map(item => {
          if (item.id === itemId) {
            return { ...item, selected: !item.selected };
          }
          return item;
        });
        
        // Check if all items are selected
        const allSelected = updatedItems.every(item => item.selected);
        
        return {
          ...section,
          selected: allSelected,
          items: updatedItems
        };
      }
      return section;
    }));
  };
  
  const handleStartAudit = () => {
    // Filter only selected sections and items
    const selectedSections = sections
      .filter(section => section.selected)
      .map(section => ({
        ...section,
        items: section.items.filter(item => item.selected)
      }));
    
    navigation.navigate('AuditExecution', {
      auditTitle,
      location,
      auditType,
      sections: selectedSections
    });
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Surface style={styles.infoContainer}>
          <Text style={styles.auditTitle}>{auditTitle}</Text>
          <Text style={styles.auditInfo}>Location: {location}</Text>
          <Text style={styles.auditInfo}>Type: {auditType.charAt(0).toUpperCase() + auditType.slice(1)}</Text>
        </Surface>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Configure Checklist</Text>
          <Text style={styles.sectionSubtitle}>Select sections and items to include</Text>
        </View>
        
        {sections.map((section) => (
          <Card key={section.id} style={styles.sectionCard}>
            <Card.Content>
              <View style={styles.sectionRow}>
                <Checkbox
                  status={section.selected ? 'checked' : 'unchecked'}
                  onPress={() => toggleSectionSelected(section.id)}
                />
                <Text 
                  style={[
                    styles.sectionName, 
                    !section.selected && styles.disabledText
                  ]}
                >
                  {section.title}
                </Text>
                <IconButton
                  icon={expandedSections[section.id] ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  onPress={() => toggleSectionExpanded(section.id)}
                />
              </View>
              
              {expandedSections[section.id] && (
                <View style={styles.itemsContainer}>
                  <Divider style={styles.divider} />
                  {section.items.map((item) => (
                    <View key={item.id} style={styles.itemRow}>
                      <Checkbox
                        status={item.selected ? 'checked' : 'unchecked'}
                        onPress={() => toggleItemSelected(section.id, item.id)}
                        disabled={!section.selected}
                      />
                      <Text 
                        style={[
                          styles.itemText, 
                          (!section.selected || !item.selected) && styles.disabledText
                        ]}
                      >
                        {item.text}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </Card.Content>
          </Card>
        ))}
        
        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            onPress={handleStartAudit}
            style={styles.startButton}
          >
            Start Audit
          </Button>
        </View>
      </ScrollView>
      
      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={() => {}}
        label="Add Custom Item"
        small
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  infoContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  auditTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  auditInfo: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  sectionCard: {
    marginBottom: 12,
    borderRadius: 12,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    flex: 1,
  },
  itemsContainer: {
    marginTop: 8,
  },
  divider: {
    marginVertical: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  itemText: {
    fontSize: 14,
    color: '#1e293b',
    flex: 1,
  },
  disabledText: {
    color: '#94a3b8',
  },
  buttonContainer: {
    marginVertical: 24,
  },
  startButton: {
    paddingVertical: 6,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default AuditConfigurationScreen;
