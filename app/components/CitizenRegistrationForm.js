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

const CitizenRegistrationForm = (props) => {
  const { state, citizen_signup } = useContext(AuthContext);
  const [checked1, setChecked1] = useState(false);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatchingError, setPasswordMatchingError] = useState(false);

  function checkAllFieldsEntered() {
    if (
      name != "" &&
      surname != "" &&
      username != "" &&
      email != "" &&
      password != "" &&
      confirmPassword != ""
    ) {
      return true;
    } else {
      return false;
    }
  }

  function checkPasswordsMatching() {
    return confirmPassword == password;
  }

  function navigateToLogin() {
    //console.log("nav");
    //if (state.signUpSuccessfullMessage != "") {
    //  props.navigation.navigate("LoginScreen");
    //}
  }

  return (
    <KeyboardAvoidingView>
      <ScrollView>
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
              <TextInput
                style={styles.textinput}
                placeholder="Name"
                underlineColorAndroid={"transparent"}
                placeholderTextColor={"gray"}
                onChangeText={(value) => setName(value)}
              />

              <TextInput
                style={styles.textinput}
                placeholder="Surname"
                underlineColorAndroid={"transparent"}
                placeholderTextColor={"gray"}
                onChangeText={(value) => setSurname(value)}
              />

              <TextInput
                style={styles.textinput}
                placeholder="Username"
                underlineColorAndroid={"transparent"}
                placeholderTextColor={"gray"}
                onChangeText={(value) => setUsername(value)}
              />

              <TextInput
                style={styles.textinput}
                placeholder="Email"
                underlineColorAndroid={"transparent"}
                placeholderTextColor={"gray"}
                onChangeText={(value) => setEmail(value)}
              />

              <TextInput
                style={styles.textinput}
                placeholder="Password"
                secureTextEntry={true}
                underlineColorAndroid={"transparent"}
                placeholderTextColor={"gray"}
                onChangeText={(value) => setPassword(value)}
              />

              <TextInput
                style={styles.textinput}
                placeholder="Password (Again)"
                secureTextEntry={true}
                underlineColorAndroid={"transparent"}
                placeholderTextColor={"gray"}
                onChangeText={(value) => setConfirmPassword(value)}
              />

              {state.signUpSuccessfullMessage != "" ? (
                <Text style={styles.successMessage}>
                  {state.signUpSuccessfullMessage}
                </Text>
              ) : null}

              {state.errorMessage != "" ? (
                <Text style={styles.errorMessage}>{state.errorMessage}</Text>
              ) : null}

              {!checkPasswordsMatching() ? (
                <Text style={styles.errorMessage}>Passwords don't match</Text>
              ) : null}

              {!checkAllFieldsEntered() ? (
                <Text style={styles.errorMessage}>Please fill all fields</Text>
              ) : null}

              <View
                style={{
                  width: "90%",
                  alignItems: "center",
                  paddingTop: "5%",
                }}
              >
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <BouncyCheckbox
                    fillColor="#cb7b23"
                    isChecked={checked1}
                    disableBuiltInState
                    onPress={() => {
                      setChecked1(!checked1);
                    }}
                    style={{ width: "8.5%", aspectRatio: 1 }}
                  />

                  <Text
                    style={{ color: "#cb7b23", fontWeight: "bold" }}
                    onPress={() =>
                      Linking.openURL("https://passmiracle.com/kvvk.pdf")
                    }
                  >
                    I understand and accept terms of usage.
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  if (checkAllFieldsEntered()) {
                    if (checkPasswordsMatching()) {
                      citizen_signup({
                        name: name,
                        surname: surname,
                        username: username,
                        email: email,
                        password: password,
                      });
                      props.navigation.navigate("LoginScreen")
                    }
                  }
                }}
              >
                <Text style={styles.buttontext}>Register</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </ScrollView>
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
});

export default CitizenRegistrationForm;
