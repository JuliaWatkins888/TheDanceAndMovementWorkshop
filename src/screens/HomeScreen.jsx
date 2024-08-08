import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Fade, Slide } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setScrollPosition, setActiveScreen } from '../actions/actions';
import { Facebook, Instagram } from '@mui/icons-material';  
import PinterestIcon from '@mui/icons-material/Pinterest';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import XIcon from '@mui/icons-material/X';
import RedditIcon from '@mui/icons-material/Reddit';
import LogoFont from '../components/LogoFont';
import { db } from '../firebaseConfig';

function HomeScreen() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);
  const isMobile = useSelector((state) => state.isMobile);
  const activeScreen = useSelector((state) => state.activeScreen);
  const socials = useSelector((state) => state.socials);
  const pages = useSelector((state) => state.pages);
  const activePagesCount = useSelector((state) => state.activePagesCount);
  const [bodyCopy, setBodyCopy] = useState('');
  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      dispatch(setActiveScreen('Home'));
    }, 700);

    const fetchBodyCopy = async () => {
      try {
        const copySnapshot = await db.collection('BodyCopy').where('Location', '==', 'home').get();
        if (!copySnapshot.empty) {
          const copyData = copySnapshot.docs[0].data();
          setBodyCopy(copyData.Copy);
        } else {
          console.log('No matching documents found.');
        }
      } catch (error) {
        console.error('Error fetching body copy: ', error);
      }
    };

    fetchBodyCopy();
    
    const timer = setTimeout(() => {
      setSlideIn(true);
    }, 750);

    return () => clearTimeout(timer); 
  }, [dispatch]);

  const renderSocialIcons = () => {
    return socials.map((social, index) => (
      social.Active && (
        <Box
          key={index}
          style={{
            display: 'flex',
            flex: 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <IconButton
            style={{
              color: theme.primary,
            }}
            component="a"
            href={social.Link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {renderIconByName(social.Name)}
          </IconButton>
        </Box>
      )
    ));
  };

  const renderIconByName = (iconName) => {
    switch (iconName.toLowerCase()) {
      case 'facebook':
        return <Facebook />;
      case 'instagram':
        return <Instagram />;
      case 'pinterest':
        return <PinterestIcon />;
      case 'linkedin':
        return <LinkedInIcon />;
      case 'youtube':
        return <YouTubeIcon />;
      case 'x':
        return <XIcon />;
      case 'reddit':
        return <RedditIcon />;
      default:
        return null;
    }
  };

  return (
    <Fade in={activeScreen === 'Home'}>
      <Box style={{
        display: 'flex',
        width: isMobile ? '100vw' : 'calc(100vw - 32px)',
        height: '100vh',
        flexDirection: isMobile ? 'column' : 'row',
        zIndex: 2,
        margin: isMobile ? '80px 0px 0px 0px' : '80px 16px 16px 16px',
        overflow: 'scroll'
      }}>
        <Box style={{
          display: 'flex',
          flex: !isMobile && 1,
          height: isMobile ? 'auto' : 'calc(100vh - 96px)',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2
        }}>
          <Box style={{ display: 'flex', flexDirection: 'column', width: '75%' }}>
            <LogoFont
              text="The Dance & Movement Workshop"
              fontColor={theme.black}
              fontWeight={700}
              fontAlign="center" 
              fontMargin="5px 0px 0px 0px"
              fontSize={!isMobile ? '40px' : '21px'}
            />
            <Typography>
              {bodyCopy}
            </Typography>
            {!isMobile && (
              <Box style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '20px', 
                width: !isMobile && '50%'
              }}>
                <Box
                  style={{
                    backgroundColor: theme.primary,
                    borderRadius: '20px',
                    color: theme.white,
                    padding: '5px 20px',
                    display: 'flex',
                    flex: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    dispatch(setScrollPosition(activePagesCount * 100))
                    dispatch(setActiveScreen('Contact'));
                  }}
                >
                  <LogoFont
                    text="Contact" 
                    fontColor={theme.white}
                    fontWeight={700}  
                    fontType="secondary"
                  />
                </Box>
                {renderSocialIcons()}
              </Box>
            )}
          </Box>
        </Box>
        <Box style={{
          display: 'flex',
          flex: 1,
          height: isMobile ? 'calc(50vh - 74px)' : 'calc(100vh - 96px)',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2
        }}>
          <Slide direction="left" in={slideIn}>
            <img src={'https://firebasestorage.googleapis.com/v0/b/dance-and--movement-workshop.appspot.com/o/hero.png?alt=media&token=198aa677-c6bd-4a75-aae9-0d49a6330646'} alt="Girl in a dance pose" style={{ height: isMobile ? '100%' : 'calc(100vh - 96px)' }} />
          </Slide>
        </Box>
      </Box>
    </Fade>
  );
}

export default HomeScreen;
