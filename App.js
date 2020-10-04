import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import Constants from 'expo-constants';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import {Accuracy} from "expo-location";
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { AntDesign } from '@expo/vector-icons';
import firebase from 'firebase';

const StackNavigator = createStackNavigator(
    {
      StationList: { screen: StationList },
      StationDetails: { screen: StationDetails },
      UpdatePrice:{screen: UpdatePrice},
      Map:{screen: Map},
    },
    { initialRouteKey: 'Map' }
);

const TabNavigator = createBottomTabNavigator({
      StationList: {
        screen:StackNavigator,
        navigationOptions: {
          tabBarLabel:"StationList",
          tabBarIcon: ({ tintColor }) => (
              <AntDesign name="gas-pump" size={24} color={tintColor} />
          )
        },
      },
      Map: {
        screen:Map,
        navigationOptions: {
          tabBarLabel:"Map",
          tabBarIcon: ({ tintColor }) => (
              <AntDesign name="map" size={24} color={tintColor} />
          )
        },
      }
    },
    {
      tabBarOptions: {
        showIcon:true,
        labelStyle: {
          fontSize: 15,
        },
        activeTintColor: 'darkblue',
        inactiveTintColor: 'gray',
        size:40
      }
    });

const AppContainer = createAppContainer(TabNavigator);

export default class App extends React.Component {
  componentWillMount() {
    const firebaseConfig = {
      apiKey: "AIzaSyBaa1U7cLxIXE2WZMLKplA7vrEcmCWRmI8",
      authDomain: "marinefuel-95f1a.firebaseapp.com",
      databaseURL: "https://marinefuel-95f1a.firebaseio.com",
      projectId: "marinefuel-95f1a",
      storageBucket: "marinefuel-95f1a.appspot.com",
      messagingSenderId: "598074706617",
      appId: "1:598074706617:web:d748c9e73776ea4d306968",
      measurementId: "G-HP5KBX6H6W"
    };


    // Vi kontrollerer at der ikke allerede er en initialiseret instans af firebase
    // Så undgår vi fejlen Firebase App named '[DEFAULT]' already exists (app/duplicate-app).
    if (firebase.apps.length === 0) {
      firebase.initializeApp(firebaseConfig);
    }
  }
  render() {
    return <AppContainer />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
