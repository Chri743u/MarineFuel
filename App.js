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
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";
import ProfileScreen from "./components/ProfileScreen";

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
      apiKey: "AIzaSyBnm2sD31aR3--yG2iAqhDVE1tRCNR3bEc",
      authDomain: "marinefueldb.firebaseapp.com",
      databaseURL: "https://marinefueldb.firebaseio.com",
      projectId: "marinefueldb",
      storageBucket: "marinefueldb.appspot.com",
      messagingSenderId: "600925738741",
      appId: "1:600925738741:web:cba1c092c955d1fb3897bc",
      measurementId: "G-9ER6NJBPB2"
    };

    //Vi opretter en rekursiv funktion som kontrollere at der ikke allerede er oprettet en instans af firebase
    //Dermed undgås firebase-fejlen "App named '[DEFAULT]' already exists (app/duplicate-app)".
    if (firebase.apps.length ===0 ) {
      firebase.initializeApp(firebaseConfig);
    }
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ user });
    });

  }
  render() {
    const {user} = this.state
    if(!user){
      return (
          <View style={styles.container}>
            <Text style={styles.paragraph}>
              Opret eller Login med din firebase Email
            </Text>
            <Card>
              <SignUpForm />
            </Card>
            <Card>
              <LoginForm />
            </Card>
          </View>
      )
    } else {

      return <AppContainer />;

  }
}
}
