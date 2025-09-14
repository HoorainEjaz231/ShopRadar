import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import network from '../network';
import { useNavigation } from '@react-navigation/native';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  
  const [data,setdata] = useState(null)

  const handleLoginCheck =async () => {
    const userData = await AsyncStorage.getItem('user');
    setdata(JSON.parse(userData));
   console.log(JSON.parse(userData))
    if(userData){
      navigation.replace('DrawerNav')
    }
  }

useEffect(() => {
    handleLoginCheck();
  }, []);

  //const navigation = useNavigation()
  const handleLogin = async () => {

    try {
      const response = await axios.post(`${network.serverurl}/Customer/login`, {
        Email: email,
        Password: password,
      });
      if (response.status === 200) {
        await AsyncStorage.setItem('user', JSON.stringify(response.data));
        console.log(response.data)
        Alert.alert('Success', 'Logged in successfully', [
          { text: 'OK', onPress: () => navigation.replace('DrawerNav') }
        ]);
      }
    } catch (error) {
      console.log('Login failed:', error);
      Alert.alert('Error', 'Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.link}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Text>Show Products Only </Text>
        <TouchableOpacity onPress={() => navigation.navigate('DrawerNav')}>
          <Text style={styles.link}>View Products</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 32,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 15,
    borderRadius: 25,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'center',
  },
  link: {
    color: '#3498db',
    fontWeight: 'bold',
  },
});
