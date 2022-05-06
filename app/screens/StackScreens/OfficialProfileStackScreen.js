import * as React from 'react';
import { TouchableOpacity, View, Dimensions } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import  Constants from 'expo-constants';
import OfficialProfileScreen from '../OfficialScreens/OfficialProfileScreen'
import userLogOut from '../../LogoutHelper';

const OfficialProfileStack = createStackNavigator();

function OfficialProfileStackScreen(props) {
  return (
    <View style ={{paddingTop: Constants.statusBarHeight, backgroundColor: "#080f26", height: Dimensions.get('window').height}}>
    <OfficialProfileStack.Navigator>
      <OfficialProfileStack.Screen name="OfficialProfile" component={OfficialProfileScreen} options={{
            headerTitle:"Profile",
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
    </OfficialProfileStack.Navigator>
    </View>
  );
}

export default OfficialProfileStackScreen;