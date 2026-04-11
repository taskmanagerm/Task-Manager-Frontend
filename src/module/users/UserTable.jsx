import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Stack,
    Chip,
    Avatar,
    Box,
    Typography,
    IconButton,
    Tooltip,
    CircularProgress
} from "@mui/material";
import {
    Visibility as ViewIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Person as PersonIcon
} from "@mui/icons-material";

const UserTable = ({ users, onView, onEdit, onDelete, loading }) => {

    const getRoleColor = (role) => {
        switch(role) {
            case 'ADMIN': return 'error';
            case 'MANAGER': return 'warning';
            case 'MEMBER': return 'info';
            default: return 'default';
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (users.length === 0) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                <PersonIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography color="text.secondary">No users found</Typography>
                <Typography variant="body2" color="text.disabled">
                    Click "Add User" to create your first user
                </Typography>
            </Paper>
        );
    }

    return (
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: 'grey.50' }}>
                        <TableCell><Typography fontWeight="600">User</Typography></TableCell>
                        <TableCell><Typography fontWeight="600">Email</Typography></TableCell>
                        <TableCell><Typography fontWeight="600">Role</Typography></TableCell>
                        <TableCell><Typography fontWeight="600">Phone</Typography></TableCell>
                        <TableCell align="right"><Typography fontWeight="600">Actions</Typography></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => {
                        const fullName = user.name || `${user.firstName || ""} ${user.lastName || ""}`;
                        const roleName = user.roles?.[0]?.name || user.role || "N/A";
                        const userInitial = fullName?.charAt(0)?.toUpperCase() || 'U';

                        return (
                            <TableRow
                                key={user.id}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: 'action.hover',
                                    },
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                bgcolor: roleName === 'ADMIN' ? 'error.light' :
                                                    roleName === 'MANAGER' ? 'warning.light' : 'info.light',
                                                fontSize: '1rem',
                                                fontWeight: 500
                                            }}
                                        >
                                            {userInitial}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body1" fontWeight="500">
                                                {fullName}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                ID: #{user.id}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>

                                <TableCell>
                                    <Typography variant="body2">{user.email}</Typography>
                                </TableCell>

                                <TableCell>
                                    <Chip
                                        label={roleName}
                                        size="small"
                                        color={getRoleColor(roleName)}
                                        sx={{
                                            fontWeight: 500,
                                            minWidth: 80
                                        }}
                                    />
                                </TableCell>

                                <TableCell>
                                    <Typography variant="body2">{user.phoneNum || '-'}</Typography>
                                </TableCell>

                                <TableCell align="right">
                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                        <Tooltip title="View Details">
                                            <IconButton
                                                size="small"
                                                color="info"
                                                onClick={() => onView(user)}
                                                sx={{
                                                    bgcolor: 'info.50',
                                                    '&:hover': { bgcolor: 'info.100' }
                                                }}
                                            >
                                                <ViewIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Edit User">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => onEdit(user)}
                                                sx={{
                                                    bgcolor: 'primary.50',
                                                    '&:hover': { bgcolor: 'primary.100' }
                                                }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Delete User">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => onDelete(user.id)}
                                                sx={{
                                                    bgcolor: 'error.50',
                                                    '&:hover': { bgcolor: 'error.100' }
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UserTable;