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
import { SafeAreaView } from "react-native-safe-area-context";
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [description, setDescription] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [reportId, setReportId] = useState("");
  const [userId, setUserId] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [instId, setInstId] = useState("");
  const [upvotes, setUpvotes] = useState([]);
  const [comments, setComments] = useState([]);
  const [image, setImage] = useState("");
  const [institutionName, setInstitutionName] = useState("");

  const [solution, setSolution] = useState({});
  const [official, setOfficial] = useState({});

  const [resolvedByCitizen, setResolvedByCitizen] = useState(false);

  useEffect(async () => {
    setIsLoading(true);
    let accessToken = await AsyncStorage.getItem("accessToken");
    let reportId = await AsyncStorage.getItem("displayReportId");

    var axios = require("axios");
    var config = {
      method: "get",
      url: API_URL + "/report/" + reportId,
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
    };
    axios(config)
      .then(function (response) {
        //set variables from response
        setReportId(reportId);
        setFirstName(response.data.report.firstName);
        setLastName(response.data.report.lastName);
        setUsername(response.data.report.username);
        setUserId(response.data.report.userId);
        setCategory(response.data.report.category);
        setLocation(response.data.report.city);
        setInstId(response.data.report.institutionId);
        setDescription(response.data.report.description);
        setUpvotes(response.data.report.upvotes);
        setComments(response.data.report.comments);
        setSolution(response.data.report.solution);
        setOfficial(response.data.report.official);
        setResolvedByCitizen(response.data.report.resolvedByCitizen);
        setImage(response.data.report.image);
        setProfilePicture(response.data.report.profilePicture);
        setInstitutionName(response.data.report.institutionName);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        setIsLoading(false);
      });
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: "#080f26",
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

      {!isLoading && (
        <Report
          reportId={reportId}
          name={firstName + " " + lastName}
          username={username}
          userId={userId}
          category={category}
          location={location}
          institutionId={instId}
          description={description}
          upvotes={upvotes}
          comments={comments}
          solution={solution}
          official={official}
          isResolved={resolvedByCitizen}
          isInstitution={false}
          isOfficial={false}
          navigation={props.navigation}
          image={image}
          profilePicture={profilePicture}
          responsibleInstitution={institutionName}
        />
      )}
    </SafeAreaView>
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

export default DisplayUserProfileScreen;
