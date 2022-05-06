import { GetEmailIdentityCommand } from "@aws-sdk/client-sesv2";
import { AutoFocus } from "expo-camera/build/Camera.types";
import React, { useState, useContext, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  Alert,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Keyboard,
  Linking,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Context as AuthContext } from "../context/AuthContext";
import axios from "axios";
import { faProcedures } from "@fortawesome/free-solid-svg-icons";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

let source = axios.CancelToken.source();
const codeSent = Math.floor(100000 + Math.random() * 900000);
let send = 0;

const AuthScreen = (props, route, navigation) => {
  const [code, setCode] = useState("");
  const email = props.route.params.email;
  const type = props.route.params.type;

  const sendCode = async () => {
    axios({
      method: "post",
      url: "https://europe-west3-reportown-347509.cloudfunctions.net/send-email",
      data: {
        to: email,
        subject: "Email Verify",
        text: "",
        html: codeSent.toString(),
      },
    });
    send = 1;
  };

  function proceedCLicked() {
    if (codeSent == code) {
      Alert.alert("Success", "Registiration is completed", [{ text: "Okay" }]);
      props.navigation.navigate("LoginScreen");
    } else {
      Alert.alert("Error", "Code is wrong", [{ text: "Okay" }]);
    }
  }

  useEffect(() => {
    if (send == 0) {
      sendCode();
    }
  });

  return (
    <KeyboardAvoidingView>
      <TouchableWithoutFeedback>
        <SafeAreaView
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#080f26",
            paddingTop:
              Platform.OS === "android" ? StatusBar.currentHeight * 2 : 0,
          }}
        >
          <View style={styles.regForm}>
            <View style={{ height: "20%", alignItems: "center" }}>
              <Image
                source={require("../gui_components/reportown.png")}
                style={{
                  width: "60%",
                  height: "100%",
                  resizeMode: "contain",
                  backgroundColor: "#080f26",
                }}
              />
            </View>
            <Text style={styles.header}>Register</Text>
            <Text style={styles.prompt}>
              Please enter the authentication code sent to your email adress.
            </Text>
            <TextInput
              style={styles.textinput}
              placeholder="Auth Code"
              underlineColorAndroid={"transparent"}
              placeholderTextColor={"gray"}
              onChangeText={(value) => setCode(value)}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                proceedCLicked();
              }}
            >
              <Text style={styles.buttontext}>Proceed</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  regForm: {
    backgroundColor: "#080f26",
  },
  header: {
    fontSize: 24,
    color: "#fff",
    paddingBottom: 10,
    marginBottom: 40,
    alignItems: "center",
    textAlign: "center",
    paddingTop: 30,
  },
  textinput: {
    alignSelf: "stretch",
    height: 40,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 30,
    color: "black",
    backgroundColor: "white",
    borderColor: "#f8f8f8",
    borderWidth: 1,
    borderRadius: 5,
  },
  button: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#cb7b23",
    marginBottom: 250,
    width: 200,
    borderRadius: 5,
    marginLeft: "25%",
  },
  buttontext: {
    color: "#fff",
    fontWeight: "bold",
  },
  errorMessage: {
    marginLeft: "auto",
    marginRight: "auto",
    fontSize: 16,
    color: "red",
  },
  successMessage: {
    marginLeft: "auto",
    marginRight: "auto",
    fontSize: 16,
    color: "green",
  },

  prompt: {
    marginLeft: "auto",
    marginRight: "auto",
    fontSize: 16,
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },
});

export default AuthScreen;
