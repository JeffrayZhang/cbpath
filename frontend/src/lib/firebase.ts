import axios from "axios"
import { FirebaseError, initializeApp } from "firebase/app"
import {
  GoogleAuthProvider,
  User,
  UserCredential,
  getAuth,
  getRedirectResult,
  reauthenticateWithPopup,
  reauthenticateWithRedirect,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth"
import { useEffect, useState } from "react"
import { API_URL } from "./api"
import MobileDetect from "mobile-detect"
import { useNavigate } from "react-router-dom"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2DquTL9xvXUzlPaFwtO3bC3t1kiCsF2I",
  authDomain: "jeff-app-4533e.firebaseapp.com",
  projectId: "jeff-app-4533e",
  storageBucket: "jeff-app-4533e.appspot.com",
  messagingSenderId: "634267512629",
  appId: "1:634267512629:web:af81dc89cf38497a4de67c",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleAuthProvider = new GoogleAuthProvider()

// allows access to user's displayName
googleAuthProvider.addScope("https://www.googleapis.com/auth/userinfo.profile")

type SupportedAuthProvider = GoogleAuthProvider

export async function deleteUser() {
  const md = new MobileDetect(window.navigator.userAgent)
  if (!auth.currentUser) {
    throw new Error("User is not authenticated")
  }
  let tries = 0
  while (true) {
    try {
      await auth.currentUser.delete()
      window.location.replace("/")
      return
    } catch (error) {
      if (error instanceof FirebaseError && error.code === "auth/requires-recent-login") {
        if (md.mobile()) {
          await reauthenticateWithRedirect(auth.currentUser, googleAuthProvider)
        } else {
          await reauthenticateWithPopup(auth.currentUser, googleAuthProvider)
        }
        tries++
      }
      if (tries > 1) {
        alert("Failed to delete user firebase account. Please disable all popup blockers and try again.")
        console.error("failed to delete user firebase account", error)
        return
      }
    }
  }
}

export async function signOut() {
  await auth.signOut()
  window.location.replace("/")
}

export async function signIn(
  authProvider: SupportedAuthProvider,
  navigate: ((path: string) => void) | null = null
) {
  let credentials: UserCredential
  try {
    credentials = await signInWithPopup(auth, authProvider)
  } catch (error) {
    handleSignInError(error)
    console.error("failed to signInWithPopup", error)
    return
  }
  if (credentials) {
    try {
      await onSignInCredentialsReceived(credentials, navigate)
    } catch (error) {
      console.error("failed to onSignInCredentialsReceived", error)
      alert(
        "An unexpected error occurred while signing you in, please contact support or try again later"
      )
    }
  }
}

function handleSignInError(error: unknown) {
  if (
    error instanceof FirebaseError &&
    (error.code === "auth/cancelled-popup-request" || error.code === "auth/popup-closed-by-user")
  ) {
    return
  }
  alert("Failed to signin with Google Firebase. Please disable all popup blockers and try again.")
}

async function onSignInCredentialsReceived(
  credentials: UserCredential,
  navigate: ((path: string) => void) | null
) {
  try {
    const idToken = await credentials.user.getIdToken()
    const userInfo = await axios.post(`${API_URL}/user`, null, {
      headers: { idToken },
    })
    if (
      userInfo.data.graduationYear === null ||
      userInfo.data.grade === null ||
      userInfo.data.isIB === null
    ) {
      const navigateFunc = navigate ?? window.location.replace // temp workaround
      navigateFunc("/profile")
    } else {
      window.location.reload()
    }
  } catch (error) {
    console.error(error)
    alert("An unexpected error occurred while signing you in, please contact support try again later")
  }
}

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>()
  useEffect(() => {
    auth.onAuthStateChanged(() => {
      setUser(auth.currentUser)
    })
  }, [])
  return user
}

export async function authenticatedApiRequest(
  method: "GET" | "PUT" | "POST" | "PATCH" | "DELETE",
  path: string,
  data?: object,
  headers?: object
) {
  if (!auth.currentUser) {
    throw new Error("User is not authenticated")
  }
  return await axios(`${API_URL}${path}`, {
    method,
    data: data,
    headers: {
      idToken: await auth.currentUser.getIdToken(),
      ...(headers ?? {}),
    },
  })
}
