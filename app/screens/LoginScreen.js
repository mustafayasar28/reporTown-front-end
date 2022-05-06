import React, { Component, useContext, useState } from "react";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  Button,
  Alert,
  SafeAreaView,
  Platform,
  Dimensions,
  Keyboard,
  ScrollView,
  StyleSheet,
  Modal,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import "../Global.js";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
const LoginScreen = (props) => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  signInClicked = async () => {
    setIsLoading(true);
    const request = await axios
      .post(API_URL + "/login", {
        username: username,
        password: password,
      })
      .then(async (response) => {
        setErrorText(false);
        console.log(response.data.roles[2]);
        await AsyncStorage.setItem("accessToken", response.data.accessToken);
        await AsyncStorage.setItem("tokenType", response.data.tokenType);
        await AsyncStorage.setItem("userId", response.data.id);

        if (response.data.roles[2] == "ROLE_CITIZEN") {
          props.navigation.reset({
            index: 0,
            routes: [
              {
                name: "UserScreens",
                params: {
                  username: username,
                },
              },
            ],
          });
        } else if (response.data.roles[2] == "ROLE_INSTITUTION") {
          props.navigation.reset({
            index: 0,
            routes: [
              {
                name: "InstScreens",
                params: {
                  username: username,
                },
              },
            ],
          });
        } else if (response.data.roles[2] == "ROLE_OFFICIAL") {
          props.navigation.reset({
            index: 0,
            routes: [
              {
                name: "OfficialScreens",
                params: {
                  username: username,
                },
              },
            ],
          });
        }
      })
      .catch((error) => {
        console.log(error.response);
        if (error.response.status == 404) {
          setNetworkError(true);
          setErrorText(false);
        } else {
          setNetworkError(false);
          setErrorText(true);
        }
      })
      .finally(function () {
        setIsLoading(false);
      });
  };

  return (
    <TouchableOpacity
      onPress={() => {
        Keyboard.dismiss();
      }}
      activeOpacity={5}
      style={{
        width: "100%",
        height: "100%",
        alignItems: "center",
        backgroundColor: "#080f26",
      }}
    >
      <ScrollView
        style={{
          width: "100%",
          height: "100%",
          paddingTop:
            Platform.OS === "android" ? StatusBar.currentHeight * 1.5 : 0,
        }}
      >
        <Modal
          transparent={true}
          animationType={"none"}
          visible={isLoading || isLoading == undefined || isLoading == null}
          style={{ zIndex: 1100 }}
          onRequestClose={() => {}}
        >
          <View style={styles.modalBackground}>
            <View style={styles.activityIndicatorWrapper}>
              {isLoading && (
                <Image
                  source={require("../assets/loader.gif")}
                  style={{ height: 80, width: 80 }}
                  resizeMode="contain"
                  resizeMethod="resize"
                />
              )}
            </View>
          </View>
        </Modal>

        <View style={{ height: 130, alignItems: "center" }}>
          <Image
            source={require("../gui_components/reportown.png")}
            style={{ width: "60%", height: "100%", resizeMode: "contain" }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            height: "15%",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: "white",
              fontSize: Dimensions.get("window").width / 12,
            }}
          >
            Login
          </Text>
        </View>

        <View
          style={{
            height: "40%",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <View
            style={{
              height: "70%",
              width: "70%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TextInput
              style={{
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                width: "100%",
                color: "white",

                height:
                  Platform.OS === "ios"
                    ? Dimensions.get("window").height / 20
                    : undefined,
                fontSize:
                  Platform.OS === "ios"
                    ? Dimensions.get("window").width / 25
                    : undefined,
              }}
              placeholder="Username"
              placeholderTextColor="white"
              autoCapitalize="none"
              textContentType="emailAddress"
              keyboardType="email-address"
              onChangeText={(value) => setUserName(value)}
            />
            <TextInput
              secureTextEntry={true}
              style={{
                marginTop: "5%",
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                width: "100%",
                color: "white",
                height:
                  Platform.OS === "ios"
                    ? Dimensions.get("window").height / 20
                    : undefined,
                fontSize:
                  Platform.OS === "ios"
                    ? Dimensions.get("window").width / 25
                    : undefined,
              }}
              placeholder="Password"
              placeholderTextColor="white"
              autoCapitalize="none"
              textContentType="password"
              onChangeText={(value) => setPassword(value)}
            />

            {networkError && (
              <View>
                <Text
                  style={{
                    color: "white",
                    marginTop: "5%",
                    marginBottom: "5%",
                  }}
                >
                  *Network Error Occurred!
                </Text>
              </View>
            )}

            {errorText && (
              <View>
                <Text
                  style={{
                    color: "white",
                    marginTop: "5%",
                    marginBottom: "5%",
                  }}
                >
                  *Username or password not correct
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={{
              width: "30%",
              alignItems: "center",
              height: "10%",
              justifyContent: "center",
              marginBottom: "40%",
              marginTop: "5%",
            }}
            onPress={() => props.navigation.navigate("ForgotPasswordScreen1")}
          >
            <Text
              style={{
                fontSize: Dimensions.get("window").width / 30,
                textDecorationLine: "underline",
                color: "#cb7b23",
              }}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>
          <View
            style={{
              marginBottom: "30%",
              width: "30%",
            }}
          >
            <Button
              onPress={signInClicked}
              title="Login"
              color="#cb7b23"
              accessibilityLabel="Learn more about this purple button"
            />
          </View>
        </View>
        <View
          style={{
            width: "100%",
            height: "10%",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <View
            style={{
              width: "100%",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: Dimensions.get("window").width / 25,
                textAlignVertical: "center",
                color: "white",
              }}
            >
              Don't you have an account?
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => props.navigation.navigate("RegisterChooseScreen")}
            style={{
              width: "30%",
              alignItems: "center",
              height: "50%",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: Dimensions.get("window").width / 20,
                textDecorationLine: "underline",
                color: "#cb7b23",
              }}
            >
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "#rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  activityIndicatorWrapper: {
    backgroundColor: "#080f26",
    height: 80,
    width: 80,
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
  },
});

export default LoginScreen;
