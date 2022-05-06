import * as React from "react";
import {
  TouchableOpacity,
  View,
  Dimensions,
  Modal,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import userLogOut from "../../LogoutHelper";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useIsFocused } from "@react-navigation/native";
import {
  faComment,
  faCircleArrowUp,
  faCheckCircle,
  faCircleExclamation,
  faCircleXmark,
  faLocationDot,
  faBuildingColumns,
  faChevronUp,
  faChevronDown,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { API_URL } from "@env";
import axios from "axios";
import { ScrollView } from "react-native-gesture-handler";

import InstMapScreen from "../InstScreens/InstMapScreen";

const InstMapStack = createStackNavigator();

function InstMapStackScreen(props) {
  const [notifModal, setNotifModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [notifs, setNotifs] = React.useState([]);
  const [reportModal, setReportModal] = React.useState(false);
  const [selectedReport, setSelectedReport] = React.useState({});

  const isFocused = useIsFocused();

  React.useEffect(async () => {
    if (isFocused) {
      loadNotifs();
    }
  }, [props, isFocused]);

  const loadNotifs = async () => {
    let accessToken = await AsyncStorage.getItem("accessToken");

    var axios = require("axios");

    var config = {
      method: "get",
      url: API_URL + "/notification/fetch",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
    };

    setIsLoading(true);
    axios(config)
      .then(function (response) {
        setNotifs(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        setIsLoading(false);
      });
  };

  const selectReport = async (reportId) => {
    let accessToken = await AsyncStorage.getItem("accessToken");

    var axios = require("axios");
    console.log(reportId);
    var config = {
      method: "get",
      url: API_URL + "/report/" + reportId,
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
    };

    setIsLoading(true);
    axios(config)
      .then(function (response) {
        setSelectedReport(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        setIsLoading(false);
        setReportModal(true);
        console.log(selectedReport);
      });
  };

  async function showReportScreen(reportId) {
    await AsyncStorage.setItem("displayReportId", reportId);
    setNotifModal(false);
    props.navigation.navigate("DisplayReport");
  }

  return (
    <View
      style={{
        paddingTop: Constants.statusBarHeight,
        backgroundColor: "#080f26",
        height: Dimensions.get("window").height,
      }}
    >
      <InstMapStack.Navigator>
        <InstMapStack.Screen
          name="InstMap"
          component={InstMapScreen}
          options={{
            headerTitle: "Map",
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#080f26",
              height: 50,
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerLeft: () => (
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={() => {
                    setNotifModal(true);
                  }}
                >
                  <View style={{ marginLeft: 20 }}>
                    <MaterialCommunityIcons
                      name="bell-alert"
                      size={28}
                      color="#cb7b23"
                    />
                    <Text
                      style={{
                        fontSize: 8,
                        width: 10,
                        height: 10,
                        color: "white",
                        position: "absolute",
                        backgroundColor: "green",
                        borderRadius: 5,
                        justifyContent: "center",
                        textAlign: "center",
                        top: 0,
                        fontWeight: "bold",
                        right: 0,
                      }}
                    >
                      {notifs ? notifs.length : 0}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ),
            headerRight: () => (
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity onPress={() => userLogOut(props)}>
                  <MaterialIcons
                    name="logout"
                    size={28}
                    color="#cb7b23"
                    style={{ marginRight: 20 }}
                  />
                </TouchableOpacity>
              </View>
            ),
          }}
        />
      </InstMapStack.Navigator>
      <Modal
        transparent={true}
        visible={notifModal}
        animationType="slide"
        onRequestClose={() => setNotifModal(false)}
      >
        <View style={{ backgroundColor: "#000000aa", flex: 1 }}>
          <View
            style={{
              backgroundColor: "#080f26",
              margin: 25,
              padding: 25,
              borderRadius: 10,
              flex: 1,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setNotifModal(false);
              }}
              style={{
                width: 40,
                height: 40,
                top: 10,
                right: 15,
                position: "absolute",
                flex: 1,
              }}
            >
              <FontAwesomeIcon
                style={{ color: "#FFFFFF" }}
                icon={faCircleXmark}
                size={40}
              />
            </TouchableOpacity>
            <Text style={{ color: "white", fontSize: 24, textAlign: "center" }}>
              Notifications
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: "white",
                  marginTop: 5,
                }}
              />

              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: "white",
                  marginTop: 5,
                }}
              />
            </View>
            <ScrollView style={{ marginLeft: 10 }}>
              {notifs.map((not, index) => {
                return (
                  <View key={not.id}>
                    <View
                      style={{
                        flexDirection: "row",
                        marginBottom: 10,
                        marginTop: 10,
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 16,
                        }}
                      >
                        {index + 1}. @{not.description}
                      </Text>
                    </View>
                    {not.type != "REWARD" && not.reportId != null && (
                      <TouchableOpacity
                        onPress={() => {
                          showReportScreen(not.reportId);
                        }}
                      >
                        <Text
                          style={{
                            color: "aqua",
                            fontSize: 16,
                            textAlign: "right",
                            textDecorationLine: "underline",
                          }}
                        >
                          See Report
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
                source={require("../../assets/loader.gif")}
                style={{ height: 80, width: 80 }}
                resizeMode="contain"
                resizeMethod="resize"
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  closeButton: {
    width: 40,
    height: 40,
    top: 10,
    right: 15,
    flex: 1,
    position: "absolute", // add if dont work with above
  },
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
export default InstMapStackScreen;
