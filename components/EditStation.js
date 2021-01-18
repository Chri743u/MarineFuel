import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    Alert,
    ScrollView
} from 'react-native';
import firebase from 'firebase';

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center' },
    row: {
        flexDirection: 'row',
        height: 30,
        margin: 10,
    },
    label: { fontWeight: 'bold', width: 150 },
    input: { borderWidth: 1, flex: 1 },
});

//klassen tager data som kan skifte som komponent og opretter en tom string variabel.
export default class EditStation extends React.Component {
    state = {
        name: '',
        diesel: '',
        benzin: '',
        uid: firebase.auth().currentUser.uid,
        user: firebase.auth().currentUser,
        email: firebase.auth().currentUser.email,
        };


    componentDidMount() {
        const { user } = firebase.auth();
        this.setState({ user });
        const id = this.props.navigation.getParam('id');
        this.loadStation(id);
    }

    //firebase instantieringen som indlæser stationens data fra argumentet, ID, vi fik fra navigationen.
    loadStation = id => {
        firebase
            .database()
            .ref('/Stations/'+id)
            .once('value', dataObject => {
                const station = dataObject.val();
                const {name, diesel, benzin} = station;
                this.setState({ name, diesel, benzin});
            });
    };

    handleNameChange = text => this.setState({ name: text });
    handleDieselChange = text => this.setState({ diesel: text });
    handleBenzinChange = text => this.setState({ benzin: text });

    //this.props.navigation udpakker vores komponents data så vi kan anvende dens parametre
    updateData = () => {
        const { navigation } = this.props;
        const { name, diesel, benzin} = this.state;
        const id = navigation.getParam('id');
        try {
           firebase
                .database()
                .ref(`/Stations/${id}`)
                //Update ændre de felter vi har kaldt
                .update({ name, diesel, benzin});
            Alert.alert("Din info er nu opdateret");
            navigation.goBack();
        } catch (error) {
            Alert.alert(`Error: ${error.message}`);
        }
    };

    render() {
        const user = firebase.auth().currentUser;
        // Hvis der ikke er en bruger logget ind, vises der ingenting
        if (!user) {
            return null;
        }
        const { name, diesel, benzin} = this.state;
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.row}>
                        <Text style={styles.label}>{name}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Dieselpris</Text>
                        <TextInput
                            value={diesel}
                            onChangeText={this.handleDieselChange}
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Benzinpris</Text>
                        <TextInput
                            value={benzin}
                            onChangeText={this.handleBenzinChange}
                            style={styles.input}
                        />
                    </View>
                    <Button title="Tryk for at opdatere priserne!" onPress={this.updateData} />
                </ScrollView>
            </View>
        );
    }
}
