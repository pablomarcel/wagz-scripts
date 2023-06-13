/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import { Box, Container, TextField, Button, Card, CardContent, FormControl } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const PollForm = () => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['']);
    const [createdDate, setCreatedDate] = useState('');
    const [author, setAuthor] = useState('');
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const pollQuestion = { question, options, createdDate, author };

        try {
            const response = await axios.post('/.netlify/functions/createPollQuestion', pollQuestion);

            // Clear the form fields
            setQuestion('');
            setOptions(['']);
            setCreatedDate('');
            setAuthor('');

            // Set the Snackbar message and open it
            setMessage('Poll question created successfully!');
            setOpen(true);
        } catch (error) {
            console.error('Error creating poll question', error);

            // Set the Snackbar message and open it
            setMessage('Error creating poll question');
            setOpen(true);
        }
    };

    const handleOptionChange = (index, event) => {
        const values = [...options];
        values[index] = event.target.value;
        setOptions(values);
    };

    const handleAddOption = () => {
        setOptions([...options, '']);
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
                        <h2>Create Poll Question</h2>
                        <form onSubmit={handleSubmit}>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="question"
                                    label="Question"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                />
                            </FormControl>
                            {options.map((option, index) => (
                                <FormControl key={index} fullWidth margin="normal">
                                    <TextField
                                        id={`option-${index}`}
                                        label={`Option ${index + 1}`}
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, e)}
                                    />
                                </FormControl>
                            ))}
                            <Button
                                type="button"
                                color="primary"
                                variant="contained"
                                onClick={handleAddOption}
                                sx={{ mt: 2, mb: 2 }}
                            >
                                Add Option
                            </Button>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="createdDate"
                                    label="Created Date"
                                    type="datetime-local"
                                    value={createdDate}
                                    onChange={(e) => setCreatedDate(e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="author"
                                    label="Author"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                />
                            </FormControl>
                            <Button
                                fullWidth
                                type="submit"
                                color="primary"
                                variant="contained"
                                sx={{ mt: 2 }}
                            >
                                Create Poll
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

export default PollForm;
