import {useState, useEffect} from 'react'
// Firebase App (the core Firebase SDK) is always required and must be listed first
import app from '../firebase'

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
            room === 'patients' ? appts.sort((a,b)=> (b.firstName - a.firstName)) : appts.sort((a,b)=> (b.date - a.date))
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

store = app.firestore()