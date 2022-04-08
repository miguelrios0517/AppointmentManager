import * as React from "react";
import Paper from "@material-ui/core/Paper";
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  MonthView,
  Appointments,
  AppointmentTooltip
} from "@devexpress/dx-react-scheduler-material-ui";
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import { useAuth } from '../contexts/AuthContext'

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    margin: {
        margin: theme.spacing(1),
      },
      extendedIcon: {
        marginRight: theme.spacing(1),
      },
  }));

function Schedule(props) {
    const classes = useStyles();

    const { useDB } = useAuth()
    const appointments = useDB('appointments')

    const monthCur = new Date().getMonth() + 1
    const yearCur = new Date().getFullYear() 
    const [month, setMonth] = React.useState(monthCur)
    const [year, setYear] = React.useState(yearCur)
    const [currentDate, setCurrentDate] = React.useState(year.toString() + "-0" + month.toString() + "-01")


    const setToday = () => {
        
        setMonth(monthCur)
        setYear(yearCur)
        setCurrentDate(yearCur.toString() +  "-0" + monthCur.toString() + "-01")
    }
  
    const setCalendar = (event) => {
        
        if(event.target.name === "month") {
            setMonth(event.target.value)
            setCurrentDate(year.toString() + "-0" + event.target.value.toString() + "-01")
        }
        else if (event.target.name === "year") {
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
                
                const start = appt.date.toDate()
                const endmin = start.getMinutes() + parseInt(duration)
                
                
                const end = new Date(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours(), endmin) 
                

                appts.push({
                    startDate: start,
                    endDate: end,
                    title: appt.patient + ', ' + appt.provider,
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
        <header className = 'header'>Schedule</header>
        <div className = "main"> 
            <div>
                <FormControl className={classes.formControl}>
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
                <FormControl className={classes.formControl}>
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
                <Button size="small" className={classes.margin} onClick={setToday} >
                    Today
                </Button>
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

        
        