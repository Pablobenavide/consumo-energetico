import { Alert, Box, Button, Card, CardContent, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { energyApi } from '../api/energyApi';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { authenticate } = useAuth();
  const [form, setForm] = useState({ email: 'demo@energyhome.com', password: 'Password123!' });
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const result = await energyApi.login(form);
      authenticate(result);
      navigate('/', { replace: true });
    } catch (loginError) {
      setError(loginError.message || 'No fue posible iniciar sesión');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', px: 2, py: 6 }}>
      <Card sx={{ width: '100%', maxWidth: 480 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 900 }}>
            EnergyHome
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Accede al dashboard energético del hogar.
          </Typography>
          {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
          <Box component="form" onSubmit={submit} sx={{ display: 'grid', gap: 2 }}>
            <TextField
              label="Correo"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Contraseña"
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              fullWidth
            />
            <Button type="submit" variant="contained" size="large">
              Iniciar sesión
            </Button>
          </Box>
          <Typography variant="body2" sx={{ mt: 2 }}>
            ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}