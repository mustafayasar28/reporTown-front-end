import * as React from "react";
import { TouchableOpacity, View, Dimensions } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialCommunityIcons, MaterialIcons  } from "@expo/vector-icons";
import Constants from "expo-constants";
import userLogOut from "../../LogoutHelper";
import DisplayInstitutionProfileScreen from "../DisplayInstitutionProfileScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DisplayInstitutionProfileStack = createStackNavigator();

function DisplayInstitutionProfileStackScreen(props) {
   const backFunc = async () => {
        await AsyncStorage.removeItem("displayInstId");
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
      <DisplayInstitutionProfileStack.Navigator>
        <DisplayInstitutionProfileStack.Screen
          name="DisplayUserProfile"
          component={DisplayInstitutionProfileScreen}
          options={{
            headerTitle: "Institution Profile",
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
      </DisplayInstitutionProfileStack.Navigator>
    </View>
  );
}

export default DisplayInstitutionProfileStackScreen;
