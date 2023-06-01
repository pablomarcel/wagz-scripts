/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';
import '../bootstrap-5.2.3-dist/css/bootstrap.min.css';
import { Box, Container, TextField, Button, Card, CardContent, FormControl } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const ShopForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [affiliateUrl, setAffiliateUrl] = useState('');
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const shopItem = { name, description, price, imageUrl, affiliateUrl };

        try {
            const response = await axios.post('/.netlify/functions/createShopItem', shopItem);
            //console.log(response);

            // Clear the form fields
            setName('');
            setDescription('');
            setPrice('');
            setImageUrl('');
            setAffiliateUrl('');

            // Set the Snackbar message and open it
            setMessage('Shop item created successfully!');
            setOpen(true);
        } catch (error) {
            console.error('Error creating shop item', error);

            // Set the Snackbar message and open it
            setMessage('Error creating shop item');
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
                        <h2>Create Shop Item</h2>
                        <form onSubmit={handleSubmit}>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="name"
                                    label="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
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
                                    id="price"
                                    label="Price"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="imageUrl"
                                    label="Image URL"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="affiliateUrl"
                                    label="Affiliate URL"
                                    value={affiliateUrl}
                                    onChange={(e) => setAffiliateUrl(e.target.value)}
                                />
                            </FormControl>
                            <Button
                                fullWidth
                                type="submit"
                                color="primary"
                                variant="contained"
                                sx={{ mt: 2 }}
                            >
                                Create Shop Item
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Box>
            <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
                <Alert onClose={() => setOpen(false)} severity="success">
                    {message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ShopForm;
