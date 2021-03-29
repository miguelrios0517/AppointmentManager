import {useState, useEffect} from 'react'
// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

let store
const coll = 'appointments'

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

export { db, useDB }

const firebaseConfig = {
    apiKey: "AIzaSyAsbi24FcfKqYbM1-aE2GXT96gJKRc5dj8",
    authDomain: "appointment-management-s-df6d3.firebaseapp.com",
    projectId: "appointment-management-s-df6d3",
    storageBucket: "appointment-management-s-df6d3.appspot.com",
    messagingSenderId: "674416326615",
    appId: "1:674416326615:web:fcc3b834d4d20e9d693d92",
    measurementId: "G-EY9PW9ZX08"
};

firebase.initializeApp(firebaseConfig);
store = firebase.firestore()
