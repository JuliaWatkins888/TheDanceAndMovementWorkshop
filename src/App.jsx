import React from 'react';
import { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { Box, Fade } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setThemeColors, setSocials, setPages, setActivePagesCount } from './actions/actions';
import Navbar from './components/Navbar';
import HomeScreen from './screens/HomeScreen';
import GalleryScreen from './screens/GalleryScreen';
import EventsScreen from './screens/EventsScreen';
import CalendarScreen from './screens/CalendarScreen';
import ContactScreen from './screens/ContactScreen';
import LinkBar from './components/LinkBar';
import BlogScreen from './screens/BlogScreen';
import DashboardScreen from './screens/DashboardScreen'; 
import { HashRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);
  const isMobile = useSelector((state) => state.isMobile);
  const scrollPosition = useSelector((state) => state.scrollPosition);
  const socials = useSelector((state) => state.socials);
  const activePagesCount = useSelector((state) => state.activePagesCount);
  const pages = useSelector((state) => state.pages);

  useEffect(() => {
    const fetchThemeColors = async () => {
      try {
        const colorsSnapshot = await db.collection('Colors').get();
        const colors = colorsSnapshot.docs.reduce((acc, doc) => {
          const data = doc.data();
          acc[data.Color] = data.Hex;
          return acc;
        }, {});
        dispatch(setThemeColors(colors));
      } catch (error) {
        console.error('Error fetching theme colors: ', error);
      }
    };

    const fetchSocials = async () => {
      try {
        const socialsSnapshot = await db.collection('Socials').get();
        const socialsData = socialsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch(setSocials(socialsData));
      } catch (error) {
        console.error('Error fetching socials: ', error);
      }
    };  

    const fetchPages = async () => {
      try {
        const pagesSnapshot = await getDocs(collection(db, 'Pages'));
        const pageData = [];
        let activeCount = 0;
        pagesSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.Active) activeCount++;
          pageData.push({ id: doc.id, ...data });
        });
        dispatch(setPages(pageData));
        dispatch(setActivePagesCount(activeCount));
      } catch (error) {
        console.error('Error fetching pages: ', error);
      }
    };
  

    fetchThemeColors();
    fetchSocials();
    fetchPages();
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Box style={{ width: '100vw', backgroundColor: theme.white}}>
            <Navbar />
            <Box
              style={{
                display: 'flex',
                flexDirection: 'column',
                transition: 'top 1s ease-in-out',
                height: `calc(100vh * ${activePagesCount + 1})`,
                width: '100vw',
                position: 'absolute',
                top: `-${scrollPosition}vh`,
                left: 0,
                right: 0,
                zIndex: 1, 
                backgroundColor: theme.white
              }}
            >
              <HomeScreen />
              {pages.map(page => {
                const { Name, Active } = page;
                switch (Name) {
                  case 'Gallery':
                    return Active ? <GalleryScreen key={Name} /> : null;
                  case 'Events':
                    return Active ? <EventsScreen key={Name} /> : null;
                  case 'Calendar':
                    return Active ? <CalendarScreen key={Name} /> : null;
                  case 'Blog':
                    return Active ? <BlogScreen key={Name} /> : null;
                  case 'Contact':
                    return Active ? <ContactScreen key={Name} /> : null;
                  default:
                    return null;
                }
              })}
              <Fade in={scrollPosition !== 0 && !isMobile}>
                <Box>
                  <LinkBar />
                </Box>
              </Fade>
            </Box>
          </Box>
        } />
        <Route path="/Dashboard" element={<DashboardScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
