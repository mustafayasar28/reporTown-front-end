import createDataContext from "./createDataContext";
import trackerApi from "../api/tracker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigate } from "../navigationRef";

const authReducer = (state, action) => {
  switch (action.type) {
    case "add_error":
      return { signUpSuccessfullMessage: "", errorMessage: action.payload };
    case "add_success":
      return { errorMessage: "", signUpSuccessfullMessage: action.payload };
    case "signup":
      return { ...state, token: action.payload };
    case "signup_id":
      return { ...state, id: action.payload };
    case "login_success":
      return { ...state, loginMessage: "success" };
    case "login_error":
      return { ...state, loginMessage: "error" };
    default:
      return state;
  }
};

const citizen_signup = (dispatch) => {
  return async ({ name, surname, username, email, password }) => {
    // Make API request to sign up
    const request = await trackerApi
      .post("/register", 
      {
        username: username,
        password: password,
        firstName: name,
        lastName: surname,
        email: email,
        role: "CITIZEN"
    })
      .then(async (response) => {
        console.log(response.data);
        dispatch({
          type: "add_success",
          payload: "You have successfully created your account",
        });
        //await AsyncStorage.setItem("token", response.data.token);
        //dispatch({ type: "signup", payload: response.data.token });
        await AsyncStorage.setItem("id", response.data.id);
        dispatch({ type: "signup_id", payload: response.data.id });
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response);
        dispatch({
          type: "add_error",
          payload: "*Something went wrong with sign up",
        });
      });
    // Modify the state, Make the user authenticated
    // If signing up fails, reflect an error message
  };
};


const inst_signup = (dispatch) => {
  return async ({ name, username, email, password }) => {
    // Make API request to sign up
    const request = await trackerApi
      .post("/register", 
      {
        username: username,
        password: password,
        institutionName: name,
        email: email,
        role: "INSTITUTION",
        approvalDocument: "aws.amazon.com/s3/approvals/tccumhubaskanligi"

    })
      .then(async (response) => {
        console.log(response.data);
        dispatch({
          type: "add_success",
          payload: "You have successfully created your account",
        });
        //await AsyncStorage.setItem("token", response.data.token);
        //dispatch({ type: "signup", payload: response.data.token });
        await AsyncStorage.setItem("id", response.data.id);
        dispatch({ type: "signup_id", payload: response.data.id });
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response);
        dispatch({
          type: "add_error",
          payload: "*Something went wrong with sign up",
        });
      });
    // Modify the state, Make the user authenticated
    // If signing up fails, reflect an error message
  };
};

const user_signin = (dispatch) => {
  return async ({ username, password }) => {
    const request = await trackerApi
      .post("/login", {
        username: username,
        password: password,
      })
      .then(async (response) => {
        console.log("bu ra ya da girdim");
        console.log(response);
        //await AsyncStorage.setItem("token", response.data.token);
        //dispatch({ type: "signup", payload: response.data.token });
        //await AsyncStorage.setItem("id", response.data.id);
        //dispatch({ type: "signup_id", payload: response.data.id });
        //navigate("LoginScreen");
      })
      .catch((error) => {
        console.log("buraya girdim");
        return {
          loginMessage: "error",
        };
      });

    // Make API request to sign in
    // Modify the state, Make the user authenticated
    // If signing in fails, reflect an error message
  };
};
/*
    const request = await axios
      .post(
        "http://reportown-env-1.eba-njgmzgmh.us-east-1.elasticbeanstalk.com/login",
        {
          username: username,
          password: password,
        }
      )
      .then((response) => {
        setErrorText(false);

        if (response.data) console.log(response.data);
      })
      .catch((error) => {
        setErrorText(true);
        console.log(error);
      });
      */

const signout = (dispatch) => {
  return ({ username, password }) => {
    // Sign Out
  };
};

export const { Provider, Context } = createDataContext(
  authReducer,
  { user_signin, signout, citizen_signup, inst_signup},
  {
    id: null,
    token: null,
    errorMessage: "",
    signUpSuccessfullMessage: "",
    loginMessage: "",
  }
);
