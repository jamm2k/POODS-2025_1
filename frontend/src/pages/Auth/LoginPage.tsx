import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  RestaurantMenu,
  Email,
  Lock
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { login, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Por favor, insira um e-mail válido.');
      setEmailError(true);
      return;
    }

    if (password.length < 3) {
      setError('A senha deve ter no mínimo 3 caracteres.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const user = await login(email, password);

      switch (user.tipoUsuario) {
        case 'ADMIN':
          navigate('/admin');
          break;
        case 'GARCOM':
          navigate('/garcom');
          break;
        case 'COZINHEIRO':
          navigate('/cozinha');
          break;
        default:
          navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'E-mail ou senha incorretos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0d6869ff 0%, #0e4775ff 100%)',
        }}
      >
        <CircularProgress size={60} sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0d6869ff 0%, #0e4775ff 100%)',
        overflow: 'auto',
        p: 2,
      }}
    >
      <Paper
        elevation={12}
        sx={{
          p: { xs: 3, sm: 4 },
          width: '100%',
          maxWidth: { xs: 360, sm: 400 },
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          background: '#FFFFFF',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 0.5 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 1.5,
            }}
          >
            <Box
              sx={{
                width: { xs: 60, sm: 70 },
                height: { xs: 60, sm: 70 },
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0B5D5E 0%, #0E7575 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(11, 93, 94, 0.4)',
              }}
            >
              <RestaurantMenu sx={{ fontSize: { xs: 32, sm: 36 }, color: 'white' }} />
            </Box>
          </Box>

          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              background: 'linear-gradient(135deg, #0B5D5E 0%, #0E7575 100%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '1.5rem', sm: '1.75rem' },
            }}
          >
            Restaurante
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
            Sistema de Gestão
          </Typography>
        </Box>

        <Box sx={{ height: 1, background: 'linear-gradient(90deg, transparent, #e0e0e0, transparent)', my: 0.5 }} />

        {error && (
          <Alert
            severity="error"
            onClose={() => setError(null)}
            sx={{ borderRadius: 2, py: 0.5 }}
          >
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}
        >
          <TextField
            label="E-mail"
            variant="outlined"
            type="email"
            value={email}
            onChange={handleEmailChange}
            error={emailError}
            helperText={emailError ? 'E-mail inválido' : ''}
            fullWidth
            required
            autoComplete="email"
            autoFocus
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color={emailError ? 'error' : 'action'} sx={{ fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />

          <TextField
            label="Senha"
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            autoComplete="current-password"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" sx={{ fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    tabIndex={-1}
                    size="small"
                  >
                    {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              py: 1.25,
              mt: 0.5,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #0B5D5E 0%, #0E7575 100%)',
              fontSize: { xs: '0.95rem', sm: '1rem' },
              fontWeight: 'bold',
              textTransform: 'none',
              boxShadow: '0 4px 15px rgba(11, 93, 94, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #094d4e 0%, #0c6464 100%)',
                boxShadow: '0 6px 20px rgba(11, 93, 94, 0.6)',
              },
              '&:disabled': {
                background: '#ccc',
              },
            }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={18} color="inherit" />
                <span>Entrando...</span>
              </Box>
            ) : (
              'Entrar'
            )}
          </Button>
        </Box>

        <Box sx={{ mt: 1.5, pt: 1.5, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>Admin</Typography>
            <Typography variant="caption" color="text.secondary">•</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>Garçom</Typography>
            <Typography variant="caption" color="text.secondary">•</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>Cozinheiro</Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;