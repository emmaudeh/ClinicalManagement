import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Button, Box, Typography, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import logo from './IMG/image.png'
const theme = createTheme();
const Registration = () => {
    const [values, setValues] = useState({ id: '' });
    const [registered, setRegistered] = useState(false);
    const [errors, setErrors] = useState({ id: '' });

    const handleInput = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Simulate successful registration
            setRegistered(true);
        } catch (error) {
            setErrors({ id: 'Registration failed' });
        }
    };

    return (
      <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
          sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              background: 'linear-gradient(to right, #6a11cb, #2575fc)', // Gradient background
          }}
      >
          <Box
              sx={{
                  width: 400,
                  padding: 4,
                  borderRadius: 2,
                  boxShadow: 5,
                  backgroundColor: 'white',
                  textAlign: 'center',
              }}
          >
          <Typography component="h1" variant="h5" sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src={logo} alt="Logo" style={{ width: '100px', marginBottom: '10px' }} />
          Student Registration
      </Typography>
              {!registered ? (
                  <Box component="form" onSubmit={handleRegister} noValidate>
                      <Box mb={2}>
                          <TextField
                              fullWidth
                              label="Enter Student ID"
                              name="id"
                              variant="outlined"
                              value={values.id}
                              onChange={handleInput}
                              error={!!errors.id}
                              helperText={errors.id}
                          />
                      </Box>
                      <Box mb={2}>
                          <Button variant="contained" color="primary" type="submit" fullWidth>
                              Sign Up
                          </Button>
                      </Box>
                      <Typography variant="body2" textAlign="center">
                          Already registered? <Link to="/login">Login here</Link>
                      </Typography>
                  </Box>
              ) : (
                  <Box textAlign="center">
                      <Typography variant="h6" component="p">
                          Registration successful!
                      </Typography>
                      <Typography variant="body1">
                          Please proceed to <Link to="/login">Login</Link>.
                      </Typography>
                  </Box>
              )}
          </Box>
      </Box>
  </ThemeProvider>
    );
};

export default Registration;
