import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    Alert,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import firebase from 'firebase';

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center' },
    row: {
        flexDirection: 'row',
        height: 30,
        margin: 10,
    },
    label: { fontWeight: 'bold', width: 125 },
    input: { borderWidth: 1, flex: 1 },
});

export default class AddStation extends React.Component {
    state = {
        name: '',
        diesel: '',
        benzin: '',
    };

    //Håndtering af navn og pris til havn
    handleNameChange = text => this.setState({ name: text });
    handleDieselChange = text => this.setState({ diesel: text });
    handleBenzinChange = text => this.setState({ benzin: text });

    //Kald til databasen som kaldes når der trykkes på 'add station' - ses i render()
    handleSave = () => {
        const { name, diesel, benzin} = this.state;
        try {
            const reference = firebase
                .database()
                .ref('/Stations/')
                .push({ name, diesel, benzin});
            Alert.alert(`Saved`);
            this.setState({
                name: '',
                diesel: '',
                benzin: '',

            });
        } catch (error) {
            Alert.alert(`Error: ${error.message}`);
        }
    };

    render() {
        const { name, diesel, benzin} = this.state;
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.row}>
                        <Text style={styles.label}>Navn</Text>
                        <TextInput
                            value={name}
                            onChangeText={this.handleNameChange}
                            style={styles.input}
                        />
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
                            onChangeText={this.handleBenzinChange()}
                            style={styles.input}
                        />
                    </View>
                    <Button title="Add Station"
                            onPress={this.handleSave}

                    />
                </ScrollView>
            </SafeAreaView>
        );
    }
}
