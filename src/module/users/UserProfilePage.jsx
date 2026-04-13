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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Tooltip
} from "@mui/material";
import {
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Badge as BadgeIcon,
    Work as WorkIcon,
    Assignment as ProjectIcon,
    CheckCircle as ApprovedIcon,
    Cancel as RejectedIcon,
    AccessTime as HoursIcon,
    People as PeopleIcon,
    DoneAll as CompletedIcon,
    PlayArrow as RunningIcon,
    Create as CreatedIcon,
    Security as SecurityIcon,
    Pending as PendingIcon,
    Replay as ReopenedIcon,
    Visibility as VisibilityIcon,
    Close as CloseIcon
} from "@mui/icons-material";

const UserProfilePage = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [taskDialogOpen, setTaskDialogOpen] = useState(false);

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
            case 'EMPLOYEE': return 'info';
            default: return 'default';
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'APPROVE': return 'success';
            case 'PENDING': return 'warning';
            case 'REJECT': return 'error';
            case 'CLOSE': return 'info';
            case 'REOPEN': return 'secondary';
            default: return 'default';
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'APPROVE': return <ApprovedIcon fontSize="small" />;
            case 'REJECT': return <RejectedIcon fontSize="small" />;
            case 'PENDING': return <PendingIcon fontSize="small" />;
            case 'CLOSE': return <CompletedIcon fontSize="small" />;
            case 'REOPEN': return <ReopenedIcon fontSize="small" />;
            default: return <PendingIcon fontSize="small" />;
        }
    };

    const handleViewTask = (task) => {
        setSelectedTask(task);
        setTaskDialogOpen(true);
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

    const { user, summary, projects, tasksByStatus } = profile;
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
                    <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <BadgeIcon color="action" />
                            <Box>
                                <Typography variant="body2" color="text.secondary">User ID</Typography>
                                <Typography variant="body1" fontWeight="500">#{user?.id}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <EmailIcon color="action" />
                            <Box>
                                <Typography variant="body2" color="text.secondary">Email</Typography>
                                <Typography variant="body1" fontWeight="500">{user?.email}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
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
                        {/* ADMIN Summary Cards */}
                        {role === "ADMIN" && (
                            <>
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
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <Avatar sx={{ bgcolor: 'success.light', mr: 1 }}>
                                                    <CompletedIcon />
                                                </Avatar>
                                                <Typography color="text.secondary" variant="body2">
                                                    Completed Projects
                                                </Typography>
                                            </Box>
                                            <Typography variant="h3" fontWeight="600" color="success.main">
                                                {summary?.totalCompletedProjects || 0}
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
                                                <Avatar sx={{ bgcolor: 'info.light', mr: 1 }}>
                                                    <ProjectIcon />
                                                </Avatar>
                                                <Typography color="text.secondary" variant="body2">
                                                    Total Tasks Created
                                                </Typography>
                                            </Box>
                                            <Typography variant="h3" fontWeight="600" color="info.main">
                                                {summary?.totalTasksCreated || 0}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={2.4}>
                                    <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
                                        <CardContent>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Approved Tasks
                                            </Typography>
                                            <Typography variant="h4" fontWeight="600" color="success.main">
                                                {summary?.totalApprovedTasks || 0}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={2.4}>
                                    <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
                                        <CardContent>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Rejected Tasks
                                            </Typography>
                                            <Typography variant="h4" fontWeight="600" color="error.main">
                                                {summary?.totalRejectedTasks || 0}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={2.4}>
                                    <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
                                        <CardContent>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Pending Tasks
                                            </Typography>
                                            <Typography variant="h4" fontWeight="600" color="warning.main">
                                                {summary?.totalPendingTasks || 0}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={2.4}>
                                    <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
                                        <CardContent>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Closed Tasks
                                            </Typography>
                                            <Typography variant="h4" fontWeight="600" color="info.main">
                                                {summary?.totalClosedTasks || 0}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={2.4}>
                                    <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
                                        <CardContent>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Reopened Tasks
                                            </Typography>
                                            <Typography variant="h4" fontWeight="600" color="secondary.main">
                                                {summary?.totalReopenedTasks || 0}
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
                                                    <ProjectIcon />
                                                </Avatar>
                                                <Typography color="text.secondary" variant="body2">
                                                    Assigned Projects
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
                                                <Avatar sx={{ bgcolor: 'success.light', mr: 1 }}>
                                                    <ApprovedIcon />
                                                </Avatar>
                                                <Typography color="text.secondary" variant="body2">
                                                    Approved Tasks
                                                </Typography>
                                            </Box>
                                            <Typography variant="h3" fontWeight="600" color="success.main">
                                                {summary?.totalApprovedTasks || 0}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <Avatar sx={{ bgcolor: 'error.light', mr: 1 }}>
                                                    <RejectedIcon />
                                                </Avatar>
                                                <Typography color="text.secondary" variant="body2">
                                                    Rejected Tasks
                                                </Typography>
                                            </Box>
                                            <Typography variant="h3" fontWeight="600" color="error.main">
                                                {summary?.totalRejectedTasks || 0}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <Avatar sx={{ bgcolor: 'warning.light', mr: 1 }}>
                                                    <CreatedIcon />
                                                </Avatar>
                                                <Typography color="text.secondary" variant="body2">
                                                    Tasks Created By Me
                                                </Typography>
                                            </Box>
                                            <Typography variant="h3" fontWeight="600" color="warning.main">
                                                {summary?.totalTasksCreatedByMe || 0}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12}>
                                    <Card elevation={2} sx={{ borderRadius: 3 }}>
                                        <CardContent>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Approval Rate
                                            </Typography>
                                            <Typography variant="h3" fontWeight="600" color="primary.main">
                                                {summary?.approvalRate || 0}%
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {summary?.totalApprovedTasks || 0} of {summary?.totalTasksInProjects || 0} tasks approved
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </>
                        )}

                        {/* EMPLOYEE Summary Cards */}
                        {role === "EMPLOYEE" && (
                            <>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <Avatar sx={{ bgcolor: 'info.light', mr: 1 }}>
                                                    <ProjectIcon />
                                                </Avatar>
                                                <Typography color="text.secondary" variant="body2">
                                                    Assigned Tasks
                                                </Typography>
                                            </Box>
                                            <Typography variant="h3" fontWeight="600" color="info.main">
                                                {summary?.totalAssignedTasks || 0}
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
                                                    Approved Tasks
                                                </Typography>
                                            </Box>
                                            <Typography variant="h3" fontWeight="600" color="success.main">
                                                {summary?.totalApprovedTasks || 0}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <Avatar sx={{ bgcolor: 'info.light', mr: 1 }}>
                                                    <CompletedIcon />
                                                </Avatar>
                                                <Typography color="text.secondary" variant="body2">
                                                    Closed Tasks
                                                </Typography>
                                            </Box>
                                            <Typography variant="h3" fontWeight="600" color="info.main">
                                                {summary?.totalClosedTasks || 0}
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
                                <Grid item xs={12}>
                                    <Card elevation={2} sx={{ borderRadius: 3 }}>
                                        <CardContent>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Approval Rate
                                            </Typography>
                                            <Typography variant="h3" fontWeight="600" color="primary.main">
                                                {summary?.approvalRate || 0}%
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {summary?.totalApprovedTasks || 0} of {summary?.totalAssignedTasks || 0} tasks approved
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </>
                        )}
                    </Grid>
                </Box>
            )}

            {/* Projects Section */}
            {projects && projects.length > 0 && (
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <ProjectIcon color="primary" />
                        <Typography variant="h6" fontWeight="600">
                            Projects
                        </Typography>
                    </Box>

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
                                        {project.projectName}
                                    </Typography>
                                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                                        <Chip
                                            label={project.status}
                                            size="small"
                                            color={project.status === 'RUNNING' ? 'success' : 'default'}
                                        />
                                        <Chip
                                            label={`${project.taskCount || 0} Tasks`}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </Stack>
                                    {(role === "ADMIN" || role === "MANAGER") && (
                                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                            <Chip
                                                size="small"
                                                icon={<ApprovedIcon />}
                                                label={`Approved: ${project.approvedTasks || 0}`}
                                                color="success"
                                                variant="outlined"
                                            />
                                            <Chip
                                                size="small"
                                                icon={<RejectedIcon />}
                                                label={`Rejected: ${project.rejectedTasks || 0}`}
                                                color="error"
                                                variant="outlined"
                                            />
                                            <Chip
                                                size="small"
                                                icon={<PendingIcon />}
                                                label={`Pending: ${project.pendingTasks || 0}`}
                                                color="warning"
                                                variant="outlined"
                                            />
                                            <Chip
                                                size="small"
                                                icon={<CompletedIcon />}
                                                label={`Closed: ${project.closedTasks || 0}`}
                                                color="info"
                                                variant="outlined"
                                            />
                                            {project.reopenedTasks > 0 && (
                                                <Chip
                                                    size="small"
                                                    icon={<ReopenedIcon />}
                                                    label={`Reopened: ${project.reopenedTasks || 0}`}
                                                    color="secondary"
                                                    variant="outlined"
                                                />
                                            )}
                                        </Stack>
                                    )}
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {/* Tasks by Status Section */}
            {tasksByStatus && (
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <WorkIcon color="primary" />
                        <Typography variant="h6" fontWeight="600">
                            Tasks by Status
                        </Typography>
                    </Box>

                    {['approved', 'rejected', 'pending', 'closed', 'reopened'].map((status) => {
                        const tasks = tasksByStatus[status];
                        if (!tasks || tasks.length === 0) return null;

                        return (
                            <Box key={status} sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, textTransform: 'capitalize' }}>
                                    {status} Tasks ({tasks.length})
                                </Typography>
                                <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                                    <Table>
                                        <TableHead sx={{ bgcolor: (theme) => `${getStatusColor(status.toUpperCase())}.50` }}>
                                            <TableRow>
                                                <TableCell><Typography fontWeight="600">Task Description</Typography></TableCell>
                                                <TableCell><Typography fontWeight="600">Project</Typography></TableCell>
                                                <TableCell><Typography fontWeight="600">Due Date</Typography></TableCell>
                                                <TableCell><Typography fontWeight="600">Status</Typography></TableCell>
                                                <TableCell><Typography fontWeight="600">Actions</Typography></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {tasks.map((task) => (
                                                <TableRow key={task.id} hover>
                                                    <TableCell sx={{ maxWidth: 300 }}>
                                                        <Typography variant="body2" sx={{
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical'
                                                        }}>
                                                            {task.description}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>{task.projectName}</TableCell>
                                                    <TableCell>{task.dueDate}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            icon={getStatusIcon(task.latestStatus)}
                                                            label={task.latestStatus}
                                                            size="small"
                                                            color={getStatusColor(task.latestStatus)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Tooltip title="View Details">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleViewTask(task)}
                                                                color="primary"
                                                            >
                                                                <VisibilityIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        );
                    })}
                </Box>
            )}

            {/* Task Details Dialog */}
            <Dialog open={taskDialogOpen} onClose={() => setTaskDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">Task Details</Typography>
                        <IconButton onClick={() => setTaskDialogOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {selectedTask && (
                        <Stack spacing={2}>
                            <Paper sx={{ p: 2, bgcolor: (theme) => theme.palette.action.hover, borderRadius: 2 }}>
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                    {selectedTask.description}
                                </Typography>
                            </Paper>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">Project</Typography>
                                    <Typography variant="body2" fontWeight="500">{selectedTask.projectName}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">Due Date</Typography>
                                    <Typography variant="body2" fontWeight="500">{selectedTask.dueDate}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">Status</Typography>
                                    <Chip
                                        icon={getStatusIcon(selectedTask.latestStatus)}
                                        label={selectedTask.latestStatus}
                                        size="small"
                                        color={getStatusColor(selectedTask.latestStatus)}
                                    />
                                </Grid>
                                {selectedTask.latestActionDescription && (
                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 1 }} />
                                        <Typography variant="caption" color="text.secondary">Latest Action</Typography>
                                        <Paper sx={{ p: 2, mt: 1, bgcolor: (theme) => theme.palette.background.default }}>
                                            <Typography variant="body2">{selectedTask.latestActionDescription}</Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                                By: {selectedTask.latestActionBy} | At: {selectedTask.latestActionAt}
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                )}
                            </Grid>
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setTaskDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default UserProfilePage;