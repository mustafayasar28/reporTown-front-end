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
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { API_URL } from "@env";
import Report from "../components/Report";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { TextInput } from "react-native-gesture-handler";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
const DisplayUserProfileScreen = (props) => {
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
  const [profilePicture, setProfilePicture] = useState("");

  useEffect(async () => {
    setIsLoading(true);
    let accessToken = await AsyncStorage.getItem("accessToken");
    let userId = await AsyncStorage.getItem("displayUserId");
    console.log("I am" + userId);
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
          if (response.data.reports[i].solution == null) {
            unresReports.push(response.data.reports[i]);
          } else {
            resReports.push(response.data.reports[i]);
          }
        }

        setUnresolvedReports(unresReports);
        setResolvedReports(resReports);
        setReports(unresReports);
        setProfilePicture(response.data.user.profilePicture);
        setUsername(response.data.user.username);
        setDescription(response.data.user.bio);
        setIsLoading(false);
        console.log(response.data.user.bio);
        console.log(userId);
        console.log(accessToken);
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
                source={require("../assets/loader.gif")}
                style={{ height: 80, width: 80 }}
                resizeMode="contain"
                resizeMethod="resize"
              />
            )}
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
                borderRadius: 50,
              }}
            >
              <Image
                source={{ uri: profilePicture }}
                style={{
                  height: 100,
                  width: 100,
                  backgroundColor: "white",
                  borderRadius: 50,
                }}
                resizeMode="contain"
                resizeMethod="resize"
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
                ? "The user does not have any unresolved reports."
                : "The user does not have any resolved reports."}
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
                    profilePicture={profilePicture}
                    isResolved={report.resolvedByCitizen}
                    official={report.official}
                    isInstitution={false}
                    isOfficial={false}
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
export default DisplayUserProfileScreen;
