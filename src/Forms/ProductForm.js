/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import '../bootstrap-5.2.3-dist/css/bootstrap.min.css';
import { Box, Container, TextField, Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select, Snackbar, Alert } from '@mui/material';

const ProductForm = () => {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';
    const [description, setDescription] = useState('');
    const [buyButtonId, setBuyButtonId] = useState('');
    const [publishableKey, setPublishableKey] = useState('');
    const [publicFigureId, setPublicFigureId] = useState('');
    const [publicFigures, setPublicFigures] = useState([]);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchPublicFigures();
    }, []);

    const fetchPublicFigures = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/.netlify/functions/listPublicFigures`);
            setPublicFigures(response.data);
        } catch (error) {
            console.error('Error fetching public figures', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const productItem = { description, buyButtonId, publishableKey, publicFigureId };

        try {
            const response = await axios.post(`${API_BASE_URL}/.netlify/functions/createProductItem`, productItem);

            // Clear the form fields
            setDescription('');
            setBuyButtonId('');
            setPublishableKey('');
            setPublicFigureId('');

            // Set the Snackbar message and open it
            setMessage('Product item created successfully!');
            setOpen(true);
        } catch (error) {
            console.error('Error creating product item', error);

            // Set the Snackbar message and open it
            setMessage('Error creating product item');
            setOpen(true);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                <Card sx={{
                    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '15px',
                }}>
                    <CardContent>
                        <h2>Create Product Item</h2>
                        <form onSubmit={handleSubmit}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="publicFigure-label">Public Figure</InputLabel>
                                <Select
                                    labelId="publicFigure-label"
                                    id="publicFigure"
                                    value={publicFigureId}
                                    onChange={(e) => setPublicFigureId(e.target.value)}
                                    label="Public Figure"
                                >
                                    <MenuItem value="">
                                        <em>Select a public figure</em>
                                    </MenuItem>
                                    {publicFigures.map((publicFigure) => (
                                        <MenuItem key={publicFigure.id} value={publicFigure.id}>
                                            {publicFigure.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="description"
                                    label="Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    multiline
                                    rows={4}
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="buyButtonId"
                                    label="Buy Button ID"
                                    value={buyButtonId}
                                    onChange={(e) => setBuyButtonId(e.target.value)}
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="publishableKey"
                                    label="Publishable Key"
                                    value={publishableKey}
                                    onChange={(e) => setPublishableKey(e.target.value)}
                                />
                            </FormControl>
                            <Button
                                fullWidth
                                type="submit"
                                color="primary"
                                variant="contained"
                                sx={{ mt: 2 }}
                            >
                                Create Product Item
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Box>
            <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
                <Alert onClose={() => setOpen(false)} severity={message.startsWith('Error') ? "error" : "success"}>
                    {message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ProductForm;
