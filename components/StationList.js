import * as React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import firebase from 'firebase';

import StationListItem from './StationListItem';

export default class StationList extends React.Component {
    state = {
        stations: {},
    };

    componentDidMount() {
        firebase
            .database()
            .ref('/Stations')
            .on('value', snapshot => {
                this.setState({ cars: snapshot.val() });
            });
    }

    handleSelectStation = id => {
        this.props.navigation.navigate('StationDetails', { id });
    };

    render() {
        const { stations } = this.state;
        // Vi viser ingenting hvis der ikke er data
        if (!stations) {
            return null;
        }
        // Flatlist forventer et array. Derfor tager vi alle values fra vores cars objekt, og bruger som array til listen
        const stationArray = Object.values(stations);
        // Vi skal også bruge alle IDer, så vi tager alle keys også.
        const stationKeys = Object.keys(stations);
        return (
            <View>
                <FlatList
                    data={stationArray}
                    // Vi bruger stationKeys til at finde ID på den aktuelle bil og returnerer dette som key, og giver det med som ID til StationListItem
                    keyExtractor={(item, index) => stationKeys[index]}
                    renderItem={({ item, index }) => (
                        <StationListItem
                            car={item}
                            id={stationKeys[index]}
                            onSelect={this.handleSelectStation}
                        />
                    )}
                />
            </View>
        );
    }
}