import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "./userService";
import UserTable from "./UserTable";
import UserForm from "./UserForm";
import UserViewDialog from "./UserViewDialog";
import {
    Box,
    Button,
    Typography,
    Paper,
    Container,
    Alert,
    Snackbar,
    Fab,
    Zoom,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Backdrop,
    CircularProgress
} from "@mui/material";
import {
    Add as AddIcon,
    People as PeopleIcon,
    Close as CloseIcon
} from "@mui/icons-material";

const UserPage = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editUser, setEditUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState("");
    const [viewDialogOpen, setViewDialogOpen] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await getUsers();
            setUsers(res.data.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            await deleteUser(id);
            setSuccess("User deleted successfully!");
            fetchUsers();
        } catch (err) {
            console.error("Error deleting user:", err);
            setError("Failed to delete user");
        }
    };

    const handleFormSuccess = (message) => {
        setShowForm(false);
        setEditUser(null);
        setSuccess(message);
        fetchUsers();
    };

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setViewDialogOpen(true);
    };

    const handleCloseViewDialog = () => {
        setViewDialogOpen(false);
        setSelectedUser(null);
    };

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
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: { xs: 'wrap', sm: 'nowrap' },
                    gap: 2
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <PeopleIcon sx={{ fontSize: 40 }} />
                    <Box>
                        <Typography variant="h4" fontWeight="600">
                            User Management
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                            Manage system users, roles, and permissions
                        </Typography>
                    </Box>
                </Box>

                <Button
                    variant="contained"
                    size="large"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        setEditUser(null);
                        setShowForm(true);
                    }}
                    sx={{
                        borderRadius: 2,
                        px: 4,
                        py: 1.2,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.3)',
                        },
                        width: { xs: '100%', sm: 'auto' }
                    }}
                >
                    Add User
                </Button>
            </Paper>

            {/* Error Alert */}
            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3, borderRadius: 2 }}
                    onClose={() => setError(null)}
                >
                    {error}
                </Alert>
            )}

            {/* User Form Dialog - FIXED SPACING ISSUE */}
            <Dialog
                open={showForm}
                onClose={() => {
                    setShowForm(false);
                    setEditUser(null);
                }}
                maxWidth="md"
                fullWidth
                scroll="body"
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        m: 2,
                        maxHeight: 'calc(100% - 64px)'
                    }
                }}
                BackdropComponent={Backdrop}
                BackdropProps={{
                    sx: { backgroundColor: 'rgba(0,0,0,0.5)' }
                }}
            >
                <DialogTitle sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    py: 2,
                    px: 3
                }}>
                    <Typography variant="h6" fontWeight="600">
                        {editUser ? 'Edit User' : 'Add New User'}
                    </Typography>
                    <IconButton
                        edge="end"
                        onClick={() => {
                            setShowForm(false);
                            setEditUser(null);
                        }}
                        size="small"
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 0, overflowY: 'auto' }}>
                    <UserForm
                        selectedUser={editUser}
                        onSuccess={(message) => handleFormSuccess(message || "User saved successfully!")}
                        onCancel={() => {
                            setShowForm(false);
                            setEditUser(null);
                        }}
                    />
                </DialogContent>
            </Dialog>

            {/* Users Table */}
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                    flexWrap: 'wrap',
                    gap: 2
                }}>
                    <Typography variant="h5" fontWeight="600">
                        Users List
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{
                        bgcolor: 'grey.100',
                        px: 2,
                        py: 1,
                        borderRadius: 2
                    }}>
                        Total: {users.length} users
                    </Typography>
                </Box>

                <UserTable
                    users={users}
                    onView={handleViewUser}
                    onEdit={(user) => {
                        setEditUser(user);
                        setShowForm(true);
                    }}
                    onDelete={handleDelete}
                    loading={loading}
                />
            </Paper>

            <UserViewDialog
                open={viewDialogOpen}
                user={selectedUser}
                onClose={handleCloseViewDialog}
            />

            {/* Success Snackbar */}
            <Snackbar
                open={!!success}
                autoHideDuration={3000}
                onClose={() => setSuccess("")}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSuccess("")} severity="success" sx={{ width: '100%' }}>
                    {success}
                </Alert>
            </Snackbar>

            {/* Floating Action Button for Mobile */}
            {!showForm && (
                <Zoom in={true}>
                    <Fab
                        color="primary"
                        sx={{
                            position: 'fixed',
                            bottom: 16,
                            right: 16,
                            display: { xs: 'flex', md: 'none' },
                            boxShadow: 4
                        }}
                        onClick={() => {
                            setEditUser(null);
                            setShowForm(true);
                        }}
                    >
                        <AddIcon />
                    </Fab>
                </Zoom>
            )}
        </Container>
    );
};

export default UserPage;