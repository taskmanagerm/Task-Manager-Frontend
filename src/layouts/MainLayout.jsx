import { Link, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Tooltip,
    useTheme,
    useMediaQuery,
    CssBaseline
} from "@mui/material";
import {
    Menu as MenuIcon,
    Assignment as ProjectIcon,
    People as UsersIcon,
    Person as ProfileIcon,
    Logout as LogoutIcon,
    ChevronLeft as ChevronLeftIcon
} from "@mui/icons-material";
import useAccess from "../hooks/useAccess.js";

const MainLayout = () => {
    const { can } = useAccess();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // State for mobile drawer
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    // Get user from localStorage
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    const user = auth?.user || {};

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem("auth");
        window.location.href = "/login";
    };

    const isActive = (path) => {
        return location.pathname.includes(path);
    };

    // Navigation items with permission checks
    const navItems = [
        {
            text: 'Projects',
            icon: <ProjectIcon />,
            path: '/home/projects',
            show: can("PROJECT_MODULE")
        },
        {
            text: 'Users',
            icon: <UsersIcon />,
            path: '/home/users',
            show: can("USER_MODULE")
        },
        {
            text: 'My Profile',
            icon: <ProfileIcon />,
            path: '/home/profile',
            show: true
        }
    ];

    // Filter visible items
    const visibleNavItems = navItems.filter(item => item.show);

    // Drawer width
    const drawerWidth = 260;

    // Drawer content
    const drawer = (
        <Box sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#1a1f37', // Dark blue background
            color: '#ffffff'
        }}>
            {/* Logo Section */}
            <Box sx={{
                p: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        color: '#ffffff',
                        letterSpacing: '0.5px',
                        fontSize: '1.25rem'
                    }}
                >
                    WorkTracker
                </Typography>
                {isMobile && (
                    <IconButton onClick={handleDrawerToggle} sx={{ color: '#ffffff' }}>
                        <ChevronLeftIcon />
                    </IconButton>
                )}
            </Box>

            {/* User Info */}
            <Box sx={{
                p: 2.5,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <Avatar
                    sx={{
                        bgcolor: '#4f46e5', // Indigo color
                        width: 45,
                        height: 45,
                        fontSize: '1.1rem',
                        fontWeight: 500
                    }}
                >
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
                <Box>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 500,
                            color: '#ffffff',
                            fontSize: '0.95rem',
                            lineHeight: 1.4
                        }}
                    >
                        {user.name || 'User'}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '0.85rem',
                            textTransform: 'capitalize'
                        }}
                    >
                        {user.role || 'Role'}
                    </Typography>
                </Box>
            </Box>

            {/* Navigation Links */}
            <List sx={{ flex: 1, pt: 2, px: 1.5 }}>
                {visibleNavItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                        <ListItemButton
                            component={Link}
                            to={item.path}
                            selected={isActive(item.path)}
                            onClick={isMobile ? handleDrawerToggle : undefined}
                            sx={{
                                py: 1.2,
                                px: 2,
                                borderRadius: 1.5,
                                '&.Mui-selected': {
                                    backgroundColor: 'rgba(79, 70, 229, 0.15)', // Indigo with opacity
                                    '&:hover': {
                                        backgroundColor: 'rgba(79, 70, 229, 0.2)',
                                    },
                                    '& .MuiListItemIcon-root': {
                                        color: '#4f46e5',
                                    },
                                    '& .MuiListItemText-primary': {
                                        color: '#ffffff',
                                        fontWeight: 500,
                                    },
                                },
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                }
                            }}
                        >
                            <ListItemIcon sx={{
                                color: isActive(item.path) ? '#4f46e5' : 'rgba(255,255,255,0.6)',
                                minWidth: 40,
                                fontSize: '1.25rem'
                            }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{
                                    fontSize: '0.95rem',
                                    fontWeight: isActive(item.path) ? 500 : 400,
                                    color: isActive(item.path) ? '#ffffff' : 'rgba(255,255,255,0.8)'
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            {/* Bottom Section with Logout */}
            <Box sx={{
                p: 2,
                borderTop: '1px solid rgba(255,255,255,0.1)'
            }}>
                <List sx={{ px: 1.5 }}>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={handleLogout}
                            sx={{
                                py: 1.2,
                                px: 2,
                                borderRadius: 1.5,
                                '&:hover': {
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)', // Red with opacity
                                }
                            }}
                        >
                            <ListItemIcon sx={{
                                minWidth: 40,
                                color: '#ef4444' // Red color
                            }}>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Logout"
                                primaryTypographyProps={{
                                    fontSize: '0.95rem',
                                    color: '#ef4444',
                                    fontWeight: 400
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <CssBaseline />

            {/* App Bar */}
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                    bgcolor: '#ffffff',
                    color: '#1f2937',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    borderBottom: '1px solid #e5e7eb'
                }}
            >
                <Toolbar sx={{ minHeight: '64px !important' }}>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{
                            mr: 2,
                            display: { md: 'none' },
                            color: '#4b5563'
                        }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                            flexGrow: 1,
                            fontSize: '1.1rem',
                            fontWeight: 500,
                            color: '#1f2937'
                        }}
                    >
                        {visibleNavItems.find(item => isActive(item.path))?.text || 'Dashboard'}
                    </Typography>

                    {/* Profile Menu */}
                    <Tooltip title="Account">
                        <IconButton
                            onClick={handleProfileMenuOpen}
                            size="small"
                            sx={{
                                ml: 1,
                                '&:hover': {
                                    backgroundColor: '#f3f4f6'
                                }
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 36,
                                    height: 36,
                                    bgcolor: '#4f46e5',
                                    fontSize: '0.9rem',
                                    fontWeight: 500
                                }}
                            >
                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                            </Avatar>
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>

            {/* Profile Menu Dropdown */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                    sx: {
                        mt: 1,
                        minWidth: 180,
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                        border: '1px solid #e5e7eb'
                    }
                }}
            >
                <MenuItem
                    component={Link}
                    to="/home/profile"
                    sx={{ py: 1.2, px: 2 }}
                >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                        <ProfileIcon fontSize="small" sx={{ color: '#4b5563' }} />
                    </ListItemIcon>
                    <ListItemText
                        primary="Profile"
                        primaryTypographyProps={{
                            fontSize: '0.9rem',
                            color: '#1f2937'
                        }}
                    />
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem
                    onClick={handleLogout}
                    sx={{ py: 1.2, px: 2 }}
                >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                        <LogoutIcon fontSize="small" sx={{ color: '#ef4444' }} />
                    </ListItemIcon>
                    <ListItemText
                        primary="Logout"
                        primaryTypographyProps={{
                            fontSize: '0.9rem',
                            color: '#ef4444'
                        }}
                    />
                </MenuItem>
            </Menu>

            {/* Navigation Drawer */}
            <Box
                component="nav"
                sx={{
                    width: { md: drawerWidth },
                    flexShrink: { md: 0 }
                }}
            >
                {/* Mobile drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            backgroundColor: '#1a1f37',
                            border: 'none'
                        },
                    }}
                >
                    {drawer}
                </Drawer>

                {/* Desktop drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            backgroundColor: '#1a1f37',
                            border: 'none',
                            boxShadow: 'none'
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    minHeight: '100vh',
                    backgroundColor: '#f9fafb', // Light gray background
                    mt: '64px',
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default MainLayout;