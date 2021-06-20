//Auth context is an intermediate between your firebase program (returns firebase app.auth -
// i.e., access to your backend) and your app.js, the parent component of your frontend. By using
// React.creatContext and passing it the value = {currentUser, signup}, we grant every child nested 
// within the <AuthProvider /> component a reference to the currentUser (whether available or null)
// state and methods such as signup, logout, resetPassword, updateEmail, etc.
//

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
        return auth.createUserWithEmailAndPassword(email, password) //this returns a promise wich we can use inside of Signup.js
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

    
    const value = {
        currentUser, 
        signup,
        login,
        logout,
        resetPassword,
        updateEmail, 
        updatePassword
    }

    return (
        //this creates the context, by passing it array of children 
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
 