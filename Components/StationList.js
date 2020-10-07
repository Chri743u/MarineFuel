
import * as React from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import firebase from 'firebase';

import StationListItem from './StationListItem';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start' // if you want to fill rows left to right
    },
    item: {
        width: '50%' // is 50% of container width
    }
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
                this.setState({ stations: snapshot.val() });
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
            <View style={styles.row}>
                <FlatList
                    data={stationArray}
                    // Vi bruger stationKeys til at finde ID på den aktuelle bil og returnerer dette som key, og giver det med som ID til CarListItem
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
        );

    }
}
