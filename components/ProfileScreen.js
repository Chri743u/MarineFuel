import * as React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import firebase from 'firebase';
import Constants from "expo-constants";

export default class ProfileScreen extends React.Component {
state= {
    uid: firebase.auth().currentUser.uid,
    user: firebase.auth().currentUser,
    email: firebase.auth().currentUser.email,
}
    componentDidMount = () => {
        const { user } = firebase.auth();
        this.setState({ user });
    };

    handleLogOut = async () => {
        await firebase.auth().signOut();
    };

    render() {
        const user = firebase.auth().currentUser;
        // Hvis der ikke er en bruger logget ind, vises der ingenting
        if (!user) {
            return null;
        }
        return (
            <View style={styles.container}>
                <Text>Current user: {user.email}</Text>
                <Button onPress={this.handleLogOut} title="Log out" />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#ecf0f1',
        padding: 8,
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});