import { auth } from "@/firebase"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth"


export const register = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password)
}

export const login = (email: string, password: string) => {
  try {
    const signDetails = signInWithEmailAndPassword(auth, email, password)                   
    return signDetails
  } catch (error) {
    console.log(error)
  }

}

export const logout = () => {
  return signOut(auth)
}
