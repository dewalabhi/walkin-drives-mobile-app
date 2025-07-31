import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { drivesAPI, interestAPI } from '../../services/api';

export default function DriveDetailsScreen({ route, navigation }) {
  const { driveId } = route.params;
  const [drive, setDrive] = useState(null);
  const [hasInterest, setHasInterest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadDriveDetails();
    checkInterestStatus();
  }, [driveId]);

  const loadDriveDetails = async () => {
    try {
      const driveData = await drivesAPI.getDrive(driveId);
      setDrive(driveData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load drive details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const checkInterestStatus = async () => {
    try {
      const response = await interestAPI.checkInterest(driveId);
      setHasInterest(response.hasInterest);
    } catch (error) {
      console.error('Error checking interest:', error);
    }
  };

  const handleInterestToggle = async () => {
    setActionLoading(true);
    try {
      if (hasInterest) {
        await interestAPI.withdrawInterest(driveId);
        setHasInterest(false);
        Alert.alert('Success', 'Interest withdrawn successfully');
      } else {
        await interestAPI.expressInterest(driveId);
        setHasInterest(true);
        Alert.alert('Success', 'Interest expressed successfully! The company will be notified.');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update interest');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCall = () => {
    if (drive?.companyId?.contactNumber) {
      Linking.openURL(`tel:${drive.companyId.contactNumber}`);
    }
  };

  const handleWebsite = () => {
    if (drive?.companyId?.website) {
      const url = drive.companyId.website.startsWith('http') 
        ? drive.companyId.website 
        : `https://${drive.companyId.website}`;
      Linking.openURL(url);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!drive) {
    return (
      <View style={styles.errorContainer}>
        <Text>Drive not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Drive Details</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Company Info */}
        <View style={styles.companySection}>
          <Text style={styles.companyName}>{drive.companyId.companyName}</Text>
          {drive.companyId.companyDescription && (
            <Text style={styles.companyDescription}>
              {drive.companyId.companyDescription}
            </Text>
          )}
        </View>

        {/* Job Details */}
        <View style={styles.section}>
          <Text style={styles.jobTitle}>{drive.title}</Text>
          {drive.description && (
            <Text style={styles.description}>{drive.description}</Text>
          )}
        </View>

        {/* Date & Time */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Icon name="event" size={20} color="#007AFF" />
            <Text style={styles.infoText}>
              {new Date(drive.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Icon name="access-time" size={20} color="#007AFF" />
            <Text style={styles.infoText}>
              {drive.startTime} - {drive.endTime}
            </Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Icon name="location-on" size={20} color="#007AFF" />
            <View style={styles.locationInfo}>
              <Text style={styles.infoText}>{drive.location.address}</Text>
              <Text style={styles.cityText}>
                {drive.location.city}, {drive.location.state}
              </Text>
            </View>
          </View>
        </View>

        {/* Job Categories */}
        {drive.jobCategories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Job Categories</Text>
            <View style={styles.tagsContainer}>
              {drive.jobCategories.map((category, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{category}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Skills */}
        {drive.specificSkills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Required Skills</Text>
            <View style={styles.tagsContainer}>
              {drive.specificSkills.map((skill, index) => (
                <View key={index} style={[styles.tag, styles.skillTag]}>
                  <Text style={styles.skillTagText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Experience Level */}
        {drive.experienceLevel.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience Level</Text>
            <View style={styles.tagsContainer}>
              {drive.experienceLevel.map((exp, index) => (
                <View key={index} style={[styles.tag, styles.expTag]}>
                  <Text style={styles.expTagText}>{exp}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Requirements */}
        {drive.requirements && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Requirements</Text>
            <Text style={styles.requirements}>{drive.requirements}</Text>
          </View>
        )}

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          {drive.companyId.contactNumber && (
            <TouchableOpacity style={styles.contactButton} onPress={handleCall}>
              <Icon name="phone" size={20} color="#007AFF" />
              <Text style={styles.contactText}>{drive.companyId.contactNumber}</Text>
            </TouchableOpacity>
          )}
          
          {drive.companyId.website && (
            <TouchableOpacity style={styles.contactButton} onPress={handleWebsite}>
              <Icon name="language" size={20} color="#007AFF" />
              <Text style={styles.contactText}>{drive.companyId.website}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Interest Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Icon name="people" size={24} color="#666" />
            <Text style={styles.statNumber}>{drive.currentInterested}</Text>
            <Text style={styles.statLabel}>People Interested</Text>
          </View>
        </View>
      </ScrollView>

      {/* Interest Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.interestButton,
            hasInterest ? styles.withdrawButton : styles.expressButton,
            actionLoading && styles.buttonDisabled
          ]}
          onPress={handleInterestToggle}
          disabled={actionLoading}
        >
          <Icon 
            name={hasInterest ? "remove" : "add"} 
            size={24} 
            color="#fff" 
          />
          <Text style={styles.interestButtonText}>
            {actionLoading 
              ? 'Processing...' 
              : hasInterest 
                ? 'Withdraw Interest' 
                : 'Express Interest'
            }
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  companySection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  companyDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  locationInfo: {
    marginLeft: 10,
    flex: 1,
  },
  cityText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#e8f4ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  skillTag: {
    backgroundColor: '#f0f8e8',
  },
  skillTagText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '500',
  },
  expTag: {
    backgroundColor: '#fff3e0',
  },
  expTagText: {
    color: '#FF9800',
    fontSize: 14,
    fontWeight: '500',
  },
  requirements: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  contactText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 10,
  },
  statsSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 100,
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  interestButton: {
    flexDirection: 'row',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  expressButton: {
    backgroundColor: '#007AFF',
  },
  withdrawButton: {
    backgroundColor: '#FF3B30',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  interestButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});