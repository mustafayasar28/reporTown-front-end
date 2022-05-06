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
  RefreshControlBase,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faLandmark,
  faStar,
  faSquarePen,
} from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@env";
import { TextInput } from "react-native-gesture-handler";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import Report from "../components/Report";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
function DisplayInstitutionProfileScreen(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [description, setDescription] = useState("");
  const [reports, setReports] = useState([]);
  const [selectedType, setSelectedType] = useState("unresolved");
  const [unresolvedReports, setUnresolvedReports] = useState([]);
  const [resolvedReports, setResolvedReports] = useState([]);
  const [descriptionModal, setDescriptionModal] = useState(false);
  const [addedBio, setAddedBio] = useState("");
  const [score, setScore] = useState(0);
  const [employees, setEmployees] = useState([]);

  useEffect(async () => {
    setIsLoading(true);
    let accessToken = await AsyncStorage.getItem("accessToken");
    let userId = await AsyncStorage.getItem("displayInstId");

    const response = await axios
      .get(API_URL + "/profile/" + userId, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then((response) => {
        setInstitutionName(response.data.user.institutionName);
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

        setEmployees([]);

        setEmployees(response.data.user.employees);

        setUsername(response.data.user.username);
        setDescription(response.data.user.bio);
      })
      .finally(function () {
        setIsLoading(false);
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
      {/** Loading Animation Modal*/}
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
            <FontAwesomeIcon
              marginTop={20}
              size={96}
              icon={faLandmark}
              color="white"
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
              {institutionName}
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
            </View>
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

          {selectedType != "employees" && reports.length == 0 && (
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
                ? "The institution does not have any unresolved reports."
                : "The institution does not have any resolved reports."}
            </Text>
          )}

          {selectedType != "employees" && reports.length != 0 && (
            <View>
              {reports.map((report) => {
                return (
                  <Report
                    key={report.id}
                    reportId={report.id}
                    username={username}
                    name={report.firstName + " " + report.lastName}
                    responsibleInstitution={report.institutionName}
                    userId={report.userId}
                    category={report.category}
                    location={report.city}
                    description={report.description}
                    upvotes={report.upvotes}
                    comments={report.comments}
                    isResolved={report.resolvedByCitizen}
                    solution={report.solution}
                    isInstitution={false}
                    official={report.official}
                    image={report.image}
                    employees={employees}
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
}

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
export default DisplayInstitutionProfileScreen;
