import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfile } from "../profile/profileService.js";
import {
    Box,
    Typography,
    Paper,
    Grid,
    Divider,
    CircularProgress,
    Card,
    CardContent,
    Avatar,
    Chip,
    Container,
    Alert,
    Stack,
    LinearProgress
} from "@mui/material";
import {
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Badge as BadgeIcon,
    Work as WorkIcon,
    Assignment as ProjectIcon,
    CheckCircle as ApprovedIcon,
    AccessTime as HoursIcon,
    People as PeopleIcon,
    DoneAll as CompletedIcon,
    PlayArrow as RunningIcon,
    Create as CreatedIcon,
    Security as SecurityIcon
} from "@mui/icons-material";

const UserProfilePage = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, [id]);

    const fetchProfile = async () => {
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

    const getRoleColor = (role) => {
        switch(role) {
            case 'ADMIN': return 'error';
            case 'MANAGER': return 'warning';
            case 'MEMBER': return 'info';
            default: return 'default';
        }
    };

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
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress size={60} thickness={4} />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error">{error}</Alert>
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

    const { user, summary, projects, workLogs, roles } = profile;
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Avatar
                        sx={{
                            width: 80,
                            height: 80,
                            bgcolor: 'rgba(255,255,255,0.2)',
                            border: '3px solid white',
                            fontSize: '2rem',
                            fontWeight: 600
                        }}
                    >
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight="600" gutterBottom>
                            {user?.name}
                        </Typography>
                        <Chip
                            label={role}
                            color={getRoleColor(role)}
                            sx={{
                                fontWeight: 600,
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                color: 'white'
                            }}
                        />
                    </Box>
                </Box>
            </Paper>

            {/* User Info Card */}
            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <PersonIcon color="primary" />
                    <Typography variant="h6" fontWeight="600">
                        Personal Information
                    </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <BadgeIcon color="action" />
                            <Box>
                                <Typography variant="body2" color="text.secondary">User ID</Typography>
                                <Typography variant="body1" fontWeight="500">#{user?.id}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <EmailIcon color="action" />
                            <Box>
                                <Typography variant="body2" color="text.secondary">Email</Typography>
                                <Typography variant="body1" fontWeight="500">{user?.email}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <PhoneIcon color="action" />
                            <Box>
                                <Typography variant="body2" color="text.secondary">Phone</Typography>
                                <Typography variant="body1" fontWeight="500">{user?.phoneNum || 'N/A'}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Performance Summary */}
            {summary && (
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <WorkIcon color="primary" />
                        <Typography variant="h6" fontWeight="600">
                            Performance Summary
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
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
            )}

            {/* Projects Section (ADMIN/MANAGER) */}
            {(role === "ADMIN" || role === "MANAGER") && (
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <ProjectIcon color="primary" />
                        <Typography variant="h6" fontWeight="600">
                            Projects
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
                                            '&:hover': { boxShadow: 3 }
                                        }}
                                    >
                                        <Typography fontWeight="600" gutterBottom>
                                            {project.name}
                                        </Typography>
                                        <Chip
                                            label={project.status}
                                            size="small"
                                            color={project.status === 'ACTIVE' ? 'success' : 'default'}
                                        />
                                        {project.description && (
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                {project.description}
                                            </Typography>
                                        )}
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">No projects found</Typography>
                        </Paper>
                    )}
                </Box>
            )}

            {/* Work Logs Section (MEMBER) */}
            {role === "MEMBER" && (
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <WorkIcon color="primary" />
                        <Typography variant="h6" fontWeight="600">
                            Work Logs
                        </Typography>
                    </Box>

                    {workLogs?.length > 0 ? (
                        workLogs.map((project) => (
                            <Card key={project.projectId} sx={{ mb: 3, borderRadius: 2 }}>
                                <CardContent>
                                    <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                                        {project.projectName}
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Stack spacing={1}>
                                        {project.workLogs?.map((log, index) => (
                                            <Paper
                                                key={index}
                                                variant="outlined"
                                                sx={{
                                                    p: 1.5,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
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
                                                    <Typography variant="body2">{log.date}</Typography>
                                                </Box>
                                                <Chip
                                                    label={log.status}
                                                    size="small"
                                                    color={getStatusColor(log.status)}
                                                />
                                            </Paper>
                                        ))}
                                    </Stack>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">No work logs found</Typography>
                        </Paper>
                    )}
                </Box>
            )}

            {/* Roles & Permissions */}
            {roles && (
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <SecurityIcon color="primary" />
                        <Typography variant="h6" fontWeight="600">
                            Roles & Permissions
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        {roles.map((role) => (
                            <Grid item xs={12} md={6} key={role.id}>
                                <Card elevation={2} sx={{ borderRadius: 2 }}>
                                    <CardContent>
                                        <Typography fontWeight="600" color="primary.main" gutterBottom>
                                            {role.name}
                                        </Typography>
                                        <Divider sx={{ my: 2 }} />
                                        {role.permissions?.length > 0 ? (
                                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                {role.permissions.map((permission) => (
                                                    <Chip
                                                        key={permission.id}
                                                        label={permission.name}
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
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </Container>
    );
};

export default UserProfilePage;