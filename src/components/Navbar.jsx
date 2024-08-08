import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setOpenNav, setScrollPosition, setNavEnter, setActiveScreen } from '../actions/actions';
import { AppBar, Toolbar, Box, IconButton, Button, Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LogoFont from './LogoFont';
import Slide from '@mui/material/Slide';
import Fade from '@mui/material/Fade';
import Grow from '@mui/material/Grow';
import { Facebook, Instagram } from '@mui/icons-material';
import PinterestIcon from '@mui/icons-material/Pinterest';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import XIcon from '@mui/icons-material/X';
import RedditIcon from '@mui/icons-material/Reddit';
import Logo from '../assets/images/logo';

const Navbar = (props) => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);
  const isMobile = useSelector((state) => state.isMobile);
  const drawerOpen = useSelector((state) => state.openNav);
  const scrollPosition = useSelector((state) => state.scrollPosition);
  const navEnter = useSelector((state) => state.navEnter);
  const activeScreen = useSelector((state) => state.activeScreen);
  const socials = useSelector((state) => state.socials);
  const pages = useSelector((state) => state.pages);
  const activeUser = useSelector((state) => state.activeUser);
  const activePagesCount = useSelector((state) => state.activePagesCount);
  const [hoveredBox, setHoveredBox] = useState(null);
  const [greeting, setGreeting] = useState(null);
  const d = new Date();
  let hour = d.getHours();

  useEffect(() => {
    setTimeout(() => {
      dispatch(setNavEnter(true));
    }, 400);
    if (hour >= 0 && hour < 12) {
        setGreeting('Good Morning ');
    } else if (hour >= 12 && hour < 17) {
        setGreeting('Good Afternoon ');
    } else {
        setGreeting('Good Evening ');
    }
  }, [dispatch]);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    dispatch(setOpenNav(open));
  };

  const handleNavigation = (text, index) => {
    switch (text) {
      case 'Home':
        toggleDrawer(false);
        dispatch(setActiveScreen('Home'));
        break;
      case 'Events':
        toggleDrawer(false);
        dispatch(setActiveScreen('Events'));
        break;
      case 'Calendar':
        toggleDrawer(false);
        dispatch(setActiveScreen('Calendar'));
        break;
      case 'Gallery':
        toggleDrawer(false);
        dispatch(setActiveScreen('Gallery'));
        break;
      case 'Blog':
        toggleDrawer(false);
        dispatch(setActiveScreen('Blog'));
        break;
      case 'Contact':
        toggleDrawer(false);
        dispatch(setActiveScreen('Contact'));
        break;
      default:
        break;
    }
    dispatch(setScrollPosition(index * 100));
  };

  const handleMouseEnter = (box) => {
    setHoveredBox(box);
  };

  const handleMouseLeave = () => {
    setHoveredBox(null);
  };

  const renderSocialIcons = () => {
    return socials.map((social, index) => (
      social.Active && (
        <Box
          key={index}
          style={{
            display: 'flex',
            flex: 2,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
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

  const list = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem button key={'Home'} onClick={() => handleNavigation('Home', 0)}>
            <ListItemText primary={'Home'} />
        </ListItem>
        {pages.filter(page => page.Active).map((page, index) => (
          page.Name !== 'Contact' && (
            <ListItem button key={page.Name} onClick={() => handleNavigation(page.Name, index + 1)}>
              <ListItemText primary={page.Name} />
            </ListItem>
          )
        ))}
        <Divider />
        <ListItem button onClick={() => handleNavigation('Contact', activePagesCount)}>
          <Button
            style={{
              backgroundColor: theme.primary,
              borderRadius: '20px',
              color: theme.white,
              width: '100%',
            }}
          >
            Contact
          </Button>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" style={{ backgroundColor: theme.white, zIndex: 3 }}>
      <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Slide direction="right" in={navEnter}>
            <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Logo />
              <Fade in={scrollPosition !== 0}>
                <Box>
                  {isMobile ? (
                    <Box style={{ display: 'flex', flexDirection: 'column' }}>
                      <LogoFont
                        text="The Dance & Movement Workshop"
                        fontColor={theme.black}
                        fontWeight={700}
                        fontAlign="center"
                        fontMargin="5px 0px 0px 0px"
                        fontSize="20px"
                        fontType="secondary"
                      />
                    </Box>
                  ) : (
                    <LogoFont
                      text="The Dance & Movement Workshop"
                      fontColor={theme.black}
                      fontWeight={700}
                      fontAlign="center"
                      fontMargin="5px 0px 0px 0px"
                      fontSize={!isMobile && '23px'}
                      fontType="secondary"
                    />
                  )}
                </Box>
              </Fade>
            </Box>
          </Slide>
        </Box>
        {isMobile && props.mode !== 'dash' ? (
          <Box>
            <Slide direction="left" in={navEnter}>
              <IconButton edge="start" sx={{ color: theme.primary }} aria-label="menu" onClick={toggleDrawer(true)}>
                <MenuIcon style={{ paddingTop: '5px' }} />
              </IconButton>
            </Slide>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
              sx={{
                width: isMobile && '100vw'
              }}
            >
              <IconButton sx={{ color: theme.primary, position: 'absolute', top: 5, right: 5 }} aria-label="close" onClick={toggleDrawer(false)}>
                <CloseIcon />
              </IconButton>
              {list}
              <Box style={{ display: 'flex', flexDirection: 'row' }}>
                {renderSocialIcons()}
              </Box>
            </Drawer>
          </Box>
        ) : (
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            {props.mode !== "dash" ? (
                <>
                    <Grow in={navEnter} {...(navEnter ? { timeout: 800 } : {})}>
                        <Box
                            onClick={() => handleNavigation('Home', 0)}
                            onMouseEnter={() => handleMouseEnter('Home')}
                            onMouseLeave={handleMouseLeave}
                            style={{
                                cursor: 'pointer',
                                borderBottom: hoveredBox === 'Home' && activeScreen !== 'Home' ? `2px solid ${theme.secondary}` : '2px solid transparent',
                                transition: 'all 0.5s ease',
                                margin: '0px 0px 0px 15px',
                            }}
                        >
                            <LogoFont
                                text="Home"
                                fontColor={activeScreen === 'Home' ? theme.primary : theme.black}
                                fontWeight={500}
                                fontMargin="5px 0px 0px 0px"
                                fontType="secondary"
                            />
                        </Box>
                    </Grow>
                    {pages.filter(page => page.Active).map((page, index) => (
                        <Grow in={navEnter} {...(navEnter ? { timeout: 800 + (index * 200) } : {})} key={page.Name}>
                            <Box
                                onClick={() => handleNavigation(page.Name, index + 1)}
                                onMouseEnter={() => handleMouseEnter(page.Name)}
                                onMouseLeave={handleMouseLeave}
                                style={{
                                    cursor: 'pointer',
                                    margin: '0px 0px 0px 15px',
                                    borderBottom: hoveredBox === page.Name && activeScreen !== page.Name ? `2px solid ${theme.secondary}` : '2px solid transparent',
                                    transition: 'all 0.5s ease',
                                }}
                            >
                                <LogoFont
                                    text={page.Name}
                                    fontColor={activeScreen === page.Name ? theme.primary : theme.black}
                                    fontWeight={500}
                                    fontMargin="5px 0px 0px 0px"
                                    fontType="secondary"
                                />
                            </Box>
                        </Grow>
                    ))}
                </>
            ) : (
                <Fade in={navEnter}>
                    <Box>
                        <LogoFont
                            text={greeting + activeUser}
                            fontColor={theme.black}
                            fontWeight={700}
                            fontAlign="center" 
                            fontMargin="5px 0px 0px 0px"
                            fontSize='15px'
                            fontType="secondary"
                        />
                    </Box>
                </Fade>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
