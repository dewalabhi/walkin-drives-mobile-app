import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { drivesAPI } from '../../services/api';

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata'];
const JOB_CATEGORIES = ['Technology', 'Software Development', 'IT', 'HR', 'Finance', 'Sales', 'Marketing'];

export default function HomeScreen({ navigation }) {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    city: '',
    jobCategories: [],
    searchText: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadDrives();
  }, [filters]);

  const loadDrives = async () => {
    try {
      setLoading(true);
      const filterParams = {};
      
      if (filters.city) filterParams.city = filters.city;
      if (filters.jobCategories.length > 0) {
        filterParams.jobCategories = filters.jobCategories.join(',');
      }
      
      const response = await drivesAPI.getDrives(filterParams);
      setDrives(response.drives);
    } catch (error) {
      console.error('Error loading drives:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDrives();
    setRefreshing(false);
  };

  const toggleCategoryFilter = (category) => {
    setFilters(prev => ({
      ...prev,
      jobCategories: prev.jobCategories.includes(category)
        ? prev.jobCategories.filter(c => c !== category)
        : [...prev.jobCategories, category]
    }));
  };

  const DriveCard = ({ item }) => (
    <TouchableOpacity
      style={styles.driveCard}
      onPress={() => navigation.navigate('DriveDetails', { driveId: item._id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.companyName}>{item.companyId.companyName}</Text>
        <Text style={styles.date}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
      </View>
      
      <Text style={styles.jobTitle}>{item.title}</Text>
      
      <View style={styles.locationRow}>
        <Icon name="location-on" size={16} color="#666" />
        <Text style={styles.location}>{item.location.city}</Text>
      </View>
      
      <View style={styles.timeRow}>
        <Icon name="access-time" size={16} color="#666" />
        <Text style={styles.time}>
          {item.startTime} - {item.endTime}
        </Text>
      </View>
      
      <View style={styles.categoriesContainer}>
        {item.jobCategories.slice(0, 2).map((category, index) => (
          <View key={index} style={styles.categoryTag}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        ))}
        {item.jobCategories.length > 2 && (
          <Text style={styles.moreCategories}>
            +{item.jobCategories.length - 2} more
          </Text>
        )}
      </View>
      
      <View style={styles.cardFooter}>
        <Text style={styles.interested}>
          {item.currentInterested} interested
        </Text>
        
        <TouchableOpacity style={styles.interestButton}>
          <Icon name="add" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Walk-in Drives</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Icon name="filter-list" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search companies or job titles..."
          value={filters.searchText}
          onChangeText={(text) => setFilters(prev => ({ ...prev, searchText: text }))}
        />
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          {/* City Filter */}
          <Text style={styles.filterLabel}>City</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterRow}>
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  !filters.city && styles.filterChipActive
                ]}
                onPress={() => setFilters(prev => ({ ...prev, city: '' }))}
              >
                <Text style={[
                  styles.filterChipText,
                  !filters.city && styles.filterChipTextActive
                ]}>All Cities</Text>
              </TouchableOpacity>
              {CITIES.map(city => (
                <TouchableOpacity
                  key={city}
                  style={[
                    styles.filterChip,
                    filters.city === city && styles.filterChipActive
                  ]}
                  onPress={() => setFilters(prev => ({ ...prev, city }))}
                >
                  <Text style={[
                    styles.filterChipText,
                    filters.city === city && styles.filterChipTextActive
                  ]}>{city}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Job Categories Filter */}
          <Text style={styles.filterLabel}>Job Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterRow}>
              {JOB_CATEGORIES.map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterChip,
                    filters.jobCategories.includes(category) && styles.filterChipActive
                  ]}
                  onPress={() => toggleCategoryFilter(category)}
                >
                  <Text style={[
                    styles.filterChipText,
                    filters.jobCategories.includes(category) && styles.filterChipTextActive
                  ]}>{category}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Drives List */}
      <FlatList
        data={drives}
        renderItem={({ item }) => <DriveCard item={item} />}
        keyExtractor={(item) => item._id}
        style={styles.drivesList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  filterButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
  },
  filtersContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  filterChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  filterChipActive: {
    backgroundColor: '#007AFF',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  drivesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  driveCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  time: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  categoryTag: {
    backgroundColor: '#e8f4ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  moreCategories: {
    fontSize: 12,
    color: '#666',
    alignSelf: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  interested: {
    fontSize: 14,
    color: '#666',
  },
  interestButton: {
    backgroundColor: '#e8f4ff',
    borderRadius: 20,
    padding: 8,
  },
});
