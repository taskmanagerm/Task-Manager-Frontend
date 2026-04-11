import { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    MenuItem,
    Paper,
    Grid,
    Stack,
    IconButton,
    InputAdornment,
    Alert
} from "@mui/material";
import {
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Lock as LockIcon,
    Assignment as RoleIcon,
    Close as CloseIcon,
    Save as SaveIcon
} from "@mui/icons-material";
import { createUser, updateUser } from "./userService";

const roles = ["ADMIN", "MANAGER", "MEMBER"];

const initialState = {
    name: "",
    email: "",
    phoneNum: "",
    password: "",
    role: ""
};

const UserForm = ({ selectedUser, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    const isEdit = Boolean(selectedUser);

    useEffect(() => {
        if (selectedUser) {
            setFormData({
                name: selectedUser.name || "",
                email: selectedUser.email || "",
                phoneNum: selectedUser.phoneNum || "",
                password: "",
                role: selectedUser.roles?.[0]?.name || selectedUser.role || ""
            });
        } else {
            setFormData(initialState);
        }
        setErrors({});
        setApiError("");
    }, [selectedUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.phoneNum.trim()) {
            newErrors.phoneNum = "Phone number is required";
        }

        if (!isEdit && !formData.password) {
            newErrors.password = "Password is required";
        } else if (!isEdit && formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!formData.role) {
            newErrors.role = "Role is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setApiError("");

        const payload = {
            name: formData.name,
            email: formData.email,
            phoneNum: formData.phoneNum,
            role: formData.role
        };

        if (!isEdit) {
            payload.password = formData.password;
        }

        try {
            if (isEdit) {
                await updateUser(selectedUser.id, payload);
                onSuccess("User updated successfully!");
            } else {
                await createUser(payload);
                onSuccess("User created successfully!");
            }
        } catch (err) {
            console.error("Error saving user:", err);
            setApiError(err.response?.data?.message || "Failed to save user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper
            elevation={3}
            sx={{
                p: { xs: 2, sm: 4 },
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* API Error */}
            {apiError && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setApiError("")}>
                    {apiError}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    {/* Name Field */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Full Name *"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            error={!!errors.name}
                            helperText={errors.name}
                            disabled={loading}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                            placeholder="Enter user's full name"
                        />
                    </Grid>

                    {/* Email Field */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Email Address *"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                            disabled={loading}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                            placeholder="Enter email address"
                        />
                    </Grid>

                    {/* Phone Field */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Phone Number *"
                            name="phoneNum"
                            value={formData.phoneNum}
                            onChange={handleChange}
                            error={!!errors.phoneNum}
                            helperText={errors.phoneNum}
                            disabled={loading}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PhoneIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                            placeholder="Enter phone number"
                        />
                    </Grid>

                    {/* Password Field (only for create) */}
                    {!isEdit && (
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type="password"
                                label="Password *"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                error={!!errors.password}
                                helperText={errors.password}
                                disabled={loading}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                                placeholder="Enter password (min. 6 characters)"
                            />
                        </Grid>
                    )}

                    {/* Role Field */}
                    <Grid item xs={12}>
                        <TextField
                            select
                            fullWidth
                            label="Role *"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            error={!!errors.role}
                            helperText={errors.role}
                            disabled={loading}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <RoleIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                        >
                            <MenuItem value="" disabled>Select a role</MenuItem>
                            {roles.map(role => (
                                <MenuItem key={role} value={role}>
                                    {role}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* Form Summary */}
                    {formData.name && formData.role && (
                        <Grid item xs={12}>
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    bgcolor: 'grey.50',
                                    borderRadius: 2
                                }}
                            >
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Summary:
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Name:</strong> {formData.name} |
                                    <strong> Role:</strong> {formData.role} |
                                    <strong> Email:</strong> {formData.email}
                                </Typography>
                            </Paper>
                        </Grid>
                    )}

                    {/* Action Buttons */}
                    <Grid item xs={12}>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            sx={{ mt: 2 }}
                        >
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth={!isEdit}
                                disabled={loading}
                                startIcon={<SaveIcon />}
                                sx={{
                                    py: 1.5,
                                    borderRadius: 2,
                                    flex: isEdit ? 1 : 'none',
                                    minWidth: { sm: 200 }
                                }}
                            >
                                {loading ? 'Saving...' : (isEdit ? 'Update User' : 'Create User')}
                            </Button>

                            {isEdit && (
                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={onCancel}
                                    disabled={loading}
                                    fullWidth
                                    sx={{ py: 1.5, borderRadius: 2 }}
                                >
                                    Cancel
                                </Button>
                            )}
                        </Stack>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
};

export default UserForm;