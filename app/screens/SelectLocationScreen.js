import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Dimensions,
  Alert,
  Button,
  TouchableOpacity,
  Text,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";

import { LogBox } from "react-native";
LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
function SelectLocationScreen({ navigation, route }) {
  const [location, setLocation] = useState(null);
  const mapRef = React.createRef();
  const [marker, setMarker] = useState(null);

  function insClicked() {
    navigation.navigate({
      name: "PostScreen",
      params: { post: location },
      merge: true,
    });
  }

  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  return (
    <View style={styles.container}>
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
        <TouchableOpacity onPress={() => insClicked()}>
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
});
export default SelectLocationScreen;
