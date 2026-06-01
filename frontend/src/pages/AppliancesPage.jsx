import { Alert, Box, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useEffect, useState } from 'react';
import { energyApi } from '../api/energyApi';
import { ApplianceDialog } from '../components/AppDialog';

export function AppliancesPage() {
  const [appliances, setAppliances] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const loadAppliances = async () => {
    try {
      const response = await energyApi.listAppliances();
      setAppliances(response);
    } catch (applianceError) {
      setError(applianceError.message || 'No fue posible cargar los electrodomésticos');
    }
  };

  useEffect(() => {
    loadAppliances();
  }, []);

  const submit = async (payload) => {
    if (editing) {
      await energyApi.updateAppliance(editing.id, payload);
    } else {
      await energyApi.createAppliance(payload);
    }
    setDialogOpen(false);
    setEditing(null);
    await loadAppliances();
  };

  const remove = async (id) => {
    await energyApi.deleteAppliance(id);
    await loadAppliances();
  };

  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            Electrodomésticos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Crea, edita y elimina dispositivos con su potencia y horas de uso.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          Nuevo electrodoméstico
        </Button>
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <Grid container spacing={2}>
        {appliances.map((appliance) => (
          <Grid item xs={12} md={6} key={appliance.id}>
            <Card>
              <CardContent>
                <Stack spacing={1.5}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {appliance.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {appliance.powerWatts} watts · {appliance.dailyHours} horas/día · {appliance.monthlyKwh} kWh/mes
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<EditOutlinedIcon />}
                      onClick={() => {
                        setEditing(appliance);
                        setDialogOpen(true);
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteOutlineIcon />}
                      onClick={() => remove(appliance.id)}
                    >
                      Eliminar
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <ApplianceDialog
        open={dialogOpen}
        initialValue={editing}
        onClose={() => {
          setDialogOpen(false);
          setEditing(null);
        }}
        onSubmit={submit}
      />
    </Stack>
  );
}