import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import Constants from 'expo-constants';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { StyleSheet, Text, View, SafeAreaView, Button } from 'react-native';
import firebase from "firebase";

export default class Map extends React.Component {
    mapViewRef = React.createRef();

    //Vi sætter state til null
    state = {
        station: [],
        hasLocationPermission: null,
        currentLocation: null,
        userMarkerCoordinates: [],
        selectedCoordinate: null,
        selectedAddress: null,
    };

    //Vi henter permissions til at bruge lokationstjeneste på brugerens device
    getLocationPermission = async () => {
        const { status } = await Permissions.askAsync(Permissions.LOCATION);
        this.setState({ hasLocationPermission: status });
    };

    componentDidMount = async () => {
        await this.getLocationPermission();
        await
            firebase
                .database()
                .ref('/Stations/'+id)
                .once('value', dataObject => {
                    const station = dataObject.val();
                    const {name, lat, lon} = station;
                    this.setState({name, lat, lon});
                });
    };

    //Opdaterer brugerens lokation
    updateLocation = async () => {
        const { coords } = await Location.getCurrentPositionAsync();
        this.setState({ currentLocation: coords });
        const { latitude, longitude } = coords;
        this.mapViewRef &&
        this.mapViewRef.current.animateCamera({
            camera: { center: { latitude, longitude }, zoom: 20, altitude: 100 },
            duration: 10,
        });
    };

    handleSelectMarker = coordinate => {
        this.setState({ selectedCoordinate: coordinate });
        this.findAddress(coordinate);
    };

    findAddress = async coordinate => {
        const [selectedAddress] = await Location.reverseGeocodeAsync(coordinate);
        this.setState({ selectedAddress });
    };

    closeInfoBox = () =>
        this.setState({ selectedCoordinate: null, selectedAddress: null });

    //Skriver nuværende positionskoordinaterne ved tryk på update knappen
    renderCurrentLocation = () => {

        const { hasLocationPermission, currentLocation } = this.state;
        if (hasLocationPermission === null) {
            return null;
        }
        if (hasLocationPermission === false) {
            return <Text>No location access. Go to settings to change</Text>;
        }
        return (
            <View>
                <Button title="Update Location" onPress={this.updateLocation} />
                {currentLocation && (
                    <Text>
                        {`${currentLocation.latitude}, ${
                            currentLocation.longitude
                        } accuracy:${currentLocation.accuracy}`}
                    </Text>
                )}
            </View>
        );
    };


    render() {
        const {
            station,
            userMarkerCoordinates,
            selectedCoordinate,
            selectedAddress,
        } = this.state;
        return (

            <SafeAreaView style={styles.container}>
                {this.renderCurrentLocation()}
                <MapView
                    provider="google"
                    style={styles.map}
                    ref={this.mapViewRef}
                    showsUserLocation
                    showsMyLocationButton
                    followsUserLocation={true}>
                    <Marker
                        coordinate={{ latitude: station.lat, longitude: station.lon}}
                        title="Korsør Lystbådehavn"
                        description="Brændstofpris: 10.9 - xx km"

                    />
                    <Marker
                        coordinate={{ latitude: 55.965206, longitude: 11.844747 }}
                        title="Hundested Havn"
                        description="Brændstofpris: 9.9 - xx km"

                    />
                    {userMarkerCoordinates.map((coordinate, index) => (
                        <Marker
                            coordinate={coordinate}
                            key={index.toString()}
                            onPress={() => this.handleSelectMarker(coordinate)}
                        />
                    ))}
                </MapView>
                {selectedCoordinate && (
                    <View style={styles.infoBox}>
                        <Text style={styles.infoText}>
                            {selectedCoordinate.latitude}, {selectedCoordinate.longitude}
                        </Text>
                        {selectedAddress && (
                            <Text style={styles.infoText}>
                                {selectedAddress.name} {selectedAddress.postalCode}
                            </Text>
                        )}
                        <Button title="close" onPress={this.closeInfoBox} />
                    </View>
                )}
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#ecf0f1',
        padding: 8,
    },
    map: { flex: 1 },
    infoBox: {
        height: 100,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'yellow',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    infoText: {
        fontSize: 20,
    },
});