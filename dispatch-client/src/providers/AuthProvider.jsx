import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase.init";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //register with email and pass
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };
  // login
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };
  // set display name / photo after register
  const updateUserProfile = (profile) => {
    return updateProfile(auth.currentUser, profile);
  };
  // logout
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  useEffect(()=>{
    const unsubscribe= onAuthStateChanged(auth, (currentUser)=>{
        setUser(currentUser);
        setLoading(false)
    });
    return ()=> unsubscribe()
  }, [])

  const authInfo = {user, createUser, signIn, updateUserProfile, logOut, loading}

  return <AuthContext value={authInfo}>{children}</AuthContext>
};

export default AuthProvider;