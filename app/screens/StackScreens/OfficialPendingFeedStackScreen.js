import * as React from 'react';
import { TouchableOpacity, View, Dimensions } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import  Constants from 'expo-constants';
import OfficialPendingFeedScreen from '../OfficialScreens/OfficialPendingFeedScreen'
import userLogOut from '../../LogoutHelper';

const OfficialPendingFeedStack = createStackNavigator();

function OfficialPendingFeedStackScreen(props) {
  return (
    <View style ={{paddingTop: Constants.statusBarHeight, backgroundColor: "#080f26", height: Dimensions.get('window').height}}>
    <OfficialPendingFeedStack.Navigator>
      <OfficialPendingFeedStack.Screen name="OfficialPendingFeed" component={OfficialPendingFeedScreen} options={{
            headerTitle:"Pending Solutions Feed",
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
    </OfficialPendingFeedStack.Navigator>
    </View>
  );
}

export default OfficialPendingFeedStackScreen;