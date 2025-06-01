import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Card, Button, RadioButton, TextInput, IconButton, useTheme, Surface, FAB, Divider, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const AuditExecutionScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const { auditTitle, location, auditType, sections } = route.params || {};
  
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [notes, setNotes] = useState({});
  const [photos, setPhotos] = useState({});
  
  const currentSection = sections?.[currentSectionIndex] || { items: [] };
  const currentItem = currentSection?.items?.[currentItemIndex] || {};
  const totalItems = sections?.reduce((total, section) => total + section.items.length, 0) || 0;
  const currentItemNumber = sections?.slice(0, currentSectionIndex).reduce((total, section) => total + section.items.length, 0) + currentItemIndex + 1 || 0;
  
  const handleResponseChange = (value) => {
    setResponses({
      ...responses,
      [`${currentSection.id}-${currentItem.id}`]: value
    });
  };
  
  const handleNotesChange = (text) => {
    setNotes({
      ...notes,
      [`${currentSection.id}-${currentItem.id}`]: text
    });
  };
  
  const handleAddPhoto = () => {
    // In a real app, this would open the camera
    const mockPhoto = { id: Date.now(), uri: 'https://via.placeholder.com/150' };
    
    setPhotos({
      ...photos,
      [`${currentSection.id}-${currentItem.id}`]: [
        ...(photos[`${currentSection.id}-${currentItem.id}`] || []),
        mockPhoto
      ]
    });
  };
  
  const handleNext = () => {
    if (currentItemIndex < currentSection.items.length - 1) {
      // Move to next item in current section
      setCurrentItemIndex(currentItemIndex + 1);
    } else if (currentSectionIndex < sections.length - 1) {
      // Move to first item of next section
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentItemIndex(0);
    } else {
      // End of audit
      navigation.navigate('ReportSummary', {
        auditTitle,
        location,
        auditType,
        sections,
        responses,
        notes,
        photos
      });
    }
  };
  
  const handlePrevious = () => {
    if (currentItemIndex > 0) {
      // Move to previous item in current section
      setCurrentItemIndex(currentItemIndex - 1);
    } else if (currentSectionIndex > 0) {
      // Move to last item of previous section
      setCurrentSectionIndex(currentSectionIndex - 1);
      setCurrentItemIndex(sections[currentSectionIndex - 1].items.length - 1);
    }
  };
  
  const handleFinish = () => {
    navigation.navigate('ReportSummary', {
      auditTitle,
      location,
      auditType,
      sections,
      responses,
      notes,
      photos
    });
  };
  
  const currentResponse = responses[`${currentSection.id}-${currentItem.id}`] || '';
  const currentNotes = notes[`${currentSection.id}-${currentItem.id}`] || '';
  const currentPhotos = photos[`${currentSection.id}-${currentItem.id}`] || [];
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{auditTitle}</Text>
        <Text style={styles.headerSubtitle}>{location}</Text>
      </View>
      
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Item {currentItemNumber} of {totalItems}
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(currentItemNumber / totalItems) * 100}%`, backgroundColor: theme.colors.primary }
            ]} 
          />
        </View>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <Surface style={styles.itemContainer}>
          <View style={styles.sectionIndicator}>
            <Chip mode="outlined">{currentSection.title}</Chip>
          </View>
          
          <Text style={styles.itemText}>{currentItem.text}</Text>
          
          <View style={styles.responseContainer}>
            <Text style={styles.responseLabel}>Response:</Text>
            <RadioButton.Group onValueChange={handleResponseChange} value={currentResponse}>
              <View style={styles.radioRow}>
                <RadioButton.Item 
                  label="Compliant" 
                  value="compliant" 
                  labelStyle={{ color: theme.colors.success }}
                />
              </View>
              <View style={styles.radioRow}>
                <RadioButton.Item 
                  label="Non-Compliant" 
                  value="non-compliant" 
                  labelStyle={{ color: theme.colors.error }}
                />
              </View>
              <View style={styles.radioRow}>
                <RadioButton.Item 
                  label="Not Applicable" 
                  value="na" 
                  labelStyle={{ color: theme.colors.lightText }}
                />
              </View>
            </RadioButton.Group>
          </View>
          
          {currentResponse === 'non-compliant' && (
            <View style={styles.notesContainer}>
              <Text style={styles.notesLabel}>Notes (Required):</Text>
              <TextInput
                mode="outlined"
                multiline
                numberOfLines={3}
                value={currentNotes}
                onChangeText={handleNotesChange}
                placeholder="Describe the issue..."
                style={styles.notesInput}
              />
            </View>
          )}
          
          <Divider style={styles.divider} />
          
          <View style={styles.photosContainer}>
            <View style={styles.photosHeader}>
              <Text style={styles.photosLabel}>Evidence Photos:</Text>
              <Button 
                mode="outlined" 
                icon="camera" 
                onPress={handleAddPhoto}
              >
                Add Photo
              </Button>
            </View>
            
            {currentPhotos.length > 0 ? (
              <View style={styles.photoGrid}>
                {currentPhotos.map((photo) => (
                  <View key={photo.id} style={styles.photoContainer}>
                    <Image source={{ uri: photo.uri }} style={styles.photo} />
                    <IconButton
                      icon="close"
                      size={16}
                      style={styles.removePhotoButton}
                      onPress={() => {
                        // Remove photo logic
                      }}
                    />
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noPhotosText}>No photos added</Text>
            )}
          </View>
        </Surface>
      </ScrollView>
      
      <View style={styles.navigationContainer}>
        <Button 
          mode="outlined" 
          onPress={handlePrevious}
          disabled={currentSectionIndex === 0 && currentItemIndex === 0}
          style={styles.navButton}
        >
          Previous
        </Button>
        
        <Button 
          mode="contained" 
          onPress={handleNext}
          style={[styles.navButton, styles.nextButton]}
        >
          {currentSectionIndex === sections.length - 1 && 
           currentItemIndex === currentSection.items.length - 1 
            ? 'Finish' 
            : 'Next'}
        </Button>
      </View>
      
      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="flag"
        onPress={handleFinish}
        label="Finish Audit"
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
  header: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  progressContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  progressText: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  itemContainer: {
    padding: 16,
    borderRadius: 12,
  },
  sectionIndicator: {
    marginBottom: 16,
  },
  itemText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 24,
  },
  responseContainer: {
    marginBottom: 16,
  },
  responseLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 8,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notesContainer: {
    marginBottom: 16,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: '#ffffff',
  },
  divider: {
    marginVertical: 16,
  },
  photosContainer: {
    marginBottom: 16,
  },
  photosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  photosLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  photoContainer: {
    width: 100,
    height: 100,
    margin: 4,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    width: 24,
    height: 24,
  },
  noPhotosText: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
  },
  navigationContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  navButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  nextButton: {
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80,
  },
});

export default AuditExecutionScreen;
