import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Paper,
  Badge,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Box, Card, Grid,
  CardContent, Typography, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, CssBaseline, ThemeProvider, createTheme,Button
} from '@mui/material';
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon, CheckCircle as CheckCircleIcon, Cancel as CancelIcon } from '@mui/icons-material';
import Localbase from 'localbase'
import axios from 'axios'
import QRCode from "react-qr-code";
const theme = createTheme();

export default function StudentPage() {
  let url = "http://localhost:8080"
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();
  let db = new Localbase('clinicaldbmanagement')
  const [studentData, setstudentData] = useState({
    fullName: '',
    email: '',
    department: '',
    level: '',
    id: '',
    isVerified: true
  })
  const [timeTable, setTimetable] = useState({
    group: "",
    level: '',
    weeks: '',
    days: {
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false
    },
    startTime: '',
    endTime: ''
  })
  const [ward,setward]=useState("")
  useEffect(() => {
    db.collection('users').get().then(users => {
      if (users.length !== 0) {
        axios.post(`${url}/api/find-a-student`, { id: users[0].userData._id })
          .then(res => {
            setward(res.data.content.timeTable.ward)
            setstudentData({
              fullName: res.data.content.name,
              email: res.data.content.email,
              department: res.data.content.department,
              level: res.data.content.level,
              id: res.data.content.ID,
              isVerified: true
            })
            if (res.data.content.timeTable.timeTableId !== "") {
              axios.post(`${url}/api/find-a-timetable`, { id: res.data.content.timeTable.timeTableId })
                .then(a => {
                  setTimetable(a.data.content.content[0])
                })
                .catch(err => {
                  console.log(err)
                  alert("error getting timetable")
                })
            }
          })
          .catch(err => {
            alert("error loading student content")
            console.log(err)
          })

      }
    })
  }, []);
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    db.collection('users').delete()
      .then(res => {
        navigate('/login');
      })
      .catch(err => {
        alert("can not logout")
      })
  };


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            ...(open && {
              marginLeft: 240,
              width: `calc(100% - 240px)`,
              transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            }),
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ marginRight: 2, ...(open && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Student Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          open={open}
          sx={{
            width: 0,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: 240,
              boxSizing: 'border-box',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              ...(open ? { width: 240 } : { width: 0 }),
            },
          }}
        >
          <Toolbar>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <List>
            <ListItem button component={Link} to="/Student">
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            background: 'linear-gradient(to right, #6a11cb, #2575fc)',
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Toolbar />
          <Box sx={{ maxWidth: 600, padding: 3, backgroundColor: 'white', borderRadius: 2, boxShadow: 3, marginTop:10}}>
            <Typography variant="h4" gutterBottom>Student Profile</Typography>
            <Paper variant="outlined" sx={{ padding: 2, marginBottom: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} display="flex" justifyContent="center">
                  <Tooltip title={studentData.isVerified ? "Verified User" : "You need to verify your identity"} arrow>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                      badgeContent={studentData.isVerified ? <CheckCircleIcon color="primary" /> : <CancelIcon color="error" />}
                    >
                      <Avatar alt={studentData.fullName} src="/path/to/image.jpg" sx={{ width: 56, height: 56 }} />
                    </Badge>
                  </Tooltip>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1"><strong>Full Name:</strong> {studentData.fullName}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1"><strong>Email:</strong> {studentData.email}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1"><strong>Department:</strong> {studentData.department}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1"><strong>Level:</strong> {studentData.level}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1"><strong>ID:</strong> {studentData.id}</Typography>
                </Grid>
              </Grid>
              <TimetableCard timetable={timeTable} ward={ward}/>
              <Card sx={{ width: 300,marginTop:2}}>
              <Typography variant="body1">QR code for attendance</Typography>
              <QRCode style={{width:"150px", height:"150px"}} value={studentData.id} />
              </Card>
              

              
            </Paper>
          </Box>
        </Box>
      </Box>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}


function TimetableCard({ timetable,ward}) {

  return (
    <Card sx={{ width: 300}}>
      <CardContent>
        <Typography variant="h6" component="div">
          {timetable.group} - Level {timetable.level}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Period: {timetable.weeks} weeks
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Time: {timetable.startTime} - {timetable.endTime}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Days: {Object.keys(timetable.days).filter(day => timetable.days[day]).join(', ')}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          ward: {ward}
        </Typography>
      </CardContent>
    </Card>
  );
}