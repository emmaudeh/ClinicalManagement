import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Button, Typography, Drawer, List, ListItem, ListItemText, CssBaseline, IconButton, Toolbar, AppBar, TextField, MenuItem } from '@mui/material';
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Localbase from 'localbase'
import { Card, CardContent, Snackbar, Alert } from '@mui/material';
import { QrReader } from 'react-qr-reader';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper } from '@mui/material';
import StudentAssessmentForm from './StudentAssessmentForm';
import Wards from './Wards';

const theme = createTheme();
let url = "http://localhost:8080"
export const HospitalPage = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  let db = new Localbase('clinicaldbmanagement')
  const handleLogout = () => {
    db.collection('users').delete()
      .then(res => {
        navigate('/login');
      })
      .catch(err => {
        alert("can not logout")
      })
  };

  const [userData, setuserData] = useState({
    fullName: '',
    email: '',
    department: '',
    level: '',
    id: '',
    isVerified: true
  })
  useEffect(() => {
    db.collection('users').get().then(users => {
      if (users.length !== 0) {
        setuserData({
          email: users[0].userData.email,
          id: users[0].userData.ID,
          isVerified: true
        })
      }
    })
  }, []);
  const [view, setView] = useState('Timetable');
  const handleChangeView = (newView) => {
    setView(newView);
    handleDrawerClose();
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
              Hospital Dashboard
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
          <ListItem button onClick={() => handleChangeView('Wards')}>
              <ListItemText primary="Wards" />
            </ListItem>
            <ListItem button onClick={() => handleChangeView('Timetable')}>
              <ListItemText primary="Timetable" />
            </ListItem>
            <ListItem button onClick={() => handleChangeView('Attendance')}>
              <ListItemText primary="Attendance" />
            </ListItem>
            <ListItem button onClick={() => handleChangeView('Assessments')}>
              <ListItemText primary="Assessments" />
            </ListItem>
          </List>
          <Box sx={{ padding: 2, textAlign: 'center' }}>
            <Button variant="contained" color="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            ...(open && { marginLeft: 0 }),
          }}
        >
          <Toolbar />
          {view === 'Timetable' && <Timetable />}
          {view === 'Attendance' && <SetupAttendance />}
          {view === 'Assessments' && <StudentAssessmentForm />}
          {view === 'Wards' && <Wards />}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default HospitalPage;



