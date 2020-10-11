
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
    label: { fontWeight: 'bold', width: 100 },
    input: { borderWidth: 1, flex: 1 },
});

export default class EditStation extends React.Component {
    state = {
        brand: '',
        model: '',
    };

    componentDidMount() {
        const id = this.props.navigation.getParam('id');
        this.loadStation(id);
    }

    // Her loader vi bilens data ud fra det ID vi får med fra navigationen
    loadStation = id => {
        firebase
            .database()
            .ref('/Stations/'+id)
            .once('value', dataObject => {
                const station = dataObject.val();
                const {name, price} = station;
                this.setState({ name, price});
            });
    };

    handleNameChange = text => this.setState({ name: text });

    handlePriceChange = text => this.setState({ price: text });

    updateData = () => {
        // Vi bruger this.props.navigation flere steder så vi pakker den ud én gang for alle
        const { navigation } = this.props;
        const { name, price} = this.state;
        const id = navigation.getParam('id');
        try {
           firebase
                .database()
                .ref(`/Stations/${id}`)
                // Vi bruger update, så kun de felter vi angiver, bliver ændret
                .update({ name, price});
            // Når bilen er ændret, går vi tilbage.
            Alert.alert("Din info er nu opdateret");
            navigation.goBack();
        } catch (error) {
            Alert.alert(`Error: ${error.message}`);
        }
    };

    render() {
        const { name, price} = this.state;
        return (
            <View style={styles.container}>
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
                        <Text style={styles.label}>Brændstofspris</Text>
                        <TextInput
                            value={price}
                            onChangeText={this.handlePriceChange}
                            style={styles.input}
                        />
                    </View>
                    <Button title="Press to update station info" onPress={this.updateData} />
                </ScrollView>
            </View>
        );
    }
}
