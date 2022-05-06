import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Modal,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCamera,
  faRotateRight,
  faSquarePen,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { API_URL } from "@env";
import Report from "../components/Report";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { TextInput } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";

import { LogBox } from "react-native";
LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const ProfileScreen = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [score, setScore] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [reports, setReports] = useState([]);
  const [selectedType, setSelectedType] = useState("unresolved");
  const [unresolvedReports, setUnresolvedReports] = useState([]);
  const [resolvedReports, setResolvedReports] = useState([]);
  const [descriptionModal, setDescriptionModal] = useState(false);
  const [addedBio, setAddedBio] = useState("");
  const [selectPhotoModal, setSelectPhotoModal] = useState(false);
  const [uri, setUri] = useState("");
  const [filetype, setFileType] = useState("");
  const [photoname, setPhotoName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  let [selectedImage, setSelectedImage] = React.useState(null);

  useEffect(async () => {
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
        setReports([]);

        let unresReports = [];
        let resReports = [];
        for (let i = 0; i < response.data.reports.length; i++) {
          if (response.data.reports[i].resolvedByCitizen == false) {
            unresReports.push(response.data.reports[i]);
          } else {
            resReports.push(response.data.reports[i]);
          }
        }

        setUnresolvedReports(unresReports);
        setResolvedReports(resReports);
        setReports(unresReports);

        setUsername(response.data.user.username);
        setDescription(response.data.user.bio);
        setProfilePicture(response.data.user.profilePicture);
        setSelectedType("unresolved");
      })
      .finally(function () {
        setIsLoading(false);
        console.log(profilePicture);
      });
  }, []);

  const showUnsolvedReports = async () => {
    setReports([]);
    setReports(unresolvedReports);
  };

  const showResolvedReports = async () => {
    setReports([]);
    setReports(resolvedReports);
  };

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
      .then(function (response) {})
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        setIsLoading(false);
        setDescriptionModal(false);
        setAddedBio("");
        refreshPage();
      });
  };

  const refreshPage = async () => {
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
        setReports([]);

        let unresReports = [];
        let resReports = [];
        for (let i = 0; i < response.data.reports.length; i++) {
          if (response.data.reports[i].resolvedByCitizen == false) {
            unresReports.push(response.data.reports[i]);
          } else {
            resReports.push(response.data.reports[i]);
          }
        }

        setUnresolvedReports(unresReports);
        setResolvedReports(resReports);
        setReports(unresReports);

        setUsername(response.data.user.username);
        setDescription(response.data.user.bio);
        setIsLoading(false);
        setProfilePicture(response.data.user.profilePicture);
        setSelectedType("unresolved");
      })
      .finally(function () {
        console.log(reports);
      });
  };

  const uploadPhoto = async () => {
    setIsLoading(true);
    let accessToken = await AsyncStorage.getItem("accessToken");
    let userId = await AsyncStorage.getItem("userId");

    let body = new FormData();
    body.append("photo", {
      uri: uri,
      name: photoname,
      filename: photoname,
      type: filetype,
    });

    var data = new FormData();
    data.append(
      "file",
      {
        name: photoname,
        type: filetype,
        uri: uri,
      },
      photoname
    );

    await axios
      .post(API_URL + "/user/" + userId + "/upload", body, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + accessToken,
        },
        transformRequest: (formData, headers) => {
          return data;
        },
      })
      .then((res) => {
        console.log("response" + JSON.stringify(res));
      })
      .catch((e) => console.log(e))
      .finally(function () {
        setIsLoading(false);
      });
  };

  async function takeAndUploadPhotoAsync() {
    // Display the camera to the user and wait for them to take a photo or to cancel
    // the action
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
    });

    if (result.cancelled) {
      return;
    }

    // ImagePicker saves the taken photo to disk and returns a local URI to it
    let localUri = result.uri;
    let filename = localUri.split("/").pop();

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    setUri(localUri);
    setFileType(type);
    setPhotoName(filename);

    // Upload the image using the fetch and FormData APIs
    let formData = new FormData();
    // Assume "photo" is the name of the form field the server expects
    formData.append("photo", { uri: localUri, name: filename, type });
  }

  async function selectPhoto() {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === true) {
      return;
    }

    let localUri = pickerResult.uri;
    let filename = localUri.split("/").pop();

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    setUri(localUri);
    setFileType(type);
    setPhotoName(filename);

    setSelectedImage({ localUri: pickerResult.uri });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#cb7b23",
          marginTop: 5,
          marginBottom: 5,
          padding: 10,
          borderRadius: 5,
          width: Dimensions.get("window").width - 10,
        }}
        onPress={refreshPage}
      >
        <View
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            flexDirection: "row",
          }}
        >
          <FontAwesomeIcon icon={faRotateRight} size={26} color="white" />
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: 16,
              paddingTop: 3,
            }}
          >
            {"  "}
            Refresh Page{" "}
          </Text>
        </View>
      </TouchableOpacity>
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

      {/** Select Photo Modal */}
      <Modal
        transparent={true}
        animationType={"none"}
        visible={selectPhotoModal}
        style={{ zIndex: 1100 }}
        onRequestClose={() => {
          setSelectPhotoModal(false);
          setUri("");
          setFileType("");
          setPhotoName("");
        }}
      >
        <View style={{ backgroundColor: "#000000aa", flex: 1 }}>
          <View
            style={{
              backgroundColor: "#080f26",
              marginVertical: 150,
              height: 400,
              marginHorizontal: 25,
              padding: 25,
              borderRadius: 10,
              flex: 1,
              position: "absolute",
            }}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setSelectPhotoModal(false);
                setUri("");
                setFileType("");
                setPhotoName("");
              }}
            >
              <FontAwesomeIcon
                style={{ color: "#ffffff" }}
                icon={faCircleXmark}
                size={36}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginTop: 50 }}
              onPress={() => takeAndUploadPhotoAsync()}
            >
              <Text style={styles.commentSendButton}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginTop: 50 }}
              onPress={() => selectPhoto()}
            >
              <Text style={styles.commentSendButton}>Select Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginTop: 50 }}
              onPress={() => uploadPhoto()}
            >
              <Text
                style={{
                  marginTop: 10,
                  marginHorizontal: 70,
                  textAlign: "center",
                  textAlignVertical: "center",
                  fontWeight: "bold",
                  width: 150,
                  color: "white",
                  fontSize: 16,
                  height: 50,
                  backgroundColor: "#454B1B",
                  borderRadius: 10,
                }}
              >
                Upload Photo
              </Text>
            </TouchableOpacity>
            {uri != "" && (
              <Text
                style={{
                  color: "green",
                  fontSize: 16,
                  textDecorationLine: "underline",
                  textAlign: "center",
                  marginTop: 5,
                }}
              >
                Image has been saved
              </Text>
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
                setAddedBio("");
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
            <View
              style={{
                width: 100,
                height: 100,
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => setSelectPhotoModal(true)}
                style={{ overflow: "hidden", borderRadius: 50 }}
              >
                <Image
                  source={{ uri: profilePicture }}
                  style={{
                    height: 100,
                    width: 100,
                    backgroundColor: "white",
                  }}
                  resizeMode="contain"
                  resizeMethod="resize"
                />
              </TouchableOpacity>
              <FontAwesomeIcon
                icon={faCamera}
                color="#cb7b23"
                size={24}
                style={{ position: "absolute", bottom: 0, right: 0 }}
              />
            </View>
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

            {description == "" && (
              <TouchableOpacity
                style={{
                  marginTop: 20,
                  marginBottom: 10,
                }}
                onPress={() => {
                  setDescriptionModal(true);
                  setAddedBio("");
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
            {description != "" && (
              <TouchableOpacity
                onPress={() => {
                  setDescriptionModal(true);
                  setAddedBio("");
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 5,
                    marginTop: 17,
                    marginHorizontal: 5,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                    }}
                  >
                    {description}
                  </Text>
                  <FontAwesomeIcon
                    style={{ marginLeft: 10 }}
                    icon={faSquarePen}
                    color="#cb7b23"
                    size={20}
                  />
                </View>
              </TouchableOpacity>
            )}
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

          <View style={styles.ridesFriends}>
            <TouchableOpacity
              onPress={() => {
                setSelectedType("unresolved");
                showUnsolvedReports();
              }}
            >
              <Text
                style={
                  selectedType == "unresolved"
                    ? styles.selected
                    : styles.unselected
                }
              >
                Unresolved
              </Text>
            </TouchableOpacity>
            <View style={styles.verticleLine}></View>
            <TouchableOpacity
              onPress={() => {
                setSelectedType("resolved");
                showResolvedReports();
              }}
            >
              <Text
                style={
                  selectedType == "resolved"
                    ? styles.selected
                    : styles.unselected
                }
              >
                Resolved
              </Text>
            </TouchableOpacity>
          </View>
          {reports.length == 0 && (
            <Text
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: 30,
                fontSize: 24,
                color: "white",
              }}
            >
              {selectedType == "unresolved"
                ? "You don't have any unresolved reports"
                : "You don't have any resolved reports"}
            </Text>
          )}

          {reports.length != 0 && (
            <View>
              {reports.map((report) => {
                return (
                  <Report
                    key={report.id}
                    reportId={report.id}
                    name={firstName + " " + lastName}
                    username={username}
                    responsibleInstitution={report.institutionName}
                    userId={report.userId}
                    category={report.category}
                    location={report.city}
                    description={report.description}
                    upvotes={report.upvotes}
                    comments={report.comments}
                    solution={report.solution}
                    image={report.image}
                    isResolved={report.resolvedByCitizen}
                    isDecidable={true}
                    profilePicture={report.profilePicture}
                    navigation={props.navigation}
                  />
                );
              })}
            </View>
          )}
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
    right: 5,
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
export default ProfileScreen;
