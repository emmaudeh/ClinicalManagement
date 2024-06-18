import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { Box, Card, Grid, CardContent, CardActions, Typography, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, TablePagination, CssBaseline, ThemeProvider, createTheme, Button, FormControl, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  TextField
} from '@mui/material';
import Localbase from 'localbase'
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';
import axios from 'axios'
const theme = createTheme();
let url = "http://localhost:8080"
function University() {
  const navigate = useNavigate();
  let db = new Localbase('clinicaldbmanagement')
  const [open, setOpen] = useState(false);
  const [view, setView] = useState('students');

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleChangeView = (newView) => {
    setView(newView);
    handleDrawerClose();
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
              Admin Dashboard
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
            <ListItem button onClick={() => handleChangeView('students')}>
              <ListItemText primary="Students" />
            </ListItem>
            <ListItem button onClick={() => handleChangeView('createTimetable')}>
              <ListItemText primary="Create Timetable" />
            </ListItem>
          </List>
          <Box sx={{ padding: 2, textAlign: 'center' }}>
            <Button variant="contained" color="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3, width: `calc(100% - ${open ? 240 : 0}px)` }}>
          <Toolbar />
          {view === 'students' && <StudentsOverview />}
          {view === 'createTimetable' && <CreateTimetable />}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
function StudentsOverview() {
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({ level: '', department: '', search: '' });
  const [page, setPage] = useState(0);
  const [update, setUpdate] = useState(false)
  const rowsPerPage = 5;
  useEffect(() => {
    axios.get(`${url}/api/find-students`)
      .then(res => {
        setFilteredStudents(res.data.students)
        setStudents(res.data.students)
      })
      .catch(err => {
        console.log(err)
        alert('can not load students')
      })
  }, [update]);
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    filterStudents(newFilters);
    setPage(0); // Reset page to 0 when filters change
  };

  const filterStudents = (filters) => {
    let filtered = students;
    if (filters.level) {
      filtered = filtered.filter(student => student.level === Number(filters.level));
    }
    if (filters.department) {
      filtered = filtered.filter(student => student.department === filters.department);
    }
    if (filters.search) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        student.ID.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    setFilteredStudents(filtered);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const [numGroups, setNumGroups] = useState('');
  const [subject, setSubject] = useState('');
  const [timetableGroup, setTimetableGroup] = useState('');
  const [timetableGroups, setTimetableGroups] = useState([]);
  const [studentsInLevel, setStudentsInLevel] = useState(0);

  //assigning the timetable to student

  const handleSubmit = () => {
    if (numGroups !== 0 && subject !== "") {
      axios.post(`${url}/api/assign-timetable`, { timeTableId: timetableGroup._id, N_Students: Number(numGroups), ward: subject })
        .then(res => {
          console.log(res.data.success)
          if (res.data.success) {
            setUpdate(!update)
            alert("timetable successfully assigned")
            setStudentsInLevel(Number(studentsInLevel) - Number(numGroups))
          }
        })
        .catch(err => {
          alert("something went wrong")
          console.log(err)
        })
    }

  };
  //find all timetable 
  useEffect(() => {
    axios.get(`${url}/api/find-timetable`)
      .then(res => {
        if (res.data.content) {
          setTimetableGroups(res.data.content)
        }
      })
      .catch(err => {
        console.log(err)
        alert('can not load timetable')
      })
  }, []);
  //run and get students numbers when timetable is selected by level
  useEffect(() => {
    if (timetableGroup !== "") {
      const selecting = students.filter(student => student.timeTable.timeTableId === "");
      setStudentsInLevel(countStudentsBySpecifiedLevel(selecting, timetableGroup.content[0].level))
    }
  }, [timetableGroup, update]);
  //function to count students account to their level
  function countStudentsBySpecifiedLevel(students, specifiedLevel) {
    const count = students.filter(student => student.level === specifiedLevel).length;
    return count;
  }

  const [open, setOpen] = useState(false);
  const [studentData, setStudentData] = useState({
    email: '',
    department: '',
    name: '',
    level: '',
    ID: ''
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData({
      ...studentData,
      [name]: value
    });
  };

  const handleCreate = () => {
    axios.post(`${url}/api/student-sign-up`, studentData)
      .then(response => {
        console.log('Student created:', response.data);
        alert("student created")
        setStudentData({
          email: '',
          department: '',
          name: '',
          level: '',
          ID: ''
        })
        handleClose();
      })
      .catch(error => {
        console.error('There was an error creating the student!', error);
        alert('There was an error creating the student!');
      });

  };
  const [wards, setWards] = useState([])
  useEffect(() => {
    fetchWards();
  }, []);

  const fetchWards = async () => {
    try {
      const response = await axios.get(`${url}/api/finds-wards`);
      setWards(response.data);
    } catch (error) {
      console.log('Error fetching wards:', error);
    }
  };
  return (
    <div>
      <Box sx={{ maxWidth: 600, mx: 'auto', p: 3, backgroundColor: 'white', borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom>
          Timetable Assignment
        </Typography>
        <form>
          <TextField
            select
            label="Timetable Group"
            value={timetableGroup}
            onChange={(e) => setTimetableGroup(e.target.value)}
            fullWidth
            margin="normal"
          >
            {timetableGroups.map(group => (
              <MenuItem key={group._id} value={group}>{group.content[0].group}-Level{group.content[0].level}-{group.content[0].weeks}weeks</MenuItem>
            ))}
          </TextField>
          <Typography variant="body1" gutterBottom>
            Number of Unassigned Students in Level: {studentsInLevel}
          </Typography>
          <TextField
            label="Number of Students"
            type="number"
            value={numGroups}
            onChange={(e) => setNumGroups(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            select
            label="Wards"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            fullWidth
            margin="normal"
          >
            {wards.map((group) => (
              <MenuItem key={group._id} value={group.name}>{group.name}</MenuItem>
            ))}
          </TextField>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ mt: 2 }}
          >
            Assign
          </Button>
        </form>
      </Box>
      <div>
        <Typography variant="h6" gutterBottom>
          List of Students
        </Typography>
        <Button onClick={handleClickOpen}>Add student</Button><br />
        <TextField
          label="Search by Name or ID"
          variant="outlined"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          sx={{ margin: 1, width: '300px' }}
        />
        <TextField
          select
          label="Level"
          value={filters.level}
          onChange={handleFilterChange}
          name="level"
          sx={{ marginRight: 2 }}
        >
          {[100, 200, 300, 400].map(level => (
            <MenuItem key={level} value={level}>{level}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Department"
          value={filters.department}
          onChange={handleFilterChange}
          name="department"
        >
          {['Nursing', 'Midwifery'].map(department => (
            <MenuItem key={department} value={department}>{department}</MenuItem>
          ))}
        </TextField>
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((student, index) => (
                  <TableRow key={index}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.department}</TableCell
                    ><TableCell>{student.level}</TableCell>
                    <TableCell>{student.ID}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10]} // fixed at 10 for simplicity
            component="div"
            count={filteredStudents.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            ActionsComponent={TablePaginationActions}
          />
        </TableContainer>
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Student</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={studentData.email}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="department"
            label="Department"
            type="text"
            fullWidth
            value={studentData.department}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={studentData.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="level"
            label="Level"
            type="number"
            fullWidth
            value={studentData.level}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="ID"
            label="ID"
            type="text"
            fullWidth
            value={studentData.ID}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreate} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

// Custom pagination actions component
function TablePaginationActions(props) {
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  return (
    <Box sx={{ flexShrink: 0, marginLeft: 2.5 }}>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
    </Box>
  );
}

function TimetableCard({ timetable, onDelete }) {

  return (
    <Card sx={{ minWidth: 275, marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          {timetable[0].group} - Level {timetable[0].level}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Period: {timetable[0].starting} - {timetable[0].ending}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Time: {timetable[0].startTime} - {timetable[0].endTime}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Days: {Object.keys(timetable[0].days).filter(day => timetable[0].days[day]).join(', ')}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="secondary" onClick={onDelete}>Delete</Button>
      </CardActions>
    </Card>
  );
}

function CreateTimetable() {

  const [update, setUpdate] = useState(false)
  const [timetableData, setTimetableData] = useState({
    group: "",
    level: '',
    starting: '',
    ending: '',
    days: {
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false
    },
    startTime: '',
    endTime: ''
  });
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
  }, [update]);


  const handleDelete = (index, timetable) => {
    axios.post(`${url}/api/delete-timetable`, { id: timetable })
      .then(res => {
        {
          if (res.data.success) {
            setTimetables(timetables.filter((_, i) => i !== index));
          }
        }
      })
      .catch(err => {
        alert("can not delete timetable")
      })

  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setTimetableData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setTimetableData(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [name]: checked
      }
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post(`${url}/api/create-timetable`, { content: timetableData })
      .then(res => {
        if (res.data.success) {
          setUpdate(!update)
          alert("timetable created")
          setTimetableData({
            group: "",
            level: '',
            starting: '',
            ending: '',
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
        }
      })
      .catch(err => {
        console.log(err)
      })
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Timetable
        </Typography>
        <Grid container spacing={2}>
          {timetables.map((timetable, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <TimetableCard
                timetable={timetable.content}
                onDelete={() => handleDelete(index, timetable._id)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ maxWidth: 500, mx: 'auto', p: 3, backgroundColor: 'white', borderRadius: 2, boxShadow: 3 }}>

        <Typography variant="h5" gutterBottom>
          Create Timetable
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Session(Morning/Afternoon/Evening)"
            value={timetableData.department}
            onChange={handleChange}
            name="group"
            fullWidth
            margin="normal"
          />
          <TextField
            select
            label="Level"
            value={timetableData.level}
            onChange={handleChange}
            name="level"
            fullWidth
            margin="normal"
          >
            {[100, 200, 300, 400].map(level => (
              <MenuItem key={level} value={level}>{level}</MenuItem>
            ))}
          </TextField>
          <Typography variant='p'>starting date</Typography>
          <TextField
            type="date"
            name="starting"
            value={timetableData.starting}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Typography variant='p'>ending date</Typography>
          <TextField
            type="date"
            name="ending"
            value={timetableData.ending}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <FormControl component="fieldset" margin="normal">
            <Typography component="legend">Days of the Week</Typography>
            <FormGroup row>
              {Object.keys(timetableData.days).map(day => (
                <FormControlLabel
                  key={day}
                  control={
                    <Checkbox checked={timetableData.days[day]} onChange={handleCheckboxChange} name={day} />
                  }
                  label={day}
                />
              ))}
            </FormGroup>
          </FormControl>
          <TextField
            label="Start Time (hour)"
            type="time"
            name="startTime"
            value={timetableData.startTime}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 3600, // 1 hour steps
            }}
          />
          <TextField
            label="End Time (hour)"
            type="time"
            name="endTime"
            value={timetableData.endTime}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 3600, // 1 hour steps
            }}
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Create Timetable
          </Button>
        </form>
      </Box>
    </div>

  );
}


export default University;
