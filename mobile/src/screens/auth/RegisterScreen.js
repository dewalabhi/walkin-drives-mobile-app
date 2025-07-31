import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const [userType, setUserType] = useState('candidate');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Company fields
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  
  // Candidate fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('Fresher (0 years)');
  
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (userType === 'company' && (!companyName || !contactNumber)) {
      Alert.alert('Error', 'Please fill in company name and contact number');
      return;
    }

    if (userType === 'candidate' && (!fullName || !phone)) {
      Alert.alert('Error', 'Please fill in your name and phone number');
      return;
    }

    const userData = {
      userType,
      email,
      password,
      ...(userType === 'company' ? {
        companyName,
        companyDescription,
        website,
        contactNumber,
      } : {
        fullName,
        phone,
        location,
        experience,
      })
    };

    setLoading(true);
    const result = await signUp(userData);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Registration Failed', result.error);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join our platform today</Text>

          <View style={styles.form}>
            {/* User Type Selection */}
            <Text style={styles.label}>I am a:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={userType}
                onValueChange={(itemValue) => setUserType(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Job Candidate" value="candidate" />
                <Picker.Item label="Company/Recruiter" value="company" />
              </Picker>
            </View>

            {/* Common Fields */}
            <TextInput
              style={styles.input}
              placeholder="Email *"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Password *"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm Password *"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            {/* Company Specific Fields */}
            {userType === 'company' && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Company Name *"
                  value={companyName}
                  onChangeText={setCompanyName}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Company Description"
                  value={companyDescription}
                  onChangeText={setCompanyDescription}
                  multiline
                  numberOfLines={3}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Website"
                  value={website}
                  onChangeText={setWebsite}
                  autoCapitalize="none"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Contact Number *"
                  value={contactNumber}
                  onChangeText={setContactNumber}
                  keyboardType="phone-pad"
                />
              </>
            )}

            {/* Candidate Specific Fields */}
            {userType === 'candidate' && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Full Name *"
                  value={fullName}
                  onChangeText={setFullName}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Phone Number *"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Current Location"
                  value={location}
                  onChangeText={setLocation}
                />

                <Text style={styles.label}>Experience Level:</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={experience}
                    onValueChange={(itemValue) => setExperience(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Fresher (0 years)" value="Fresher (0 years)" />
                    <Picker.Item label="1-2 years" value="1-2 years" />
                    <Picker.Item label="3-5 years" value="3-5 years" />
                    <Picker.Item label="5+ years" value="5+ years" />
                  </Picker>
                </View>
              </>
            )}

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.linkText}>
              Already have an account? <Text style={styles.linkTextBold}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
  },
  button: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  linkButton: {
    alignItems: 'center',
  },
  linkText: {
    fontSize: 16,
    color: '#666',
  },
  linkTextBold: {
    color: '#007AFF',
    fontWeight: '600',
  },
});