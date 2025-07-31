import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { drivesAPI, interestAPI } from '../../services/api';

export default function DriveManagementScreen() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDrives();
  }, []);

  const loadDrives = async () => {
    try {
      setLoading(true);
      const response = await drivesAPI.getMyDrives();
      setDrives(response);
    } catch (error) {
      Alert.alert('Error', 'Failed to load drives');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDrives();
    setRefreshing(false);
  };

  const viewCandidates = async (driveId, driveTitle) => {
    try {
      const candidates = await interestAPI.getDriveCandidates(driveId);
      Alert.alert(
        `Interested Candidates - ${driveTitle}`,
        candidates.length > 0 
          ? candidates.map(c => `• ${c.candidateId.fullName} (${c.candidateId.phone})`).join('\n')
          : 'No candidates have expressed interest yet.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to load candidates');
    }
  };

  const DriveItem = ({ item }) => (
    <View style={styles.driveCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.driveTitle}>{item.title}</Text>
        <View style={[styles.statusBadge, styles[`status${item.status}`]]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <Text style={styles.driveDate}>
        {new Date(item.date).toLocaleDateString()} • {item.startTime} - {item.endTime}
      </Text>
      
      <Text style={styles.driveLocation}>{item.location.city}</Text>

      <View style={styles.cardFooter}>
        <Text style={styles.interestedCount}>
          {item.currentInterested} interested
        </Text>
        
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => viewCandidates(item._id, item.title)}
        >
          <Text style={styles.viewButtonText}>View Candidates</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Drives</Text>
      </View>

      <FlatList
        data={drives}
        renderItem={({ item }) => <DriveItem item={item} />}
        keyExtractor={(item) => item._id}
        style={styles.drivesList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="business" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No drives created yet</Text>
            <Text style={styles.emptySubText}>Create your first walk-in drive</Text>
          </View>
        }
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
  drivesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  driveCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  driveTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusactive: {
    backgroundColor: '#e8f5e8',
  },
  statusclosed: {
    backgroundColor: '#ffe8e8',
  },
  statuspostponed: {
    backgroundColor: '#fff3e0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  driveDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  driveLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  interestedCount: {
    fontSize: 14,
    color: '#666',
  },
  viewButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
});