import * as React from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import firebase from 'firebase';
import StationListItem from './StationListItem';

const styles = StyleSheet.create({
    container1: {
        flex: 1,
        flexWrap: 'wrap',
    },
    item: {
        width: '20%'
    },
    header: {
        flexDirection: "row",
        padding: 13,
        borderWidth: 4,
        margin: 5,
        alignContent: "center",
    },
});

export default class StationList extends React.Component {
    state = {
        stations: {},
    };

    componentDidMount() {
        firebase
            .database()
            .ref('/Stations')
            .on('value', snapshot => {
                this.setState({stations: snapshot.val()});
            });}

        handleSelectStation = id => {
        this.props.navigation.navigate('StationDetails', { id });};

    //render funktionen tager vores argument og præsenterer det på skærmen.
    render() {
        const { stations } = this.state;
        //I tilfælde af en tom mængde (Ø), vises ingenting.
        if (!stations) {
            return null;
        }
        //Flatlist kræver variabler af typen 'array', hvorfor vi opretter en konstant som tager vores stations objekt
        //og sætter værdierne ind som et array
        const stationArray = Object.values(stations);
        //Ligeledes skal vores nøgler - vores ID'er - indsættes.
        const stationKeys = Object.keys(stations);
        return (
            <View style={styles.container1}>
                <Text style={styles.header}> Havn                                                 Brændstofpris</Text>
            <View style={styles.row}>
                <FlatList
                    data={stationArray}
                    //stationKeys som blev indsat i vores Array anvendes til at finde ID'et på en given station
                    //og returnere dette som en nøgle, og videregiver det som ID til StationListItem filen
                    keyExtractor={(item, index) => stationKeys[index]}
                    renderItem={({ item, index }) => (
                        <StationListItem
                            station={item}
                            id={stationKeys[index]}
                            onSelect={this.handleSelectStation}
                        />
                    )}
                />
            </View>
            </View>
        );
    }
}
