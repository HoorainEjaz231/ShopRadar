import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const LocationSelector = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('Select a location');
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setAddress('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setAddress(
        reverseGeocode[0]?.formatted_address || 'Location not found'
      );
    })();
  }, []);

  const handleLocationSelect = (data, details) => {
    const { lat, lng } = details.geometry.location;
    console.log('Selected location:', lat, lng); // Debug log
    setSelectedLocation({
      latitude: lat,
      longitude: lng,
    });
    setRegion({
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    console.log(details.for)
    setAddress(details.formatted_address);
  };

  const handleSetLocation = () => {
    console.log('Setting location:', selectedLocation); // Debug log
    if (selectedLocation) {
      setRegion({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.locationButton} onPress={() => setModalVisible(true)}>
        <MaterialIcons name="location-pin" size={24} color="black" />
        <Text style={styles.locationText}>{address}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Select Location</Text>
          <TouchableOpacity
            style={styles.currentLocationButton}
            onPress={async () => {
              let location = await Location.getCurrentPositionAsync({});
              setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              });
              setAddress('Current location');
              setSelectedLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              });
            }}
          >
            <Text style={styles.currentLocationText}>Use Current Location</Text>
          </TouchableOpacity>

          <GooglePlacesAutocomplete
            placeholder="Search"
            onPress={handleLocationSelect}
            query={{
              key: 'YOUR_GOOGLE_API_KEY', // Replace with your API key
              language: 'en',
            }}
            styles={{
              textInputContainer: styles.textInputContainer,
              textInput: styles.textInput,
              listView: styles.listView,
            }}
            fetchDetails={true}
          />

          <MapView
            style={styles.map}
            region={region}
            onRegionChangeComplete={(region) => setRegion(region)}
          >
            <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
          </MapView>

          <TouchableOpacity
            style={styles.setLocationButton}
            onPress={handleSetLocation}
            disabled={!selectedLocation}
          >
            <Text style={styles.setLocationText}>Set Location</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  locationText: {
    marginLeft: 10,
  },
  modalView: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  currentLocationButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    marginBottom: 20,
  },
  currentLocationText: {
    color: 'white',
    fontSize: 16,
  },
  textInputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  textInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingLeft: 8,
    borderRadius: 5,
  },
  listView: {
    backgroundColor: 'white',
  },
  map: {
    width: '100%',
    height: 300,
  },
  setLocationButton: {
    padding: 10,
    backgroundColor: '#28a745',
    borderRadius: 5,
    marginTop: 20,
  },
  setLocationText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#d9534f',
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default LocationSelector;
