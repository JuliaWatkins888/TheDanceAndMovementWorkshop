import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import EmailIcon from '@mui/icons-material/Email';
import { Facebook, Instagram } from '@mui/icons-material';  
import PinterestIcon from '@mui/icons-material/Pinterest';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import XIcon from '@mui/icons-material/X';
import RedditIcon from '@mui/icons-material/Reddit';
import { setScrollPosition } from '../actions/actions';

const LinkBar = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);
  const socials = useSelector((state) => state.socials);

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

  const handleActionClick = (action) => {
    if (action === 'email') {
      dispatch(setScrollPosition(300));
    } else {
      window.open(action, '_blank');
    }
  };

  return (
    <SpeedDial
      ariaLabel="SpeedDial example"
      sx={{ position: 'fixed', bottom: 16, right: 16 }}
      color={theme.primary}
      icon={<SpeedDialIcon />}
      FabProps={{
        sx: {
          bgcolor: theme.primary,
          '&:hover': {
            bgcolor: theme.secondary,
          }
        }
      }}
    >
      <SpeedDialAction
        key='Contact'
        icon={<EmailIcon />}
        tooltipTitle='Contact'
        onClick={() => handleActionClick('email')}
      />
      {socials.map((social) => (
        social.Active && (
          <SpeedDialAction
            key={social.Name}
            icon={renderIconByName(social.Name)}
            tooltipTitle={social.Name}
            onClick={() => handleActionClick(social.Link)}
          />
        )
      ))}
    </SpeedDial>
  );
};

export default LinkBar;
