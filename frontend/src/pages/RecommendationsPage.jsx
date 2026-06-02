import { Alert, Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { energyApi } from '../api/energyApi';

export function RecommendationsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setData(await energyApi.recommendations());
      } catch (recommendationError) {
        setError(recommendationError.message || 'No fue posible cargar las recomendaciones');
      }
    };

    load();
  }, []);

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!data) {
    return <Typography>Cargando recomendaciones...</Typography>;
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 900 }}>
          Recomendaciones de ahorro
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sugerencias automáticas generadas a partir del consumo mensual.
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 900 }}>
            {data.totalConsumption} kWh
          </Typography>
          <Stack spacing={1.5}>
            {data.recommendations.map((item) => (
              <Alert key={item} severity="info">
                {item}
              </Alert>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}