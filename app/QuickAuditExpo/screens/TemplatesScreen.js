import React, { useState, useLayoutEffect, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import SearchBar from '../components/SearchBar';
import FilterButton from '../components/FilterButton';
import { useFocusEffect } from '@react-navigation/native';

const TemplatesScreen = ({ navigation, route }) => {
  const { colors, typography, spacing } = useTheme();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [templates, setTemplates] = useState([
    {
      id: '1',
      title: 'Food Safety Inspection',
      category: 'Safety',
      questions: 24,
      lastUpdated: '2025-05-15',
      isFavorite: true
    },
    {
      id: '2',
      title: 'Workplace Safety Audit',
      category: 'Safety',
      questions: 32,
      lastUpdated: '2025-05-10',
      isFavorite: false
    },
    {
      id: '3',
      title: 'Quality Control Checklist',
      category: 'Quality',
      questions: 18,
      lastUpdated: '2025-05-05',
      isFavorite: true
    },
    {
      id: '4',
      title: 'Facility Maintenance Inspection',
      category: 'Maintenance',
      questions: 42,
      lastUpdated: '2025-04-28',
      isFavorite: false
    },
    {
      id: '5',
      title: 'COVID-19 Safety Protocol',
      category: 'Health',
      questions: 15,
      lastUpdated: '2025-04-20',
      isFavorite: false
    }
  ]);

  // Filter options
  const filters = [
    { id: 'all', label: 'All', icon: 'grid-outline' },
    { id: 'favorites', label: 'Favorites', icon: 'star-outline' },
    { id: 'recent', label: 'Recent', icon: 'time-outline' },
    { id: 'category', label: 'Category', icon: 'folder-outline' }
  ];

  // Set up header right button for creating a new template
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          onPress={() => navigation.navigate('NewTemplate')}
          style={{ marginRight: 16 }}
        >
          <Ionicons name="add-circle" size={28} color={colors.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, colors.primary]);

  // Check if template was updated in the last 7 days
  const isRecent = (dateString) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(dateString) > oneWeekAgo;
  };

  // Filter templates based on search and active filter
  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'all' || 
                         (activeFilter === 'favorites' && template.isFavorite) ||
                         (activeFilter === 'recent' && isRecent(template.lastUpdated)) ||
                         (activeFilter === 'category' && template.category === 'Safety');
      
      return matchesSearch && matchesFilter;
    });
  }, [templates, searchQuery, activeFilter]);

  // Handle search input change
  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  // Handle filter button press
  const handleFilterPress = (filterId) => {
    setActiveFilter(filterId);
  };

  // Toggle favorite status of a template
  const toggleFavorite = (id) => {
    setTemplates(templates.map(template => 
      template.id === id 
        ? {...template, isFavorite: !template.isFavorite} 
        : template
    ));
  };

  // Handle template press
  const handleTemplatePress = (template) => {
    navigation.navigate('TemplateDetail', { templateId: template.id });
  };

  // Get color for category badge
  const getCategoryColor = (category) => {
    const colors = {
      'Safety': '#4CAF50',
      'Quality': '#2196F3',
      'Maintenance': '#FF9800',
      'Health': '#F44336',
    };
    return colors[category] || '#9E9E9E';
  };

  // Render template item
  const renderTemplateItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => handleTemplatePress(item)}
      activeOpacity={0.8}
    >
      <Animatable.View 
        animation="fadeIn" 
        duration={500}
        style={[styles.templateCard, { backgroundColor: colors.surface }]}
      >
        <View style={styles.templateHeader}>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
            <Text style={[styles.categoryText, { color: 'white' }]}>{item.category}</Text>
          </View>
          <TouchableOpacity 
            onPress={(e) => {
              e.stopPropagation();
              toggleFavorite(item.id);
            }}
          >
            <Ionicons 
              name={item.isFavorite ? 'star' : 'star-outline'} 
              size={24} 
              color={item.isFavorite ? colors.accent : colors.textTertiary} 
            />
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.templateTitle, { color: colors.textPrimary }]}>{item.title}</Text>
        
        <View style={styles.templateFooter}>
          <Text style={[styles.templateMeta, { color: colors.textTertiary }]}>
            {item.questions} questions • Updated {item.lastUpdated}
          </Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
        </View>
      </Animatable.View>
    </TouchableOpacity>
  );

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Add any data refresh logic here
      return () => {}; // Optional cleanup
    }, [])
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Search Bar */}
        <SearchBar 
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Search templates..."
          placeholderTextColor={colors.textTertiary}
        />
        
        {/* Filter Buttons */}
        <View style={[styles.filterContainer, { marginBottom: spacing.medium }]}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContent}
          >
            {filters.map((filter) => (
              <FilterButton
                key={filter.id}
                label={filter.label}
                icon={filter.icon}
                isActive={activeFilter === filter.id}
                onPress={() => handleFilterPress(filter.id)}
                style={{ marginRight: spacing.small }}
              />
            ))}
          </ScrollView>
        </View>
        
        {/* Template List */}
        <FlatList
          data={filteredTemplates}
          renderItem={renderTemplateItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons 
                name="document-text-outline" 
                size={48} 
                color={colors.textTertiary} 
              />
              <Text style={[styles.emptyStateText, { color: colors.textTertiary }]}>
                {searchQuery ? 'No matching templates found' : 'No templates available'}
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  filterContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  filterScrollContent: {
    paddingVertical: 8,
  },
  listContainer: {
    paddingBottom: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  templateCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  templateTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  templateFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  templateMeta: {
    fontSize: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  templateActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  }
});

export default TemplatesScreen;
