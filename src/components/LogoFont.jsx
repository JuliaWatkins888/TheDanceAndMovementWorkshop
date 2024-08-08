import React from 'react';
import { Typography, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import './components.css';

const LogoFont = (props) => {
  const theme = useSelector((state) => state.theme);

  const textSegments = props.text.split('&');

  return (
    <Box style={{margin: props.fontMargin,}}>
      {textSegments.map((segment, index) => (
        <React.Fragment key={index}>
          <Typography
            component="span"
            sx={{
              fontFamily: props.fontType == 'secondary' ? 'LogoFont, sans-serif' : 'DisplayFont, sans-serif',
              fontSize: props.fontSize,
              fontWeight: props.fontWeight,
              letterSpacing: '3px',
              textAlign: props.fontAlign,
              transition: 'color 0.3s ease',
              zIndex: 9,
              color: props.fontColor,
            }}
          >
            {segment}
          </Typography>
          {index < textSegments.length - 1 && (
            <Typography
              component="span"
              sx={{
                fontFamily: props.fontType == 'secondary' ? 'LogoFont, sans-serif' : 'DisplayFont, sans-serif',
                fontSize: props.fontSize,
                fontWeight: props.fontWeight,
                margin: props.fontMargin,
                letterSpacing: '3px',
                textAlign: props.fontAlign,
                transition: 'color 0.3s ease',
                zIndex: 9,
                color: theme.primary,
              }}
            >
              &
            </Typography>
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default LogoFont;
