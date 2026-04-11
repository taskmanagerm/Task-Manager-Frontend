import { useState } from "react";
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Alert,
    InputAdornment,
    IconButton,
    CircularProgress,
    Fade,
    Zoom
} from "@mui/material";
import {
    Email as EmailIcon,
    Lock as LockIcon,
    Visibility,
    VisibilityOff,
    Login as LoginIcon
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../app/authSlice";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Login = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState({ email: false, password: false });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Validation
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const isFormValid = () => {
        return form.email.trim() !== "" &&
            form.password.trim() !== "" &&
            validateEmail(form.email);
    };

    const getEmailError = () => {
        if (!touched.email) return "";
        if (!form.email) return "Email is required";
        if (!validateEmail(form.email)) return "Please enter a valid email";
        return "";
    };

    const getPasswordError = () => {
        if (!touched.password) return "";
        if (!form.password) return "Password is required";
        if (form.password.length < 6) return "Password must be at least 6 characters";
        return "";
    };

    const handleLogin = async () => {
        // Mark all fields as touched
        setTouched({ email: true, password: true });

        // Validate before submitting
        if (!isFormValid()) {
            setError("Please fill all fields correctly");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await API.post("/user/login", form);

            const userData = res.data.data;

            // Dispatch login data to Redux
            dispatch(loginSuccess(userData));

            // Save auth info in localStorage
            localStorage.setItem(
                "auth",
                JSON.stringify({
                    user: userData,
                    token: userData.token
                })
            );

            // Navigate to home
            navigate("/home/projects", { replace: true });
        } catch (err) {
            console.log(err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !loading && isFormValid()) {
            handleLogin();
        }
    };

    const handleBlur = (field) => {
        setTouched({ ...touched, [field]: true });
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                p: 2
            }}
        >
            <Zoom in={true} timeout={500}>
                <Container maxWidth="sm">
                    <Paper
                        elevation={10}
                        sx={{
                            p: { xs: 3, sm: 5 },
                            borderRadius: 4,
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        {/* Header */}
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Typography
                                variant="h4"
                                component="h1"
                                gutterBottom
                                sx={{
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent'
                                }}
                            >
                                Welcome Back
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Sign in to continue to your account
                            </Typography>
                        </Box>

                        {/* Error Alert */}
                        <Fade in={!!error}>
                            <Alert
                                severity="error"
                                sx={{ mb: 3, borderRadius: 2 }}
                                onClose={() => setError("")}
                            >
                                {error}
                            </Alert>
                        </Fade>

                        {/* Form */}
                        <Box component="form" noValidate>
                            {/* Email Field */}
                            <TextField
                                fullWidth
                                label="Email Address"
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                onBlur={() => handleBlur('email')}
                                onKeyPress={handleKeyPress}
                                error={!!getEmailError()}
                                helperText={getEmailError()}
                                disabled={loading}
                                sx={{ mb: 3 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                                placeholder="Enter your email"
                            />

                            {/* Password Field */}
                            <TextField
                                fullWidth
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                onBlur={() => handleBlur('password')}
                                onKeyPress={handleKeyPress}
                                error={!!getPasswordError()}
                                helperText={getPasswordError()}
                                disabled={loading}
                                sx={{ mb: 2 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon color="primary" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                placeholder="Enter your password"
                            />

                            {/* Login Button */}
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                onClick={handleLogin}
                                disabled={loading || !isFormValid()}
                                sx={{
                                    py: 1.5,
                                    borderRadius: 2,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #5a6fd6 0%, #6a4292 100%)',
                                    }
                                }}
                                startIcon={!loading && <LoginIcon />}
                            >
                                {loading ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                                        Logging in...
                                    </Box>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>

                        </Box>

                    </Paper>
                </Container>
            </Zoom>
        </Box>
    );
};

export default Login;