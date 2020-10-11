import firebase from 'firebase';
import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import StationList from "./components/StationList";
import AddStation from "./components/AddStation";
import StationDetails from "./components/StationDetails";
import { AntDesign } from '@expo/vector-icons';
import Map from "./components/Map";
import EditStation from "./components/EditStation";
import { FontAwesome5 } from '@expo/vector-icons';

const StackNavigator = createStackNavigator(
    {
      MarineFuel: { screen: StationList },
      StationDetails: { screen: StationDetails },
      EditStation:{screen: EditStation},
    },
    { initialRouteKey: 'Station List' }
);

const TabNavigator = createBottomTabNavigator({
  Main: {screen: Map,
    navigationOptions: {
      tabBarLabel:"Map",
      tabBarIcon: ({ tintColor }) => (
          <FontAwesome5 name="map" size={24} color={tintColor} />
      )
    },
  },
  Second: {screen: StackNavigator,
    navigationOptions: {
      tabBarLabel:"Havne Liste",
      tabBarIcon: ({ tintColor }) => (
          <FontAwesome5 name="gas-pump" size={24} color={tintColor} />
      )
    },
  },
  Third: {screen: AddStation,
    navigationOptions: {
  tabBarLabel:"Tilføj havn",
      tabBarIcon: ({ tintColor }) => (
      <AntDesign name="plussquareo" size={24} color={tintColor} />
  )
},
},

});
const AppContainer = createAppContainer(TabNavigator);


export default class App extends React.Component {
  componentDidMount() {
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
    if (firebase.apps.length ===0 ) {
      firebase.initializeApp(firebaseConfig);
    }

  }
  render() {
    return <AppContainer />;
  }
}
