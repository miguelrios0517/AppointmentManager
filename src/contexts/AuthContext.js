import React, { useContext, useState, useEffect } from 'react'
import { auth } from '../firebase'

//Auth context is an intermediate between your firebase program (returns firebase app.auth -
// i.e., access to your backend) and your app.js, the parent component of your frontend. By using
// React.creatContext and passing it the value = {currentUser, signup}, we grant every child nested 
// within the <AuthProvider /> component a reference to the currentUser state and the signup() method
//
 
const AuthContext = React.createContext()

//this is a helper function that allows to use the context (i.e., gives us access to the context )
export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider(children) {
    const [currentUser, setCurrentUser] = useState()

    //helper function that calls the creatUserWith... method in the auth api
    function signup(email, password) {
        auth.createUserWithEmailAndPassword(email, password) //this returns a promise wich we can use inside of Signup.js
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChnaged(user => {
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
            {children}
        </AuthContext.Provider>
    )
}