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
import { doc, getDoc } from "firebase/firestore";
import { CollectionsOutlined } from "@material-ui/icons";



const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

// Returns <AuthProvider >{children}</AuthProvider>
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])

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

  useEffect(() => {
    getDocument();
  }, [])

  const testFunction = (pid) => {
    console.log('TEST FUNCTION WORKS', pid)
  }

  const getDocument=async(id, collect)=>{
    /*
    if (id && collect) {
      const docRef=store.collection(collect).doc(id);
      const doc=await docRef.get();
      if(doc.exists) {
        console.log('doc.data',doc.data())
        return doc.data();
      }
    }
    */

    if (id && collect) {
      store.collection(collect).doc(id).get()
        .then(snapshot => {
          //console.log("SNAPSHOT DATA", snapshot.data())
          return snapshot.data()})
    }
  

  }

  //database collections 
  let store;
  const coll = 'appointments'

  // room is the dataset (i.e., appointments, patients, etc.)
  function useDB(collect, item) {
    const [appointments, setAppointments] = useState([])
    //const [item, setItem] = useState([])

    function add(a) {
      setAppointments(current => {
        const appts = [a, ...current]
        appts.sort((a, b) => (b.date - a.date))
        return appts
      })
    }

    function remove(id) {
      setAppointments(current => current.filter(m => m.id !== id))
    }

    useEffect(() => {
      const collection = collect ? store.collection(collect) :
        store.collection(coll)

      collection.onSnapshot(snap => snap.docChanges().forEach(c => {
        const { doc, type } = c
        //console.log(doc.data().uid)
        if (doc.data().uid === currentUser.uid) {
          //item? console.log('item available'): console.log('item not available')
          if (item) {
            if (doc.id === item) {
              //console.log('getting item', doc.data())
              if (type === 'added') add({ ...doc.data(), id: doc.id })
              if (type === 'removed') remove(doc.id)
            }
          } else {
            //console.log('getting collection', doc.data())
            if (type === 'added') add({ ...doc.data(), id: doc.id })
            if (type === 'removed') remove(doc.id)
          }

        }
      }))
    }, [])

    // filter the appointments for the
    //var appts_user = appointments.filter(appt => appt.uid == currentUser.uid)
    //console.log('AUTH CONTEXT', appointments)
    //const appts_user = item? appointments.filter(appt => appt.id == item)[0]: appointments
    return appointments
  }

  const db = {}

  db.send = function (data, collect) {
    data.uid = currentUser.uid
    return store.collection(collect).add(data)
  }

  db.delete = function (id, collect) {
    return store.collection(collect).doc(id).delete()
  }

  db.edit = function (id, data, collect) {
    return store.collection(collect).doc(id).set(data, { merge: true });
  }

  db.get = async function (id, collect) {
    const collectRef = store.collection(collect)
    collectRef.where('id', '==', id).get().then(snapshot => {
      if (snapshot.empty) {
        //console.log('No matching documents.');
        return;
      }
      snapshot.forEach(doc => {
        //console.log(doc.id, '=>', doc.data());
      });
    }).catch(error => console.log('ERROR', error))

    /*
    try{
      const snapshot = await collectRef.where('id', '==', id).get();
      if (snapshot.empty) {
        console.log('No matching documents.');
        return;
      } 
      snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
      });
    } catch (error) {
      console.log(error)
    }*/
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
    useDB, 
    getDocument,
    testFunction, 
  }

  store = app.firestore()

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}