import { useState } from "react";
import {
    TextField,
    Button,
    Paper,
    Typography,
    Autocomplete,
    Chip,
    Grid,
    Box,
    Alert,
    Snackbar,
    Divider,
    useTheme,
    useMediaQuery
} from "@mui/material";
import {
    Add as AddIcon,
    Close as CloseIcon,
    Save as SaveIcon
} from "@mui/icons-material";
import { addProject } from "./projectService";

const ProjectForm = ({ refresh }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [projectCode, setProjectCode] = useState("");
    const [projectName, setProjectName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const validateForm = () => {
        if (!projectName.trim()) {
            setError("Project name is required");
            return false;
        }
        if (!projectCode.trim()) {
            setError("Project code is required");
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setError("");

        try {
            await addProject({
                projectCode: projectCode.trim(),
                projectName: projectName.trim(),
                description: description.trim(),
            });

            // Reset form
            setProjectCode("");
            setProjectName("");
            setDescription("");
            setSuccess(true);
            refresh();
        } catch (err) {
            console.error("Error creating project:", err);
            setError(err.response?.data?.message || "Failed to create project");
        } finally {
            setLoading(false);
        }
    };

    const handleClearForm = () => {
        setProjectCode("");
        setProjectName("");
        setDescription("");
        setError("");
    };

    return (
        <Paper
            elevation={3}
            sx={{
                p: { xs: 2, sm: 3, md: 4 },
                borderRadius: 3,
                background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
            }}
        >
            {/* Header */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 3,
                pb: 2,
                borderBottom: `2px solid ${theme.palette.primary.light}`,
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AddIcon color="primary" />
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 600,
                            fontSize: { xs: '1.25rem', sm: '1.5rem' }
                        }}
                    >
                        Create New Project
                    </Typography>
                </Box>

                {/* Clear button */}
                <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<CloseIcon />}
                    onClick={handleClearForm}
                    disabled={loading}
                    sx={{
                        borderRadius: 2,
                        display: { xs: 'none', sm: 'flex' }
                    }}
                >
                    Clear Form
                </Button>
            </Box>

            {/* Error Alert */}
            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3, borderRadius: 2 }}
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>
            )}

            {/* Form Grid - Vertical Alignment */}
            <Grid
                container
                spacing={3}
                direction="column"
                sx={{ width: '100%', mx: 'auto' }}
            >

                {/* Project Code */}
                <Grid item xs={12}>
                    <TextField
                        label="Project Code"
                        fullWidth
                        required
                        value={projectCode}
                        onChange={(e) => setProjectCode(e.target.value)}
                        error={!projectCode.trim() && !!error}
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                transition: 'all 0.3s',
                                '&:hover': {
                                    boxShadow: theme.shadows[2]
                                },
                                '&.Mui-focused': {
                                    boxShadow: theme.shadows[3]
                                }
                            }
                        }}
                        placeholder="Enter project name"
                        disabled={loading}
                    />
                </Grid>

                {/* Project Name */}
                <Grid item xs={12}>
                    <TextField
                        label="Project Name *"
                        fullWidth
                        required
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        error={!projectName.trim() && !!error}
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                transition: 'all 0.3s',
                                '&:hover': {
                                    boxShadow: theme.shadows[2]
                                },
                                '&.Mui-focused': {
                                    boxShadow: theme.shadows[3]
                                }
                            }
                        }}
                        placeholder="Enter project name"
                        disabled={loading}
                    />
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        rows={isMobile ? 3 : 4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                transition: 'all 0.3s',
                                '&:hover': {
                                    boxShadow: theme.shadows[2]
                                }
                            }
                        }}
                        placeholder="Describe the project goals, objectives, and scope..."
                        disabled={loading}
                    />
                </Grid>

                {/* Action Buttons */}
                <Grid item xs={12}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2,
                        mt: 2,
                        pt: 2,
                        borderTop: `1px solid ${theme.palette.divider}`
                    }}>
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth={isMobile}
                            onClick={handleSubmit}
                            disabled={loading}
                            startIcon={loading ? null : <SaveIcon />}
                            sx={{
                                py: 1.5,
                                borderRadius: 2,
                                fontWeight: 600,
                                fontSize: '1rem',
                                flex: { sm: 1 },
                                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                                '&:hover': {
                                    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                                }
                            }}
                        >
                            {loading ? "Creating Project..." : "Create Project"}
                        </Button>

                        {/* Mobile clear button */}
                        {isMobile && (
                            <Button
                                variant="outlined"
                                color="error"
                                size="large"
                                fullWidth
                                onClick={handleClearForm}
                                disabled={loading}
                                startIcon={<CloseIcon />}
                                sx={{ borderRadius: 2 }}
                            >
                                Clear Form
                            </Button>
                        )}
                    </Box>
                </Grid>
            </Grid>

            {/* Success Snackbar */}
            <Snackbar
                open={success}
                autoHideDuration={3000}
                onClose={() => setSuccess(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    severity="success"
                    onClose={() => setSuccess(false)}
                    sx={{
                        width: '100%',
                        borderRadius: 2,
                        boxShadow: theme.shadows[3]
                    }}
                >
                    Project created successfully!
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default ProjectForm;