import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../app/authSlice";
import { useNavigate } from "react-router-dom";
import { getProfile } from "./profileService";

import {
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Button,
    Divider,
    Stack,
    CircularProgress,
    Avatar,
    Chip,
    IconButton,
    Container,
    LinearProgress,
    Alert
} from "@mui/material";
import {
    Logout as LogoutIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    Badge as BadgeIcon,
    Work as WorkIcon,
    Assignment as ProjectIcon,
    CheckCircle as ApprovedIcon,
    AccessTime as HoursIcon,
    TrendingUp as TrendingUpIcon,
    People as PeopleIcon,
    DoneAll as CompletedIcon,
    PlayArrow as RunningIcon,
    Create as CreatedIcon
} from "@mui/icons-material";

const MyProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const auth = JSON.parse(localStorage.getItem("auth"));
        const currentUser = auth?.user;

        if (currentUser?.id) {
            fetchProfile(currentUser.id);
        } else {
            setLoading(false);
            setError("No user found. Please login again.");
        }
    }, []);

    const fetchProfile = async (id) => {
        try {
            setError(null);
            const res = await getProfile(id);
            setProfile(res.data.data);
        } catch (error) {
            console.error("Profile fetch error:", error);
            setError(error.response?.data?.message || "Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem("auth");
        navigate("/login", { replace: true });
    };

    // Helper function to get role color
    const getRoleColor = (role) => {
        switch(role) {
            case 'ADMIN': return 'error';
            case 'MANAGER': return 'warning';
            case 'MEMBER': return 'info';
            default: return 'default';
        }
    };

    // Helper function to get status color
    const getStatusColor = (status) => {
        switch(status) {
            case 'APPROVED': return 'success';
            case 'PENDING': return 'warning';
            case 'REJECTED': return 'error';
            default: return 'default';
        }
    };

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="80vh"
                flexDirection="column"
                gap={2}
            >
                <CircularProgress size={60} thickness={4} />
                <Typography variant="body1" color="text.secondary">
                    Loading profile...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    action={
                        <Button color="inherit" size="small" onClick={() => navigate('/login')}>
                            Login Again
                        </Button>
                    }
                >
                    {error}
                </Alert>
            </Container>
        );
    }

    if (!profile) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="info">No Profile Found</Alert>
            </Container>
        );
    }

    const { user, summary, workLogs, projects } = profile;
    const role = user?.role;

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                }}
            >
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    spacing={2}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                            sx={{
                                width: 60,
                                height: 60,
                                bgcolor: 'rgba(255,255,255,0.2)',
                                border: '2px solid white',
                                fontSize: '1.5rem',
                                fontWeight: 600
                            }}
                        >
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </Avatar>
                        <Box>
                            <Typography variant="h4" fontWeight="600">
                                My Profile
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                Manage your personal information and track your activity
                            </Typography>
                        </Box>
                    </Box>

                    <Button
                        variant="contained"
                        color="error"
                        size="large"
                        onClick={handleLogout}
                        startIcon={<LogoutIcon />}
                        sx={{
                            borderRadius: 2,
                            px: 4,
                            py: 1.2,
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.3)',
                            }
                        }}
                    >
                        Logout
                    </Button>
                </Stack>
            </Paper>

            {/* User Info Card */}
            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <PersonIcon color="primary" />
                    <Typography variant="h6" fontWeight="600">
                        Personal Information
                    </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <BadgeIcon sx={{ color: 'text.secondary' }} />
                            <Box>
                                <Typography variant="body2" color="text.secondary">User ID</Typography>
                                <Typography variant="body1" fontWeight="500">#{user?.id}</Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <PersonIcon sx={{ color: 'text.secondary' }} />
                            <Box>
                                <Typography variant="body2" color="text.secondary">Full Name</Typography>
                                <Typography variant="body1" fontWeight="500">{user?.name}</Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <EmailIcon sx={{ color: 'text.secondary' }} />
                            <Box>
                                <Typography variant="body2" color="text.secondary">Email Address</Typography>
                                <Typography variant="body1" fontWeight="500">{user?.email}</Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Chip
                                label={user?.role}
                                color={getRoleColor(role)}
                                sx={{
                                    fontWeight: 600,
                                    px: 2,
                                    py: 0.5,
                                    fontSize: '0.9rem'
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Performance Summary */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <TrendingUpIcon color="primary" />
                    <Typography variant="h6" fontWeight="600">
                        Performance Summary
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {/* MEMBER Summary Cards */}
                    {role === "MEMBER" && (
                        <>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Avatar sx={{ bgcolor: 'info.light', mr: 1 }}>
                                                <ProjectIcon />
                                            </Avatar>
                                            <Typography color="text.secondary" variant="body2">
                                                Worked Projects
                                            </Typography>
                                        </Box>
                                        <Typography variant="h3" fontWeight="600" color="info.main">
                                            {summary?.totalWorkedProjects || 0}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Avatar sx={{ bgcolor: 'success.light', mr: 1 }}>
                                                <ApprovedIcon />
                                            </Avatar>
                                            <Typography color="text.secondary" variant="body2">
                                                Approved Logs
                                            </Typography>
                                        </Box>
                                        <Typography variant="h3" fontWeight="600" color="success.main">
                                            {summary?.totalApprovedWorkLogsMember || 0}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Avatar sx={{ bgcolor: 'warning.light', mr: 1 }}>
                                                <HoursIcon />
                                            </Avatar>
                                            <Typography color="text.secondary" variant="body2">
                                                Total Hours
                                            </Typography>
                                        </Box>
                                        <Typography variant="h3" fontWeight="600" color="warning.main">
                                            {Math.floor((summary?.totalApprovedMinutes || 0) / 60)}h
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {(summary?.totalApprovedMinutes || 0) % 60} minutes
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </>
                    )}

                    {/* MANAGER Summary Cards */}
                    {role === "MANAGER" && (
                        <>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Avatar sx={{ bgcolor: 'info.light', mr: 1 }}>
                                                <PeopleIcon />
                                            </Avatar>
                                            <Typography color="text.secondary" variant="body2">
                                                Assigned Members
                                            </Typography>
                                        </Box>
                                        <Typography variant="h3" fontWeight="600" color="info.main">
                                            {summary?.totalAssignedProjects || 0}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Avatar sx={{ bgcolor: 'warning.light', mr: 1 }}>
                                                <RunningIcon />
                                            </Avatar>
                                            <Typography color="text.secondary" variant="body2">
                                                Running Projects
                                            </Typography>
                                        </Box>
                                        <Typography variant="h3" fontWeight="600" color="warning.main">
                                            {summary?.totalRunningProjects || 0}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Avatar sx={{ bgcolor: 'success.light', mr: 1 }}>
                                                <CompletedIcon />
                                            </Avatar>
                                            <Typography color="text.secondary" variant="body2">
                                                Completed
                                            </Typography>
                                        </Box>
                                        <Typography variant="h3" fontWeight="600" color="success.main">
                                            {summary?.totalCompletedProjects || 0}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </>
                    )}

                    {/* ADMIN Summary Cards */}
                    {role === "ADMIN" && (
                        <Grid item xs={12} sm={6} md={3}>
                            <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar sx={{ bgcolor: 'primary.light', mr: 1 }}>
                                            <CreatedIcon />
                                        </Avatar>
                                        <Typography color="text.secondary" variant="body2">
                                            Created Projects
                                        </Typography>
                                    </Box>
                                    <Typography variant="h3" fontWeight="600" color="primary.main">
                                        {summary?.totalCreatedProjects || 0}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                </Grid>
            </Box>

            {/* Projects Section (ADMIN & MANAGER) */}
            {(role === "ADMIN" || role === "MANAGER") && (
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <ProjectIcon color="primary" />
                        <Typography variant="h6" fontWeight="600">
                            Projects Overview
                        </Typography>
                    </Box>

                    {projects?.length > 0 ? (
                        <Grid container spacing={2}>
                            {projects.map((project) => (
                                <Grid item xs={12} md={6} key={project.id}>
                                    <Paper
                                        elevation={1}
                                        sx={{
                                            p: 2.5,
                                            borderRadius: 2,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            '&:hover': {
                                                boxShadow: 3,
                                                borderColor: 'primary.main'
                                            },
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        <Typography fontWeight="600" variant="subtitle1" gutterBottom>
                                            {project.name}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                                            <Chip
                                                label={project.status}
                                                size="small"
                                                color={project.status === 'ACTIVE' ? 'success' : 'default'}
                                            />
                                            <Typography variant="caption" color="text.secondary">
                                                ID: #{project.id}
                                            </Typography>
                                        </Box>
                                        {project.description && (
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                {project.description.length > 100
                                                    ? `${project.description.substring(0, 100)}...`
                                                    : project.description}
                                            </Typography>
                                        )}
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                            <Typography color="text.secondary">No projects found</Typography>
                        </Paper>
                    )}
                </Box>
            )}

            {/* Work Logs Section (MEMBER) */}
            {role === "MEMBER" && (
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <WorkIcon color="primary" />
                        <Typography variant="h6" fontWeight="600">
                            Work Log History
                        </Typography>
                    </Box>

                    {workLogs?.length > 0 ? (
                        workLogs.map((project) => (
                            <Card key={project.projectId} sx={{ mb: 3, borderRadius: 2 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="subtitle1" fontWeight="600">
                                            {project.projectName}
                                        </Typography>
                                        <Chip
                                            label={`${project.workLogs?.length || 0} entries`}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </Box>

                                    <Divider sx={{ mb: 2 }} />

                                    <Stack spacing={1.5}>
                                        {project.workLogs?.map((log, index) => (
                                            <Paper
                                                key={index}
                                                variant="outlined"
                                                sx={{
                                                    p: 1.5,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    flexWrap: 'wrap',
                                                    gap: 1,
                                                    bgcolor: log.status === 'APPROVED' ? 'success.50' :
                                                        log.status === 'REJECTED' ? 'error.50' : 'warning.50'
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Chip
                                                        label={`${log.hours}h ${log.minutes}m`}
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                    />
                                                    <Typography variant="body2">
                                                        {log.date}
                                                    </Typography>
                                                </Box>
                                                <Chip
                                                    label={log.status}
                                                    size="small"
                                                    color={getStatusColor(log.status)}
                                                    sx={{ fontWeight: 500 }}
                                                />
                                            </Paper>
                                        ))}
                                    </Stack>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                            <WorkIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                            <Typography color="text.secondary">No work logs found</Typography>
                            <Button
                                variant="outlined"
                                sx={{ mt: 2 }}
                                onClick={() => navigate('/home/projects')}
                            >
                                Go to Projects
                            </Button>
                        </Paper>
                    )}
                </Box>
            )}
        </Container>
    );
};

export default MyProfile;