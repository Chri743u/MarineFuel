
import * as React from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import firebase from 'firebase';

import SearchBar from 'react-native-search-bar';
import StationListItem from './StationListItem';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    item: {
        width: '50%'
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
                this.setState({stations: snapshot.val()});

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
        // Flatlist forventer et array. Derfor tager vi alle values fra vores stations objekt, og bruger som array til listen
        const stationArray = Object.values(stations);
        // Vi skal også bruge alle IDer, så vi tager alle keys også.
        const stationKeys = Object.keys(stations);
        return (
            <View style={styles.row}>
                <FlatList
                    data={stationArray}
                    // Vi bruger stationKeys til at finde ID på den aktuelle station og returnerer dette som key, og giver det med som ID til StationListItem
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
