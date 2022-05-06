import React, { useState, useEffect } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  Keyboard,
  Modal,
  View,
  Button,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { SearchBar } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { API_URL } from "@env";
import axios from "axios";
import MapView from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faComment,
  faCircleArrowUp,
  faCheckCircle,
  faCircleExclamation,
  faCircleXmark,
  faMagnifyingGlass,
  faLocationDot,
  faBuildingColumns,
  faChevronUp,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import BouncyCheckbox from "react-native-bouncy-checkbox";

import { LogBox } from "react-native";
LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

let uri = "https://nebosan.com.tr/wp-content/uploads/2018/06/no-image.jpg";
let filetype = "";
let photoname = "";
let mlLink = "http://34.141.8.218:80/ml-service/predict-category";
let postID = "";

function PostScreen({ navigation, route }) {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [responsible, setResponsible] = useState("");
  const [ID, setID] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchArray, setSearchArray] = useState([]);
  const [allInstitutions, setAllInstitutions] = useState([]);
  let [selectedImage, setSelectedImage] = React.useState(null);
  const mapRef = React.createRef();

  const [selectedType, setSelectedType] = useState("users");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [prediction, setPrediction] = useState("");
  const [recTest, setrecTest] = useState("");
  const [index, setIndex] = useState(null);

  const [mapModal, setMapModal] = useState(false);
  const [selection, setSelection] = useState("");
  const [tagModal, setTagModal] = useState(false);
  const [submitModal, setSubmitModal] = useState(false);
  const [marker, setMarker] = useState(null);

  var categories = [
    "Road Maintenance",
    "Transportation",
    "Accident",
    "Stray Animals",
    "Volunteering",
    "Garbage",
    "Missing",
    "Electricity",
  ];
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  useEffect(async () => {
    setIsLoading(true);
    let accessToken = await AsyncStorage.getItem("accessToken");
    searchInstitutions();
    setSearchInput("");
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }

    let position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
      enableHighAccuracy: true,
      timeInterval: 5,
    });
    setLocation({
      longitude: position.coords.longitude,
      latitude: position.coords.latitude,
      longitudeDelta: 0.04,
      latitudeDelta: 0.09,
    });

    await axios
      .get("https://api.bigdatacloud.net/data/reverse-geocode-client", {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          localityLanguage: "en",
        },
      })
      .then(function (response) {
        setCity(response.data.principalSubdivision);
        console.log(response.data.principalSubdivision);
      });

    await axios
      .get(API_URL + "/allInstitutions/", {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then((res) => {
        setAllInstitutions(res.data);
      })
      .finally(function () {
        setIsLoading(false);
      });
  }, []);

  const searchInstitutions = async () => {
    setSearchArray(allInstitutions);
  };

  const applySearch = async () => {
    setIsLoading(true);
    setSearchArray([]);
    let result = [];

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

    setSearchArray(result);
    setIsLoading(false);
  };

  function setLocClicked() {
    axios
      .get("https://api.bigdatacloud.net/data/reverse-geocode-client", {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          localityLanguage: "en",
        },
      })
      .then(function (response) {
        setCity(response.data.principalSubdivision);
        console.log(response.data.principalSubdivision);
      });
    setMapModal(false);
  }

  const submitClicked = async () => {
    console.log("submit clickedd");
    let accessToken = await AsyncStorage.getItem("accessToken");

    console.log(postID);

    if (description == "" || category == "") {
      Alert.alert(
        "Error",
        "Please make sure that a description and category provided",
        [{ text: "Okay" }]
      );
    } else {
      let editBody = {
        description: description,
        category: category,
      };

      await axios
        .post(API_URL + "/report/" + postID + "/edit", editBody, {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        })
        .then((response) => {
          Alert.alert("Success", "Your report is successfully submitted", [
            { text: "Okay" },
          ]);
        })
        .catch((error) => console.log(error));

      setSubmitModal(false);
      setCategory("");
      setDescription("");
      setIndex(null);
    }
  };

  const tagClicked = async () => {
    console.log("tag clickedd");
  };

  const postClicked = async () => {
    if (
      uri == "https://nebosan.com.tr/wp-content/uploads/2018/06/no-image.jpg" ||
      selection == ""
    ) {
      Alert.alert(
        "Error",
        "Please submit required information like photo, responsible institution",
        [{ text: "Okay" }]
      );
    } else {
      setIsLoading(true);
      let accessToken = await AsyncStorage.getItem("accessToken");
      let body1 = {
        institutionId: selection,
        description: description,
        category: category,
        latitude: location.latitude,
        longitude: location.longitude,
        city: city,
      };

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
        .post(API_URL + "/report/post", body1, {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        })
        .then((res) => {
          postID = res.data.id;
          setID(postID);
          console.log(postID);

          axios
            .post(API_URL + "/report/" + postID + "/upload", body, {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: "Bearer " + accessToken,
              },
              transformRequest: (formData, headers) => {
                return data;
              },
            })
            .then((res) => {
              console.log("burası daha önemli");
              let MLbody = {
                report_id: postID,
              };

              axios
                .post(mlLink, MLbody)
                .then((res) => {
                  var cat = "";
                  var names = [];
                  var confidences = [];

                  for (var name in res.data.predictions) {
                    console.log(
                      name + "=" + res.data.predictions[name].confidence
                    );
                    names.push(name);
                    confidences.push(res.data.predictions[name].confidence);
                  }

                  if (names.length != 0 && confidences.length != 0) {
                    cat = names[0];
                    setIndex(categories.indexOf(cat));
                    setCategory(cat);
                    setrecTest("The category is recommended by reporTown");
                  }
                  setIsLoading(false);
                  setSubmitModal(true);
                })
                .catch((e) => console.log(e))
                .done();
            })
            .catch((e) => console.log(e))
            .done();
        })
        .catch((e) => console.log(e))
        .done();

      /*await delay(5000);*/
    }
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

    uri = localUri;
    console.log("uri is: ");
    console.log(uri);
    filetype = type;
    photoname = filename;

    setSelectedImage({ localUri: localUri });
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

    uri = localUri;
    filetype = type;
    photoname = filename;

    console.log("uri is: ");
    console.log(uri);

    setSelectedImage({ localUri: pickerResult.uri });
  }

  return (
    <SafeAreaView
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#080f26",
        paddingTop:
          Platform.OS === "android" ? StatusBar.currentHeight * 1.5 : 0,
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

      <Modal
        transparent={true}
        visible={mapModal}
        animationType="slide"
        onRequestClose={() => setMapModal(false)}
      >
        <View style={{ backgroundColor: "#000000aa", flex: 1 }}>
          <View
            style={{
              backgroundColor: "#080f26",
              flex: 1,
            }}
          >
            <View
              style={{
                height: "10%",
                width: "100%",
                backgroundColor: "#cb7b23",
                justifyContent: "center", //Centered horizontally
                alignItems: "center", //Centered vertically
                textAlignVertical: "center",

                flex: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  textAlign: "center",
                }}
              >
                If you do not choose any location, your current location will be
                used{" "}
              </Text>
            </View>

            <MapView
              ref={mapRef}
              style={styles.map}
              showsUserLocation={true}
              mapType={"hybrid"}
              scrollEnabled={true}
              showsCompass={false}
              zoomEnabled={true}
              rotateEnabled={true}
              onPress={(e) => {
                setMarker(e.nativeEvent.coordinate);
                setLocation(e.nativeEvent.coordinate);
              }}
            >
              {marker && <MapView.Marker coordinate={marker} />}
            </MapView>
            <View
              style={{
                height: "10%",
                width: "100%",
                backgroundColor: "#cb7b23",
                justifyContent: "center", //Centered horizontally
                alignItems: "center", //Centered vertically
                textAlignVertical: "center",
                flex: 1,
              }}
            >
              <TouchableOpacity onPress={() => setLocClicked()}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  Set the Location
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={submitModal}
        animationType="fade"
        onRequestClose={() => setSubmitModal(false)}
      >
        <View style={{ backgroundColor: "#000000aa", flex: 1 }}>
          <View
            style={{
              backgroundColor: "#080f26",
              flex: 1,
              marginBottom: "30%",
              marginTop: "30%",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setSubmitModal(false);
                setCategory("");
                setDescription("");
                setIndex(null);
              }}
              style={styles.closeButton}
            >
              <FontAwesomeIcon
                style={{ color: "#FFFFFF" }}
                icon={faCircleXmark}
                size={30}
              />
            </TouchableOpacity>
            <View
              style={{
                marginTop: "10%",
                width: "100%",
                alignItems: "center",
                alignSelf: "center",
                justifyContent: "center",
              }}
            >
              <TextInput
                style={styles.textinput}
                multiline={true}
                numberOfLines={5}
                onChangeText={(value) => setDescription(value)}
                placeholder="Description"
                underlineColorAndroid={"transparent"}
                placeholderTextColor={"gray"}
              />
            </View>

            <View
              style={{
                alignItems: "center",
                alignSelf: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  alignSelf: "center",
                  justifyContent: "center",
                  marginBottom: "5%",
                }}
              >
                <Text style={styles.titleText}>{recTest}</Text>
              </View>
              <SelectDropdown
                data={categories}
                defaultButtonText={"Choose a category"}
                defaultValueByIndex={index}
                onSelect={(selectedItem, index) => {
                  setCategory(selectedItem);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
              />
            </View>

            <View
              style={{
                marginTop: "10%",
                width: "100%",

                alignItems: "center",
                alignSelf: "center",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={styles.button}
                onPress={() => submitClicked()}
              >
                <Text style={styles.buttontext}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={tagModal}
        animationType="fade"
        onRequestClose={() => setTagModal(false)}
      >
        <View style={{ backgroundColor: "#000000aa", flex: 1 }}>
          <View
            style={{
              backgroundColor: "#080f26",
              flex: 1,
              marginBottom: "30%",
              marginTop: "30%",
            }}
          >
            <View style={{ flexDirection: "row", padding: "5%" }}>
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
                  width: "55%",
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
                    searchInput == ""
                      ? styles.disabledButton
                      : styles.enabledButton
                  }
                >
                  Search
                </Text>
              </TouchableOpacity>
            </View>

            {!isLoading && (
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
                            <TouchableOpacity
                              onPress={() => setSelection(user.id)}
                            >
                              <FontAwesomeIcon
                                icon={faBuildingColumns}
                                color={
                                  selection == user.id ? "orange" : "white"
                                }
                                size={70}
                              />
                            </TouchableOpacity>
                          </View>
                          <View style={{ marginLeft: 10 }}>
                            <View style={{ flexDirection: "row" }}>
                              <TouchableOpacity
                                onPress={() => console.log("I am clicked")}
                              >
                                <Text
                                  style={
                                    selection == user.id
                                      ? styles.selectedInst
                                      : styles.unselectedInst
                                  }
                                >
                                  {user.institutionName}{" "}
                                </Text>
                              </TouchableOpacity>
                            </View>
                            <Text
                              style={
                                selection == user.id
                                  ? styles.selectedInst
                                  : styles.unselectedInst
                              }
                            >
                              @{user.username}
                            </Text>
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
                            style={{
                              flex: 1,
                              height: 1,
                              backgroundColor: "white",
                            }}
                          />

                          <View
                            style={{
                              flex: 1,
                              height: 1,
                              backgroundColor: "white",
                            }}
                          />
                        </View>
                      </View>
                    );
                  }
                })}
              </ScrollView>
            )}

            <View
              style={{
                marginTop: "10%",
                width: "100%",

                alignItems: "center",
                alignSelf: "center",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={styles.button}
                onPress={() => setTagModal(false)}
              >
                <Text style={styles.buttontext}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View
        style={{
          flex: 0.4,
          flexDirection: "row",
          width: "30%",
          height: "30%",
          alignItems: "center",
          alignSelf: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={{
            uri: uri,
          }}
          style={{
            flex: 1,
            width: 100,
            height: 100,
            resizeMode: "contain",
            marginVertical: 10,
            borderRadius: 10,
            alignContent: "center",
          }}
        ></Image>
      </View>
      <View
        style={{
          flex: 0.5,
          flexDirection: "row",
          width: "40%",
          height: "40%",
          alignItems: "center",
          alignSelf: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => takeAndUploadPhotoAsync()}
          style={{
            height: "30%",
            minHeight: Dimensions.get("window").height / 10,
            padding: "3%",
            width: undefined,
            marginRight: "5%",
            aspectRatio: 1,
            alignItems: "center",
          }}
        >
          <Image
            source={require("../assets/cam.png")}
            style={{
              width: "100%",
              height: undefined,
              aspectRatio: 1,
              resizeMode: "contain",
            }}
          />
          <Text
            style={{
              color: "white",
              textAlign: "center",
            }}
          >
            Take Photo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => selectPhoto()}
          style={{
            height: "30%",
            minHeight: Dimensions.get("window").height / 10,
            padding: "3%",
            marginLeft: "5%",
            width: undefined,
            aspectRatio: 1,
            alignItems: "center",
          }}
        >
          <Image
            source={require("../assets/gallery.png")}
            style={{
              width: "100%",
              height: undefined,
              aspectRatio: 1,
              resizeMode: "contain",
            }}
          />
          <Text
            style={{
              color: "white",
              textAlign: "center",
            }}
          >
            From Gallery
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          marginTop: "10%",
          width: "100%",

          alignItems: "center",
          alignSelf: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            applySearch();
            setTagModal(true);
          }}
        >
          <Text style={styles.buttontext}>Tag Responsible</Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          marginTop: "10%",
          width: "100%",

          alignItems: "center",
          alignSelf: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => setMapModal(true)}
        >
          <Text style={styles.buttontext}>Set Location</Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          marginTop: "10%",
          width: "100%",

          alignItems: "center",
          alignSelf: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity style={styles.button} onPress={() => postClicked()}>
          <Text style={styles.buttontext}>Post</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

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
  map: {
    width: Dimensions.get("window").width,
    height: (Dimensions.get("window").height / 10) * 9,
  },
  closeButton: {
    width: 20,
    height: 20,
    top: 10,
    right: 15,
    position: "absolute", // add if dont work with above
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

  unselectedInst: {
    color: "white",
    fontSize: 16,
  },

  selectedInst: {
    color: "orange",
    fontSize: 16,
  },

  titleText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "orange",
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
export default PostScreen;
