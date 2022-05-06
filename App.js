import { StatusBar } from "expo-status-bar";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { StyleSheet, Text, View } from "react-native";
import LoginScreen from "./app/screens/LoginScreen";
import RegisterChooseScreen from "./app/screens/RegisterChooseScreen";
import CitizenRegisterScreen from "./app/screens/CitizenRegisterScreen";
import InstitutionRegisterScreen from "./app/screens/InstitutionRegisterScreen";
import SearchScreen from "./app/screens/SearchScreen";
import MapScreen from "./app/screens/MapScreen";
import PostScreen from "./app/screens/PostScreen";
import ProfileScreen from "./app/screens/ProfileScreen";
import FeedScreen from "./app/screens/FeedScreen";
import { MaterialIcons } from "@expo/vector-icons";
import CameraScreen from "./app/screens/CameraScreen";
import AuthScreen from "./app/screens/AuthScreen";
import ForgotPasswordScreen1 from "./app/screens/ForgotPasswordScreen1";
import ForgotPasswordScreen2 from "./app/screens/ForgotPasswordScreen2";
import SelectLocationScreen from "./app/screens/SelectLocationScreen";
import InstMapScreen from "./app/screens/InstScreens/InstMapScreen";
import InstProfileScreen from "./app/screens/InstScreens/InstProfileScreen";
import OfficialProfileScreen from "./app/screens/OfficialScreens/OfficialProfileScreen";
import OfficialPendingFeedScreen from "./app/screens/OfficialScreens/OfficialPendingFeedScreen";
import OfficialAssignedFeedScreen from "./app/screens/OfficialScreens/OfficialAssignedFeedScreen";
import EmployeeScreen from "./app/screens/InstScreens/EmployeeScreen";
import FeedStackScreen from "./app/screens/StackScreens/FeedStackScreen";
import MapStackScreen from "./app/screens/StackScreens/MapStackScreen";
import SearchStackScreen from "./app/screens/StackScreens/SearchStackScreen";
import ProfileStackScreen from "./app/screens/StackScreens/ProfileStackScreen";
import PostStackScreen from "./app/screens/StackScreens/PostStackScreen";
import InstProfileStackScreen from "./app/screens/StackScreens/InstProfileStackScreen";
import EmployeeStackScreen from "./app/screens/StackScreens/EmployeeStackScreen";
import InstMapStackScreen from "./app/screens/StackScreens/InstMapStackScreen";
import { Provider as AuthProvider } from "./app/context/AuthContext";
import { setNavigator } from "./app/navigationRef";
import 'react-native-gesture-handler';
import firebase from 'firebase/compat/app';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";
import OfficialProfileStackScreen from "./app/screens/StackScreens/OfficialProfileStackScreen";
import OfficialAssignedFeedStackScreen from "./app/screens/StackScreens/OfficialAssignedFeedStackScreen";
import OfficialPendingFeedStackScreen from "./app/screens/StackScreens/OfficialPendingFeedStackScreen";
import DisplayUserProfileScreen from "./app/screens/DisplayUserProfileScreen";
import DisplayUserProfileStackScreen from "./app/screens/StackScreens/DisplayUserProfileStackScreen";
import DisplayInstitutionProfileStackScreen from "./app/screens/StackScreens/DisplayInstitutionProfileStackScreen";
import DisplayInstitutionProfileScreen from "./app/screens/DisplayInstitutionProfileScreen";

import DisplayReportScreen from "./app/screens/DisplayReportScreen";
import DisplayReportStackScreen from "./app/screens/StackScreens/DisplayReportStackScreen";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


const Stack = createStackNavigator();
const Tabs = createMaterialBottomTabNavigator();

const UserScreens = () => {
  return (
    <Tabs.Navigator
      initialRouteName="Post"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;

          if (route.name === "Feed") {
            iconName = "dynamic-feed";
          } else if (route.name === "Map") {
            iconName = "map";
          } else if (route.name === "Post") {
            iconName = "add";
          } else if (route.name === "Search") {
            iconName = "search";
          } else if (route.name === "Profile") {
            iconName = "person";
          }

          return <MaterialIcons name={iconName} size={24} color={color} />;
        },
      })}
      barStyle={{ backgroundColor: "#cb7b23" }}
    >
      <Tabs.Screen name="Search" component={SearchStackScreen} />
      <Tabs.Screen name="Map" component={MapStackScreen} />
      <Tabs.Screen name="Post" component={PostStackScreen} />
      <Tabs.Screen name="Feed" component={FeedStackScreen} />
      <Tabs.Screen name="Profile" component={ProfileStackScreen} />
    </Tabs.Navigator>
  );
};

