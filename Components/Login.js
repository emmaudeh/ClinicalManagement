import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, CssBaseline, MenuItem, FormControl, Select, InputLabel } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import logo from './IMG/image.png'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Localbase from 'localbase'

const theme = createTheme();
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const CustomSnackbar = ({ message, severity, open, handleClose }) => (
    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
            {message}
        </Alert>
    </Snackbar>
);
const Login = () => {
    let db = new Localbase('clinicaldbmanagement')
    const [chValue, setChValues] = useState('University');
    const [ID, setID] = useState('');
    //ID
    const [userpassword, setUserpassword] = useState('');
    let determineUrl;
    let url = "http://localhost:8080"
    const navigate = useNavigate();
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };
    const handleChoice = (e) => {
        setChValues(e.target.value);
    };

    const handleLogin = (event) => {
        event.preventDefault();
        console.log(chValue)
        switch (chValue) {
            case "Student":
                determineUrl = "login-student"
                break;
            case "University":
                determineUrl = "login-university-admin"
                break;
            case "Hospital":
                determineUrl = "login-hospital-admin"
                break;

            default:
                break;
        }
        axios.post(`${url}/api/${determineUrl}`, { ID, password: userpassword })
            .then(res => {

                if (res.data.success) {
                    console.log(res.data.user)
                    db.collection('users').add({ userData: res.data.user, userType: chValue })
                        .then(() => {
                            console.log("User added successfully");
                            navigate(`/${chValue}`);
                        })
                        .catch(error => {
                            console.error("Error adding user: ", error);
                        });
                    showSnackbar("login successfull", 'success')

                }
            })
            .catch(err => {
                showSnackbar(err.response.data.msg, 'error')
            })

    };
    useEffect(() => {
        let db = new Localbase('clinicaldbmanagement')
        db.collection('users').get().then(users => {
            if (users.length !== 0) {
                switch (users[0].userType) {
                    case "Student":
                        navigate("/Student")
                        break;
                    case "University":
                        navigate("/University")
                        break;

                    default:
                        break;
                }
            }

        })
    }, []);
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
                    <img src={logo} alt="Logo" style={{ width: '100px', marginBottom: '10px' }} />
                    <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                        Login Page
                    </Typography>
                    <Box component="form" onSubmit={handleLogin} noValidate>
                        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                            <InputLabel>Who are you logging as?</InputLabel>
                            <Select
                                value={chValue}
                                onChange={handleChoice}
                                label="Who are you logging as?"
                            >
                                <MenuItem value="University">University Admin</MenuItem>
                                <MenuItem value="Hospital">Hospital Admin</MenuItem>
                                <MenuItem value="Student">Student</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label="ID"
                            name="ID"
                            variant="outlined"
                            value={ID}
                            onChange={(e) => setID(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="User Password"
                            type="password"
                            name="password"
                            variant="outlined"
                            value={userpassword}
                            onChange={(e) => setUserpassword(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Button variant="contained" color="primary" type="submit" fullWidth>
                            Log In
                        </Button>
                        <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
                            Not registered yet? <Link to="/">Register here</Link>
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <CustomSnackbar
                message={snackbar.message}
                severity={snackbar.severity}
                open={snackbar.open}
                handleClose={handleClose}
            />
        </ThemeProvider>
    );
};

export default Login;
