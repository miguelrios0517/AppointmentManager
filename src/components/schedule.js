import * as React from "react";

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { useAuth } from '../contexts/AuthContext'
import Paper from "@material-ui/core/Paper";
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  MonthView,
  Appointments,
  AppointmentTooltip
} from "@devexpress/dx-react-scheduler-material-ui";


function Schedule(props) {

    const { useDB } = useAuth()
    const appointments = useDB('appointments')

    const monthCur = new Date().getMonth() + 1
    const yearCur = new Date().getFullYear() 
    const [month, setMonth] = React.useState(monthCur)
    const [year, setYear] = React.useState(yearCur)
    const [currentDate, setCurrentDate] = React.useState(year.toString() + "-0" + month.toString() + "-01")

    const [age, setAge] = React.useState('');
    
    //helper functions
    const setToday = () => {
        setMonth(monthCur)
        setYear(yearCur)
        setCurrentDate(yearCur.toString() +  "-0" + monthCur.toString() + "-01")
        console.log('setting date to today')
    }
  
    const setCalendar = (event) => {
        ('setting calendar values')
        if(event.target.name === "month") {
            console.log('changing month value')
            setMonth(event.target.value)
            setCurrentDate(year.toString() + "-0" + event.target.value.toString() + "-01")
        }
        else if (event.target.name === "year") {
            console.log('changing year value')
            setYear(event.target.value)
            setCurrentDate(event.target.value.toString() +  "-0" + month.toString() + "-01")
        }

    };


    function getAppointments() {
        const appts = []
        let i = 0
        for (const key in appointments){
            const appt = appointments[key]
            const duration = (appt.duration && appt.duration > 0) ? appt.duration:1
            if (appt.date) {
                const start = new Date(appt.date.replace(/-/g, '\/') + ' ' + appt.time)
                const endmin = start.getMinutes() + parseInt(duration)
                
                
                const end = new Date(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours(), endmin) 
                
                console.log('START OF APPOINTMENT', start, 'END OF APPOINTMENT', end, 'DURATION', appt.duration, endmin)
                appts.push({
                    startDate: start,
                    endDate: end,
                    title: appt.patient + (appt.facility!= ''?(', ' + appt.facility):'') + (appt.provider.name != ''? (' - ' + appt.provider.name + (appt.provider.title != ''?(' (' + appt.provider.title + ')'):appt.provider.title)): ''),
                    id: appt.id,
                    location: appt.location
                })
                
                
            }
            i=i+1
        }
        
        return appts;
    }


    return(
        <div className = "dashboard"> 
        <header className = 'pb-3'>Schedule</header>
        <div className = "main"> 
            <div>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-label">Month</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={month}
                    name="month"
                    onChange={setCalendar}
                    >
                        <MenuItem value={1}>January</MenuItem>
                        <MenuItem value={2}>February</MenuItem>
                        <MenuItem value={3}>March</MenuItem>
                        <MenuItem value={4}>April</MenuItem>
                        <MenuItem value={5}>May</MenuItem>
                        <MenuItem value={6}>June</MenuItem>
                        <MenuItem value={7}>July</MenuItem>
                        <MenuItem value={8}>August</MenuItem>
                        <MenuItem value={9}>September</MenuItem>
                        <MenuItem value={10}>October</MenuItem>
                        <MenuItem value={11}>November</MenuItem>
                        <MenuItem value={12}>December</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-label">Year</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={year}
                    name="year"
                    onChange={setCalendar}
                    >
                        <MenuItem value={2022}>2022</MenuItem>
                        <MenuItem value={2021}>2021</MenuItem>
                        <MenuItem value={2020}>2020</MenuItem>
                        <MenuItem value={2019}>2019</MenuItem>
                        <MenuItem value={2018}>2018</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="outlined" sx={{ m: 1}} onClick={setToday}>Today</Button>
                <Paper>
                    <Scheduler data={getAppointments()}>
                    <ViewState currentDate = {currentDate} />
                    <MonthView />
                    <Appointments />
                    <AppointmentTooltip />
                    </Scheduler>
                </Paper>
            </div>
        </div>
        </div>
    ); 
}

export default Schedule;

        
        