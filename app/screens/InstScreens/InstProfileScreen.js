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
import Report from "../../components/Report";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
function InstProfileScreen(props) {
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

  const onRefresh = async () => {
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

        setUsername(response.data.user.username);
        setDescription(response.data.user.bio);
        setIsLoading(false);
      });
  };

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

  const showEmployees = async () => {
    props.navigation.navigate("EmployeeScreen");
  };

  const addEmployee = async () => {
    props.navigation.navigate("EmployeeScreen");
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
      .then(function (response) {
        setDescription(response.data.user.bio);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        setIsLoading(false);
        setDescriptionModal(false);
        setAddedBio("");
        onRefresh();
      });
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
                source={require("../../assets/loader.gif")}
                style={{ height: 80, width: 80 }}
                resizeMode="contain"
                resizeMethod="resize"
              />
            )}
          </View>
        </View>
      </Modal>

      {/** Adding Bio Modal */}
      <Modal
        transparent={true}
        visible={descriptionModal}
        animationType="slide"
        onRequestClose={() => {
          setDescriptionModal(false);
          setAddedBio("");
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
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#cb7b23",
              marginTop: 10,
              marginBottom: 5,
              padding: 10,
              borderRadius: 5,
              width: Dimensions.get("window").width - 10,
            }}
            onPress={onRefresh}
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

            {description == "" && (
              <TouchableOpacity
                style={{
                  marginTop: 20,
                  marginBottom: -20,
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
            <View style={styles.verticleLine}></View>
            <TouchableOpacity
              onPress={() => {
                setSelectedType("employees");
                showEmployees();
              }}
              style={{ marginRight: 20 }}
            >
              <Text
                style={
                  selectedType == "employees"
                    ? styles.selected
                    : styles.unselected
                }
              >
                Employees
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
                ? "You don't have any unresolved reports"
                : "You don't have any resolved reports"}
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
                    isInstitution={true}
                    official={report.official}
                    isOfficial={false}
                    image={report.image}
                    employees={employees}
                    profilePicture={report.profilePicture}
                  />
                );
              })}
            </View>
          )}

          {selectedType == "employees" && employees.length == 0 && (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginTop: 30,
                  fontSize: 18,
                  color: "white",
                }}
              ></Text>
              <TouchableOpacity onPress={addEmployee}>
                <Text
                  style={{
                    fontSize: 24,
                    color: "#cb7b23",
                    textDecorationLine: "underline",
                    marginTop: 20,
                  }}
                >
                  Add Employee
                </Text>
              </TouchableOpacity>
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
export default InstProfileScreen;
