import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Paper,
    Container,
    Alert,
    Snackbar,
    CircularProgress,
    Button,
    Collapse,
    Fab,
    Zoom,
    useTheme,
    useMediaQuery
} from "@mui/material";
import {
    Add as AddIcon,
    Close as CloseIcon,
} from "@mui/icons-material";
import { getProjects } from "./projectService";
import ProjectForm from "./ProjectForm";
import ProjectTable from "./ProjectTable";
import useAccess from "../../hooks/useAccess.js";

const ProjectPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const { can } = useAccess();

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const res = await getProjects();
            setProjects(res.data.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching projects:", err);
            setError("Failed to load projects");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleViewProject = (project) => {
        navigate(`/home/projects/${project.id}`); // Navigate to user profile
    };

    const handleCreateSuccess = () => {
        setSuccessMessage("Project created successfully!");
        setShowCreateForm(false);
        fetchProjects();
    };

    const handleCloseSnackbar = () => {
        setSuccessMessage("");
    };

    const toggleCreateForm = () => {
        setShowCreateForm(!showCreateForm);
    };

    return (
        <Container
            maxWidth="xl"
            sx={{
                py: { xs: 2, sm: 3, md: 4 },
                px: { xs: 2, sm: 3 }
            }}
        >
            {/* Header Section */}
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, sm: 3 },
                    mb: 3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    color: 'white',
                    borderRadius: 3,
                    boxShadow: theme.shadows[5]
                }}
            >
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 2
                }}>
                    <Box>
                        <Typography
                            variant={isMobile ? "h5" : "h4"}
                            fontWeight="600"
                            sx={{ mb: 1 }}
                        >
                            Project Management
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                opacity: 0.9,
                                fontSize: { xs: '0.9rem', sm: '1rem' }
                            }}
                        >
                            Manage and track all your projects in one place
                        </Typography>
                    </Box>

                    {/* Create Project Button - Only for users with permission */}
                    {can("PROJECT_CREATE") && (
                        <Button
                            variant="contained"
                            color="secondary"
                            size={isMobile ? "medium" : "large"}
                            startIcon={showCreateForm ? <CloseIcon /> : <AddIcon />}
                            onClick={toggleCreateForm}
                            sx={{
                                borderRadius: 2,
                                px: { xs: 2, sm: 3 },
                                py: { xs: 1, sm: 1.5 },
                                backgroundColor: 'white',
                                color: 'primary.main',
                                '&:hover': {
                                    backgroundColor: 'grey.100',
                                },
                                boxShadow: theme.shadows[3],
                                minWidth: { xs: '100%', sm: 'auto' }
                            }}
                        >
                            {showCreateForm ? 'Close Form' : 'Create Project'}
                        </Button>
                    )}
                </Box>
            </Paper>

            {/* Error Alert */}
            <Collapse in={!!error}>
                <Alert
                    severity="error"
                    sx={{ mb: 3, borderRadius: 2 }}
                    onClose={() => setError(null)}
                >
                    {error}
                </Alert>
            </Collapse>

            {/* Create Project Form - Collapsible */}
            {can("PROJECT_CREATE") && (
                <Collapse in={showCreateForm} timeout="auto" unmountOnExit>
                    <Box sx={{ mb: 4 }}>
                        <ProjectForm
                            refresh={handleCreateSuccess}
                        />
                    </Box>
                </Collapse>
            )}

            {/* Projects List Section */}
            {can("PROJECT_VIEW") ? (
                <Paper
                    elevation={2}
                    sx={{
                        p: { xs: 2, sm: 3 },
                        borderRadius: 3,
                        overflow: 'hidden'
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 3,
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2
                    }}>
                        <Typography
                            variant="h5"
                            fontWeight="600"
                            sx={{
                                color: 'text.primary',
                                fontSize: { xs: '1.25rem', sm: '1.5rem' }
                            }}
                        >
                            Projects List
                        </Typography>

                        {/* Quick action button for mobile */}
                        {can("PROJECT_CREATE") && !showCreateForm && isMobile && (
                            <Fab
                                color="primary"
                                size="medium"
                                onClick={toggleCreateForm}
                                sx={{
                                    position: 'fixed',
                                    bottom: 16,
                                    right: 16,
                                    zIndex: 1000,
                                    boxShadow: theme.shadows[8]
                                }}
                            >
                                <AddIcon />
                            </Fab>
                        )}
                    </Box>

                    {loading ? (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            py: 8
                        }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <ProjectTable
                            projects={projects}
                            onView={handleViewProject}
                            refresh={fetchProjects}
                        />
                    )}
                </Paper>
            ) : (
                <Paper
                    elevation={2}
                    sx={{
                        p: 4,
                        borderRadius: 2,
                        textAlign: 'center',
                        backgroundColor: 'grey.50'
                    }}
                >
                    <Typography color="text.secondary">
                        You don't have permission to view projects
                    </Typography>
                </Paper>
            )}

            {/* Success Snackbar */}
            <Snackbar
                open={!!successMessage}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                TransitionComponent={Zoom}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity="success"
                    sx={{
                        width: '100%',
                        borderRadius: 2,
                        boxShadow: theme.shadows[3]
                    }}
                >
                    {successMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ProjectPage;