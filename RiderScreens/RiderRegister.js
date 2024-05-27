import React,{useState} from 'react'
import {View,Text,StyleSheet,TextInput,Button,TouchableOpacity} from 'react-native'


export default function RiderRegistration (){
    
   return(
    <View style={styles.container}>
    <View style={styles.companyInfoContainer}>
      <TextInput
        style={styles.input}
        placeholder="Business Name"
      />
      <TextInput
        style={styles.input}
        placeholder="Company Address"
      />
      <View style={styles.inlineInputs}>
        <TextInput
          style={[styles.input, styles.inlineInput]}
          placeholder="City"
        />
        <TextInput
          style={[styles.input, styles.inlineInput]}
          placeholder="State/Province"
        />
        <TextInput
          style={[styles.input, styles.inlineInput]}
          placeholder="Country"
        />
      </View>
      
      <View style={styles.inlineInputs}>
        
        <TextInput
          style={[styles.input, styles.inlineInput]}
          placeholder="Latitude"
        />
        <TextInput
          style={[styles.input, styles.inlineInput]}
          placeholder="Longitude"
        />
        
      </View>
      <TextInput
        style={styles.input}
        placeholder="Contact"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
      />
      <TextInput
        style={styles.input}
        placeholder="Shop Category"
      />
    </View>
    
    {/* Add other sections of the form here */}
    <Button title="Register" onPress={() => {}} />
  </View>
   )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 40,
      backgroundColor: '#FFFFFF',
    },
    companyInfoContainer: {
      backgroundColor: '#FFFFFF',
      padding: 20,
      borderRadius: 20,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    input: {
      height: 40,
      borderColor: '#CCCCCC',
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    inlineInputs: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    inlineInput: {
      flex: 1,
      marginRight: 5,
    },
   
  });