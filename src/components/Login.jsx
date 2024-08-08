import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoggedIn, setActiveUser } from '../actions/actions'; 
import { db } from '../firebaseConfig';
import sha256 from 'js-sha256';
import Cookies from 'js-cookie';
import { Box, Button, Container, TextField, Typography, Alert } from '@mui/material';
import LogoFont from './LogoFont';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);
  const isMobile = useSelector((state) => state.isMobile);

  useEffect(() => {
    // Check if the user is already logged in via cookie
    const loggedInUser = Cookies.get('user');
    if (loggedInUser) {
      dispatch(setLoggedIn(true));
      dispatch(setActiveUser(loggedInUser));
    }
  }, [dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const hashedPassword = sha256(password);

    try {
      const userSnapshot = await db.collection('Users').where('email', '==', email).get();
      if (userSnapshot.empty) {
        setError('Invalid email or password');
        return;
      }

      const userData = userSnapshot.docs[0].data();
      if (userData.password === hashedPassword) {
        dispatch(setLoggedIn(true));
        dispatch(setActiveUser(userData.Name));
        
        Cookies.set('user', userData.Name, { expires: 1 });
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      console.error('Error logging in: ', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <LogoFont
            text="The Dance & Movement Workshop"
            fontColor={theme.black}
            fontWeight={700}
            fontAlign="center" 
            fontMargin="5px 0px 0px 0px"
            fontSize='23px'
            fontType="secondary"
        />
      <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setError('')
          }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setError('')
          }}
        />
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ 
                mt: 3, 
                mb: 2, 
                backgroundColor: theme.primary,
                '&:hover': {
                backgroundColor: theme.secondary,
                },
            }}
            >
            Login
        </Button>
      </Box>
    </Container>
  );
}

export default Login;
