import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

function Wards() {
    const url = 'http://localhost:8080'
    const [wards, setWards] = useState([]);
    const [wardName, setWardName] = useState('');

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

    const handleAddWard = async () => {
        if (wardName.trim() === '') return;
        try {
            const response = await axios.post(`${url}/api/create-wards`, { name: wardName });
            setWards([...wards, response.data]);
            setWardName('');
        } catch (error) {
            console.log('Error adding ward:', error);
        }
    };

    const handleDeleteWard = async (id) => {
        try {
            await axios.post(`${url}/api/delete-wards`, { id: id });
            setWards(wards.filter(ward => ward._id !== id));
        } catch (error) {
            console.log('Error deleting ward:', error);
        }
    };

    return (
        <Paper sx={{ p: 3, maxWidth: 600, margin: 'auto' }}>
            <Typography variant="h4" gutterBottom>
                Manage Wards
            </Typography>
            <Box sx={{ display: 'flex', mb: 2 }}>
                <TextField
                    label="Ward Name"
                    value={wardName}
                    onChange={(e) => setWardName(e.target.value)}
                    fullWidth
                />
                <Button variant="contained" color="primary" onClick={handleAddWard} sx={{ ml: 2 }}>
                    Add Ward
                </Button>
            </Box>
            <List>
                {wards.map((ward) => (
                    <ListItem key={ward._id} secondaryAction={
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteWard(ward._id)}>
                            <DeleteIcon />
                        </IconButton>
                    }>
                        <ListItemText primary={ward.name} />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
}

export default Wards;
