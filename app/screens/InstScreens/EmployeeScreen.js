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
  faUserPlus,
  faAddressBook,
  faChevronUp,
  faChevronDown,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@env";
import { TextInput } from "react-native-gesture-handler";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import SelectDropdown from "react-native-select-dropdown";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
function EmployeeScreen(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [institutionName, setInstitutionName] = useState("");
  const [employees, setEmployees] = useState([]);
  const [addEmployeeModal, setAddEmployeeModal] = useState(false);
  const [addPositionModal, setAddPositionModal] = useState(false);
  const [positions, setPositions] = useState([]);

  /** Adding employee states */
  const [addedEmployeeName, setAddedEmployeeName] = useState("");
  const [addedEmployeeSurname, setAddedEmployeeSurname] = useState("");
  const [addedEmployeeUsername, setAddedEmployeeUsername] = useState("");
  const [addedEmployeeEmail, setAddedEmployeeEmail] = useState("");
  const [addedEmployeePassword, setAddedEmployeePassword] = useState("");
  const [addedEmployeeConfirmPassword, setAddedEmployeeConfirmPassword] =
    useState("");
  const [addedPosition, setAddedPosition] = useState("");
  const [fillAllFields, setFillAllFields] = useState(false);
  const [passwordsDontMatch, setPasswordDontMatch] = useState(false);

  const [insertedPosition, setInsertedPosition] = useState("");

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
        setEmployees([]);
        setPositions([]);
        /*
        let x = [];

        for (let i = 0; i < 20; i++) {
          x.push(response.data.user.employees[0]);
        }
        */
        setEmployees(response.data.user.employees);
        setPositions(response.data.user.positions);
        console.log(response.data.user);
        //setEmployees(x);
      })
      .finally(function () {
        setIsLoading(false);
        console.log(employees);
      });
  }, []);

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
        setInstitutionName(response.data.user.institutionName);
        setEmployees([]);
        setPositions([]);
        /*
        let x = [];

        for (let i = 0; i < 20; i++) {
          x.push(response.data.user.employees[0]);
        }
        */
        setEmployees(response.data.user.employees);
        setPositions(response.data.user.positions);
        console.log(response.data.user);
        //setEmployees(x);
      })
      .finally(function () {
        setIsLoading(false);
        setAddEmployeeModal(false);
        console.log(employees);
      });
  };

  const addEmployee = async () => {
    if (
      addedEmployeeName != "" &&
      addedEmployeeSurname != "" &&
      addedEmployeeUsername != "" &&
      addedEmployeeEmail != "" &&
      addedEmployeePassword != "" &&
      addedEmployeeConfirmPassword != ""
    ) {
      setFillAllFields(false);
      if (addedEmployeePassword === addedEmployeeConfirmPassword) {
        // send request
        setPasswordDontMatch(false);

        let accessToken = await AsyncStorage.getItem("accessToken");
        var axios = require("axios");

        var data = JSON.stringify({
          firstName: addedEmployeeName,
          lastName: addedEmployeeSurname,
          email: addedEmployeeEmail,
          username: addedEmployeeUsername,
          password: addedEmployeePassword,
          role: "OFFICIAL",
          position: addedPosition,
        });

        var config = {
          method: "post",
          url: API_URL + "/institution/addOfficial",
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json",
          },
          data: data,
        };

        setIsLoading(true);
        axios(config)
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            setIsLoading(false);
            console.log(error);
          })
          .finally(function () {
            setIsLoading(false);
            refreshPage();
          });
      } else {
        setPasswordDontMatch(true);
      }
    } else {
      setFillAllFields(true);
    }
  };

  const deleteEmployee = async (employee) => {
    let accessToken = await AsyncStorage.getItem("accessToken");
    let officialId = employee.id;
    var axios = require("axios");

    var config = {
      method: "delete",
      url: API_URL + "/deleteOfficial/" + officialId + "/",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
    };

    setIsLoading(true);
    axios(config)
      .then(function (response) {})
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        setIsLoading(false);
        refreshPage();
      });
  };

  const addPosition = async () => {
    let accessToken = await AsyncStorage.getItem("accessToken");
    var axios = require("axios");

    var data = JSON.stringify({
      position: insertedPosition,
    });

    var config = {
      method: "post",
      url: API_URL + "/addPositionToOfficial",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
      data: data,
    };

    setIsLoading(true);
    axios(config)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        setIsLoading(false);
        console.log(error);
      })
      .finally(function () {
        setIsLoading(false);
        setAddPositionModal(false);
        refreshPage();
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

      {/** ADD EMPLOYEE MODAL */}
      <Modal
        transparent={true}
        visible={addEmployeeModal}
        animationType="slide"
        onRequestClose={() => {
          setAddEmployeeModal(false);
        }}
      >
        <ScrollView style={{ backgroundColor: "#000000aa", flex: 1 }}>
          <View
            style={{
              backgroundColor: "#080f26",
              marginVertical: 100,
              padding: 25,
              marginLeft: "5%",
              borderRadius: 10,
              width: "90%",
              flex: 1,
            }}
          >
            <TextInput
              style={styles.textinput}
              placeholder="Name"
              underlineColorAndroid={"transparent"}
              placeholderTextColor={"grey"}
              onChangeText={(value) => setAddedEmployeeName(value)}
            />
            <TextInput
              style={styles.textinput}
              placeholder="Surname"
              underlineColorAndroid={"transparent"}
              placeholderTextColor={"grey"}
              onChangeText={(value) => setAddedEmployeeSurname(value)}
            />
            <TextInput
              style={styles.textinput}
              placeholder="Username"
              underlineColorAndroid={"transparent"}
              placeholderTextColor={"grey"}
              onChangeText={(value) => setAddedEmployeeUsername(value)}
            />
            <TextInput
              style={styles.textinput}
              placeholder="Email"
              underlineColorAndroid={"transparent"}
              placeholderTextColor={"grey"}
              onChangeText={(value) => setAddedEmployeeEmail(value)}
            />
            <TextInput
              style={styles.textinput}
              placeholder="Password"
              underlineColorAndroid={"transparent"}
              placeholderTextColor={"grey"}
              onChangeText={(value) => setAddedEmployeePassword(value)}
            />
            <TextInput
              style={styles.textinput}
              placeholder="Confirm Password"
              underlineColorAndroid={"transparent"}
              placeholderTextColor={"grey"}
              onChangeText={(value) => setAddedEmployeeConfirmPassword(value)}
            />
            <View style={{ marginLeft: 50, marginBottom: 20 }}>
              <SelectDropdown
                style={{ paddingLeft: 50, marginBottom: 20 }}
                data={positions}
                onSelect={(selectedItem) => {
                  setAddedPosition(selectedItem);
                }}
                defaultButtonText={"Select position"}
                dropdownIconPosition={"right"}
                buttonStyle={styles.dropdown1BtnStyle}
                buttonTextStyle={styles.dropdown1BtnTxtStyle}
                renderDropdownIcon={(isOpened) => {
                  return (
                    <FontAwesomeIcon
                      icon={isOpened ? faChevronUp : faChevronDown}
                      color={"#444"}
                      size={18}
                    />
                  );
                }}
                dropdownStyle={styles.dropdown1DropdownStyle}
                rowStyle={styles.dropdown1RowStyle}
                rowTextStyle={styles.dropdown1RowTxtStyle}
              ></SelectDropdown>
            </View>

            {fillAllFields == true && (
              <Text style={{ color: "red", textAlign: "center" }}>
                Please fill all fields
              </Text>
            )}

            {passwordsDontMatch == true && (
              <Text style={{ color: "red", textAlign: "center" }}>
                Passwords don't match
              </Text>
            )}

            <TouchableOpacity
              onPress={() => {
                addEmployee();
              }}
              style={styles.button}
            >
              <Text style={styles.buttontext}>Add Employee</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setAddEmployeeModal(false);
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
        </ScrollView>
      </Modal>

      {/** ADD POSITION MODAL */}
      <Modal
        transparent={true}
        visible={addPositionModal}
        animationType="slide"
        onRequestClose={() => {
          setAddPositionModal(false);
        }}
      >
        <ScrollView style={{ backgroundColor: "#000000aa", flex: 1 }}>
          <View
            style={{
              backgroundColor: "#080f26",
              marginVertical: 100,
              padding: 25,
              marginLeft: "5%",
              borderRadius: 10,
              width: "90%",
              flex: 1,
            }}
          >
            <TextInput
              style={styles.textinput}
              placeholder="Enter Position Name"
              underlineColorAndroid={"transparent"}
              placeholderTextColor={"grey"}
              onChangeText={(value) => setInsertedPosition(value)}
            />

            <TouchableOpacity
              disabled={insertedPosition == ""}
              onPress={() => {
                addPosition();
              }}
              style={styles.button}
            >
              <Text
                style={
                  insertedPosition != ""
                    ? styles.buttontext
                    : styles.disabledButtonText
                }
              >
                Add Position
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setInsertedPosition("");
                setAddPositionModal(false);
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
        </ScrollView>
      </Modal>
      <View>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            props.navigation.goBack();
          }}
        >
          <FontAwesomeIcon
            style={{ color: "#ffffff" }}
            icon={faCircleXmark}
            size={36}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 50,
        }}
      >
        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
          Employees of {institutionName}
        </Text>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}
        >
          <View style={{ flex: 1, height: 1, backgroundColor: "white" }} />
        </View>
      </View>

      {!isLoading && employees.length == 0 && (
        <ScrollView
          nestedScrollEnabled={true}
          style={{ marginLeft: 10, marginRight: 10 }}
        >
          <Text style={{ color: "white", fontSize: 18, marginTop: 20 }}>
            There is no employee in this institution
          </Text>
        </ScrollView>
      )}

      {!isLoading && employees.length != 0 && (
        <ScrollView
          nestedScrollEnabled={true}
          style={{ marginLeft: 10, marginRight: 10 }}
        >
          <View>
            {employees.map((employee) => {
              return (
                <View key={employee.id} style={{ marginTop: 10 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingRight: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 18,
                        textAlign: "left",
                      }}
                    >
                      {employee.firstName + " " + employee.lastName}
                    </Text>
                    <Text
                      style={{
                        textAlign: "right",
                        color: "white",
                        fontSize: 18,
                      }}
                    >
                      {employee.position}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 18,
                        marginTop: 10,
                        textAlign: "left",
                      }}
                    >
                      @{employee.username}
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        marginLeft: "auto",
                        marginRight: 10,
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faStar}
                        color="white"
                        style={{ marginTop: 13, marginRight: 10 }}
                      />
                      <Text
                        style={{
                          color: "white",
                          fontSize: 18,
                          marginTop: 10,
                          textAlign: "right",
                        }}
                      >
                        {employee.score}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={{ marginTop: 10 }}
                    onPress={() => {
                      deleteEmployee(employee);
                    }}
                  >
                    <Text
                      style={{
                        color: "#D11A2A",
                        textDecorationLine: "underline",
                        textAlign: "right",
                        marginRight: 10,
                      }}
                    >
                      Delete
                    </Text>
                  </TouchableOpacity>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 4,
                    }}
                  >
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
            })}
          </View>
        </ScrollView>
      )}
      {!isLoading && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
            marginTop: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setAddEmployeeModal(true);
            }}
            style={{ marginLeft: "auto", marginRight: "auto" }}
          >
            <FontAwesomeIcon icon={faUserPlus} size={56} color="#cb7b23" />
            <Text style={{ color: "white", fontSize: 18, marginLeft: -20 }}>
              Add Employee
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setInsertedPosition("");
              setAddPositionModal(true);
            }}
            style={{ marginLeft: "auto", marginRight: "auto" }}
          >
            <FontAwesomeIcon icon={faAddressBook} size={56} color="#cb7b23" />
            <Text style={{ color: "white", fontSize: 18, marginLeft: -20 }}>
              Add Position
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080f26",
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
  textinput: {
    alignSelf: "stretch",
    height: 40,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 30,
    color: "black",
    backgroundColor: "white",
    borderColor: "#f8f8f8",
    borderWidth: 1,
    borderRadius: 5,
  },
  button: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#cb7b23",
    width: 200,
    borderRadius: 5,
    marginLeft: "20%",
    marginTop: 20,
  },
  buttontext: {
    color: "#fff",
    fontWeight: "bold",
  },
  disabledButtonText: {
    color: "grey",
    fontWeight: "bold",
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
  closeButton: {
    width: 50,
    height: 50,
    top: 40,
    right: 10,
    position: "absolute", // add if dont work with above
  },
});
export default EmployeeScreen;
