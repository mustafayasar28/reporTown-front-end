import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faStar,
  faBuildingColumns,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { TextInput } from "react-native-gesture-handler";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
const OfficialProfileScreen = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [score, setScore] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [position, setPosition] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionModal, setDescriptionModal] = useState(false);
  const [addedBio, setAddedBio] = useState("");

  useEffect(async () => {
    console.log("calisti");
    setIsLoading(true);
    let accessToken = await AsyncStorage.getItem("accessToken");
    let userId = await AsyncStorage.getItem("userId");
    const response = await axios
      .get(API_URL + "/profile/" + userId, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then((response) => {
        setFirstName(response.data.user.firstName);
        setLastName(response.data.user.lastName);
        setScore(response.data.user.score);
        setUsername(response.data.user.username);
        setDescription(response.data.user.bio);
        setInstitutionName(response.data.user.institutionName);
        setPosition(response.data.user.position);
        setIsLoading(false);
      });
  }, []);

  const sendBio = async () => {
    let accessToken = await AsyncStorage.getItem("accessToken");
    let userId = await AsyncStorage.getItem("userId");
    var axios = require("axios");

    var data = JSON.stringify({
      bio: addedBio,
    });

    var config = {
      method: "post",
      url: API_URL + "/profile/" + userId + "/updateBio",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
      data: data,
    };

    setIsLoading(true);
    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        setIsLoading(false);
        setDescriptionModal(false);
      })
      .catch(function (error) {
        setIsLoading(false);
        setDescriptionModal(false);
        console.log(error);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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

      <Modal
        transparent={true}
        visible={descriptionModal}
        animationType="slide"
        onRequestClose={() => {
          setDescriptionModal(false);
        }}
      >
        <View style={{ backgroundColor: "#000000aa", flex: 1 }}>
          <View
            style={{
              backgroundColor: "#080f26",
              marginVertical: 150,
              height: 300,
              marginHorizontal: 25,
              padding: 25,
              borderRadius: 10,
              flex: 1,
              position: "absolute",
            }}
          >
            <TextInput
              placeholder="Add your bio"
              maxLength={200}
              multiline
              onChangeText={(text) => {
                setAddedBio(text);
              }}
              style={{
                backgroundColor: "white",
                height: 150,
                padding: 10,
                textAlignVertical: "top",
              }}
              numberOfLines={7}
            />

            <TouchableOpacity
              style={{ zIndex: 1200 }}
              disabled={addedBio.length == 0}
              onPress={() => sendBio()}
            >
              <Text
                style={
                  addedBio.length == 0
                    ? styles.disabledCommentSendButton
                    : styles.commentSendButton
                }
              >
                Send Bio
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setDescriptionModal(false);
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  marginTop: 20,
                  textDecorationLine: "underline",
                  fontSize: 16,
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {!isLoading && (
        <ScrollView
          nestedScrollEnabled={true}
          style={{ marginLeft: 10, marginRight: 10 }}
        >
          <View
            style={{
              justiftyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={require("../../assets/profile-user.png")}
              style={{ width: 100, height: 100, marginTop: 20 }}
            />
          </View>
          <View style={{ justiftyContent: "center", alignItems: "center" }}>
            <Text
              style={{
                color: "white",
                fontSize: 24,
                marginTop: 10,
              }}
            >
              {firstName} {lastName}
            </Text>
            <Text
              style={{
                marginTop: 5,
                color: "white",
                fontSize: 16,
              }}
            >
              @{username}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <FontAwesomeIcon
                style={{ marginTop: 16 }}
                icon={faStar}
                color={"#ffffff"}
                size={24}
              />
              <Text
                style={{
                  marginTop: 5,
                  marginLeft: 15,
                  color: "white",
                  fontSize: 20,
                  marginTop: 17,
                  fontWeight: "bold",
                }}
              >
                {score}
              </Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <FontAwesomeIcon
                style={{ marginTop: 16 }}
                icon={faBuildingColumns}
                color={"#ffffff"}
                size={24}
              />
              <Text
                style={{
                  marginTop: 5,
                  marginLeft: 15,
                  color: "white",
                  fontSize: 20,
                  marginTop: 17,
                }}
              >
                Works at {institutionName}
              </Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <FontAwesomeIcon
                style={{ marginTop: 16 }}
                icon={faIdCard}
                color={"#ffffff"}
                size={24}
              />
              <Text
                style={{
                  marginTop: 5,
                  marginLeft: 15,
                  color: "white",
                  fontSize: 20,
                  marginTop: 17,
                }}
              >
                Works as {position}
              </Text>
            </View>

            {description == "" && (
              <TouchableOpacity
                style={{
                  marginTop: 20,
                  marginBottom: -20,
                }}
                onPress={() => {
                  setDescriptionModal(true);
                }}
              >
                <Text
                  style={{
                    fontSize: 24,
                    color: "#cb7b23",
                    textDecorationLine: "underline",
                  }}
                >
                  Add Bio
                </Text>
              </TouchableOpacity>
            )}
            <Text
              style={{
                marginTop: 5,
                color: "white",
                fontSize: 16,
                marginTop: 17,
                marginHorizontal: 5,
              }}
            >
              {description}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 10,
            }}
          >
            <View style={{ flex: 1, height: 1, backgroundColor: "white" }} />
            <View style={{ flex: 1, height: 1, backgroundColor: "white" }} />
          </View>
        </ScrollView>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#080f26",
    marginBottom: 50,
  },
  topBox: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    flex: 1,
    height: 50,
    width: 100,
  },
  previewContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "aliceblue",
  },
  textStyle: {
    marginTop: 20,
    marginLeft: 20,
    color: "white",
    fontSize: 24,
  },
  ridesFriends: {
    paddingTop: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginBottom: 10,
  },
  numbers: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },
  verticleLine: {
    height: "100%",
    width: 1,
    backgroundColor: "#909090",
  },
  active: {
    textDecorationLine: "underline",
    color: "#cb7b23",
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
  closeButton: {
    width: 50,
    height: 50,
    top: 15,
    right: 15,
    position: "absolute", // add if dont work with above
  },
  commentSendButton: {
    marginTop: 10,
    marginHorizontal: 50,
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "bold",
    width: 200,
    color: "white",
    fontSize: 20,
    height: 50,
    backgroundColor: "#cb7b23",
    borderRadius: 10,
  },
  disabledCommentSendButton: {
    marginTop: 10,
    marginHorizontal: 50,
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "bold",
    width: 200,
    color: "#C6C6C6",
    fontSize: 20,
    height: 50,
    backgroundColor: "#cb7b23",
    borderRadius: 10,
  },
});
export default OfficialProfileScreen;
