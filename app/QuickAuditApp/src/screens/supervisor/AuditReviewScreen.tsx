/**
 * Audit Review Screen for supervisors
 * Allows supervisors to review and approve/reject audit reports
 */

import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image, SafeAreaView } from 'react-native';
import { Card, Title, Paragraph, Button, Text, Surface, Divider, Chip, ActivityIndicator } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { appTheme } from '../../theme/webAppTheme';
import { auditApi } from '../../services/api';

// Audit review status
type ReviewStatus = 'pending' | 'approved' | 'rejected';

// Audit review interface
interface AuditReview {
  id: string;
  auditId: string;
  storeName: string;
  auditorName: string;
  date: string;
  score: number;
  status: ReviewStatus;
  sections: {
    id: string;
    name: string;
    score: number;
    items: {
      id: string;
      question: string;
      response: 'yes' | 'no' | 'n/a';
      notes?: string;
      photos?: string[];
    }[];
  }[];
  notes?: string;
}

// Sample audit review data
const sampleAuditReview: AuditReview = {
  id: '1',
  auditId: 'A12345',
  storeName: 'Store #1234',
  auditorName: 'John Doe',
  date: '2023-05-28',
  score: 87,
  status: 'pending',
  sections: [
    {
      id: 's1',
      name: 'Safety',
      score: 92,
      items: [
        {
          id: 'i1',
          question: 'Are fire extinguishers easily accessible?',
          response: 'yes',
        },
        {
          id: 'i2',
          question: 'Are emergency exits clearly marked?',
          response: 'yes',
        },
        {
          id: 'i3',
          question: 'Is the first aid kit fully stocked?',
          response: 'no',
          notes: 'Missing bandages and antiseptic',
          photos: ['photo1.jpg'],
        },
      ],
    },
    {
      id: 's2',
      name: 'Cleanliness',
      score: 85,
      items: [
        {
          id: 'i4',
          question: 'Are all areas clean and free of debris?',
          response: 'yes',
        },
        {
          id: 'i5',
          question: 'Are restrooms clean and well-maintained?',
          response: 'no',
          notes: 'Soap dispenser empty',
          photos: ['photo2.jpg'],
        },
        {
          id: 'i6',
          question: 'Is the floor clean and dry?',
          response: 'yes',
        },
      ],
    },
    {
      id: 's3',
      name: 'Product Quality',
      score: 83,
      items: [
        {
          id: 'i7',
          question: 'Are all products within expiration date?',
          response: 'no',
          notes: 'Found 3 expired items in dairy section',
          photos: ['photo3.jpg', 'photo4.jpg'],
        },
        {
          id: 'i8',
          question: 'Are products properly stored?',
          response: 'yes',
        },
        {
          id: 'i9',
          question: 'Is inventory properly rotated?',
          response: 'yes',
        },
      ],
    },
  ],
  notes: 'Overall good audit but needs improvement in a few areas.',
};

