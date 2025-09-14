import React, { useState } from 'react';
import { View, Alert, StyleSheet, Modal, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { TextInput } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { themeColors } from '../theme/index';
export default function LocationSelector({ onSelectLocation, setDeliveryAddress ,DeliveryAddress}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [initialLocation, setInitialLocation] = useState(null);
   
    const getLocation = async () => {
        
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied');
            return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setInitialLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        });
        setModalVisible(true);
    };

    const handleMapPress = (event) => {
        setSelectedLocation(event.nativeEvent.coordinate);
    };

    const handleConfirm = () => {
        if (selectedLocation) {
            onSelectLocation(selectedLocation);
            setModalVisible(false);
        } else {
            Alert.alert('Please select a location on the map');
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={getLocation}>
                <Ionicons name="location-outline" size={24} color="white" />
                <Text style={styles.buttonText}>{DeliveryAddress?DeliveryAddress:"Select Location"}</Text>
            </TouchableOpacity>
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={false}
            >
                <View style={styles.modalContainer}>
                    <TextInput 
                        style={styles.input}
                        placeholder='Enter Your Full Address' 
                        onChangeText={(text) => setDeliveryAddress(text)} 
                    />
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: initialLocation ? initialLocation.latitude : 37.78825,
                            longitude: initialLocation ? initialLocation.longitude : -122.4324,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        onPress={handleMapPress}
                    >
                        {selectedLocation && (
                            <Marker
                                coordinate={selectedLocation}
                                title="Selected Location"
                                description="Your selected location"
                            >
                                <Ionicons name="location-sharp" size={40} color="red" />
                            </Marker>
                        )}
                    </MapView>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                            <Text style={styles.confirmButtonText}>Confirm Location</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        flexDirection: 'row',
        backgroundColor: themeColors.bgColor(1),
        padding: 8,
        borderRadius: 10,
        alignItems: 'center',
        // width:'auto',
        // height:'auto',
        // borderRadius:50,
        
    },
    buttonText: {
        color: 'white',
        marginLeft: 5,
        fontSize: 16,
        fontWeight:'600'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        margin: 10,
    },
    map: {
        width: '100%',
        height: '80%',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 16,
    },
    confirmButton: {
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 5,
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: '#dc3545',
        padding: 10,
        borderRadius: 5,
    },
    cancelButtonText: {
        color: 'white',
        fontSize: 16,
    },
});
