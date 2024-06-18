import React, { useState,useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Radio,
  Autocomplete
} from '@mui/material';


function StudentAssessmentForm() {
  let url = "http://localhost:8080"
  const [studentsList,setstudentsList]=useState([])
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    unit: '',
    period: '',
    items: {
      punctuality: { rating: '', comment: '' },
      appearance: { rating: '', comment: '' },
      attitude: { rating: '', comment: '' },
      attendance: { rating: '', comment: '' },
      relationship: { rating: '', comment: '' },
      communication: { rating: '', comment: '' },
      competences: { rating: '', comment: '' },
      professionalism: { rating: '', comment: '' }
    },
    areasToImprove: '',
    comment: '',
    inCharge: '',
    rank: '',
    contactNumber: '',
    date: ''
  });
  useEffect(() => {
    axios.get(`${url}/api/find-students`)
      .then(res => {
        setstudentsList(res.data.students)
      })
      .catch(err => {
        console.log(err)
        alert('can not load students')
      })
  }, []);
  const handleStudentChange = (event, value) => {
    if (value) {
      setFormData({
        ...formData,
        studentName: value.name,
        studentId: value.id
      });
    } else {
      setFormData({
        ...formData,
        studentName: '',
        studentId: ''
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleItemChange = (e, item) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      items: {
        ...formData.items,
        [item]: { ...formData.items[item], rating: value }
      }
    });
  };

  const handleCommentChange = (e, item) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      items: {
        ...formData.items,
        [item]: { ...formData.items[item], comment: value }
      }
    });
  };

  const handleSubmit = () => {
    axios.post(`${url}/api/create-assessment`, formData)
      .then(response => {
        console.log('Assessment created:', response.data);
        alert("assessment successfully submitted")
        setFormData({
          studentName: '',
          studendId: '',
          unit: '',
          period: '',
          areasToImprove: '',
          comment: '',
          inCharge: '',
          rank: '',
          contactNumber: '',
          date: '',
          items: {
            punctuality: { rating: '', comment: '' },
            appearance: { rating: '', comment: '' },
            attitude: { rating: '', comment: '' },
            attendance: { rating: '', comment: '' },
            relationship: { rating: '', comment: '' },
            communication: { rating: '', comment: '' },
            competences: { rating: '', comment: '' },
            professionalism: { rating: '', comment: '' }
          }
        })
      })
      .catch(error => {
        alert("Error creating assessment")
        console.error('There was an error creating the assessment!', error);
      });
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Student Assessment Form
      </Typography>
      <Box component="form" noValidate autoComplete="off">
        <Autocomplete
          options={studentsList}
          getOptionLabel={(option) => option.name + " " + option.ID}
          onChange={handleStudentChange}
          renderInput={(params) => (
            <TextField {...params} label="Name of Student" margin="normal" fullWidth />
          )}
        />
        <TextField
          fullWidth
          margin="normal"
          name="unit"
          label="Unit/Ward/Department"
          value={formData.unit}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="period"
          label="Period of Clinical Experience"
          value={formData.period}
          onChange={handleChange}
        />
        <TableContainer component={Paper} sx={{ marginTop: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Items</TableCell>
                <TableCell>1</TableCell>
                <TableCell>2</TableCell>
                <TableCell>3</TableCell>
                <TableCell>4</TableCell>
                <TableCell>5</TableCell>
                <TableCell>Comments</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(formData.items).map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.charAt(0).toUpperCase() + item.slice(1)}</TableCell>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <TableCell key={value}>
                      <Radio
                        checked={formData.items[item].rating === value.toString()}
                        onChange={(e) => handleItemChange(e, item)}
                        value={value}
                        name={item}
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <TextField
                      fullWidth
                      margin="normal"
                      name={`${item}_comment`}
                      value={formData.items[item].comment}
                      onChange={(e) => handleCommentChange(e, item)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TextField
          fullWidth
          margin="normal"
          name="areasToImprove"
          label="Area Student Needs to Improve"
          multiline
          rows={3}
          value={formData.areasToImprove}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="comment"
          label="Comment"
          multiline
          rows={3}
          value={formData.comment}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="inCharge"
          label="Name of In-Charge/Preceptor"
          value={formData.inCharge}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="rank"
          label="Rank"
          value={formData.rank}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="contactNumber"
          label="Contact Number"
          value={formData.contactNumber}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="date"
          label="Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.date}
          onChange={handleChange}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default StudentAssessmentForm;
