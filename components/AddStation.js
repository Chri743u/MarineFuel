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
        price: '',
    };

    handleNameChange = text => this.setState({ name: text });

    handlePriceChange = text => this.setState({ price: text });

    handleSave = () => {
        const { name, price} = this.state;
        try {
            const reference = firebase
                .database()
                .ref('/Stations/')
                .push({ name, price });
            Alert.alert(`Saved`);
            this.setState({
                name: '',
                price: '',

            });
        } catch (error) {
            Alert.alert(`Error: ${error.message}`);
        }
    };

    render() {
        const { name, price} = this.state;
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
                        <Text style={styles.label}>Brændstofspris</Text>
                        <TextInput
                            value={price}
                            onChangeText={this.handlePriceChange}
                            style={styles.input}
                        />
                    </View>
                    <Button title="Add station"
                            onPress={this.handleSave}

                    />
                </ScrollView>
            </SafeAreaView>
        );
    }
}
