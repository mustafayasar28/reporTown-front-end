import * as React from 'react';
import { TouchableOpacity, View, Dimensions } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import  Constants from 'expo-constants';
import OfficialAssignedFeedScreen from '../OfficialScreens/OfficialAssignedFeedScreen'
import userLogOut from '../../LogoutHelper';

const OfficialAssignedFeedStack = createStackNavigator();

function OfficialAssignedFeedStackScreen(props) {
  return (
    <View style ={{paddingTop: Constants.statusBarHeight, backgroundColor: "#080f26", height: Dimensions.get('window').height}}>
    <OfficialAssignedFeedStack.Navigator>
      <OfficialAssignedFeedStack.Screen name="OfficialAssignedFeed" component={OfficialAssignedFeedScreen} options={{
            headerTitle:"Assigned Reports Feed",
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#080f26",
              height: 50
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
            fontWeight: 'bold',
            },
            headerRight: () => (
              <View style ={{flexDirection: "row"}}>
                <TouchableOpacity onPress={() => userLogOut(props)}>
                <MaterialIcons name="logout" size={28} color="#cb7b23" style={{marginRight: 20 }}/>
                </TouchableOpacity>
              </View>
            ),}}/>
    </OfficialAssignedFeedStack.Navigator>
    </View>
  );
}

export default OfficialAssignedFeedStackScreen;