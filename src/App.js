import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import ShopForm from './Forms/ShopForm';
import EventForm from './Forms/EventForm';

function App() {
    return (
        <div className="App">
            <Router>
                <NavBar />
                <Routes>
                    <Route path="/shopform" element={<ShopForm />} />
                    <Route path="/eventform" element={<EventForm />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
