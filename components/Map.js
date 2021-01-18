import * as React from "react";
import Constants from "expo-constants";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { StyleSheet, Text, View, SafeAreaView, Button } from "react-native";
import firebase from "firebase";
import {getDistance} from "geolib";

export default class Map extends React.Component {
    mapViewRef = React.createRef();

    //Vi sætter state til null
    state = {

        uid: firebase.auth().currentUser.uid,
        user: firebase.auth().currentUser,
        email: firebase.auth().currentUser.email,

        stations: {},
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
        const { user } = firebase.auth().currentUser;
        this.setState({ user });
        firebase
            .database()
            .ref("/Stations")
            .on("value", (snapshot) => {
                this.setState({ stations: snapshot.val() });
            });
        await this.updateLocation();
    };

    //Opdaterer brugerens lokation
    updateLocation = async () => {
        const { coords } = await Location.getCurrentPositionAsync();
        this.setState({ currentLocation: coords });
    };

    handleSelectMarker = (coordinate) => {
        this.setState({ selectedCoordinate: coordinate });
        this.findAddress(coordinate);
    };

    findAddress = async (coordinate) => {
        const [selectedAddress] = await Location.reverseGeocodeAsync(coordinate);
        this.setState({ selectedAddress });
    };

    closeInfoBox = () =>
        this.setState({ selectedCoordinate: null, selectedAddress: null });

    //Opdaterer nuværende positionskoordinaterne ved tryk på update knappen
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
            </View>
        );
    };

    render() {
        const {
            stations,
            selectedCoordinate,
            selectedAddress,
            currentLocation,
        } = this.state;

        {
            /**
             Use the .values() function from the Object class to create an array from the stations object
             */
        }

        const user = firebase.auth().currentUser;
        const stationArray = Object.values(stations);
        // Hvis der ikke er en bruger logget ind, vises der ingenting
        if (!user) {
           return null;
       }
        return (
            <SafeAreaView style={styles.container}>
                {this.renderCurrentLocation()}
                {currentLocation &&(
                <MapView
                    provider="google"
                    style={styles.map}
                    ref={this.mapViewRef}
                    initialRegion={{
                        latitude: currentLocation.latitude,
                        longitude: currentLocation.longitude,
                        latitudeDelta: 0.10,
                        longitudeDelta: 0.45
                    }}
                    showsUserLocation
                    showsMyLocationButton
                    followsUserLocation={true}

                >
                    {/**
                     * If stationArray has any elements
                     * map over stationArray with .map()
                     * return a <Marker /> component for each element in stationArray
                     */}
                    {stationArray.length > 0 &&
                    stationArray.map((station, index) => {
                        return (
                            <Marker
                                coordinate={{ latitude: station.lat, longitude: station.lon }}
                                title={station.name}
                                key={index}
                                description={"Benzin: " + station.benzin + "\tDiesel: " + station.diesel + "\nAfstand: " +
                                (getDistance(
                                    {latitude: currentLocation.latitude, longitude: currentLocation.longitude},
                                    {latitude: station.lat, longitude: station.lon})/1000) + " km"}
                            />
                        );
                    })}

                </MapView>)}
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
        justifyContent: "center",
        paddingTop: Constants.statusBarHeight,
        backgroundColor: "#ecf0f1",
        padding: 8,
    },
    map: { flex: 1 },
    infoBox: {
        height: 100,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "yellow",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    infoText: {fontSize: 20,},
});

