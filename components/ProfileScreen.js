import * as React from 'react';
import { View, Text, Button } from 'react-native';
import firebase from 'firebase';

export default class ProfileScreen extends React.Component {
    componentDidMount = () => {
        const { user } = firebase.auth();
        this.setState({ user });
    };

    handleLogOut = async () => {
        await firebase.auth().signOut();
    };

    render() {
        const { user } = this.props;
        // Hvis der ikke er en bruger logget ind, vises der ingenting
        if (!user) {
            return null;
        }
        return (
            <View>
                <Text>Current user: {user.email}</Text>
                <Button onPress={this.handleLogOut} title="Log out" />
            </View>
        );
    }
}