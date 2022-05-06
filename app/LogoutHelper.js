import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "@env";
import axios from "axios";
import { Alert } from 'react-native';

const userLogOut = async (props) =>{
    try{
      const token = await AsyncStorage.getItem('accessToken');
      if(token !== null){
        const response = await axios.get(API_URL + '/logout', {
          headers: {
            Authorization: "Bearer " + token,
          }
        })

        if (response.status == 200){
          await AsyncStorage.removeItem('accessToken');
          await AsyncStorage.removeItem("tokenType");
          await AsyncStorage.removeItem("userId");

          props.navigation.navigate("LoginScreen");
          Alert.alert("Logout is successful!", "Login with your credentials to use the app again.");
          return true
        }
      }
      return false
    } catch (error){
      console.log('Error in logging out.', error.message);
    }
  };

export default userLogOut;