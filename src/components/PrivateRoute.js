/*
This program returns a PrivateRoute React component, which checks whether there
is a current user logged in. If so, the component is rendered, else redirect to 
login page. The backend that stores the user profiles is set up with Firebase.

Code from WebDevSimplified - React-Firebase-Auth
Repo: https://github.com/WebDevSimplified/React-Firebase-Auth
*/


import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext' 

export default function PrivateRoute({ component: Component, ...rest}) {
    
    //grab the current user 
    const { currentUser } = useAuth()

    return (
        //Route is created that renders the <Component> inside <PrivateRoute> if the currentUser is active
        // if not active, redirects to the login page
        <Route 
            {...rest}
            render={props => { 
                return currentUser ? <Component {...props} /> : <Redirect to="/login" />
            }}
        ></Route>
    )
} 

//technique: uses a function with a conditional operator which renders a component if the current user 
//  is logged in, else renders the logi page. 
// another example... <Route path="/home" render={() => <div>Home</div>} />