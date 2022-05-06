import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Modal,
  Button,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  BackHandler,
  ImageBackground,
  Icon,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
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
  faSearch,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FlatList, TextInput } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@env";
import SelectDropdown from "react-native-select-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";

import { LogBox } from "react-native";
LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

function SearchScreen(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [allInstitutions, setAllInstitutions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedType, setSelectedType] = useState("users");
  const [searchArray, setSearchArray] = useState([]);

  const [searchInput, setSearchInput] = useState("");

  useEffect(async () => {
    console.log("hello");
    setIsLoading(true);
    let accessToken = await AsyncStorage.getItem("accessToken");
    setSelectedType("users");
    setSearchInput("");
    await axios
      .get(API_URL + "/allInstitutions", {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then((response) => {
        setAllInstitutions(response.data);
      })
      .finally(function () {});

    await axios
      .get(API_URL + "/allUsers", {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then((response) => {
        setAllUsers(response.data);
        setSearchArray(response.data);
      })
      .finally(function () {
        setIsLoading(false);
      });
  }, []);

  const searchUsers = async () => {
    setSearchArray(allUsers);
  };

  const searchInstitutions = async () => {
    setSearchArray(allInstitutions);
  };

  async function showUserProfile(userId) {
    await AsyncStorage.setItem("displayUserId", userId);
    props.navigation.navigate("DisplayUserProfile");
  }

  async function showInstProfile(userId) {
    await AsyncStorage.setItem("displayInstId", userId);
    props.navigation.navigate("DisplayInstitutionProfile");
  }

  const applySearch = async () => {
    setIsLoading(true);
    setSearchArray([]);
    let result = [];
    if (selectedType == "users") {
      for (let i = 0; i < allUsers.length; i++) {
        if (allUsers[i].role == "CITIZEN") {
          let fullName = allUsers[i].firstName + " " + allUsers[i].lastName;

          if (
            fullName.includes(searchInput) ||
            allUsers[i].username.includes(searchInput)
          ) {
            result.push(allUsers[i]);
          }
        }
      }
    } else {
      for (let i = 0; i < allInstitutions.length; i++) {
        if (allInstitutions[i].role == "INSTITUTION") {
          let fullName = allInstitutions[i].institutionName;
          if (
            fullName.includes(searchInput) ||
            allInstitutions[i].username.includes(searchInput)
          ) {
            result.push(allInstitutions[i]);
          }
        }
      }
    }
    setSearchArray(result);
    setIsLoading(false);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#080f26",
        marginBottom: 50,
      }}
    >
      <Modal
        transparent={true}
        animationType={"none"}
        visible={isLoading || isLoading == undefined || isLoading == null}
        style={{ zIndex: 1100 }}
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
      <View style={styles.ridesFriends}>
        <TouchableOpacity
          onPress={() => {
            setSelectedType("users");
            searchUsers();
            setSearchInput("");
          }}
        >
          <Text
            style={
              selectedType == "users" ? styles.selected : styles.unselected
            }
          >
            Search Citizens
          </Text>
        </TouchableOpacity>
        <View style={styles.verticleLine}></View>
        <TouchableOpacity
          onPress={() => {
            setSelectedType("institutions");
            searchInstitutions();
            setSearchInput("");
          }}
        >
          <Text
            style={
              selectedType == "institutions"
                ? styles.selected
                : styles.unselected
            }
          >
            Search Institutions
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}
      >
        <View style={{ flex: 1, height: 1, backgroundColor: "white" }} />

        <View style={{ flex: 1, height: 1, backgroundColor: "white" }} />
      </View>

      <View style={{ flexDirection: "row" }}>
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          color="grey"
          size={24}
          style={{ margin: 10 }}
        />

        <TextInput
          onChangeText={(text) => setSearchInput(text)}
          placeholder="Search"
          style={{
            height: 40,
            width: "65%",
            marginRight: 20,
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 10,
            marginBottom: 30,
            textAlignVertical: "top",
            color: "black",
            backgroundColor: "white",
            borderColor: "#f8f8f8",
            borderWidth: 1,
            borderRadius: 15,
          }}
        />
        <TouchableOpacity
          disabled={searchInput == ""}
          onPress={() => applySearch()}
        >
          <Text
            style={
              searchInput == "" ? styles.disabledButton : styles.enabledButton
            }
          >
            Search
          </Text>
        </TouchableOpacity>
      </View>

      {selectedType == "users" && (
        <ScrollView style={{ marginLeft: 10 }}>
          {searchArray.map((user) => {
            if (user.role == "CITIZEN") {
              return (
                <View key={user.id}>
                  <View
                    style={{
                      flexDirection: "row",
                      marginBottom: 10,
                      marginTop: 10,
                    }}
                  >
                    <View style={{ overflow: "hidden", borderRadius: 35 }}>
                      <Image
                        source={{
                          uri: user.profilePicture,
                        }}
                        style={{
                          height: 70,
                          width: 70,
                          backgroundColor: "white",
                        }}
                      />
                    </View>
                    <View style={{ marginLeft: 10 }}>
                      <TouchableOpacity
                        onPress={() => showUserProfile(user.id)}
                      >
                        <View style={{ flexDirection: "row" }}>
                          <Text
                            style={{
                              color: "white",
                              fontSize: 16,
                              textTransform: "capitalize",
                            }}
                          >
                            {user.firstName}{" "}
                          </Text>
                          <Text
                            style={{
                              color: "white",
                              fontSize: 16,
                              textTransform: "capitalize",
                            }}
                          >
                            {user.lastName}{" "}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => showUserProfile(user.id)}
                      >
                        <Text style={{ color: "white", fontSize: 16 }}>
                          @{user.username}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <View
                      style={{ flex: 1, height: 1, backgroundColor: "white" }}
                    />

                    <View
                      style={{ flex: 1, height: 1, backgroundColor: "white" }}
                    />
                  </View>
                </View>
              );
            }
          })}
        </ScrollView>
      )}

      {selectedType == "institutions" && (
        <ScrollView style={{ marginLeft: 10 }}>
          {searchArray.map((user) => {
            if (user.role == "INSTITUTION") {
              return (
                <View key={user.id}>
                  <View
                    style={{
                      flexDirection: "row",
                      marginBottom: 10,
                      marginTop: 10,
                    }}
                  >
                    <View style={{ overflow: "hidden" }}>
                      <FontAwesomeIcon
                        icon={faBuildingColumns}
                        color="white"
                        size={70}
                      />
                    </View>
                    <View style={{ marginLeft: 10 }}>
                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                          onPress={() => showInstProfile(user.id)}
                        >
                          <Text
                            style={{
                              color: "white",
                              fontSize: 16,
                              textTransform: "capitalize",
                            }}
                          >
                            {user.institutionName}{" "}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity
                        onPress={() => showInstProfile(user.id)}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 16,
                          }}
                        >
                          @{user.username}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <View
                      style={{ flex: 1, height: 1, backgroundColor: "white" }}
                    />

                    <View
                      style={{ flex: 1, height: 1, backgroundColor: "white" }}
                    />
                  </View>
                </View>
              );
            }
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  ridesFriends: {
    paddingTop: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginBottom: 10,
  },
  verticleLine: {
    height: "100%",
    width: 1,
    backgroundColor: "#909090",
  },
  selected: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
    textDecorationLine: "underline",
    color: "#cb7b23",
  },
  unselected: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
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
  searchSection: {
    marginVertical: 20,
    marginHorizontal: 20,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  searchIcon: {
    padding: 10,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    paddingTop: 10,
    paddingLeft: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: "#fff",
    color: "#424242",
  },
  disabledButton: {
    backgroundColor: "grey",
    fontSize: 16,
    padding: 10,
    borderRadius: 5,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  enabledButton: {
    backgroundColor: "#cb7b23",
    fontSize: 16,
    padding: 10,
    borderRadius: 5,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
export default SearchScreen;
