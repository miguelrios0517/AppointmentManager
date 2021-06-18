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
        //technique: uses a function with a conditional operator which renders a component if the current user 
        //  is logged in, else renders the login page. 
        // another example... <Route path="/home" render={() => <div>Home</div>} />
} 