import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Modal,
  Image,
  FlatList,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Report from "../../components/Report";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import { SafeAreaView } from "react-native-safe-area-context";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { LogBox } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { TextInput } from "react-native-gesture-handler";

LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
function OfficialPendingFeedScreen(props) {
  const [location, setLocation] = useState([]);
  const [filterScreenShow, setFilterScreenShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filterSearch, setFilterSearch] = useState("");
  const [feedItems, setFeedItems] = useState([]);
  var allCategories = [
    "Road Maintenance",
    "Transportation",
    "Accident",
    "Stray Animals",
    "Volunteering",
    "Garbage",
    "Missing",
    "Electricity",
  ];
  const [filterDescription, setFilterDescription] = useState("");
  const [filterSelectedCategory, setFilterSelectedCategory] = useState("");
  const [allLocations, setAllLocations] = useState([]);

  useEffect(async () => {
    let accessToken = await AsyncStorage.getItem("accessToken");
    const response = await axios
      .get(API_URL + "/officialFeedNotResolvedByCitizen", {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then((response) => {
        setFeedItems([]);
        setFeedItems((feedItems) => [...feedItems, ...response.data]);
        setIsLoading(false);

        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].description == "Bakalım olacak mı") {
            console.log("*********************************");
            console.log(response.data[i]);
          }
        }
      });
  }, []);

  const UpdateSearch = (search) => {
    setFilterSearch(search);
  };

  const sendFeedReq = async () => {
    const response = await axios
      .get(API_URL + "/officialFeedNotResolvedByCitizen", {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  };

  const setFilteredFeed = async () => {
    let desc = filterDescription;
    let cat = filterSelectedCategory;

    let filteredFeedResult = [];
    for (let i = 0; i < feedItems.length; i++) {
      if (
        feedItems[i].description.includes(desc) ||
        feedItems[i].category == cat
      ) {
        filteredFeedResult.push(feedItems[i]);
      }
    }
    console.log(filteredFeedResult);
    setFeedItems(filteredFeedResult);
  };

  const onRefresh = async () => {
    console.log("refreshing");
    setIsLoading(true);
    let accessToken = await AsyncStorage.getItem("accessToken");
    const response = await axios
      .get(API_URL + "/officialFeedNotResolvedByCitizen", {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then((response) => {
        setFeedItems([]);
        setFeedItems((feedItems) => [...feedItems, ...response.data]);
        setIsLoading(false);
      });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: "#080f26",
        marginBottom: 50,
      }}
    >
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#cb7b23",
          marginTop: -10,
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

      {/* Modal View (Pop-Up screen) for Filter Screen */}
      <Modal
        transparent={true}
        visible={filterScreenShow}
        animationType="slide"
        onRequestClose={() => {
          setFilterScreenShow(false);
          setFilterDescription("");
          setFilterSelectedCategory("");
        }}
      >
        <View style={{ backgroundColor: "#000000aa", flex: 1 }}>
          <View
            style={{
              backgroundColor: "#080f26",
              marginTop: 20,
              marginHorizontal: 35,
              padding: 25,
              borderRadius: 10,
              flex: 1,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "white",
                marginLeft: "auto",
                marginRight: "auto",
                marginBottom: 20,
              }}
            >
              Filter Reports
            </Text>

            {/* ADD TWO SELECT.DROPDOWN ELEMENTS HERE WHOSE DATA WILL BE ADDED DYNAMICALLY */}
            <TextInput
              style={styles.textinput}
              placeholder="Enter Report Description"
              underlineColorAndroid={"transparent"}
              placeholderTextColor={"gray"}
              onChangeText={(value) => setFilterDescription(value)}
              textAlignVertical="top"
            />

            <View
              style={{
                width: 330,
                height: 50,
                marginLeft: 40,
              }}
            >
              <SelectDropdown
                data={allCategories}
                onSelect={(selectedItem) => {
                  setFilterSelectedCategory(selectedItem);
                }}
                defaultButtonText={"Select Category"}
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
              disabled={filterDescription == "" && filterSelectedCategory == ""}
              onPress={() => {
                setFilteredFeed();
                setFilterScreenShow(false);
              }}
            >
              <Text style={styles.modalButton}>Apply</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setFilterScreenShow(false);
                setFilterDescription("");
                setFilterSelectedCategory("");
              }}
            >
              <Text style={styles.modalButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal View for loading animation */}
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

      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}
      >
        <View style={{ flex: 1, height: 1, backgroundColor: "white" }} />

        <View style={{ flex: 1, height: 1, backgroundColor: "white" }} />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setFilterScreenShow(true);
          console.log(feedItems);
        }}
      >
        <View
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            flexDirection: "row",
          }}
        >
          <MaterialIcons name="filter-list" size={26} color="white" />
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: 16,
              paddingTop: 3,
            }}
          >
            {" "}
            Filter Reports{" "}
          </Text>
        </View>
      </TouchableOpacity>

      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}
      >
        <View style={{ flex: 1, height: 1, backgroundColor: "white" }} />

        <View style={{ flex: 1, height: 1, backgroundColor: "white" }} />
      </View>
      {!isLoading && feedItems.length == 0 && (
        <Text
          style={{
            color: "white",
            fontSize: 16,
            paddingTop: 3,
          }}
        >
          No reports to show. Go to feed to solve reports!
        </Text>
      )}

      {!isLoading && feedItems != null && (
        <FlatList
          style={{ marginLeft: 10, marginRight: 10, flex: 1 }}
          data={feedItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Report
              reportId={item.id}
              name={item.firstName + " " + item.lastName}
              username={item.username}
              responsibleInstitution={item.institutionName}
              userId={item.userId}
              category={item.category}
              location={item.city}
              institutionId={item.institutionId}
              description={item.description}
              upvotes={item.upvotes}
              comments={item.comments}
              solution={item.solution}
              official={item.official}
              isResolved={item.resolvedByCitizen}
              isInstitution={false}
              isOfficial={true}
              navigation={props.navigation}
              image={item.image}
              profilePicture={item.profilePicture}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#cb7b23",
    padding: 10,
    borderRadius: 5,
    width: Dimensions.get("window").width - 10,
  },
  modalButton: {
    backgroundColor: "#cb7b23",
    fontSize: 18,
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
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
    backgroundColor: "#FFFFFF",
    height: 80,
    width: 80,
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
  },
  refreshButton: {},
  textinput: {
    alignSelf: "stretch",
    height: 100,
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    marginBottom: 30,
    color: "black",
    backgroundColor: "white",
    borderColor: "#f8f8f8",
    borderWidth: 1,
    borderRadius: 5,
  },
});
export default OfficialPendingFeedScreen;
