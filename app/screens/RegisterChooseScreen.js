import React, { Component } from "react";
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
  StyleSheet,
  Platform,
  Dimensions,
  Keyboard,
} from "react-native";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
const RegisterChooseScreen = (props) => {
  const citClicked = () => {
    props.navigation.navigate("CitizenRegisterScreen");
  };

  const insClicked = () => {
    props.navigation.navigate("InstitutionRegisterScreen");
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
      <SafeAreaView
        style={{
          width: "100%",
          height: "100%",
          paddingTop:
            Platform.OS === "android" ? StatusBar.currentHeight * 1.5 : 0,
        }}
      >
        <View style={{ height: "20%", alignItems: "center" }}>
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
            Register
          </Text>
        </View>

        <View
          style={{
            height: "40%",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => props.navigation.navigate("CitizenRegisterScreen")}
            style={styles.button}
          >
            <Text
              style={{
                fontSize: Dimensions.get("window").width / 20,
                color: "white",
              }}
            >
              As Citizen
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("InstitutionRegisterScreen")
            }
            style={styles.button}
          >
            <Text
              style={{
                fontSize: Dimensions.get("window").width / 20,
                color: "white",
              }}
            >
              As Institution
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  textinput: {
    alignSelf: "stretch",
    height: "40%",
    marginLeft: 30,
    marginRight: 30,
    color: "black",
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 30,
    backgroundColor: "white",
    borderColor: "#f8f8f8",
    borderWidth: 1,
    borderRadius: 5,
  },

  button: {
    alignItems: "center",
    backgroundColor: "#cb7b23",
    width: "50%",
    marginBottom: "2%",
    borderRadius: 5,
    padding: 10,
  },
});

export default RegisterChooseScreen;
