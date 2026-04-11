import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Divider,
    Box,
    Chip,
    Avatar,
    Grid,
    IconButton,
    Stack,
    CircularProgress,
    Alert,
    Paper
} from "@mui/material";
import {
    Close as CloseIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Badge as BadgeIcon,
    Security as SecurityIcon,
    Visibility as ViewIcon
} from "@mui/icons-material";
import { formatPermission } from "../../helper/helper.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAccess from "../../hooks/useAccess.js"; // Import useAccess hook

const UserViewDialog = ({ open, user, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { can } = useAccess(); // Get permission checker

    useEffect(() => {
        if (open && user) {
            setLoading(false);
            setError(null);
        }
    }, [open, user]);

    const getRoleColor = (role) => {
        switch(role) {
            case 'ADMIN': return 'error';
            case 'MANAGER': return 'warning';
            case 'MEMBER': return 'info';
            default: return 'default';
        }
    };

    const handleViewProfile = () => {
        if (user?.id) {
            onClose(); // Close the dialog
            navigate(`/home/users/${user.id}`); // Navigate to user profile
        }
    };

    // Check if user has permission to view profiles
    const canViewProfile = can("USER_VIEW") && can("USER_MODULE");

    // Handle case when user is null but dialog is open
    if (!user && open) {
        return (
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}>
                    <Typography variant="h6" fontWeight="600">Error</Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 4, textAlign: 'center' }}>
                    <Alert severity="error">User data not available</Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} variant="contained">Close</Button>
                </DialogActions>
            </Dialog>
        );
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 3 }
            }}
        >
            {loading ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Box sx={{ p: 4 }}>
                    <Alert severity="error">{error}</Alert>
                </Box>
            ) : user ? (
                <>
                    <DialogTitle sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        pb: 2
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon color="primary" />
                            <Typography variant="h6" fontWeight="600">
                                User Details
                            </Typography>
                        </Box>
                        <IconButton onClick={onClose} size="small">
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>

                    <DialogContent dividers sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                            {/* User Header with Avatar */}
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                                    <Avatar
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            bgcolor: 'primary.main',
                                            fontSize: '2rem',
                                            fontWeight: 500
                                        }}
                                    >
                                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h5" fontWeight="600">
                                            {user.name || 'N/A'}
                                        </Typography>
                                        <Chip
                                            label={user.roles?.[0]?.name || user.role || 'N/A'}
                                            color={getRoleColor(user.roles?.[0]?.name || user.role)}
                                            size="small"
                                            sx={{ mt: 1 }}
                                        />
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={12}>
                                <Divider />
                            </Grid>

                            {/* Personal Information */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                                    Personal Information
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <BadgeIcon color="action" />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    User ID
                                                </Typography>
                                                <Typography variant="body1" fontWeight="500">
                                                    #{user.id || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <EmailIcon color="action" />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Email Address
                                                </Typography>
                                                <Typography variant="body1" fontWeight="500">
                                                    {user.email || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <PhoneIcon color="action" />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Phone Number
                                                </Typography>
                                                <Typography variant="body1" fontWeight="500">
                                                    {user.phoneNum || 'Not provided'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                <Divider />
                            </Grid>

                            {/* Roles & Permissions */}
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <SecurityIcon color="primary" />
                                    <Typography variant="subtitle1" fontWeight="600">
                                        Roles & Permissions
                                    </Typography>
                                </Box>

                                {user.roles && user.roles.length > 0 ? (
                                    user.roles.map((role) => (
                                        <Box key={role.id} sx={{ mb: 3 }}>
                                            <Paper
                                                variant="outlined"
                                                sx={{
                                                    p: 2,
                                                    bgcolor: 'grey.50',
                                                    borderRadius: 2
                                                }}
                                            >
                                                <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                                                    {role.name}
                                                </Typography>

                                                <Divider sx={{ my: 1.5 }} />

                                                {role.permissions && role.permissions.length > 0 ? (
                                                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                        {role.permissions.map((p) => (
                                                            <Chip
                                                                key={p.id}
                                                                label={formatPermission(p.name)}
                                                                size="small"
                                                                variant="outlined"
                                                                sx={{ m: 0.5 }}
                                                            />
                                                        ))}
                                                    </Stack>
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary">
                                                        No permissions assigned
                                                    </Typography>
                                                )}
                                            </Paper>
                                        </Box>
                                    ))
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        No roles assigned
                                    </Typography>
                                )}
                            </Grid>
                        </Grid>
                    </DialogContent>

                    <DialogActions sx={{ p: 2, gap: 1, flexWrap: 'wrap' }}>
                        {canViewProfile && (
                            <Button
                                onClick={handleViewProfile} // Fixed: removed parentheses
                                variant="contained"
                                color="primary"
                                startIcon={<ViewIcon />}
                                sx={{
                                    borderRadius: 2,
                                    px: 3
                                }}
                            >
                                View Full Profile
                            </Button>
                        )}
                        <Button
                            onClick={onClose}
                            variant={canViewProfile ? "outlined" : "contained"}
                            color={canViewProfile ? "primary" : "primary"}
                            sx={{ borderRadius: 2 }}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </>
            ) : null}
        </Dialog>
    );
};

export default UserViewDialog;