import React from 'react';
import { useSelector } from 'react-redux';
import Login from '../components/Login';
import Navbar from '../components/Navbar';
import { Box } from '@mui/material';
import LogoFont from '../components/LogoFont';
import GeneralSettings from '../components/GeneralSettings';
import BlogSettings from '../components/BlogSettings';
import EventsSettings from '../components/EventsSettings'
import GallerySettings from '../components/GallerySettings';

function DashboardScreen() {
    const isLoggedIn = useSelector((state) => state.isLoggedIn);
    const theme = useSelector((state) => state.theme);
    const isMobile = useSelector((state) => state.isMobile);
    const pages = useSelector((state) => state.pages);

    const isGalleryActive = pages.find(page => page.Name === 'Gallery')?.Active;
    const isBlogActive = pages.find(page => page.Name === 'Blog')?.Active;
    const isEventsActive = pages.find(page => page.Name === 'Events')?.Active;

    if (!isLoggedIn) {
        return <Login />;
    }

    return (
        <Box style={{ width: '100vw', overflow: 'scroll' }}>
            <Navbar mode="dash" />
            <Box style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', width: 'calc(100vw - 32px)', height: isMobile ? 'calc(100vh - 96px)' : 'calc(100vh - 96px)', margin: '16px', overflow: 'scroll' }}>
                <Box style={{ display: 'flex', flexDirection: 'column', height: isMobile ? 'auto' : 'calc(100vh - 96px)', flex: 1 }}>
                    <GeneralSettings />
                </Box>
                <Box style={{ display: 'flex', flexDirection: 'column', height: isMobile ? 'auto' : 'calc(100vh - 96px)', flex: 2 }}>
                    {isGalleryActive && <GallerySettings />}
                    {isBlogActive && <BlogSettings />}
                    {isEventsActive && <EventsSettings />}
                </Box>
            </Box>
        </Box>
    );
}

export default DashboardScreen;
