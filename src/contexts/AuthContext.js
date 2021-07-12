//Auth context is an intermediate between your firebase program (returns firebase app.auth -
// i.e., access to your backend) and your app.js, the parent component of your frontend. By using
// React.creatContext and passing it the value = {currentUser, signup}, we grant every child nested 
// within the <AuthProvider /> component a reference to the currentUser (whether available or null)
// state and methods such as signup, logout, resetPassword, updateEmail, etc.
//

import React, { useContext, useState, useEffect } from "react"
import app, { auth } from "../firebase"

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";


const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

// Returns <AuthProvider >{children}</AuthProvider>
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)
  const[users, setUsers] = useState([])

  //database users
  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password)
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
  }

  function logout() {
    return auth.signOut()
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email)
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email)
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  //database collections 
  let store
  const [coll, setColl] = useState('appointments')

  // room is the dataset (i.e., appointments, patients, etc.)
  function useDB(collect) {
    setColl(collect)
    const [appointments, setAppointments] = useState([])

    function add(a) {
        setAppointments(current => {
            const appts = [a, ...current]
            appts.sort((a,b)=> (b.date - a.date))
            return appts
        })
    }

    function remove(id) {
        setAppointments(current=> current.filter(m=> m.id!==id))
    }

    useEffect(() => {
        const collection = collect? store.collection(collect) : 
        store.collection(coll)
        
        collection.onSnapshot(snap=> snap.docChanges().forEach(c=> {
            console.log(snap.docChanges())
            const {doc, type} = c
            if (type==='added') add({...doc.data(),id:doc.id})
            if (type==='removed') remove(doc.id)
        }))
    }, [])

    // filter the appointments for the
    const filtered = appointments.filter(appt => appt.uid == currentUser.uid)
    return filtered
}

const db = {}
db.send = function(apt, collect) {
    apt.uid = currentUser.uid
    return store.collection(collect).add(apt)
}
db.delete = function(id, collect) {
    setColl(collect)
    return store.collection(collect).doc(id).delete()
}

//database methods available to components
const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword, 
    db, 
    useDB
  }

  store = app.firestore()

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
 