import React from 'react';
import DashboardRoundedIcon from '@material-ui/icons/DashboardRounded';
import EventNoteRoundedIcon from '@material-ui/icons/EventNoteRounded';
import ScheduleRoundedIcon from '@material-ui/icons/ScheduleRounded';
import PermContactCalendarRoundedIcon from '@material-ui/icons/PermContactCalendarRounded';

const icons = [<DashboardRoundedIcon />, <EventNoteRoundedIcon />, <ScheduleRoundedIcon />, <PermContactCalendarRoundedIcon />]
const pageUrls = ['/dashboard', '/appointments', '/schedule', '/patients']

export const SidebarData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: <DashboardRoundedIcon />,
    cName: 'nav-item'
  },
  {
    title: 'Appointments',
    path: '/appointments',
    icon: <EventNoteRoundedIcon />,
    cName: 'nav-item'
  },
  {
    title: 'Schedule',
    path: '/schedule',
    icon: <ScheduleRoundedIcon />,
    cName: 'nav-item'
  },
  {
    title: 'Patients',
    path: '/patients',
    icon: <PermContactCalendarRoundedIcon />,
    cName: 'nav-item'
  },
];