const InstScreens = () => {
  return (
    <Tabs.Navigator
      initialRouteName="Feed"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;

          if (route.name === "Feed") {
            iconName = "dynamic-feed";
          } else if (route.name === "Map") {
            iconName = "map";
          } else if (route.name === "Employees") {
            iconName = "people";
          } else if (route.name === "Search") {
            iconName = "search";
          } else if (route.name === "Profile") {
            iconName = "person";
          }

          return <MaterialIcons name={iconName} size={24} color={color} />;
        },
      })}
      barStyle={{ backgroundColor: "#cb7b23" }}
    >
     
      <Tabs.Screen name="Map" component={InstMapStackScreen} />
      
      
      <Tabs.Screen name="Profile" component={InstProfileStackScreen} />
    </Tabs.Navigator>
  );
};

const OfficialScreens = () => {
  return (
    <Tabs.Navigator
      initialRouteName="Feed"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;

          if (route.name === "Feed") {
            iconName = "dynamic-feed";
          } else if (route.name === "Pending Solutions") {
            iconName = "pending-actions";
          } else if (route.name === "Profile") {
            iconName = "person";
          }
          return <MaterialIcons name={iconName} size={24} color={color} />;
        },
      })}
      barStyle={{ backgroundColor: "#cb7b23" }}
    >
      <Tabs.Screen name="Pending Solutions" component={OfficialPendingFeedStackScreen} />
      <Tabs.Screen name="Feed" component={OfficialAssignedFeedStackScreen} />
      <Tabs.Screen name="Profile" component={OfficialProfileStackScreen} />
    </Tabs.Navigator>
  );
};
export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer ref={(navigator) => setNavigator(navigator)}>
        <Stack.Navigator screenOptions={{headerMode: false} }initialRouteName="LoginScreen">
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="SearchScreen" component={SearchScreen} />
          <Stack.Screen name="CameraScreen" component={CameraScreen} />
          <Stack.Screen name="UserScreens" component={UserScreens} />
          <Stack.Screen name="InstScreens" component={InstScreens} />
          <Stack.Screen name="OfficialScreens" component={OfficialScreens} />
          <Stack.Screen name="MapScreen" component={MapScreen} />
          <Stack.Screen name="SelectLocationScreen" component={SelectLocationScreen} />
          <Stack.Screen name="ForgotPasswordScreen1" component={ForgotPasswordScreen1} />
          <Stack.Screen name="ForgotPasswordScreen2" component={ForgotPasswordScreen2} />
          <Stack.Screen name="InstMapScreen" component={InstMapScreen} />
          <Stack.Screen name="EmployeeScreen" component={EmployeeScreen} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          <Stack.Screen name="OfficialProfileScreen" component={OfficialProfileScreen} />
          <Stack.Screen name="OfficialPendingFeedScreen" component={OfficialPendingFeedScreen} />
          <Stack.Screen name="OfficialAssignedFeedScreen" component={OfficialAssignedFeedScreen} />
          <Stack.Screen name="DisplayUserProfileScreen" component={DisplayUserProfileScreen}/>
          <Stack.Screen name="DisplayInstitutionProfileScreen" component ={DisplayInstitutionProfileScreen}/>
          <Stack.Screen name="DisplayInstitutionProfile" component={DisplayInstitutionProfileStackScreen}/>
          <Stack.Screen name="DisplayUserProfile" component={DisplayUserProfileStackScreen}/>
          <Stack.Screen name="DisplayReportScreen" component={DisplayReportScreen}/>
          <Stack.Screen name="DisplayReport" component={DisplayReportStackScreen}/>
          <Stack.Screen
            name="InstProfileScreen"
            component={InstProfileScreen}
          />
          <Stack.Screen name="PostScreen" component={PostScreen} />
          <Stack.Screen name="FeedScreen" component={FeedScreen} />
          <Stack.Screen name="AuthScreen" component={AuthScreen} />
          <Stack.Screen
            name="RegisterChooseScreen"
            component={RegisterChooseScreen}
          />
          <Stack.Screen
            name="CitizenRegisterScreen"
            component={CitizenRegisterScreen}
          />
          <Stack.Screen
            name="InstitutionRegisterScreen"
            component={InstitutionRegisterScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
