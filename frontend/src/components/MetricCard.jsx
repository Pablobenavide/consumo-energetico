import { Card, CardContent, Stack, Typography } from '@mui/material';

export function MetricCard({ label, value, helper, tone = 'primary' }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="overline" sx={{ fontWeight: 800, color: `${tone}.main` }}>
            {label}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {helper}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}