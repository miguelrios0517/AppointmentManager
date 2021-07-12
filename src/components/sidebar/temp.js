import React from 'react'

function temp() {
    return (
        //main application
        <div className = "screen">
            <Switch>
                <Route exact path = {["/", "/dashboard"]}>
                    <Dashboard appointments={appointments}/>
                </Route>
                <Route exact path = "/appointments">
                    <Appointments appointments={appointments} db={db}/>
                </Route>
                <Route path = "/appointments/:id">
                    <Appointment />
                </Route>
                <Route path = "/schedule">
                    <Schedule appointments={appointments}/>
                </Route>
                <Route path = "/patients">
                    <Patients />
                </Route>
            </Switch>      
        </div>
    )
}

export default temp
