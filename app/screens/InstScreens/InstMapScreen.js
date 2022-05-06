import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  ImageBackground,
  Image,
  StyleSheet,
  View,
  Dimensions,
  Modal,
  TouchableOpacity,
  Text,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import { Marker } from "react-native-maps";
import { TextInput } from "react-native-gesture-handler";
import Report from "../../components/Report";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
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
} from "@fortawesome/free-solid-svg-icons";

let posts = [];
let post_locations = [];
let current_id = "";
let index = -1;
let item = { id: "0" };
let accessToken = "";
function InstMapScreen(props) {
  const [location, setLocation] = useState({
    latitude: 10,
    longitude: 10,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const mapRef = React.createRef();
  const [reportModal, setReportModal] = useState(false);
  const [reports, setReports] = useState([]);
  const [addedBio, setAddedBio] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState([]);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        enableHighAccuracy: true,
        timeInterval: 5,
      });
      accessToken = await AsyncStorage.getItem("accessToken");
      console.log(accessToken);
      console.log("accesss");
      setIsLoading(true);
      await fetchReports();
      for (var i = 0; i < posts.length; i++) {
        if (posts[i].latitude && posts[i].longitude) {
          item = posts[i];

          post_locations.push({
            coordinates: {
              latitude: Number(posts[i].latitude),
              longitude: Number(posts[i].longitude),
            },
            id: posts[i].id,
          });
        }
      }

      console.log(post_locations);

      setLocation({
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
        longitudeDelta: 0.04,
        latitudeDelta: 0.09,
      });
    })();
  }, []);

  const showReport = async () => {
    for (var i = 0; i < posts.length; i++) {
      if (posts[i].id == current_id) {
        console.log("girdi");
        index = i;
      }
    }
    console.log("current id:");
    console.log(current_id);
    item = posts[index];
    console.log("item is: ****************");
    console.log(item);
    console.log(posts[index]);
    setReportModal(true);
  };

  const refreshData = async () => {
    let accessToken = await AsyncStorage.getItem("accessToken");
    let userId = await AsyncStorage.getItem("userId");
    const response = await axios
      .get(API_URL + "/profile/" + userId, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then((response) => {
        setEmployees([]);

        setEmployees(response.data.user.employees);
        posts = response.data.reports;
        console.log(posts);
      })
      .finally(function () {
        setIsLoading(false);
      });
  };

  const fetchReports = async () => {
    let accessToken = await AsyncStorage.getItem("accessToken");
    let userId = await AsyncStorage.getItem("userId");

    const response = await axios
      .get(API_URL + "/profile/" + userId, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then((response) => {
        setEmployees([]);

        setEmployees(response.data.user.employees);
        posts = response.data.reports;
        console.log(posts);
      })
      .finally(function () {
        setIsLoading(false);
      });
  };

  return (
    <View style={styles.container}>
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
        visible={reportModal}
        animationType="slide"
        onRequestClose={() => console.log("Back clicked")}
      >
        <View style={{ backgroundColor: "#000000aa", flex: 1 }}>
          <View
            style={{
              marginTop: "30%",
              marginBottom: "30%",
              paddingTop: 30,
              backgroundColor: "#080f26",
              flex: 0.9,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                refreshData();
                setReportModal(false);
              }}
              style={styles.closeButton}
            >
              <FontAwesomeIcon
                style={{ color: "#FFFFFF" }}
                icon={faCircleXmark}
                size={20}
              />
            </TouchableOpacity>

            <Report
              reportId={item.id}
              name={item.firstName + " " + item.lastName}
              username={item.username}
              responsibleInstitution={item.institutionName}
              isInstitution={true}
              userId={item.userId}
              category={item.category}
              location={item.city}
              institutionId={item.institutionId}
              description={item.description}
              isResolved={item.resolvedByCitizen}
              upvotes={item.upvotes}
              image={item.image}
              comments={item.comments}
              employees={employees}
              solution={item.solution}
              profilePicture={item.profilePicture}
            />
          </View>
        </View>
      </Modal>

      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true}
        mapType={"hybrid"}
      >
        {post_locations.map((item, index) => (
          <Marker
            key={index}
            coordinate={item.coordinates}
            onPress={(e) => {
              console.log(item.id);
              current_id = item.id;
              showReport();
            }}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: (Dimensions.get("window").height / 10) * 9,
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
    width: 20,
    height: 20,
    top: 10,
    right: 10,
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
export default InstMapScreen;
