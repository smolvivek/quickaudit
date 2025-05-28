import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, DataTable, useTheme, Surface, Searchbar, Chip, Avatar, IconButton, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const AuditReviewScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const { auditId, readOnly = false } = route.params || {};
  const [comments, setComments] = useState('');
  
  // Mock data - in a real app, this would be fetched based on auditId
  const auditData = {
    id: auditId || 1,
    title: 'Safety Inspection',
    location: 'Branch Office',
    date: 'May 20, 2025',
    auditor: 'Sarah Johnson',
    status: readOnly ? 'Completed' : 'Pending Approval',
    score: 82,
    sections: [
      {
        id: 1,
        title: 'General Safety',
        score: 90,
        items: [
          { id: 1, text: 'Emergency exits are clearly marked', response: 'compliant' },
          { id: 2, text: 'Fire extinguishers are accessible and in working order', response: 'compliant' },
          { id: 3, text: 'First aid kits are fully stocked and accessible', response: 'compliant' },
          { id: 4, text: 'Emergency procedures are posted and visible', response: 'non-compliant', notes: 'Emergency procedures need to be updated and posted in break room.' },
        ]
      },
      {
        id: 2,
        title: 'Electrical Safety',
        score: 75,
        items: [
          { id: 5, text: 'No exposed wiring is present', response: 'non-compliant', notes: 'Exposed wiring found near the coffee machine in break room.' },
          { id: 6, text: 'Electrical panels are accessible and properly labeled', response: 'compliant' },
          { id: 7, text: 'Extension cords are used properly and not daisy-chained', response: 'compliant' },
        ]
      },
      {
        id: 3,
        title: 'Workplace Hazards',
        score: 80,
        items: [
          { id: 8, text: 'Walkways are clear of obstructions', response: 'compliant' },
          { id: 9, text: 'Proper lighting is maintained in all areas', response: 'non-compliant', notes: 'Lighting in north stairwell is insufficient.' },
          { id: 10, text: 'Hazardous materials are properly stored and labeled', response: 'compliant' },
          { id: 11, text: 'PPE is available and in good condition', response: 'compliant' },
        ]
      },
    ]
  };
  
  const getScoreColor = (score) => {
    if (score >= 90) return theme.colors.success;
    if (score >= 70) return theme.colors.warning;
    return theme.colors.error;
  };
  
  const getResponseIcon = (response) => {
    switch (response) {
      case 'compliant':
        return { icon: 'check-circle', color: theme.colors.success };
      case 'non-compliant':
        return { icon: 'alert-circle', color: theme.colors.error };
      case 'na':
        return { icon: 'minus-circle', color: theme.colors.lightText };
      default:
        return { icon: 'help-circle', color: theme.colors.lightText };
    }
  };
  
  const handleApprove = () => {
    // In a real app, this would update the audit status
    navigation.goBack();
  };
  
  const handleReject = () => {
    // In a real app, this would update the audit status and send feedback
    navigation.goBack();
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Surface style={styles.headerContainer}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerTitle}>{auditData.title}</Text>
              <Text style={styles.headerSubtitle}>
                {auditData.location} • {auditData.date}
              </Text>
            </View>
            <Chip 
              mode="flat" 
              style={{ 
                backgroundColor: readOnly 
                  ? `${getScoreColor(auditData.score)}20` 
                  : `${theme.colors.warning}20`
              }}
              textStyle={{ 
                color: readOnly 
                  ? getScoreColor(auditData.score) 
                  : theme.colors.warning
              }}
            >
              {readOnly ? `${auditData.score}%` : auditData.status}
            </Chip>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.headerDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Auditor:</Text>
              <Text style={styles.detailValue}>{auditData.auditor}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Date:</Text>
              <Text style={styles.detailValue}>{auditData.date}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Location:</Text>
              <Text style={styles.detailValue}>{auditData.location}</Text>
            </View>
          </View>
        </Surface>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Audit Results</Text>
        </View>
        
        {auditData.sections.map((section) => (
          <Card key={section.id} style={styles.sectionCard}>
            <Card.Content>
              <View style={styles.sectionTop}>
                <Text style={styles.sectionName}>{section.title}</Text>
                <Chip 
                  mode="flat" 
                  style={{ 
                    backgroundColor: `${getScoreColor(section.score)}20`
                  }}
                  textStyle={{ 
                    color: getScoreColor(section.score)
                  }}
                >
                  {section.score}%
                </Chip>
              </View>
              
              <Divider style={styles.divider} />
              
              {section.items.map((item) => {
                const { icon, color } = getResponseIcon(item.response);
                
                return (
                  <View key={item.id} style={styles.itemContainer}>
                    <View style={styles.itemHeader}>
                      <View style={styles.itemTitleContainer}>
                        <IconButton
                          icon={icon}
                          size={20}
                          iconColor={color}
                          style={styles.itemIcon}
                        />
                        <Text style={styles.itemText}>{item.text}</Text>
                      </View>
                    </View>
                    
                    {item.notes && (
                      <View style={styles.notesContainer}>
                        <Text style={styles.notesLabel}>Notes:</Text>
                        <Text style={styles.notesText}>{item.notes}</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </Card.Content>
          </Card>
        ))}
        
        {!readOnly && (
          <Surface style={styles.actionContainer}>
            <Text style={styles.actionTitle}>Review Decision</Text>
            
            <View style={styles.buttonContainer}>
              <Button 
                mode="contained" 
                onPress={handleApprove}
                style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
              >
                Approve
              </Button>
              
              <Button 
                mode="contained" 
                onPress={handleReject}
                style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
              >
                Request Changes
              </Button>
            </View>
          </Surface>
        )}
      </ScrollView>
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
  headerContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  divider: {
    marginVertical: 12,
  },
  headerDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    marginRight: 16,
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
    marginRight: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  sectionCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  sectionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  itemContainer: {
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    margin: 0,
    marginRight: 4,
  },
  itemText: {
    fontSize: 14,
    color: '#1e293b',
    flex: 1,
  },
  notesContainer: {
    marginLeft: 36,
    marginTop: 4,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 2,
  },
  notesText: {
    fontSize: 12,
    color: '#64748b',
    fontStyle: 'italic',
  },
  actionContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default AuditReviewScreen;
