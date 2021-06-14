import React, { useContext, useState, useEffect } from 'react'
import { auth } from '../firebase'

const AuthContext = React.createContext()

//this is a helper function that allows to use the context (i.e., gives us access to the context )
export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    function signup(email, password) {
        auth.createUserWithEmailAndPassword(email, password) //this returns a promise wich we can use inside of Signup.js
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setLoading(false)
            setCurrentUser(user)
        })
        return unsubscribe
    }, [])

    
    const value = {
        currentUser, 
        signup
    }

    return (
        //this creates the context, by passing it array of children 
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}