import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import SearchBar from '../components/SearchBar';
import FilterButton from '../components/FilterButton';
import AuditCard from '../components/AuditCard';
import TabBar from '../components/TabBar';

const AuditsScreen = ({ navigation }) => {
  const { colors, typography, spacing } = useTheme();
  
  // Create styles using the theme
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 16,
      paddingTop: 60,
      paddingBottom: 16,
      backgroundColor: colors.surface,
    },
    headerContent: {
      marginTop: 16,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    searchAndFilterContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    searchContainer: {
      flex: 1,
      marginRight: spacing.sm,
    },
    filterButtonsContainer: {
      flexDirection: 'row',
    },
    filterButton: {
      marginLeft: 8,
    },
    statusFilterContainer: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      marginHorizontal: spacing.md,
      marginBottom: spacing.md,
      padding: spacing.sm,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    statusOptionsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    statusOption: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: 16,
      marginRight: spacing.xs,
      marginBottom: spacing.xs,
      borderWidth: 1,
    },
    statusOptionText: {
      fontSize: 14,
      fontWeight: '500',
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.md,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 100,
    },
    emptyText: {
      ...textStyles.body1,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: spacing.md,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    auditListContainer: {
      paddingBottom: 100, // Add padding for the tab bar
    },
    auditItem: {
      marginBottom: spacing.md,
    },
  });

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    status: false,
    date: false,
    department: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filteredAudits, setFilteredAudits] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Status filter options
  const statusOptions = ['All', 'Completed', 'In Progress', 'Draft', 'Archived'];
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Sample data for audits
  const audits = [
    {
      id: '1',
      title: 'Safety Inspection - Warehouse',
      status: 'Completed',
      date: '08/15/2024',
      score: '95%',
    },
    {
      id: '2',
      title: 'Quality Control - Production Line',
      status: 'In Progress',
      date: '08/16/2024',
      score: null,
    },
    {
      id: '3',
      title: 'Compliance Audit - Office',
      status: 'Draft',
      date: '08/17/2024',
      score: null,
    },
    {
      id: '4',
      title: 'Environmental Check - Site A',
      status: 'Completed',
      date: '08/18/2024',
      score: '88%',
    },
    {
      id: '5',
      title: 'Security Review - Building B',
      status: 'Archived',
      date: '08/19/2024',
      score: null,
    },
  ];

  // Toggle filter
  const toggleFilter = (filter) => {
    if (filter === 'status') {
      setShowFilters(!showFilters);
    }
    
    setActiveFilters({
      ...activeFilters,
      [filter]: !activeFilters[filter],
    });
  };
  
  // Filter audits based on search query and active filters
  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    
    const timeoutId = setTimeout(() => {
      let results = [...audits];
      
      // Apply search filter
      if (searchQuery) {
        results = results.filter(audit => 
          audit.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Apply status filter
      if (selectedStatus !== 'All') {
        results = results.filter(audit => 
          audit.status === selectedStatus
        );
      }
      
      setFilteredAudits(results);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedStatus]);
  
  // Select status filter
  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    setShowFilters(false);
  };

  // Handle audit press
  const handleAuditPress = (audit) => {
    console.log('Audit pressed:', audit);
    // In a real app, this would navigate to the audit details screen
    // navigation.navigate('AuditDetails', { auditId: audit.id });
  };
  
  // Handle create new audit
  const handleCreateAudit = () => {
    console.log('Create new audit');
    // In a real app, this would navigate to the create audit screen
    // navigation.navigate('CreateAudit');
  };

  // Render audit item
  const renderAuditItem = ({ item }) => (
    <AuditCard
      title={item.title}
      status={item.status}
      date={item.date}
      score={item.score}
      onPress={() => handleAuditPress(item)}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Animatable.View 
        animation="fadeIn"
        duration={500}
        style={styles.header}
      >
        <Text style={[styles.title, { color: colors.text, ...typography.h1 }]}>
          Audits
        </Text>
      </Animatable.View>

      <Animatable.View 
        animation="fadeIn"
        duration={600}
        delay={100}
        style={styles.searchContainer}
      >
        <SearchBar
          placeholder="Search audits"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmit={() => console.log('Search submitted:', searchQuery)}
        />
      </Animatable.View>

      <Animatable.View 
        animation="fadeIn"
        duration={700}
        delay={200}
        style={styles.filtersContainer}
      >
        <FilterButton
          label="Status"
          onPress={() => toggleFilter('status')}
          isActive={activeFilters.status}
        />
        <FilterButton
          label="Date"
          onPress={() => toggleFilter('date')}
          isActive={activeFilters.date}
        />
        <FilterButton
          label="Department"
          onPress={() => toggleFilter('department')}
          isActive={activeFilters.department}
        />
      </Animatable.View>
      
      {showFilters && (
        <Animatable.View 
          animation="fadeInDown"
          duration={300}
          style={[styles.statusFilterContainer, { backgroundColor: colors.surface }]}
        >
          {statusOptions.map((status) => (
            <TouchableOpacity 
              key={status}
              style={[styles.statusOption, selectedStatus === status && { backgroundColor: colors.backgroundSecondary }]}
              onPress={() => handleStatusSelect(status)}
            >
              {selectedStatus === status && (
                <Ionicons name="checkmark" size={16} color={colors.primary} style={styles.statusCheckmark} />
              )}
              <Text style={[styles.statusOptionText, { color: selectedStatus === status ? colors.primary : colors.text }]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </Animatable.View>
      )}

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading audits...</Text>
        </View>
      ) : filteredAudits.length === 0 ? (
        <Animatable.View 
          animation="fadeIn"
          duration={500}
          style={styles.emptyContainer}
        >
          <Ionicons name="document-text-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No audits found</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Try adjusting your filters or create a new audit
          </Text>
          <TouchableOpacity 
            style={[styles.createButton, { backgroundColor: colors.primary }]}
            onPress={handleCreateAudit}
          >
            <Ionicons name="add-circle-outline" size={20} color={colors.white} style={styles.createButtonIcon} />
            <Text style={[styles.createButtonText, { color: colors.white }]}>Create New Audit</Text>
          </TouchableOpacity>
        </Animatable.View>
      ) : (
        <FlatList
          data={filteredAudits}
          renderItem={renderAuditItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TabBar
        activeTab="audits"
        onTabPress={(tab) => {
          if (tab !== 'audits') {
            navigation.navigate(tab);
          }
        }}
      />
    </SafeAreaView>
  );
};

export default AuditsScreen;