function SetupAttendance() {
  const [startingTime, setStartingTime] = useState('');
  const [endingTime, setEndingTime] = useState('');
  const [level, setLevel] = useState('');
  const [ward, setWard] = useState('');
  const [attendanceSetup, setAttendanceSetup] = useState(null);
  const day = new Date().toISOString().split('T')[0]; // Today's date

  const handleStart = () => {
    setAttendanceSetup({ startingTime, endingTime, day, level, ward });
  };

  return (
    <Box sx={{ maxWidth: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom>
        Setup Attendance
      </Typography>
      <TextField
        label="Starting Time"
        type="time"
        value={startingTime}
        onChange={(e) => setStartingTime(e.target.value)}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        inputProps={{ step: 300 }}
      />
      <TextField
        label="Ending Time"
        type="time"
        value={endingTime}
        onChange={(e) => setEndingTime(e.target.value)}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        inputProps={{ step: 300 }}
      />
      <TextField
        label="Level"
        select
        value={level}
        onChange={(e) => setLevel(e.target.value)}
        fullWidth
        margin="normal"
      >
        {[100, 200, 300, 400].map(level => (
          <MenuItem key={level} value={level}>{level}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Ward"
        value={ward}
        onChange={(e) => setWard(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Day"
        value={day}
        fullWidth
        margin="normal"
        InputProps={{
          readOnly: true,
        }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleStart}
        sx={{ mt: 2 }}
      >
        Start Attendance
      </Button>
      {attendanceSetup && <Attendance setup={attendanceSetup} />}
    </Box>
  );
}

function Attendance({ setup }) {
  const [scannedData, setScannedData] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState('');
  let students = []
  const [scanned, setScanned] = useState([])
  useEffect(() => {
    axios.get(`${url}/api/find-students`)
      .then(res => {
        const filteredStudents = res.data.students.filter(e => e.level === setup.level);
        const initialStudents = filteredStudents.map(s => ({
          ID: s.ID,
          status: "absent"
        }));

        students = initialStudents
      })
      .catch(err => {
        console.log(err);
        alert('Cannot load students');
      });
  }, [setup.level]);

  const handleResult = (result, error) => {
    if (result) {
      const data = result.text;
      setScannedData(data);
      updateStatus(data);
    }
  };
  const updateStatus = (id) => {
    let found = false;
    students.map((student, index) => {
      if (student.ID === id && student.status === "absent") {
        found = true;
        students[0].status = "present"
      } else if (student.ID === id) {
        found = true;
      }
    });
    setScanned(students)
    if (found) {
      setAttendanceStatus(`Attendance marked for student ID: ${id}`);
      setOpenSnackbar(true);
    } else {
      setError('Error marking attendance. Please try again.');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  const [show, setShow] = useState(false)
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
      <Typography variant="h4" gutterBottom>
      Student Attendance
      </Typography>
      <Card sx={{ minWidth: 275, marginBottom: 2 }}>
        <CardContent>
          <QrReader
            delay={300}
            onResult={handleResult}
            style={{ width: '100%' }}
          />
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            {scannedData ? `Scanned Data: ${scannedData}` : 'Please scan a QR code to mark attendance.'}
          </Typography>
        </CardContent>
      </Card>
      <Button variant='contained' onClick={() => {
        axios.post(`${url}/api/create-attendance`, { StartingTime: setup.startingTime, EndingTime: setup.endingTime, Day: setup.day, Students: scanned, level: setup.level, ward: setup.ward })
          .then(res => {
            if (res.data.success) {
              alert("attendance successfully submitted")
              window.location.reload(true);
            }
          })
          .catch(err => {
            console.log(err)
          })
        console.log("students", scanned)
        console.log("setup", setup)
      }}>Stop & save attendance</Button>
      <Button onClick={() => { setShow(!show) }}>Show/hide present list</Button>

      {show === true ? <PresentStudentsList students={scanned} /> : ""}

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={error ? "error" : "success"} sx={{ width: '100%' }}>
          {error ? error : attendanceStatus}
        </Alert>
      </Snackbar>
    </Box>
  );
}


function PresentStudentsList({ students }) {
  // Filter students who have status "present"
  const presentStudents = students.filter(student => student.status === 'present');

  // Pagination state
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Present Students
      </Typography>
      {presentStudents.length > 0 ? (
        <Card sx={{ minWidth: 275, marginTop: 3 }}>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {presentStudents
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((student, index) => (
                      <TableRow key={index}>
                        <TableCell>{student.ID}</TableCell>
                        <TableCell>{student.status}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5]}
              component="div"
              count={presentStudents.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
            />
          </CardContent>
        </Card>
      ) : (
        <Typography variant="body1">No students marked as present.</Typography>
      )}
    </Box>
  );
}


function Timetable() {
  const [timetables, setTimetables] = useState([]);
  useEffect(() => {
    axios.get(`${url}/api/find-timetable`)
      .then(res => {
        setTimetables(res.data.content)
      })
      .catch(err => {
        console.log(err)
        alert('can not load timetable')
      })
  }, []);
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Timetables
      </Typography>
      <Grid container spacing={2}>
        {timetables.map((timetable, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <TimetableCard
              timetable={timetable.content}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}


function TimetableCard({ timetable }) {

  return (
    <Card sx={{ minWidth: 275, marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          {timetable[0].group} - Level {timetable[0].level}
        </Typography>
        <Typography variant="body2" color="textPrimary">
          Period: {timetable[0].weeks} weeks
        </Typography>
        <Typography variant="body2" color="textPrimary">
          Time: {timetable[0].startTime} - {timetable[0].endTime}
        </Typography>
        <Typography variant="body2" color="textPrimary">
          Days: {Object.keys(timetable[0].days).filter(day => timetable[0].days[day]).join(', ')}
        </Typography>
      </CardContent>
    </Card>
  );
}