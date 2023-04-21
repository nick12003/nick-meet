import {
  getAuth,
  updateProfile,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  // signInWithCredential,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// import { login, resetData } from "@/redux/user";

import app from "./index";

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
const googleProvide = new GoogleAuthProvider();
const githubProvide = new GithubAuthProvider();

const logout = () => {
  signOut(auth);
};

const anonymousLogin = async (nickName, callback) => {
  const result = await signInAnonymously(auth).then((response) => {
    updateProfile(auth.currentUser, {
      displayName: nickName,
    });

    return response;
  });
  console.log("anonymousLogin", result);
  if (callback) {
    callback();
  }
};

const googleLogin = async (callback) => {
  const result = await signInWithPopup(auth, googleProvide);
  console.log("googleLogin", result);
  if (callback) {
    callback();
  }
};

const githubLogin = async (callback) => {
  const result = await signInWithPopup(auth, githubProvide);
  console.log("githubLogin", result);
  if (callback) {
    callback();
  }
};

// const credentialLogin = async (credential) => {
//   const result = await signInWithCredential(auth, credential);
//   console.log("credentialLogin", result);
// };

const onAuthStateChange = (loginCallback, logoutCallback) =>
  onAuthStateChanged(auth, async (user) => {
    // console.log("StateChange", user);

    if (user) {
      // const idToken = await user.getIdToken();
      // const { providerData } = user;

      // if (isFirst) {
      //   let credential;
      //   if (providerData[0]?.providerId === "github.com") {
      //     credential = GithubAuthProvider.credential(idToken);
      //   }
      //   if (providerData[0]?.providerId === "google.com") {
      //     credential = GoogleAuthProvider.credential(idToken);
      //   }
      //   if (credential) {
      //     await credentialLogin(credential);
      //   }
      // }
      if (loginCallback) {
        loginCallback(user);
      }
    } else {
      if (logoutCallback) {
        logoutCallback();
      }
    }
  });

export { onAuthStateChange, anonymousLogin, googleLogin, githubLogin, logout };