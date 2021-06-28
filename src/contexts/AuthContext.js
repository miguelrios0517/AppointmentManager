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

let store
const coll = 'appointments'

export function useAuth() {
  return useContext(AuthContext)
}

// Returns <AuthProvider >{children}</AuthProvider>
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

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
  function useDB(room) {
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
        const collection = room ? 
            store.collection(coll).where('room','==',room) :
            store.collection(coll)
        
        collection.onSnapshot(snap=> snap.docChanges().forEach(c=> {
            const {doc, type} = c
            if (type==='added') add({...doc.data(),id:doc.id})
            if (type==='removed') remove(doc.id)
        }))
    }, [room])
    return appointments
}

const db = {}
db.send = function(apt) {
    return store.collection(coll).add(apt)
}
db.delete = function(id) {
    return store.collection(coll).doc(id).delete()
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
 