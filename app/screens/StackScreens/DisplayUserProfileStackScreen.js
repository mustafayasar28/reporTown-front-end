import * as React from "react";
import { TouchableOpacity, View, Dimensions } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import FeedScreen from "../FeedScreen";
import { MaterialCommunityIcons, MaterialIcons  } from "@expo/vector-icons";
import Constants from "expo-constants";
import MapScreen from "../MapScreen";
import ProfileScreen from "../ProfileScreen";
import userLogOut from "../../LogoutHelper";
import DisplayUserProfileScreen from "../DisplayUserProfileScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DisplayUserProfileStack = createStackNavigator();

function DisplayUserProfileStackScreen(props) {
   const backFunc = async () => {
        await AsyncStorage.removeItem("displayUserId");
        props.navigation.goBack();
   }

  return (
    <View
      style={{
        paddingTop: Constants.statusBarHeight,
        backgroundColor: "#080f26",
        height: Dimensions.get("window").height,
      }}
    >
      <DisplayUserProfileStack.Navigator>
        <DisplayUserProfileStack.Screen
          name="DisplayUserProfile"
          component={DisplayUserProfileScreen}
          options={{
            headerTitle: "User Profile",
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#080f26",
              height: 50,
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerLeft: () => (
              <View style ={{flexDirection: "row"}}>
                <TouchableOpacity onPress={() => backFunc()}>
                <MaterialCommunityIcons name="arrow-left-thick" size={28} color="#cb7b23" style={{marginLeft: 20 }}/>
                </TouchableOpacity>
              </View>
            ),
            headerRight: () => (
              <View style ={{flexDirection: "row"}}>
                <TouchableOpacity onPress={() => userLogOut(props)}>
                <MaterialIcons name="logout" size={28} color="#cb7b23" style={{marginRight: 20 }}/>
                </TouchableOpacity>
              </View>
              
            ),
          }}
        />
      </DisplayUserProfileStack.Navigator>
    </View>
  );
}

export default DisplayUserProfileStackScreen;
