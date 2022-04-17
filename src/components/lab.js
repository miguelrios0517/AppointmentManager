import React from 'react'
import { Scheduler } from "@aldabil/react-scheduler";
//import TailwindDateSelector from './tailwindDateSelector.js'
//import TailwindFormStyles from './tailwindFormStyles.js'

function Lab(props) {
      const EventCalendar = require('react-event-calendar');

      const events = [
        {
            start: '2015-07-20',
            end: '2015-07-02',
            eventClasses: 'optionalEvent',
            title: 'test event',
            description: 'This is a test description of an event',
        },
        {
            start: '2015-07-19',
            end: '2015-07-25',
            title: 'test event',
            description: 'This is a test description of an event',
            data: 'you can add what ever random data you may want to use later',
        },
    ];

      return (
        <>
          <Scheduler
            view="month"
            events={[
              {
                event_id: 1,
                title: "Event 1",
                start: new Date("2021/5/2 09:30"),
                end: new Date("2021/5/2 10:30"),
              },
              {
                event_id: 2,
                title: "Event 2",
                start: new Date("2021/5/4 10:00"),
                end: new Date("2021/5/4 11:00"),
              },
            ]}
          />
        </>
      );
    }

export default Lab;

/*
<p>Tailwind Date Selector</p>
                <TailwindDateSelector />
           <p>Tailwind Form Styles</p>
                <TailwindFormStyles />
*/



