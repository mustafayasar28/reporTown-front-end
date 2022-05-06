import { AutoFocus } from "expo-camera/build/Camera.types";
import React, { useState, useContext } from "react";
import {
  Image,
  StyleSheet,
  Text,
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

import { LogBox } from "react-native";
LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
const ForgotPasswordScreen2 = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

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
            <Text style={styles.header}>Forgot Password</Text>

            <TextInput
              style={styles.textinput}
              placeholder="Auth Code"
              underlineColorAndroid={"transparent"}
              placeholderTextColor={"gray"}
              onChangeText={(value) => setCode(value)}
            />

            <TextInput
              style={styles.textinput}
              placeholder="New Password"
              underlineColorAndroid={"transparent"}
              placeholderTextColor={"gray"}
              onChangeText={(value) => setPassword(value)}
            />

            <TextInput
              style={styles.textinput}
              placeholder="New Password (Again)"
              underlineColorAndroid={"transparent"}
              placeholderTextColor={"gray"}
              onChangeText={(value) => setPassword2(value)}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                props.navigation.navigate("LoginScreen");
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

export default ForgotPasswordScreen2;
