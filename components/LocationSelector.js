import React, { useState } from 'react';
import { View, StyleSheet, Modal, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { TextInput } from 'react-native-gesture-handler';
import * as Icon from 'react-native-feather';
import { colors, radius, spacing, typography } from '../theme/index';
import { Button, ModalAlert } from './ui';
export default function LocationSelector({ onSelectLocation, setDeliveryAddress ,DeliveryAddress}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [initialLocation, setInitialLocation] = useState(null);
    const [alert, setAlert] = useState({ visible: false, message: '' });

    const getLocation = async () => {

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setAlert({ visible: true, message: 'Permission to access location was denied' });
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
            setAlert({ visible: true, message: 'Please select a location on the map' });
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={getLocation}>
                <Icon.MapPin width={18} height={18} stroke={colors.white} />
                <Text style={[typography.chipSelected, styles.buttonText]}>{DeliveryAddress?DeliveryAddress:"Select Location"}</Text>
            </TouchableOpacity>
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={false}
            >
                <View style={styles.modalContainer}>
                    <TextInput
                        style={[typography.body, styles.input]}
                        placeholder='Enter Your Full Address'
                        placeholderTextColor={colors.textGray}
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
                                <Icon.MapPin width={32} height={32} fill={colors.danger} stroke={colors.danger} />
                            </Marker>
                        )}
                    </MapView>
                    <View style={styles.buttonContainer}>
                        <Button variant="secondary" title="Cancel" onPress={() => setModalVisible(false)} style={styles.modalActionButton} />
                        <Button title="Confirm Location" onPress={handleConfirm} style={styles.modalActionButton} />
                    </View>
                </View>
            </Modal>

            <ModalAlert
              visible={alert.visible}
              title="Location"
              message={alert.message}
              confirmLabel="OK"
              onConfirm={() => setAlert({ visible: false, message: '' })}
              onRequestClose={() => setAlert({ visible: false, message: '' })}
            />
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
        backgroundColor: colors.primary,
        paddingVertical: spacing.space2,
        paddingHorizontal: spacing.space3,
        borderRadius: radius.pill,
        alignItems: 'center',
    },
    buttonText: {
        color: colors.white,
        marginLeft: spacing.space1,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: colors.background,
    },
    input: {
        height: spacing.touchTarget,
        borderColor: colors.white,
        borderWidth: 1,
        borderRadius: radius.pill,
        backgroundColor: colors.backgroundFaf,
        paddingHorizontal: spacing.space4,
        margin: spacing.space3,
        color: colors.textPrimary,
    },
    map: {
        width: '100%',
        height: '80%',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: spacing.space3,
        padding: spacing.space4,
    },
    modalActionButton: {
        flex: 1,
    },
});
