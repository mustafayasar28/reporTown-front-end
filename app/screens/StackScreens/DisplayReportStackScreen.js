import * as React from "react";
import { TouchableOpacity, View, Dimensions } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import FeedScreen from "../FeedScreen";
import { MaterialCommunityIcons, MaterialIcons  } from "@expo/vector-icons";
import Constants from "expo-constants";
import userLogOut from "../../LogoutHelper";
import DisplayReportScreen from "../DisplayReportScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DisplayReportStack = createStackNavigator();

function DisplayReportStackScreen(props) {
   const backFunc = async () => {
        await AsyncStorage.removeItem("displayReportId");
        
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
      <DisplayReportStack.Navigator>
        <DisplayReportStack.Screen
          name="DisplayReport"
          component={DisplayReportScreen}
          options={{
            headerTitle: "Report Page",
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
      </DisplayReportStack.Navigator>
    </View>
  );
}

export default DisplayReportStackScreen;
