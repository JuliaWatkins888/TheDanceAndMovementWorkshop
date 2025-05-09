import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import classnames from 'classnames';

const calendarId = 'thedanceandmovementworkshop@gmail.com';
const apiKey = 'AIzaSyDLzn1XiF2rromBI1g36iplSrAunHdHvi8';

const localizer = momentLocalizer(moment);

function CalendarScreen() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);
  const isMobile = useSelector((state) => state.isMobile);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const pastDate = new Date();
        pastDate.setFullYear(pastDate.getFullYear() - 1); 
        const timeMin = pastDate.toISOString();
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 1); 
        const timeMax = futureDate.toISOString();
    
        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&singleEvents=true&orderBy=startTime&timeMin=${timeMin}&timeMax=${timeMax}`
        );
        const data = await response.json();
        const formattedEvents = data.items.map((event) => ({
          id: event.id,
          title: event.summary,
          start: new Date(event.start.dateTime || event.start.date),
          end: new Date(event.end.dateTime || event.end.date),
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    

    fetchEvents();
  }, []);
  
  useEffect(() => {
    document.documentElement.style.setProperty('--event-bg', theme.primary);
  }, [theme.primary]);
  
  const eventPropGetter = (event) => ({
    className: classnames('custom-event-bg'),
    style: {
      backgroundColor: theme.primary,
    },
  });
  
  return (
    <Box
      style={{
        display: 'flex',
        width: isMobile ? '100vw' : 'calc(100vw - 32px)',
        height: '100vh',
        zIndex: 2,
        margin: isMobile ? '80px 0px 0px 0px' : '80px 16px 16px 16px',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={eventPropGetter}
        style={{ height: 'calc(100vh - 96px)', width: '100%' }}
      />
    </Box>
  );
}

export default CalendarScreen;
