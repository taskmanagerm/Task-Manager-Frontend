import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    TextField,
    MenuItem,
    Stack,
    Alert,
    CircularProgress,
    Chip,
    IconButton,
    Card,
    CardContent,
    Avatar,
    Container,
    FormControl,
    Select,
    alpha,
    useTheme,
    Tooltip,
    Tab,
    Tabs,
    LinearProgress,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar
} from "@mui/material";
import {
    ArrowBack as ArrowBackIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    AccessTime as AccessTimeIcon,
    CalendarToday as CalendarIcon,
    Work as WorkIcon,
    Group as GroupIcon,
    Assignment as AssignmentIcon,
    Timeline as TimelineIcon,
    People as PeopleIcon,
    BarChart as BarChartIcon,
    Pending as PendingIcon,
    Add as AddIcon,
    Visibility as VisibilityIcon,
    Info as InfoIcon,
    Task as TaskIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    DateRange as DateRangeIcon,
    Replay as ReplayIcon,
    Close as CloseIcon
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
    viewProject
} from "./projectService";
import {
    getTasksByProject,
    createTask,
    getTaskActions,
    createTaskAction
} from "./taskService";
import { getUsersByRole } from "../users/userService.js";
import useAccess from "../../hooks/useAccess";

// Task Status Mapping
const TASK_STATUS = {
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
    REOPEN: 'REOPEN',
    REJECTED: 'REJECTED'
};

