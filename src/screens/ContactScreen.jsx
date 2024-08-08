import React, { useState, useRef } from 'react';
import { Box, TextField, Button, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import emailjs from '@emailjs/browser';
import LogoFont from '../components/LogoFont';
import ReCAPTCHA from 'react-google-recaptcha';

function ContactScreen() {
  const theme = useSelector((state) => state.theme);
  const isMobile = useSelector((state) => state.isMobile);

  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    message: false,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const [loading, setLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const recaptchaRef = useRef(); // Create a ref for the reCAPTCHA

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setErrors({
      name: false,
      email: false,
      message: false,
    });
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const newErrors = {
      name: !form.name,
      email: !form.email,
      message: !form.message,
    };
  
    setErrors(newErrors);
  
    if (Object.values(newErrors).some((error) => error) || !captchaValue) {
      return;
    }
  
    setLoading(true);
  
    const emailData = {
      from_name: form.name,
      from_email: form.email,
      message: form.message,
    };
  
    const serviceID = 'service_ajf98mj';
    const templateID = 'template_ye9q5cj'; 
    const publicKey = 'rUIuGs-F_cEPgsR61';
  
    emailjs.send(serviceID, templateID, emailData, publicKey)
      .then((response) => {
        setForm({ name: '', email: '', message: '' });
        setCaptchaValue(null);
        recaptchaRef.current.reset(); // Reset the reCAPTCHA
        setSnackbar({
          open: true,
          message: 'Email sent successfully!',
          severity: 'success',
        });
      })
      .catch((error) => {
        setSnackbar({
          open: true,
          message: 'Error sending email. Please try again later.',
          severity: 'error',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        width: 'calc(100vw - 32px)',
        height: '100vh',
        zIndex: 2,
        margin: isMobile ? '80px 16px 0px 16px' : '80px 16px 16px 16px',
        flexDirection: 'column',
        overflow: 'scroll'
      }}
    >
      <LogoFont
        text="I'd Love To Hear From You!"
        fontColor={theme.black}
        fontWeight={700}
        fontAlign="center"
        fontMargin={isMobile ? "0px 0px 20px 0px" : "20px 0px 30px 0px"}
        fontType="secondary"
        fontSize={!isMobile && '23px'}
      />
      <TextField
        disabled={loading}
        name="name"
        label="Name"
        variant="outlined"
        value={form.name}
        onChange={handleChange}
        error={errors.name}
        helperText={errors.name && 'Name is required'}
        fullWidth
        style={{ marginBottom: '16px' }}
      />
      <TextField
        disabled={loading}
        name="email"
        label="Email"
        variant="outlined"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
        helperText={errors.email && 'Email is required'}
        fullWidth
        style={{ marginBottom: '16px' }}
      />
      <TextField
        disabled={loading}
        name="message"
        label="Message"
        variant="outlined"
        value={form.message}
        onChange={handleChange}
        error={errors.message}
        helperText={errors.message && 'Message is required'}
        multiline
        rows={isMobile ? 7 : 10}
        fullWidth
        style={{ marginBottom: '16px' }}
      />
      
      
        
        <Box style={{display:'flex', width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
          <Box style={{display:'flex', width: '304px', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
            <ReCAPTCHA
              ref={recaptchaRef} // Attach the ref
              sitekey="6Ld1bxIqAAAAAFf1EUkDJy4D9sDSkGnrCAByZqBU"
              onChange={handleCaptchaChange}
              style={{ marginBottom: isMobile ? '16px' : '0' }}
            />
            <Button
              type="submit"
              variant="contained"
              style={{
                backgroundColor: theme.primary,
                color: '#fff',
                margin: isMobile ? '0px auto 16px auto' : '16px 0px',
                minWidth: !isMobile && '304px',
                position: 'relative',
                width: isMobile ? '100%' : 'fit-content',
              }}
            >
              {loading ? (
                <CircularProgress size={24} style={{ color: '#fff' }} />
              ) : (
                <LogoFont
                  text="Send Message"
                  fontColor={theme.white}
                  fontWeight={700}
                  fontAlign="center"
                  fontType="secondary"
                  fontSize={!isMobile && '15px'}
                />
              )}
            </Button>
          </Box>
        </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ContactScreen;
