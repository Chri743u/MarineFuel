import * as React from 'react';
import {Text, StyleSheet, TouchableOpacity, SafeAreaView,} from 'react-native';
import * as Permissions from "expo-permissions";
import firebase from "firebase";
import {getDistance} from "geolib";
import * as Location from "expo-location";
import {View} from "react-native-web";

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        padding: 13,
        borderWidth: 1,
        margin: 5,
        justifyContent: 'space-between',
    },
    StationText: { width: 130,},
    ItemText: {width: 40,}
});

export default class StationDetails extends React.Component {
    state = {
        hasLocationPermission: null,
        currentLocation: null,
    };

    handlePress = () => {
        //Vi udpakker vores oprettede parametre, 'props'.
        const {id, onSelect} = this.props
        //Og 'onSelect' tager ID'et som vi har kaldt som argument.
        onSelect(id)
    };
    //Vi henter permissions til at bruge lokationstjeneste på brugerens device
    getLocationPermission = async () => {
        const { status } = await Permissions.askAsync(Permissions.LOCATION);
        this.setState({ hasLocationPermission: status });
    };
    //Opdaterer brugerens lokation
    updateLocation = async () => {
        const { coords } = await Location.getCurrentPositionAsync();
        this.setState({ currentLocation: coords });
    };

    componentDidMount = async () => {
        await this.getLocationPermission();
        await this.updateLocation();

    };

    //render funktionen tager vores argument og præsenterer det på skærmen.
    //Indpakningsfunktionen 'TouchableOpacity' reagere på touch. Ved et touch tryk er gennemsigtigheden nedsat -
    //dvs. udseendesmæssigt dæmpes knappen.
    render() {

        const { station,
            currentLocation,
        } = this.props;
        return (
            <SafeAreaView>
                <TouchableOpacity style={styles.container} onPress={this.handlePress}>
                    <Text style={styles.StationText}>
                        {station.name}
                    </Text>
                    <Text style={styles.ItemText}>
                        {station.diesel}
                    </Text>
                    <Text style={styles.ItemText}>
                        {station.benzin}
                    </Text>
                    <Text style={styles.ItemText}>10 km</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );


    };
}
