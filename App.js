import firebase from 'firebase';
import * as React from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import StationList from "./components/StationList";
import AddStation from "./components/AddStation";
import StationDetails from "./components/StationDetails";
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import Map from "./components/Map";
import EditStation from "./components/EditStation";

//StackNavigator giver app'en mulighed for at lave en overgang mellem hver skærm,
//hvor hver skærm placeres ovenpå en stack.
const StackNavigator = createStackNavigator(
    {
      StationList: { screen: StationList },
      StationDetails: { screen: StationDetails },
      EditStation:{screen: EditStation},
    },
    { initialRouteKey: 'Map' }
);
//Vi opretter et panel i bunden af skræmen hvorfra der skiftes mellem forskellige 'ruter' (routes)
const TabNavigator = createBottomTabNavigator({
  Main: {screen: Map,
    navigationOptions: {
      tabBarLabel:"Map",
      tabBarIcon: ({ tintColor }) => (
          <FontAwesome5 name="map" size={24} color={tintColor} />
      )
    },
  },
  //Her oprettes og initialiseres vores screen til 'StackNavigator'.
  Second: {screen: StackNavigator,
    navigationOptions: {
      tabBarLabel:"Havne Liste",
      tabBarIcon: ({ tintColor }) => (
          <FontAwesome5 name="gas-pump" size={24} color={tintColor} />
      )
    },
  },/*
  Third: {screen: AddStation,
    navigationOptions: {
  tabBarLabel:"Tilføj havn",
      tabBarIcon: ({ tintColor }) => (
      <AntDesign name="plussquareo" size={24} color={tintColor} />
  )
},
},*/
});

//Det primære view hvorfra andre views udfoldes. 'initialRouteKey' definere hvilken skærm som vises på opstart
const MainStackNavigator = createStackNavigator(
    {
      MarineFuel: {screen: TabNavigator},
    },
{ initialRouteKey: 'Map' }
)
const AppContainer = createAppContainer(MainStackNavigator);


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

    //Vi opretter en rekursiv funktion som kontrollere at der ikke allerede er oprettet en instans af firebase
    //Dermed undgås firebase-fejlen "App named '[DEFAULT]' already exists (app/duplicate-app)".
    if (firebase.apps.length ===0 ) {
      firebase.initializeApp(firebaseConfig);
    }

  }
  render() {
    return <AppContainer />;
  }
}
