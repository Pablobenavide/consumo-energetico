import { Alert, Box, Grid, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, Legend, LineElement, LinearScale, PointElement, Tooltip } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { energyApi } from '../api/energyApi';
import { MetricCard } from '../components/MetricCard';

ChartJS.register(ArcElement, BarElement, CategoryScale, Legend, LineElement, LinearScale, PointElement, Tooltip);

export function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [summaryResponse, recommendationsResponse] = await Promise.all([
          energyApi.consumptionSummary(),
          energyApi.recommendations(),
        ]);
        setSummary(summaryResponse);
        setRecommendations(recommendationsResponse.recommendations || []);
      } catch (dashboardError) {
        setError(dashboardError.message || 'No fue posible cargar el dashboard');
      }
    };

    load();
  }, []);

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!summary) {
    return <Typography>Cargando dashboard...</Typography>;
  }

  const pieData = {
    labels: summary.appliances.map((item) => item.name),
    datasets: [
      {
        data: summary.appliances.map((item) => item.monthlyKwh),
        backgroundColor: ['#9be15d', '#0ea5e9', '#f59e0b', '#ef4444', '#a855f7'],
      },
    ],
  };

  const barData = {
    labels: summary.monthlySeries.map((item) => item.label),
    datasets: [
      {
        label: 'kWh mensual',
        data: summary.monthlySeries.map((item) => item.kwh),
        backgroundColor: '#0ea5e9',
      },
    ],
  };

  const lineData = {
    labels: summary.history.map((item) => new Date(item.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: 'Histórico',
        data: summary.history.map((item) => item.kwh),
        borderColor: '#9be15d',
        backgroundColor: 'rgba(155,225,93,0.18)',
        fill: true,
      },
    ],
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 900 }}>
          Bienvenido al panel energético
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitorea el consumo, identifica patrones y mejora la eficiencia del hogar.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <MetricCard label="Consumo total" value={`${summary.totalConsumption} kWh`} helper="Consumo mensual consolidado" />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard label="Electrodomésticos" value={summary.applianceCount} helper="Dispositivos registrados" tone="secondary" />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard label="Promedio" value={`${summary.averageConsumption} kWh`} helper="Promedio por electrodoméstico" />
        </Grid>
      </Grid>

      {recommendations.length ? (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 800 }}>
            Recomendaciones automáticas
          </Typography>
          <Stack spacing={1}>
            {recommendations.map((item) => (
              <Typography key={item} variant="body2">
                {item}
              </Typography>
            ))}
          </Stack>
        </Paper>
      ) : null}

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, minHeight: 360 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 800 }}>
              Consumo por electrodoméstico
            </Typography>
            <Pie data={pieData} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, minHeight: 360 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 800 }}>
              Consumo mensual
            </Typography>
            <Bar data={barData} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, minHeight: 360 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 800 }}>
              Historial de consumo
            </Typography>
            <Line data={lineData} />
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}