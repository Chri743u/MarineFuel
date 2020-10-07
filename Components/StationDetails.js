
import * as React from 'react';
import { View, Text, Platform, FlatList, StyleSheet, Button, Alert } from 'react-native';
import firebase from 'firebase';
import { YellowBox } from 'react-native';
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
    if (message.indexOf('Setting a timer') <= -1) {
        _console.warn(message);
    }
};
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'flex-start' },
    row: {
        margin: 5,
        padding: 5,
        flexDirection: 'row',
    },
    label: { width: 100, fontWeight: 'bold' },
    value: { flex: 1 },
});

export default class StationDetails extends React.Component {
    state = { station: null };

    componentDidMount() {
        // Vi udlæser ID fra navgation parametre og loader bilen når komponenten starter
        const id = this.props.navigation.getParam('id');
        this.loadStation(id);
    }

    loadStation = id => {
        firebase
            .database()
            // ID fra funktionens argument sættes ind i stien vi læser fra
            .ref('/Stations/'+id)
            .on('value', asds => {
                this.setState({ station: asds.val() });
            });
    };

    handleEdit = () => {
        // Vi navigerer videre til EditStation skærmen og sender ID med
        const { navigation } = this.props;
        const id = navigation.getParam('id');
        navigation.navigate('EditStation', { id });
    };

    confirmDelete = () => {
        if(Platform.OS ==='ios' || Platform.OS ==='android'){
            Alert.alert('Are you sure?', 'Do you want to delete the station?', [
                { text: 'Cancel', style: 'cancel' },
                // Vi bruger this.handleDelete som eventHandler til onPress
                { text: 'Delete', style: 'destructive', onPress: this.handleDelete },
            ]);
        } else {
            if(confirm('Er du sikker på du vil slette denne station?')){
                this.handleDelete()
            }
        }
    };

    // Vi spørger brugeren om han er sikker

    // Vi sletter den aktuelle bil
    handleDelete = () => {
            const { navigation } = this.props;
            const id = navigation.getParam('id');
            try {
                firebase
                    .database()
                    // Vi sætter bilens ID ind i stien
                    .ref(`/Stations/${id}`)
                    // Og fjerner data fra den sti
                    .remove();
                // Og går tilbage når det er udført
                navigation.goBack();
            } catch (error) {
                Alert.alert(error.message);
            }

    };

    render() {
        const { station } = this.state;
        if (!station) {
            return <Text>No data</Text>;
        }
        return (
            <View style={styles.container}>
                <Button title="Edit" onPress={this.handleEdit} />
                <Button title="Delete" onPress={this.confirmDelete} />
                <View style={styles.row}>
                    <Text style={styles.label}>Navn</Text>
                    <Text style={styles.value}>{station.name}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Fuel price</Text>
                    <Text style={styles.value}>{station.price}</Text>
                </View>
            </View>
        );
    }
}
