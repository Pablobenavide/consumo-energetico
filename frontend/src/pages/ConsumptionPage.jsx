import { Alert, Box, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { energyApi } from '../api/energyApi';

export function ConsumptionPage() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setSummary(await energyApi.consumptionSummary());
      } catch (consumptionError) {
        setError(consumptionError.message || 'No fue posible cargar el consumo');
      }
    };

    load();
  }, []);

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!summary) {
    return <Typography>Cargando consumo...</Typography>;
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 900 }}>
          Consumo total
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Resumen consolidado del gasto energético del hogar.
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={1}>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>
            {summary.totalConsumption} kWh
          </Typography>
          <Typography variant="body2">Electrodomésticos: {summary.applianceCount}</Typography>
          <Typography variant="body2">Promedio: {summary.averageConsumption} kWh</Typography>
        </Stack>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 800 }}>
          Historial
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Electrodoméstico</TableCell>
              <TableCell>kWh</TableCell>
              <TableCell>Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {summary.history.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.appliance_name}</TableCell>
                <TableCell>{entry.kwh}</TableCell>
                <TableCell>{new Date(entry.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
}