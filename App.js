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
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import Map from "./components/Map";
import EditStation from "./components/EditStation";

//StackNavigator til StationList views
const StackNavigator = createStackNavigator(
    {
      StationList: { screen: StationList },
      StationDetails: { screen: StationDetails },
      EditStation:{screen: EditStation},
    },
    { initialRouteKey: 'Map' }
);

//TabNavigator, som giver den overordnede navigation mellem Map, Havneliste og tilføj havn.
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

//For at have ens header i alle views tilføjer vi denne StackNavigator, hvor MarineFuel står i headeren
const MainStackNavigator = createStackNavigator(
    {
      MarineFuel: {screen: TabNavigator},
    },
{ initialRouteKey: 'Map' }
)
const AppContainer = createAppContainer(MainStackNavigator);


export default class App extends React.Component {
  //Konfiguration til databasen
  componentDidMount() {
    const firebaseConfig = {
        apiKey: "AIzaSyBnm2sD31aR3--yG2iAqhDVE1tRCNR3bEc",
        authDomain: "marinefueldb.firebaseapp.com",
        databaseURL: "https://marinefueldb.firebaseio.com",
        projectId: "marinefueldb",
        storageBucket: "marinefueldb.appspot.com",
        messagingSenderId: "600925738741",
        appId: "1:600925738741:web:cba1c092c955d1fb3897bc",
        measurementId: "G-9ER6NJBPB2"
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
