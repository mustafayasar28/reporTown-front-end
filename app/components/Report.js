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
  Dimensions,
  Alert,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import * as ImagePicker from "expo-image-picker";
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
import { FlatList, TextInput } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@env";
import SelectDropdown from "react-native-select-dropdown";

let uri = "https://nebosan.com.tr/wp-content/uploads/2018/06/no-image.jpg";
let filetype = "";
let photoname = "";

const Report = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isReportUpvoted, setIsReportUpvoted] = useState(false);
  const [commentScreenShow, setCommentScreenShow] = useState(false);
  const [commentSending, setCommentSending] = useState(false);
  const [solutionModal, setSolutionModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [description, setDescription] = useState("");
  const [upvoteCount, setUpvoteCount] = useState(
    props.upvotes == undefined || props.upvotes == null
      ? 0
      : props.upvotes.length
  );
  const [officialModal, setOfficialModal] = useState(false);
  const [assignedOfficialModal, setAssignedOfficialModal] = useState(false);
  const [postSolutionModal, setPostSolutionModal] = useState(false);
  const [selectedOfficial, setSelectedOfficial] = useState({});
  const [selectedOfficialIndex, setSelectedOfficialIndex] = useState(-1);
  let [selectedImage, setSelectedImage] = React.useState(null);

  const [powderblue, setPowderblue] = useState({
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: "auto",
  });
  const [skyblue, setSkyblue] = useState({
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 100,
  });
  const [steelblue, setSteelblue] = useState({
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 150,
  });

  useEffect(async () => {
    if (props.description == "Yollar çok kalabalık, kaza olmuş")
      console.log(props.solution);
    let userId = await AsyncStorage.getItem("userId");
    if (props.upvotes != null && props.upvotes != undefined) {
      for (let i = 0; i < props.upvotes.length; i++) {
        if (props.upvotes[i] == userId) {
          setIsReportUpvoted(true);
        }
      }
    }
  }, []);

  async function openComment() {
    setCommentScreenShow(true);
  }

  async function showUserProfile() {
    let userId = props.userId;
    console.log(userId);
    await AsyncStorage.setItem("displayUserId", userId);
    props.navigation.navigate("DisplayUserProfile");
  }

  async function takeAndUploadPhotoAsync() {
    console.log("kameray GİRDİ");
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

  async function upVoteReport() {
    /** Send a Upvote request */
    let accessToken = await AsyncStorage.getItem("accessToken");
    let reportId = props.reportId;

    axios({
      method: "PATCH",
      url: `${API_URL}/report/${reportId}/upvote`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((api_response) => {
        if (isReportUpvoted) {
          setIsReportUpvoted(false);
        } else {
          setIsReportUpvoted(true);
        }
        setUpvoteCount(api_response.data.upvotes);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const assignOfficial = async () => {
    let accessToken = await AsyncStorage.getItem("accessToken");
    let reportId = props.reportId;
    let officialId = props.employees[selectedOfficialIndex].id;

    var axios = require("axios");

    var data = JSON.stringify({
      reportId: reportId,
    });

    var config = {
      method: "post",
      url: API_URL + "/assignOfficial/" + officialId + "/toReport",
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
        setOfficialModal(false);
      });
  };

  async function sendComment() {
    let accessToken = await AsyncStorage.getItem("accessToken");
    let reportId = props.reportId;
    axios({
      method: "POST",
      url: `${API_URL}/report/${reportId}/comment`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        text: commentText,
      },
    })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(function () {
        setCommentScreenShow(false);
      });
  }

  const acceptSolution = async () => {
    let accessToken = await AsyncStorage.getItem("accessToken");
    let userId = await AsyncStorage.getItem("userId");
    console.log(userId);
    let reportId = props.reportId;
    setIsLoading(true);
    axios({
      method: "GET",
      url: `${API_URL}/report/${reportId}/solution/approve`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(function () {
        setIsLoading(false);
        setSolutionModal(false);
      });
  };

  const rejectSolution = async () => {
    let accessToken = await AsyncStorage.getItem("accessToken");
    let reportId = props.reportId;
    var axios = require("axios");

    console.log(reportId);
    var config = {
      method: "get",
      url: API_URL + "/report/" + reportId + "/solution/reject",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
    };

    setIsLoading(true);
    axios(config)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        setIsLoading(false);
        setSolutionModal(false);
      });
  };

  const markAsSolved = async () => {
    let accessToken = await AsyncStorage.getItem("accessToken");
    let reportId = props.reportId;
    var axios = require("axios");

    console.log(reportId);
    var config = {
      method: "get",
      url: API_URL + "/report/" + reportId + "/solution/mark",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
    };

    setIsLoading(true);
    axios(config)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        setIsLoading(false);
        setSolutionModal(false);
      });
  };

  const postSolutionClicked = async () => {
    let accessToken = await AsyncStorage.getItem("accessToken");

    let body1 = {
      description: description,
    };

    await axios
      .post(API_URL + "/report/" + props.reportId + "/solve", body1, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then((res) => {
        console.log("response" + JSON.stringify(res));
      })
      .catch((e) => console.log(e))
      .done();

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
      .post(API_URL + "/solution/" + props.reportId + "/upload", body, {
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
      .done();
    Alert.alert(
      "Post Solution Successful!",
      "Solution is posted for user's review."
    );
    setPostSolutionModal(false);
  };

  const Comment = ({ item }) => {
    return (
      <View style={{ flex: 1, marginVertical: 20 }}>
        <View style={{ flexDirection: "row" }}>
          <Image
            source={require("../assets/profile-user.png")}
            style={{ width: "100%", height: 30, width: 30 }}
          ></Image>
          <Text style={{ color: "white", fontSize: 20, marginLeft: 15 }}>
            {item.username}
          </Text>
        </View>
        <Text style={{ color: "white", margin: 10, fontSize: 16 }}>
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: "column",
        },
        {
          maxHeight: 400,
          borderBottomColor: "white",
          borderBottomWidth: 2,
        },
      ]}
    >
      {/** Is loading modal */}
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

      {/** COMMENTS SCREEN MODAL */}
      <Modal
        transparent={true}
        visible={commentScreenShow}
        animationType="slide"
        onRequestClose={() => setCommentScreenShow(false)}
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
                setCommentScreenShow(false);
              }}
              style={styles.closeButton}
            >
              <FontAwesomeIcon
                style={{ color: "#FFFFFF" }}
                icon={faCircleXmark}
                size={40}
              />
            </TouchableOpacity>
            {props.comments != null &&
              props.comments != undefined &&
              props.comments.length != 0 && (
                <FlatList
                  style={{ marginBottom: 20 }}
                  data={props.comments}
                  renderItem={Comment}
                  keyExtractor={(item) => item.id}
                ></FlatList>
              )}

            {props.comments != null &&
              props.comments != undefined &&
              props.isInstitution != true &&
              props.comments.length == 0 && (
                <Text style={{ color: "white", fontSize: 20 }}>
                  Be the first person to comment!
                </Text>
              )}

            {props.isInstitution != true && (
              <View style={styles.commentView}>
                <TextInput
                  onChangeText={(text) => setCommentText(text)}
                  style={styles.commentInput}
                />
                <TouchableOpacity
                  disabled={!commentText.length}
                  onPress={() => sendComment()}
                >
                  <Text
                    style={
                      commentText.length > 0
                        ? styles.commentSendButton
                        : styles.disabledCommentSendButton
                    }
                  >
                    Send
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/** Solution Modal */}
      {props.solution != null && (
        <Modal
          transparent={true}
          visible={solutionModal}
          animationType="slide"
          onRequestClose={() => setSolutionModal(false)}
        >
          <View
            style={{
              backgroundColor: "#000000aa",
              flexGrow: 1,
            }}
          >
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
                  setSolutionModal(false);
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

              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                <Text
                  style={{ fontSize: 16, color: "aqua", fontWeight: "bold" }}
                >
                  Description:{" "}
                </Text>
                <Text style={{ fontSize: 16, color: "white" }}>
                  {props.solution.description}
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                  height: "100%",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    height: "100%",
                    width: "100%",
                    backgroundColor: "#000000aa",
                    marginTop: 20,
                  }}
                >
                  <Image
                    source={{
                      uri: props.solution.image,
                    }}
                    style={{
                      flex: 1,
                      width: null,
                      height: null,
                      resizeMode: "contain",
                      marginVertical: 10,
                      borderRadius: 10,
                    }}
                  ></Image>
                </View>

                {props.isResolved == false && props.isDecidable == true && (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: -400,
                      marginTop: 50,
                      marginHorizontal: 20,
                    }}
                  >
                    <TouchableOpacity onPress={() => acceptSolution()}>
                      <FontAwesomeIcon
                        icon={faCircleCheck}
                        size={60}
                        color="green"
                      />
                      <Text
                        style={{
                          color: "white",
                          fontSize: 16,
                          marginLeft: -20,
                          marginTop: 5,
                        }}
                      >
                        Accept Solution
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => rejectSolution()}>
                      <FontAwesomeIcon
                        icon={faCircleXmark}
                        size={60}
                        color="red"
                      />
                      <Text
                        style={{
                          color: "white",
                          fontSize: 16,
                          marginLeft: -20,
                          marginTop: 5,
                        }}
                      >
                        Reject Solution
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/** Show Image Modal */}
      <Modal
        transparent={true}
        visible={showImageModal}
        animationType="slide"
        onRequestClose={() => setShowImageModal(false)}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => {
            setShowImageModal(false);
          }}
        >
          <View
            style={{
              flex: 1,
              height: "100%",
              width: "100%",
              backgroundColor: "#000000aa",
            }}
          >
            <Image
              source={{
                uri: props.image,
              }}
              style={{
                flex: 1,
                width: null,
                height: null,
                resizeMode: "contain",
                marginVertical: 10,
                borderRadius: 10,
              }}
            ></Image>
          </View>
        </TouchableOpacity>
      </Modal>

      {/** Post solution modal */}
      {props.official != null &&
        props.isOfficial &&
        props.category != "Volunteering" && (
          <Modal
            transparent={true}
            visible={postSolutionModal}
            animationType="slide"
            onRequestClose={() => setPostSolutionModal(false)}
          >
            <View style={{ backgroundColor: "#000000aa", flex: 1 }}>
              <View
                style={{
                  backgroundColor: "#080f26",
                  margin: 20,
                  padding: 25,
                  borderRadius: 10,
                  flex: 1,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setPostSolutionModal(false);
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

                <View
                  style={{
                    flex: 0.5,
                    flexDirection: "row",
                    width: "10%",
                    height: "100%",
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
                      width: 80,
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
                      width: 80,
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
                      Choose From Gallery
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    marginTop: 10,
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
                    marginTop: "10%",
                    width: "100%",
                    height: "10%",
                    alignItems: "center",
                    alignSelf: "center",
                    justifyContent: "center",
                  }}
                >
                  <TouchableOpacity
                    style={styles.solutionButton}
                    onPress={() => postSolutionClicked()}
                  >
                    <Text style={styles.buttontext}>Post Solution</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}

      {/** See Official Modal  assignedOfficialModal*/}
      {props.official != null && (
        <Modal
          transparent={true}
          visible={assignedOfficialModal}
          animationType="slide"
          onRequestClose={() => setAssignedOfficialModal(false)}
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
                  setAssignedOfficialModal(false);
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
              <View style={{ flexDirection: "row", width: 220 }}>
                <Text style={{ color: "white", fontSize: 18 }}>Name:</Text>
                <Text style={{ color: "white", fontSize: 18, marginLeft: 10 }}>
                  {props.official.firstName} {props.official.lastName}
                </Text>
              </View>
              <View style={{ flexDirection: "row", width: 220 }}>
                <Text style={{ color: "white", fontSize: 18 }}>Position:</Text>
                <Text style={{ color: "white", fontSize: 18, marginLeft: 10 }}>
                  {props.official.position}{" "}
                </Text>
              </View>
              <View style={{ flexDirection: "row", width: 220 }}>
                <Text style={{ color: "white", fontSize: 18 }}>
                  Institution Name:
                </Text>
                <Text style={{ color: "white", fontSize: 18, marginLeft: 10 }}>
                  {props.official.institutionName}{" "}
                </Text>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/** Assign Official Modal */}
      {props.employees != null &&
        props.category != "Volunteering" &&
        props.isInstitution == true && (
          <Modal
            transparent={true}
            visible={officialModal}
            animationType="slide"
            onRequestClose={() => setOfficialModal(false)}
          >
            <View style={{ backgroundColor: "#000000aa", flex: 1 }}>
              <View
                style={{
                  backgroundColor: "#080f26",
                  marginTop: 200,
                  marginRight: 25,
                  marginLeft: 25,
                  marginBottom: 300,
                  padding: 25,
                  borderRadius: 10,
                  flex: 1,
                }}
              >
                {props.employees.length == 0 && (
                  <Text style={{ color: "white", fontSize: 18 }}>
                    There is no officials in the institution. Please add
                    employee first.
                  </Text>
                )}
                {props.employees.length != 0 && (
                  <View>
                    <View
                      style={{
                        marginBottom: 20,
                        height: 100,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          color: "white",
                          fontSize: 24,
                          fontWeight: "bold",
                          marginBottom: 30,
                        }}
                      >
                        Select an official to assign
                      </Text>
                      <SelectDropdown
                        style={{ width: 300 }}
                        data={props.employees.map((emp) => {
                          return emp.firstName + " " + emp.lastName;
                        })}
                        onSelect={(selectedItem, selectedIndex) => {
                          setSelectedOfficial(selectedItem);
                          setSelectedOfficialIndex(selectedIndex);
                        }}
                        defaultButtonText={"Select official"}
                        dropdownIconPosition={"right"}
                        buttonStyle={styles.dropdown1BtnStyle}
                        buttonTextStyle={styles.dropdown1BtnTxtStyle}
                        dropdownStyle={styles.dropdown1DropdownStyle}
                        rowStyle={styles.dropdown1RowStyle}
                        rowTextStyle={styles.dropdown1RowTxtStyle}
                        renderDropdownIcon={(isOpened) => {
                          return (
                            <FontAwesomeIcon
                              color="#444"
                              size={18}
                              icon={isOpened ? faChevronUp : faChevronDown}
                            />
                          );
                        }}
                      />
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        assignOfficial();
                      }}
                      style={styles.button}
                    >
                      <Text style={styles.buttontext}>Assign Official</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setOfficialModal(false);
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 16,
                          textAlign: "center",
                          textDecorationLine: "underline",
                          marginTop: 15,
                        }}
                      >
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </Modal>
        )}

      <View style={{ flex: 1, backgroundColor: "#080f26" }}>
        <View
          style={[
            styles.container,
            {
              flexDirection: "row",
              alignContent: "space-between",
            },
          ]}
        >
          <View style={styles.boxContainer}>
            <Image
              source={{
                uri: props.profilePicture,
              }}
              style={{
                height: 50,
                width: 50,
                backgroundColor: "white",
              }}
            />
          </View>

          <View
            style={[
              styles.box,
              {
                flexBasis: skyblue.flexBasis,
                flexGrow: skyblue.flexGrow,
                flexShrink: skyblue.flexShrink,
                backgroundColor: "#080f26",
                justifyContent: "center",
                marginTop: 50,
              },
            ]}
          >
            <View
              style={{
                justifyContent: "center",
                paddingLeft: 10,
              }}
            >
              <TouchableOpacity onPress={() => showUserProfile()}>
                <Text style={{ color: "white" }}>{props.name}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => showUserProfile()}>
                <Text style={{ color: "white" }}>@{props.username}</Text>
              </TouchableOpacity>
            </View>
          </View>
          {props.solution != null && (
            <TouchableOpacity
              onPress={() => setSolutionModal(true)}
              style={{
                position: "absolute",
                paddingTop: 20,
              }}
            >
              <Text
                style={{
                  color: "green",
                  textDecorationLine: "underline",
                  fontSize: 16,
                }}
              >
                See Solution
              </Text>
            </TouchableOpacity>
          )}
          {props.solution == null && props.isDecidable && !props.isResolved && (
            <TouchableOpacity
              onPress={() => markAsSolved()}
              style={{
                position: "absolute",
                paddingTop: 20,
              }}
            >
              <Text
                style={{
                  color: "green",
                  textDecorationLine: "underline",
                  fontSize: 16,
                }}
              >
                Mark as Solved
              </Text>
            </TouchableOpacity>
          )}
          {props.official == null &&
            props.isResolved == false &&
            props.isInstitution && (
              <TouchableOpacity
                onPress={() => setOfficialModal(true)}
                style={{ paddingTop: 20, paddingRight: 20 }}
              >
                <Text
                  style={{
                    color: "green",
                    textDecorationLine: "underline",
                    fontSize: 16,
                  }}
                >
                  Assign Official
                </Text>
              </TouchableOpacity>
            )}

          {props.isResolved == false &&
            props.isOfficial &&
            props.solution == null && (
              <TouchableOpacity
                onPress={() => setPostSolutionModal(true)}
                style={{ paddingTop: 20, paddingRight: 20 }}
              >
                <Text
                  style={{
                    color: "green",
                    textDecorationLine: "underline",
                    fontSize: 16,
                  }}
                >
                  Send Solution
                </Text>
              </TouchableOpacity>
            )}

          {props.official != null && props.isOfficial != true && (
            <TouchableOpacity
              onPress={() => {
                setAssignedOfficialModal(true);
              }}
              style={{
                position: "absolute",
                paddingTop: 20,
                marginLeft: 100,
              }}
            >
              <Text
                style={{
                  color: "green",

                  textDecorationLine: "underline",
                  fontSize: 16,
                }}
              >
                See Official
              </Text>
            </TouchableOpacity>
          )}
          <View
            style={[
              styles.box,
              {
                flexBasis: steelblue.flexBasis,
                flexGrow: steelblue.flexGrow,
                flexShrink: steelblue.flexShrink,
                backgroundColor: "#080f26",
                height: 90,
                marginTop: 30,
              },
            ]}
          >
            <View flexDirection="row">
              <Text style={{ color: "white" }}>{props.category}</Text>
            </View>
            <View flexDirection="row" style={{ marginTop: 10, color: "white" }}>
              <Text style={{ color: "white" }}>
                {props.location == null || props.location == undefined
                  ? "No location"
                  : props.location}
              </Text>
              <FontAwesomeIcon
                style={{ marginLeft: 10 }}
                icon={faLocationDot}
                color="white"
              />
            </View>
            <View flexDirection="row" style={{ marginTop: 10, color: "white" }}>
              <Text style={{ color: "white" }}>
                {props.responsibleInstitution}
              </Text>
              <FontAwesomeIcon
                style={{ marginLeft: 10 }}
                icon={faBuildingColumns}
                color="white"
              />
            </View>
          </View>
        </View>
      </View>
      <View style={{ flex: 2, backgroundColor: "#080f26" }}>
        <View
          style={[
            styles.container,
            {
              flexDirection: "row",
              alignContent: "space-between",
            },
          ]}
        >
          <View>
            <View>
              <Text style={{ color: "white", marginBottom: 5, marginTop: 20 }}>
                {props.description}
              </Text>
            </View>
            <View style={{ marginTop: 10 }}>
              <TouchableOpacity
                onPress={() => {
                  setShowImageModal(true);
                }}
              >
                <Image
                  source={{
                    uri: props.image,
                  }}
                  style={{ height: 200, width: 400, resizeMode: "cover" }}
                ></Image>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          flex: 3,
          flexDirection: "row",
          backgroundColor: "#080f26",
          maxHeight: 50,
        }}
      >
        <TouchableOpacity onPress={() => upVoteReport()}>
          <FontAwesomeIcon
            style={{ margin: 13 }}
            icon={faCircleArrowUp}
            color={isReportUpvoted ? "green" : "white"}
            size={25}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 30,
            marginTop: 5,
            color: isReportUpvoted ? "green" : "white",
          }}
        >
          {upvoteCount}
        </Text>

        <View style={{ marginLeft: 10, flexDirection: "row" }}>
          <TouchableOpacity onPress={() => openComment()}>
            <FontAwesomeIcon
              style={{ margin: 13 }}
              icon={faComment}
              color="white"
              size={25}
            />
          </TouchableOpacity>

          <Text style={{ fontSize: 30, marginTop: 5, color: "white" }}>
            {props.comments == null || props.comments == undefined
              ? "0"
              : props.comments.length}
          </Text>
          {props.isResolved == false ? (
            <Text
              style={{
                fontSize: 16,
                marginTop: 15,
                marginLeft: 100,
                color: "white",
              }}
            >
              Not Resolved
            </Text>
          ) : (
            <View>
              <Text
                style={{
                  fontSize: 16,
                  marginTop: 15,
                  marginLeft: 100,
                  color: "white",
                }}
              >
                Resolved
              </Text>
            </View>
          )}

          {props.isResolved == false ? (
            <FontAwesomeIcon
              style={{ margin: 12 }}
              icon={faCircleExclamation}
              color="white"
              size={25}
            />
          ) : (
            <FontAwesomeIcon
              style={{ margin: 12 }}
              icon={faCheckCircle}
              color="green"
              size={25}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    flex: 1,
    height: 50,
    width: 50,
  },
  boxLabel: {
    minWidth: 80,
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  label: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "100",
  },
  previewContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "aliceblue",
  },
  row: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 5,
  },
  input: {
    borderBottomWidth: 1,
    paddingVertical: 3,
    width: 50,
    textAlign: "center",
  },
  boxContainer: {
    elevation: 2,
    height: 50,
    width: 50,
    marginTop: 50,
    resizeMode: "contain",
    backgroundColor: "#080f26",
    position: "relative",
    borderRadius: 25,
    overflow: "hidden",
  },
  nameContainer: {
    justifyContent: "center",
  },
  commentButton: {
    marginRight: 10,
    marginLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#cb7b23",
    borderRadius: 10,
    position: "absolute",
    bottom: 10,
  },
  commentText: {
    color: "#fff",
    textAlign: "center",
    paddingLeft: 10,
    paddingRight: 10,
  },
  commentView: {
    position: "absolute",
    bottom: 10,
    flexDirection: "row",
    width: "100%",
    flex: 1,
  },
  commentInput: {
    backgroundColor: "white",
    color: "black",
    height: 40,
    borderWidth: 1,
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    borderRadius: 10,
  },
  commentSendButton: {
    color: "white",
    fontSize: 24,
    backgroundColor: "#cb7b23",
    marginRight: -30,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  disabledCommentSendButton: {
    color: "#C6C6C6",
    fontSize: 24,
    backgroundColor: "#cb7b23",
    marginRight: -30,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    top: 10,
    right: 15,
    flex: 1,
    position: "absolute", // add if dont work with above
  },
  dropdownsRow: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: "5%",
    marginBottom: 25,
  },

  dropdown1BtnStyle: {
    flex: 1,
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444",
  },
  dropdown1BtnTxtStyle: { color: "#444", textAlign: "left" },
  dropdown1DropdownStyle: { backgroundColor: "#EFEFEF" },
  dropdown1RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5",
  },
  dropdown1RowTxtStyle: { color: "#444", textAlign: "left" },

  dropdown2BtnStyle: {
    flex: 1,
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444",
  },
  dropdown2BtnTxtStyle: { color: "#444", textAlign: "left" },
  dropdown2DropdownStyle: { backgroundColor: "#EFEFEF" },
  dropdown2RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5",
  },
  dropdown2RowTxtStyle: { color: "#444", textAlign: "left" },
  button: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#cb7b23",
    width: 200,
    borderRadius: 5,
    marginLeft: "20%",
    marginTop: 20,
  },
  textinput: {
    alignSelf: "stretch",
    height: "40%",
    marginLeft: 30,
    marginRight: 30,
    color: "black",
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
    backgroundColor: "white",
    borderColor: "#f8f8f8",
    borderWidth: 1,
    borderRadius: 5,
  },
  solutionButton: {
    alignItems: "center",
    backgroundColor: "#cb7b23",
    width: "50%",
    marginBottom: "2%",
    borderRadius: 5,
    padding: 10,
  },
  buttontext: {
    color: "#fff",
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
  modalHeader: {
    flexDirection: "row",
  },
  /* The header takes up all the vertical space not used by the close button. */
  modalHeaderContent: {
    flexGrow: 1,
  },
  modalHeaderCloseText: {
    textAlign: "center",
    paddingLeft: 5,
    paddingRight: 5,
    color: "white",
  },
});

export default Report;
