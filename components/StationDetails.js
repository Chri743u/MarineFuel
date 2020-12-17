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
    label: { width: 187.5, fontWeight: 'bold' },
    value: { flex: 1 },
});

export default class StationDetails extends React.Component {

    state = {
        station: null,
        uid: firebase.auth().currentUser.uid,
        user: firebase.auth().currentUser,
        email: firebase.auth().currentUser.email,
    };

    componentDidMount() {
        const { user } = firebase.auth();
        this.setState({ user });
        //ID udlæses fra navigation parametre og station objektet indlæses når komponenten starter
        const id = this.props.navigation.getParam('id');
        this.loadStation(id);
    }

    loadStation = id => {
        firebase
            .database()
            //Firebase instantiering som tager ID fra funktionens argument og indsættes i stien der hentes fra.
            .ref('/Stations/'+id)
            .on('value', asds => {
                this.setState({ station: asds.val() });
            });
    };

    //Funktionen som håndtere navigationen til 'EditStation' viewet tager ID'et som argument videre
    handleEdit = () => {
        const { navigation } = this.props;
        const id = navigation.getParam('id');
        navigation.navigate('EditStation', { id });
    };

    //Dialogbokse som bekræfter/afkræfter en brugers handlinger
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

    //Funktionen som håndtere at et station objekt skal slettes.
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

    //Vores præsentation på skærmen, hvor 'Navn' på stationen og 'Brændstofspris' på stationen fremgår
    //Her bindes de forskellige funktioner sammen
    render() {
        const user = firebase.auth().currentUser;
        // Hvis der ikke er en bruger logget ind, vises der ingenting
        if (!user) {
            return null;
        }
        const { station } = this.state;
        if (!station) {
            return <Text>No data</Text>;
        }
        return (
            <View style={styles.container}>

                <View style={styles.row}>
                    <Text style={styles.label}>Navn</Text>
                    <Text style={styles.value}>{station.name}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Dieselpris</Text>
                    <Text style={styles.value}>{station.diesel}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Benzinpris</Text>
                    <Text style={styles.value}>{station.benzin}</Text>
                </View>
                <Button title="Edit" onPress={this.handleEdit} />
                <Button title="Delete" onPress={this.confirmDelete} />
            </View>
        );
    }
}
