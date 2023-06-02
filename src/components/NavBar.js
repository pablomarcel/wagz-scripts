import React, { useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Box, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingIcon from '@mui/icons-material/ShoppingCart';
import EventIcon from '@mui/icons-material/Event';

const drawerWidth = 240;

const NavBar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const drawerItems = [
        {
            text: 'ShopForm',
            icon: <ShoppingIcon />,
            route: '/shopform',
        },
        {
            text: 'EventForm',
            icon: <EventIcon />,
            route: '/eventform',
        }
    ];

    return (
        <div>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerToggle}>
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
                <Drawer
                    variant="temporary"
                    open={drawerOpen}
                    onClose={handleDrawerToggle}
                    sx={{
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            top: '64px', // AppBar height on desktop devices
                            height: 'calc(100% - 64px)',
                        },
                    }}
                >
                    <List>
                        {drawerItems.map((item, index) => (
                            <ListItem button key={index} component={RouterLink} to={item.route}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
            </Box>
            <Box component="main"
                 sx={{ flexGrow: 1, p: 3, ml: { md: drawerWidth }, mt: { xs: '56px', sm: '64px' } }}
            >
                {/* your main content goes here */}
            </Box>
        </div>
    );
};

export default NavBar;
