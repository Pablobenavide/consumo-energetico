import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinkStyle = ({ isActive }) => ({
  color: isActive ? '#9be15d' : '#cbd5e1',
  textDecoration: 'none',
  fontWeight: 700,
});

export function Shell() {
  const { user, signOut } = useAuth();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, rgba(155,225,93,0.22), transparent 24%), radial-gradient(circle at top right, rgba(14,165,233,0.18), transparent 28%), linear-gradient(180deg, #07111f 0%, #091726 45%, #050b14 100%)',
      }}
    >
      <AppBar position="sticky" color="transparent" elevation={0}>
        <Toolbar sx={{ borderBottom: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(18px)' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: 0.4, flexGrow: 1 }}>
            EnergyHome
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mr: 3 }}>
            <NavLink to="/" style={navLinkStyle} end>
              Dashboard
            </NavLink>
            <NavLink to="/appliances" style={navLinkStyle}>
              Electrodomésticos
            </NavLink>
            <NavLink to="/consumption" style={navLinkStyle}>
              Consumo
            </NavLink>
            <NavLink to="/recommendations" style={navLinkStyle}>
              Recomendaciones
            </NavLink>
          </Box>
          <Typography variant="body2" sx={{ mr: 2, color: 'text.secondary' }}>
            {user?.name}
          </Typography>
          <Button variant="outlined" color="primary" onClick={signOut}>
            Salir
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}