// Task Action Status Mapping
const TASK_ACTION_STATUS = {
    APPROVE: 'APPROVE',
    REJECT: 'REJECT',
    REOPEN: 'REOPEN',
    CLOSE: 'CLOSE',
    PENDING: 'PENDING'
};

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`project-tabpanel-${index}`}
            aria-labelledby={`project-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

// Styled Components
const SectionCard = ({ children, title, icon: Icon, ...props }) => (
    <Paper
        elevation={0}
        sx={{
            p: 3,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
            position: 'relative',
            height: '100%',
            transition: 'all 0.3s ease',
            '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            },
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: theme => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            },
            ...props.sx
        }}
        {...props}
    >
        {title && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                {Icon && <Icon sx={{ mr: 1.5, color: 'primary.main' }} />}
                <Typography variant="h6" fontWeight="600">{title}</Typography>
            </Box>
        )}
        {children}
    </Paper>
);

const StatCard = ({ title, value, color = 'primary', subtitle }) => {
    const theme = useTheme();
    return (
        <Card
            elevation={0}
            sx={{
                p: 2,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.05)} 0%, ${alpha(theme.palette[color].main, 0.02)} 100%)`,
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 24px ${alpha(theme.palette[color].main, 0.2)}`,
                }
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                        {title}
                    </Typography>
                    <Typography variant="h4" fontWeight="700" color={`${color}.main`}>
                        {value}
                    </Typography>
                    {subtitle && (
                        <Typography variant="caption" color="text.secondary">
                            {subtitle}
                        </Typography>
                    )}
                </Box>
            </Box>
        </Card>
    );
};

const InfoItem = ({ label, value, icon: Icon }) => (
    <Box sx={{
        display: 'flex',
        alignItems: 'center',
        p: 1.5,
        bgcolor: 'action.hover',
        borderRadius: 2,
        transition: 'all 0.2s ease',
        '&:hover': {
            bgcolor: alpha('#000', 0.04),
            transform: 'translateX(4px)'
        }
    }}>
        {Icon && <Icon sx={{ mr: 1.5, color: 'primary.main', fontSize: 20 }} />}
        <Box>
            <Typography variant="caption" color="text.secondary">{label}</Typography>
            <Typography variant="body2" fontWeight="600">{value || 'N/A'}</Typography>
        </Box>
    </Box>
);

// Add Task Dialog Component
function AddTaskDialog({ open, onClose, projectId, employees, onSuccess }) {
    const [taskDescription, setTaskDescription] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [taskDoneDate, setTaskDoneDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const formatDateToDDMMYYYY = (date) => {
        if (!date) return null;
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleSubmit = async () => {
        if (!taskDescription.trim()) {
            setError("Task description is required");
            return;
        }
        if (!employeeId) {
            setError("Please select an employee");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const taskData = {
                projectId: Number(projectId),
                employeeId: Number(employeeId),
                taskDescription: taskDescription.trim(),
                taskDoneDate: taskDoneDate ? formatDateToDDMMYYYY(taskDoneDate) : null
            };

            await createTask(taskData);
            setTaskDescription("");
            setEmployeeId("");
            setTaskDoneDate(null);
            onSuccess();
            onClose();
        } catch (err) {
            console.error("Error adding task:", err);
            setError(err.response?.data?.message || "Failed to create task");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TaskIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Add New Task</Typography>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Stack spacing={3} sx={{ mt: 2 }}>
                    {error && (
                        <Alert severity="error" onClose={() => setError("")}>
                            {error}
                        </Alert>
                    )}

                    <TextField
                        label="Task Description"
                        fullWidth
                        multiline
                        rows={3}
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        placeholder="Describe the task..."
                        required
                    />

                    <FormControl fullWidth required>
                        <Select
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            displayEmpty
                        >
                            <MenuItem value="">Select Employee</MenuItem>
                            {employees.map((employee) => (
                                <MenuItem key={employee.id} value={employee.id}>
                                    {employee.name} ({employee.email})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <DatePicker
                        label="Expected Completion Date (Optional)"
                        value={taskDoneDate}
                        onChange={(newValue) => setTaskDoneDate(newValue)}
                        slotProps={{
                            textField: {
                                fullWidth: true
                            }
                        }}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={!taskDescription.trim() || !employeeId || loading}
                >
                    {loading ? <CircularProgress size={24} /> : "Create Task"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// Add Task Action Dialog
function AddTaskActionDialog({ open, onClose, taskId, onSuccess }) {
    const [actionDescription, setActionDescription] = useState("");
    const [taskActionStatus, setTaskActionStatus] = useState(TASK_ACTION_STATUS.PENDING);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        if (!actionDescription.trim()) {
            setError("Action description is required");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await createTaskAction({
                taskId: taskId,
                actionDescription: actionDescription.trim(),
                taskActionStatus: taskActionStatus
            });
            setActionDescription("");
            setTaskActionStatus(TASK_ACTION_STATUS.PENDING);
            onSuccess();
            onClose();
        } catch (err) {
            console.error("Error adding task action:", err);
            setError(err.response?.data?.message || "Failed to add action");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Add Task Action</Typography>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Stack spacing={3} sx={{ mt: 2 }}>
                    {error && (
                        <Alert severity="error" onClose={() => setError("")}>
                            {error}
                        </Alert>
                    )}

                    <TextField
                        label="Action Description"
                        fullWidth
                        multiline
                        rows={4}
                        value={actionDescription}
                        onChange={(e) => setActionDescription(e.target.value)}
                        placeholder="Describe the action taken..."
                        required
                        autoFocus
                    />

                    <FormControl fullWidth>
                        <Select
                            value={taskActionStatus}
                            onChange={(e) => setTaskActionStatus(e.target.value)}
                        >
                            <MenuItem value={TASK_ACTION_STATUS.PENDING}>Pending</MenuItem>
                            <MenuItem value={TASK_ACTION_STATUS.APPROVE}>Approve</MenuItem>
                            <MenuItem value={TASK_ACTION_STATUS.REJECT}>Reject</MenuItem>
                            <MenuItem value={TASK_ACTION_STATUS.CLOSE}>Close</MenuItem>
                            <MenuItem value={TASK_ACTION_STATUS.REOPEN}>Reopen</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={!actionDescription.trim() || loading}
                >
                    {loading ? <CircularProgress size={24} /> : "Add Action"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// Task Details Dialog
function TaskDetailsDialog({ open, onClose, task, onRefresh, canAddAction }) {
    const [taskActions, setTaskActions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addActionOpen, setAddActionOpen] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        if (open && task) {
            loadTaskActions();
        }
    }, [open, task]);

    const loadTaskActions = async () => {
        setLoading(true);
        try {
            const response = await getTaskActions(task.id);
            setTaskActions(response.data.data || []);
        } catch (error) {
            console.error("Error loading task actions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleActionSuccess = async () => {
        await loadTaskActions();
        if (onRefresh) onRefresh();
    };

    const getActionStatusColor = (status) => {
        switch(status) {
            case TASK_ACTION_STATUS.APPROVE: return 'success';
            case TASK_ACTION_STATUS.REJECT: return 'error';
            case TASK_ACTION_STATUS.REOPEN: return 'warning';
            case TASK_ACTION_STATUS.CLOSE: return 'info';
            default: return 'warning';
        }
    };

    const getActionStatusIcon = (status) => {
        switch(status) {
            case TASK_ACTION_STATUS.APPROVE: return <CheckCircleIcon />;
            case TASK_ACTION_STATUS.REJECT: return <CancelIcon />;
            case TASK_ACTION_STATUS.REOPEN: return <ReplayIcon />;
            case TASK_ACTION_STATUS.CLOSE: return <CloseIcon />;
            default: return <PendingIcon />;
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                        <Typography variant="h6">Task Details</Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3}>
                        {/* Task Description */}
                        <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                {task?.taskDescription}
                            </Typography>
                        </Paper>

                        {/* Task Info Grid */}
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <InfoItem
                                    label="Assigned To"
                                    value={task?.employee?.name || 'N/A'}
                                    icon={PersonIcon}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <InfoItem
                                    label="Assigned Email"
                                    value={task?.employee?.email || 'N/A'}
                                    icon={EmailIcon}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <InfoItem
                                    label="Created By"
                                    value={task?.createdBy?.name || 'N/A'}
                                    icon={PersonIcon}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <InfoItem
                                    label="Created Date"
                                    value={task?.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'N/A'}
                                    icon={DateRangeIcon}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <InfoItem
                                    label="Due Date"
                                    value={task?.taskDoneDate || 'Not set'}
                                    icon={CalendarIcon}
                                />
                            </Grid>
                        </Grid>

                        {/* Task Actions Section */}
                        <Divider>
                            <Chip label="Task Actions" icon={TimelineIcon} />
                        </Divider>

                        {/* Add Action Button */}
                        {canAddAction && (
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={() => setAddActionOpen(true)}
                                sx={{ alignSelf: 'flex-start' }}
                            >
                                Add Action
                            </Button>
                        )}

                        {/* Actions List */}
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                <CircularProgress />
                            </Box>
                        ) : taskActions.length === 0 ? (
                            <Paper sx={{ p: 3, textAlign: 'center', bgcolor: alpha(theme.palette.background.default, 0.5) }}>
                                <Typography color="text.secondary">No actions available for this task</Typography>
                            </Paper>
                        ) : (
                            <Stack spacing={2}>
                                {taskActions.map((action) => (
                                    <Card key={action.id} variant="outlined">
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                                                <Box>
                                                    <Typography variant="subtitle2" fontWeight="600">
                                                        {action.actionBy?.name || 'Unknown User'}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {new Date(action.actionAt).toLocaleString()}
                                                    </Typography>
                                                </Box>
                                                <Chip
                                                    icon={getActionStatusIcon(action.actionStatus)}
                                                    label={action.actionStatus}
                                                    size="small"
                                                    color={getActionStatusColor(action.actionStatus)}
                                                />
                                            </Box>
                                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                                {action.actionDescription}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Stack>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Close</Button>
                </DialogActions>
            </Dialog>

            <AddTaskActionDialog
                open={addActionOpen}
                onClose={() => setAddActionOpen(false)}
                taskId={task?.id}
                onSuccess={handleActionSuccess}
            />
        </>
    );
}

// Main Component
const ProjectDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { can } = useAccess();
    const theme = useTheme();

    // Data state
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState("");
    const [tabValue, setTabValue] = useState(0);

    // Dialog states
    const [addTaskOpen, setAddTaskOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [taskDetailsOpen, setTaskDetailsOpen] = useState(false);

    // Load project data
    useEffect(() => {
        loadProjectData();
    }, [id]);

    const loadProjectData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Load project details
            const projectRes = await viewProject(id);
            setProject(projectRes.data.data);

            // Load tasks
            if (can("TASK_VIEW") || can("TASK_VIEW_ALL")) {
                const tasksRes = await getTasksByProject(id);
                setTasks(tasksRes.data.data || []);
            }

            // Load employees for task assignment (ADMIN, MANAGER, EMPLOYEE roles)
            if (can("TASK_CREATE")) {
                try {
                    const employeesRes = await getUsersByRole("EMPLOYEE");
                    const managersRes = await getUsersByRole("MANAGER");
                    const adminsRes = await getUsersByRole("ADMIN");

                    const allEmployees = [
                        ...(employeesRes.data.data || []),
                        ...(managersRes.data.data || []),
                        ...(adminsRes.data.data || [])
                    ];
                    setEmployees(allEmployees);
                } catch (err) {
                    console.error("Error loading employees:", err);
                }
            }
        } catch (err) {
            console.error("Error loading project data:", err);

            if (err.response?.status === 401 || err.response?.status === 403) {
                localStorage.removeItem("auth");
                navigate("/login", { replace: true });
                return;
            }

            setError(err.response?.data?.message || "Failed to load project details");
        } finally {
            setLoading(false);
        }
    };

    const refreshTasks = async () => {
        try {
            const tasksRes = await getTasksByProject(id);
            setTasks(tasksRes.data.data || []);
        } catch (err) {
            console.error("Error refreshing tasks:", err);
        }
    };

    const handleAddTask = async () => {
        await refreshTasks();
        setSuccess("Task created successfully!");
        setTimeout(() => setSuccess(""), 3000);
    };

    const handleViewTask = (task) => {
        setSelectedTask(task);
        setTaskDetailsOpen(true);
    };

    const handleTaskRefresh = async () => {
        await refreshTasks();
        if (selectedTask) {
            const updatedTask = tasks.find(t => t.id === selectedTask.id);
            setSelectedTask(updatedTask);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Get latest action status for a task
    // Get latest action status for a task (sorted by date)
    const getLatestActionStatus = (task) => {
        // Check if task has taskActions array and it's not empty
        if (task.taskActions && task.taskActions.length > 0) {
            // Sort actions by actionAt date (most recent first) and get the first one
            const sortedActions = [...task.taskActions].sort((a, b) =>
                new Date(b.actionAt) - new Date(a.actionAt)
            );
            return sortedActions[0].actionStatus || 'PENDING';
        }
        return 'PENDING';
    };

    // Get status color for action status
    const getActionStatusColor = (status) => {
        switch(status) {
            case TASK_ACTION_STATUS.APPROVE: return 'success';
            case TASK_ACTION_STATUS.REJECT: return 'error';
            case TASK_ACTION_STATUS.REOPEN: return 'warning';
            case TASK_ACTION_STATUS.CLOSE: return 'info';
            default: return 'warning';
        }
    };

    const getActionStatusIcon = (status) => {
        switch(status) {
            case TASK_ACTION_STATUS.APPROVE: return <CheckCircleIcon />;
            case TASK_ACTION_STATUS.REJECT: return <CancelIcon />;
            case TASK_ACTION_STATUS.REOPEN: return <ReplayIcon />;
            case TASK_ACTION_STATUS.CLOSE: return <CloseIcon />;
            default: return <PendingIcon />;
        }
    };

    // Analytics calculations based on latest action status
    const getTaskAnalytics = () => {
        const totalTasks = tasks.length;
        const pendingTasks = tasks.filter(t => {
            const latestStatus = getLatestActionStatus(t);
            return latestStatus === TASK_ACTION_STATUS.PENDING;
        }).length;
        const approvedTasks = tasks.filter(t => {
            const latestStatus = getLatestActionStatus(t);
            return latestStatus === TASK_ACTION_STATUS.APPROVE;
        }).length;
        const rejectedTasks = tasks.filter(t => {
            const latestStatus = getLatestActionStatus(t);
            return latestStatus === TASK_ACTION_STATUS.REJECT;
        }).length;
        const closedTasks = tasks.filter(t => {
            const latestStatus = getLatestActionStatus(t);
            return latestStatus === TASK_ACTION_STATUS.CLOSE;
        }).length;
        const reopenedTasks = tasks.filter(t => {
            const latestStatus = getLatestActionStatus(t);
            return latestStatus === TASK_ACTION_STATUS.REOPEN;
        }).length;

        const approvalRate = totalTasks > 0 ? ((approvedTasks / totalTasks) * 100).toFixed(1) : 0;

        return {
            totalTasks,
            pendingTasks,
            approvedTasks,
            rejectedTasks,
            closedTasks,
            reopenedTasks,
            approvalRate
        };
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress size={60} thickness={4} />
            </Box>
        );
    }

    if (!project) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                    <AssignmentIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h4" gutterBottom>Project Not Found</Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        The project you're looking for doesn't exist or you don't have access to it.
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/home/projects')}
                        size="large"
                        sx={{ mt: 2, borderRadius: 2 }}
                    >
                        Back to Projects
                    </Button>
                </Paper>
            </Container>
        );
    }

    const taskAnalytics = getTaskAnalytics();

    // Permission checks
    const canCreateTask = can("TASK_CREATE");
    const canViewTasks = can("TASK_VIEW") || can("TASK_VIEW_ALL");
    const canAddTaskAction = can("TASK_ACTION_CREATE");

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            onClick={() => navigate('/home/projects')}
                            sx={{
                                mr: 2,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                                    transform: 'scale(1.1)'
                                }
                            }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h4" fontWeight="600">Project Details</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                            icon={<AssignmentIcon />}
                            label={`ID: ${project.id}`}
                            variant="outlined"
                            sx={{ borderRadius: 2 }}
                        />
                        <Chip
                            label={project.status}
                            color={project.status === 'RUNNING' ? 'success' : 'default'}
                            sx={{ borderRadius: 2 }}
                        />
                    </Box>
                </Box>

                {/* Alerts */}
                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3, borderRadius: 2 }}
                        onClose={() => setError(null)}
                    >
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert
                        severity="success"
                        sx={{ mb: 3, borderRadius: 2 }}
                        onClose={() => setSuccess("")}
                    >
                        {success}
                    </Alert>
                )}

                {/* Tabs */}
                <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                            bgcolor: alpha(theme.palette.background.paper, 0.8),
                            backdropFilter: 'blur(10px)',
                            '& .MuiTab-root': {
                                fontWeight: 600,
                                textTransform: 'none',
                                fontSize: '1rem',
                                minHeight: 64,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.05)
                                }
                            }
                        }}
                    >
                        <Tab icon={<TaskIcon />} label="Tasks" iconPosition="start" />
                        <Tab icon={<BarChartIcon />} label="Analytics" iconPosition="start" />
                        <Tab icon={<InfoIcon />} label="Information" iconPosition="start" />
                    </Tabs>

                    {/* Tasks Tab */}
                    <TabPanel value={tabValue} index={0}>
                        <Box sx={{ p: 3 }}>
                            <Stack spacing={3}>
                                {/* Header with Add Task Button */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                                    <Typography variant="h5" fontWeight="600">
                                        Project Tasks
                                    </Typography>
                                    {canCreateTask && (
                                        <Button
                                            variant="contained"
                                            startIcon={<AddIcon />}
                                            onClick={() => setAddTaskOpen(true)}
                                            sx={{ borderRadius: 2 }}
                                        >
                                            Add Task
                                        </Button>
                                    )}
                                </Box>

                                {/* Tasks List */}
                                {!canViewTasks ? (
                                    <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                                        <AssignmentIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                                        <Typography variant="h6" color="text.secondary" gutterBottom>
                                            Access Denied
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            You don't have permission to view tasks.
                                        </Typography>
                                    </Paper>
                                ) : tasks.length === 0 ? (
                                    <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                                        <TaskIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                                        <Typography variant="h6" color="text.secondary" gutterBottom>
                                            No Tasks Found
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {canCreateTask
                                                ? "Click the 'Add Task' button to create your first task."
                                                : "No tasks have been created for this project yet."}
                                        </Typography>
                                    </Paper>
                                ) : (
                                    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                                        <Table>
                                            <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                                                <TableRow>
                                                    <TableCell><Typography fontWeight="600">Task Description</Typography></TableCell>
                                                    <TableCell><Typography fontWeight="600">Assigned To</Typography></TableCell>
                                                    <TableCell><Typography fontWeight="600">Due Date</Typography></TableCell>
                                                    <TableCell><Typography fontWeight="600">Latest Action Status</Typography></TableCell>
                                                    <TableCell><Typography fontWeight="600">Actions</Typography></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {tasks.map((task) => {
                                                    const latestStatus = getLatestActionStatus(task);
                                                    return (
                                                        <TableRow key={task.id} hover>
                                                            <TableCell sx={{ maxWidth: 300 }}>
                                                                <Typography variant="body2" sx={{
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    display: '-webkit-box',
                                                                    WebkitLineClamp: 2,
                                                                    WebkitBoxOrient: 'vertical'
                                                                }}>
                                                                    {task.taskDescription}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.secondary.main }}>
                                                                        {task.employee?.name?.charAt(0) || '?'}
                                                                    </Avatar>
                                                                    <Typography variant="body2">{task.employee?.name || 'Unassigned'}</Typography>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>
                                                                {task.taskDoneDate ? new Date(task.taskDoneDate).toLocaleDateString() : 'Not set'}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    icon={getActionStatusIcon(latestStatus)}
                                                                    label={latestStatus}
                                                                    size="small"
                                                                    color={getActionStatusColor(latestStatus)}
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
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </Stack>
                        </Box>
                    </TabPanel>

                    {/* Analytics Tab */}
                    <TabPanel value={tabValue} index={1}>
                        <Box sx={{ p: 3 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <SectionCard title="Task Analytics (Based on Latest Action Status)" icon={BarChartIcon}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6} md={2.4}>
                                                <StatCard
                                                    title="Total Tasks"
                                                    value={taskAnalytics.totalTasks}
                                                    color="primary"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={2.4}>
                                                <StatCard
                                                    title="Pending"
                                                    value={taskAnalytics.pendingTasks}
                                                    color="warning"
                                                    subtitle={`${taskAnalytics.totalTasks > 0 ? ((taskAnalytics.pendingTasks / taskAnalytics.totalTasks) * 100).toFixed(1) : 0}%`}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={2.4}>
                                                <StatCard
                                                    title="Approved"
                                                    value={taskAnalytics.approvedTasks}
                                                    color="success"
                                                    subtitle={`${taskAnalytics.approvalRate}%`}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={2.4}>
                                                <StatCard
                                                    title="Rejected"
                                                    value={taskAnalytics.rejectedTasks}
                                                    color="error"
                                                    subtitle={`${taskAnalytics.totalTasks > 0 ? ((taskAnalytics.rejectedTasks / taskAnalytics.totalTasks) * 100).toFixed(1) : 0}%`}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={2.4}>
                                                <StatCard
                                                    title="Closed"
                                                    value={taskAnalytics.closedTasks}
                                                    color="info"
                                                    subtitle={`${taskAnalytics.totalTasks > 0 ? ((taskAnalytics.closedTasks / taskAnalytics.totalTasks) * 100).toFixed(1) : 0}%`}
                                                />
                                            </Grid>
                                        </Grid>

                                        {/* Task Status Distribution */}
                                        <Box sx={{ mt: 3 }}>
                                            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                                                Latest Action Status Distribution
                                            </Typography>
                                            <Stack spacing={2}>
                                                {[
                                                    { status: 'PENDING', count: taskAnalytics.pendingTasks, color: 'warning' },
                                                    { status: 'APPROVE', count: taskAnalytics.approvedTasks, color: 'success' },
                                                    { status: 'REJECT', count: taskAnalytics.rejectedTasks, color: 'error' },
                                                    { status: 'CLOSE', count: taskAnalytics.closedTasks, color: 'info' },
                                                    { status: 'REOPEN', count: taskAnalytics.reopenedTasks, color: 'warning' }
                                                ].map(item => {
                                                    const percentage = taskAnalytics.totalTasks > 0 ? (item.count / taskAnalytics.totalTasks) * 100 : 0;
                                                    if (item.count === 0 && percentage === 0) return null;
                                                    return (
                                                        <Box key={item.status}>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                                <Typography variant="body2">{item.status}</Typography>
                                                                <Typography variant="body2" fontWeight="600">
                                                                    {item.count} ({percentage.toFixed(1)}%)
                                                                </Typography>
                                                            </Box>
                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={percentage}
                                                                color={item.color}
                                                                sx={{
                                                                    height: 8,
                                                                    borderRadius: 4,
                                                                    bgcolor: alpha(theme.palette[item.color].main, 0.1)
                                                                }}
                                                            />
                                                        </Box>
                                                    );
                                                })}
                                            </Stack>
                                        </Box>
                                    </SectionCard>
                                </Grid>
                            </Grid>
                        </Box>
                    </TabPanel>

                    {/* Information Tab */}
                    <TabPanel value={tabValue} index={2}>
                        <Box sx={{ p: 3 }}>
                            <Grid container spacing={3}>
                                {/* Basic Information */}
                                <Grid item xs={12}>
                                    <SectionCard title="Basic Information" icon={InfoIcon}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Typography variant="h5" fontWeight="700" color="primary.main" gutterBottom>
                                                    {project.projectName}
                                                </Typography>
                                                <Typography variant="body1" color="text.secondary" paragraph>
                                                    {project.description || "No description provided"}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <InfoItem
                                                    label="Project ID"
                                                    value={project.id}
                                                    icon={AssignmentIcon}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <InfoItem
                                                    label="Project Code"
                                                    value={project.projectCode || 'N/A'}
                                                    icon={AssignmentIcon}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <InfoItem
                                                    label="Status"
                                                    value={project.status}
                                                    icon={WorkIcon}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <InfoItem
                                                    label="Created By"
                                                    value={project.createdBy?.name || 'N/A'}
                                                    icon={PersonIcon}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <InfoItem
                                                    label="Created Date"
                                                    value={new Date(project.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                    icon={CalendarIcon}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <InfoItem
                                                    label="Created Time"
                                                    value={new Date(project.createdAt).toLocaleTimeString()}
                                                    icon={AccessTimeIcon}
                                                />
                                            </Grid>
                                        </Grid>
                                    </SectionCard>
                                </Grid>

                                {/* Statistics Summary */}
                                <Grid item xs={12}>
                                    <SectionCard title="Statistics Summary" icon={BarChartIcon}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <StatCard
                                                    title="Total Tasks"
                                                    value={taskAnalytics.totalTasks}
                                                    color="primary"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <StatCard
                                                    title="Project Age"
                                                    value={project.createdAt ? Math.ceil((new Date() - new Date(project.createdAt)) / (1000 * 60 * 60 * 24)) : 0}
                                                    color="info"
                                                    subtitle="days"
                                                />
                                            </Grid>
                                        </Grid>
                                    </SectionCard>
                                </Grid>
                            </Grid>
                        </Box>
                    </TabPanel>
                </Paper>

                {/* Dialogs */}
                <AddTaskDialog
                    open={addTaskOpen}
                    onClose={() => setAddTaskOpen(false)}
                    projectId={id}
                    employees={employees}
                    onSuccess={handleAddTask}
                />

                <TaskDetailsDialog
                    open={taskDetailsOpen}
                    onClose={() => {
                        setTaskDetailsOpen(false);
                        setSelectedTask(null);
                    }}
                    task={selectedTask}
                    onRefresh={handleTaskRefresh}
                    canAddAction={canAddTaskAction}
                />
            </Container>
        </LocalizationProvider>
    );
};

export default ProjectDetailsPage;