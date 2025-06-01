/**
 * Finding Details Screen
 * Shows detailed information about an audit finding
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Alert
} from 'react-native';
import { Card, Button, TextInput, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { appTheme } from '../theme/webAppTheme';

// Mock data for the finding
const mockFinding = {
  id: 'F12345',
  title: 'Fire Extinguisher Missing',
  description: 'Fire extinguisher is missing from its designated location in the east wing corridor.',
  severity: 'High',
  category: 'Fire Safety',
  location: 'East Wing, Floor 2',
  assignedTo: 'John Smith',
  status: 'Open',
  createdAt: '2023-05-15T10:30:00',
  dueDate: '2023-05-22T17:00:00',
  photos: [
    'https://example.com/photo1.jpg',
    'https://example.com/photo2.jpg'
  ],
  comments: [
    {
      id: 'C1',
      user: 'Jane Doe',
      text: 'I have ordered a replacement fire extinguisher.',
      timestamp: '2023-05-16T09:15:00'
    },
    {
      id: 'C2',
      user: 'Mike Johnson',
      text: 'Please ensure it is installed by the due date.',
      timestamp: '2023-05-16T14:22:00'
    }
  ]
};

const FindingDetails = ({ route, navigation }) => {
  // In a real app, we would get the finding from the route params
  // const { findingId } = route.params;
  const finding = mockFinding;
  
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState(finding.status);
  
  const handleAddComment = () => {
    if (!comment.trim()) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }
    
    // In a real app, we would add the comment to the backend
    Alert.alert('Success', 'Comment added successfully');
    setComment('');
  };
  
  const handleStatusChange = (newStatus) => {
    // In a real app, we would update the status in the backend
    setStatus(newStatus);
    Alert.alert('Success', `Status updated to ${newStatus}`);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.findingId}>Finding #{finding.id}</Text>
          <Chip 
            mode="outlined" 
            style={[
              styles.statusChip, 
              status === 'Open' ? styles.statusOpen : 
              status === 'In Progress' ? styles.statusInProgress : 
              styles.statusClosed
            ]}
          >
            {status}
          </Chip>
        </View>
        
        <Text style={styles.title}>{finding.title}</Text>
        
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category:</Text>
              <Text style={styles.detailValue}>{finding.category}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Severity:</Text>
              <Text style={[
                styles.detailValue, 
                finding.severity === 'High' ? styles.highSeverity :
                finding.severity === 'Medium' ? styles.mediumSeverity :
                styles.lowSeverity
              ]}>
                {finding.severity}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Location:</Text>
              <Text style={styles.detailValue}>{finding.location}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Assigned To:</Text>
              <Text style={styles.detailValue}>{finding.assignedTo}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Created:</Text>
              <Text style={styles.detailValue}>{formatDate(finding.createdAt)}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Due Date:</Text>
              <Text style={styles.detailValue}>{formatDate(finding.dueDate)}</Text>
            </View>
          </Card.Content>
        </Card>
        
        <Text style={styles.sectionTitle}>Description</Text>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.description}>{finding.description}</Text>
          </Card.Content>
        </Card>
        
        <Text style={styles.sectionTitle}>Photos</Text>
        <ScrollView horizontal style={styles.photosContainer}>
          {finding.photos.map((photo, index) => (
            <TouchableOpacity key={index} style={styles.photoWrapper}>
              <Image 
                source={{ uri: photo }} 
                style={styles.photo} 
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.addPhotoButton}>
            <Icon name="camera-plus" size={32} color={appTheme.colors.primary} />
            <Text style={styles.addPhotoText}>Add Photo</Text>
          </TouchableOpacity>
        </ScrollView>
        
        <Text style={styles.sectionTitle}>Status</Text>
        <View style={styles.statusButtons}>
          <TouchableOpacity 
            style={[
              styles.statusButton, 
              status === 'Open' && styles.activeStatusButton
            ]}
            onPress={() => handleStatusChange('Open')}
          >
            <Text style={[
              styles.statusButtonText,
              status === 'Open' && styles.activeStatusButtonText
            ]}>Open</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.statusButton, 
              status === 'In Progress' && styles.activeStatusButton
            ]}
            onPress={() => handleStatusChange('In Progress')}
          >
            <Text style={[
              styles.statusButtonText,
              status === 'In Progress' && styles.activeStatusButtonText
            ]}>In Progress</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.statusButton, 
              status === 'Closed' && styles.activeStatusButton
            ]}
            onPress={() => handleStatusChange('Closed')}
          >
            <Text style={[
              styles.statusButtonText,
              status === 'Closed' && styles.activeStatusButtonText
            ]}>Closed</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.sectionTitle}>Comments</Text>
        <Card style={styles.card}>
          <Card.Content>
            {finding.comments.map((comment) => (
              <View key={comment.id} style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentUser}>{comment.user}</Text>
                  <Text style={styles.commentTime}>{formatDate(comment.timestamp)}</Text>
                </View>
                <Text style={styles.commentText}>{comment.text}</Text>
              </View>
            ))}
            
            <View style={styles.addCommentContainer}>
              <TextInput
                label="Add a comment"
                value={comment}
                onChangeText={setComment}
                style={styles.commentInput}
                multiline
              />
              <Button 
                mode="contained" 
                onPress={handleAddComment}
                style={styles.addCommentButton}
              >
                Add
              </Button>
            </View>
          </Card.Content>
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
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  findingId: {
    fontSize: 14,
    color: '#666',
  },
  statusChip: {
    height: 28,
  },
  statusOpen: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
  },
  statusInProgress: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  statusClosed: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: appTheme.colors.primary,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 16,
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  highSeverity: {
    color: '#f44336',
    fontWeight: 'bold',
  },
  mediumSeverity: {
    color: '#ff9800',
    fontWeight: 'bold',
  },
  lowSeverity: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  photosContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  photoWrapper: {
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  photo: {
    width: 120,
    height: 120,
  },
  addPhotoButton: {
    width: 120,
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  addPhotoText: {
    marginTop: 8,
    color: appTheme.colors.primary,
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  activeStatusButton: {
    backgroundColor: appTheme.colors.primary,
    borderColor: appTheme.colors.primary,
  },
  statusButtonText: {
    fontWeight: 'bold',
    color: '#666',
  },
  activeStatusButtonText: {
    color: '#fff',
  },
  commentItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  commentUser: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  commentTime: {
    color: '#666',
    fontSize: 12,
  },
  commentText: {
    fontSize: 16,
    lineHeight: 22,
  },
  addCommentContainer: {
    marginTop: 8,
  },
  commentInput: {
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  addCommentButton: {
    alignSelf: 'flex-end',
  },
});

export default FindingDetails;