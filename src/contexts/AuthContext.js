import {createContext, useContext, useEffect, useState } from 'react';
import {auth} from '../utils/init-firebase';
import {
  createUserWithEmailAndPassword ,
  signInWithEmailAndPassword ,
  onAuthStateChanged
} from 'firebase/auth';

const AuthContext = createContext({
  currentUser: null,
  register: () => Promise,
  login: () => Promise,
})

export const useAuth = () => useContext(AuthContext)

export default function AuthContextProvider({children}){
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user) // run when app loads, sets the user
    })
    return() => {
      unsubscribe() // run when app unloads, unsubs
    }
  }, [])

  function register(email, password){
    return createUserWithEmailAndPassword(auth, email, password)
  }

  function login(email, password){
    return signInWithEmailAndPassword(auth, email, password)
  }

  const value = {
    currentUser,
    register,
    login
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
