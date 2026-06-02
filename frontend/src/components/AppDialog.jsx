import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

const emptyForm = { name: '', powerWatts: '', dailyHours: '' };

export function ApplianceDialog({ open, initialValue, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    setForm(initialValue || emptyForm);
  }, [initialValue, open]);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialValue ? 'Editar electrodoméstico' : 'Nuevo electrodoméstico'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Nombre" value={form.name} onChange={updateField('name')} fullWidth />
          <TextField
            label="Potencia (watts)"
            type="number"
            value={form.powerWatts}
            onChange={updateField('powerWatts')}
            fullWidth
          />
          <TextField
            label="Horas diarias"
            type="number"
            value={form.dailyHours}
            onChange={updateField('dailyHours')}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={() =>
            onSubmit({
              ...form,
              powerWatts: Number(form.powerWatts),
              dailyHours: Number(form.dailyHours),
            })
          }
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}