// Audit Review Screen Component
const AuditReviewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(true);
  const [auditReview, setAuditReview] = useState<AuditReview | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Load audit review data
  useEffect(() => {
    const fetchAuditReview = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        // For now, we'll use sample data
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAuditReview(sampleAuditReview);
      } catch (error) {
        console.error('Error fetching audit review:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAuditReview();
  }, []);

  // Handle approve audit
  const handleApprove = async () => {
    if (!auditReview) return;
    
    try {
      setSubmitting(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setAuditReview({
        ...auditReview,
        status: 'approved',
      });
      
      // Navigate back
      navigation.goBack();
    } catch (error) {
      console.error('Error approving audit:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle reject audit
  const handleReject = async () => {
    if (!auditReview) return;
    
    try {
      setSubmitting(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setAuditReview({
        ...auditReview,
        status: 'rejected',
      });
      
      // Navigate back
      navigation.goBack();
    } catch (error) {
      console.error('Error rejecting audit:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={appTheme.colors.primary} />
        <Text style={styles.loadingText}>Loading audit review...</Text>
      </View>
    );
  }

  // Render if no audit found
  if (!auditReview) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Audit review not found</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Surface style={styles.headerSurface}>
        <View style={styles.headerContainer}>
          <Title style={styles.headerTitle}>Audit Review</Title>
          <View style={styles.headerInfo}>
            <Chip 
              mode="outlined" 
              style={[
                styles.statusChip,
                auditReview.status === 'approved' && styles.approvedChip,
                auditReview.status === 'rejected' && styles.rejectedChip,
              ]}
            >
              {auditReview.status.toUpperCase()}
            </Chip>
          </View>
        </View>
      </Surface>
      
      <ScrollView style={styles.scrollView}>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Audit Summary</Title>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Store:</Text>
              <Text style={styles.summaryValue}>{auditReview.storeName}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Auditor:</Text>
              <Text style={styles.summaryValue}>{auditReview.auditorName}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Date:</Text>
              <Text style={styles.summaryValue}>{auditReview.date}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Score:</Text>
              <Text style={[
                styles.summaryValue, 
                styles.scoreValue,
                auditReview.score >= 90 ? styles.goodScore : 
                auditReview.score >= 70 ? styles.averageScore : 
                styles.poorScore
              ]}>
                {auditReview.score}%
              </Text>
            </View>
          </Card.Content>
        </Card>
        
        {auditReview.sections.map(section => (
          <Card key={section.id} style={styles.sectionCard}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Title style={styles.sectionTitle}>{section.name}</Title>
                <Text style={[
                  styles.sectionScore,
                  section.score >= 90 ? styles.goodScore : 
                  section.score >= 70 ? styles.averageScore : 
                  styles.poorScore
                ]}>
                  {section.score}%
                </Text>
              </View>
              
              <Divider style={styles.divider} />
              
              {section.items.map(item => (
                <View key={item.id} style={styles.questionItem}>
                  <View style={styles.questionRow}>
                    <Text style={styles.questionText}>{item.question}</Text>
                    <Chip 
                      mode="flat"
                      style={[
                        styles.responseChip,
                        item.response === 'yes' && styles.yesChip,
                        item.response === 'no' && styles.noChip,
                        item.response === 'n/a' && styles.naChip,
                      ]}
                    >
                      {item.response.toUpperCase()}
                    </Chip>
                  </View>
                  
                  {item.notes && (
                    <View style={styles.notesContainer}>
                      <Text style={styles.notesLabel}>Notes:</Text>
                      <Text style={styles.notesText}>{item.notes}</Text>
                    </View>
                  )}
                  
                  {item.photos && item.photos.length > 0 && (
                    <View style={styles.photosContainer}>
                      <Text style={styles.photosLabel}>Photos:</Text>
                      <View style={styles.photosList}>
                        {item.photos.map((photo, index) => (
                          <View key={index} style={styles.photoItem}>
                            <Text style={styles.photoPlaceholder}>
                              [Photo {index + 1}]
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                  
                  <Divider style={styles.itemDivider} />
                </View>
              ))}
            </Card.Content>
          </Card>
        ))}
        
        {auditReview.notes && (
          <Card style={styles.notesCard}>
            <Card.Content>
              <Title style={styles.cardTitle}>Auditor Notes</Title>
              <Paragraph style={styles.auditNotes}>{auditReview.notes}</Paragraph>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
      
      {auditReview.status === 'pending' && (
        <Surface style={styles.actionSurface}>
          <View style={styles.actionContainer}>
            <Button 
              mode="outlined" 
              onPress={handleReject}
              style={styles.rejectButton}
              disabled={submitting}
            >
              Reject
            </Button>
            <Button 
              mode="contained" 
              onPress={handleApprove}
              style={styles.approveButton}
              disabled={submitting}
              loading={submitting}
            >
              Approve
            </Button>
          </View>
        </Surface>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 16,
  },
  headerSurface: {
    elevation: 4,
  },
  headerContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusChip: {
    backgroundColor: '#f0f0f0',
  },
  approvedChip: {
    backgroundColor: '#e6f7e6',
    borderColor: '#4caf50',
  },
  rejectedChip: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreValue: {
    fontSize: 18,
  },
  goodScore: {
    color: '#4caf50',
  },
  averageScore: {
    color: '#ff9800',
  },
  poorScore: {
    color: '#f44336',
  },
  sectionCard: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionScore: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 8,
  },
  questionItem: {
    marginVertical: 8,
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  questionText: {
    flex: 1,
    fontSize: 16,
    marginRight: 8,
  },
  responseChip: {
    minWidth: 60,
    justifyContent: 'center',
  },
  yesChip: {
    backgroundColor: '#e6f7e6',
  },
  noChip: {
    backgroundColor: '#ffebee',
  },
  naChip: {
    backgroundColor: '#f0f0f0',
  },
  notesContainer: {
    marginVertical: 8,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
  },
  photosContainer: {
    marginVertical: 8,
  },
  photosLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  photosList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  photoItem: {
    width: 80,
    height: 80,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    borderRadius: 4,
  },
  photoPlaceholder: {
    fontSize: 12,
    color: '#666',
  },
  itemDivider: {
    marginTop: 8,
  },
  notesCard: {
    marginBottom: 16,
    elevation: 2,
  },
  auditNotes: {
    fontSize: 16,
  },
  actionSurface: {
    elevation: 4,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  rejectButton: {
    flex: 1,
    marginRight: 8,
  },
  approveButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default AuditReviewScreen;