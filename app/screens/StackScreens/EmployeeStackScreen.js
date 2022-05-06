import * as React from 'react';
import { TouchableOpacity, View, Dimensions } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import FeedScreen from '../FeedScreen';
import { MaterialCommunityIcons, MaterialIcons  } from '@expo/vector-icons';
import  Constants from 'expo-constants';
import EmployeeScreen from '../InstScreens/EmployeeScreen';
import userLogOut from '../../LogoutHelper';

const EmployeeStack = createStackNavigator();

function EmployeeStackScreen(props) {
  return (
    <View style ={{paddingTop: Constants.statusBarHeight, backgroundColor: "#080f26", height: Dimensions.get('window').height}}>
    <EmployeeStack.Navigator>
      <EmployeeStack.Screen name="Employee" component={EmployeeScreen} options={{
            headerTitle:"My Employees",
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#080f26",
              height: 50
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
            fontWeight: 'bold',
            },
            headerLeft: () => (
              <View style ={{flexDirection: "row"}}>
                <TouchableOpacity onPress={() => alert('This is a button!')}>
                <MaterialCommunityIcons name="bell-alert" size={28} color="#cb7b23" style={{marginLeft: 20 }}/>
                </TouchableOpacity>
              </View>
            ),
            headerRight: () => (
              <View style ={{flexDirection: "row"}}>
                <TouchableOpacity onPress={() => userLogOut(props)}>
                <MaterialIcons name="logout" size={28} color="#cb7b23" style={{marginRight: 20 }}/>
                </TouchableOpacity>
              </View>
            ),}}/>
    </EmployeeStack.Navigator>
    </View>
  );
}

export default EmployeeStackScreen;