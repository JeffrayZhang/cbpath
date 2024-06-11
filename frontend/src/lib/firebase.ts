import axios from "axios";
import { FirebaseError, initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  User,
  getAuth,
  signInWithPopup,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { API_URL } from "./api";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2DquTL9xvXUzlPaFwtO3bC3t1kiCsF2I",
  authDomain: "jeff-app-4533e.firebaseapp.com",
  projectId: "jeff-app-4533e",
  storageBucket: "jeff-app-4533e.appspot.com",
  messagingSenderId: "634267512629",
  appId: "1:634267512629:web:af81dc89cf38497a4de67c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

// allows access to user's displayName
googleAuthProvider.addScope("https://www.googleapis.com/auth/userinfo.profile");

type SupportedAuthProvider = GoogleAuthProvider;

export async function signIn(
  authProvider: SupportedAuthProvider,
  navigate: ((path: string) => void) | null = null,
) {
  let credentials;
  try {
    credentials = await signInWithPopup(auth, authProvider);
  } catch (error) {
    if (
      error instanceof FirebaseError &&
      (error.code === "auth/cancelled-popup-request" ||
        error.code === "auth/popup-closed-by-user")
    ) {
      return;
    }
    alert(
      "Failed to signin with Google Firebase. Please disable all popup blockers and try again.",
    );
    console.error("failed to signInWithPopup", error);
    return;
  }
  const idToken = await credentials.user.getIdToken();
  const userInfo = await axios.post(`${API_URL}/user`, null, {
    headers: { idToken },
  });
  if (userInfo.data.needsMoreInfo) {
    const navigateFunc = navigate ?? window.location.replace; // temp workaround
    navigateFunc("/profile");
  } else {
    window.location.reload();
  }
}

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>();
  useEffect(() => {
    auth.onAuthStateChanged(() => {
      setUser(auth.currentUser);
    });
  }, []);
  return user;
}

export async function authenticatedApiRequest(
  method: "GET" | "PUT" | "POST" | "PATCH" | "DELETE",
  path: string,
  data?: object,
  headers?: object,
) {
  if (!auth.currentUser) {
    throw new Error("User is not authenticated");
  }
  return await axios(`${API_URL}${path}`, {
    method,
    data: data,
    headers: {
      idToken: await auth.currentUser.getIdToken(),
      ...(headers ?? {}),
    },
  });
}
