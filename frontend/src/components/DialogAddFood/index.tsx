import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useForm, Controller } from 'react-hook-form';
import type { IFood } from '../../interfaces/IFoods';

interface DialogAddFoodProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<IFood, 'id'>) => void;
  isPending: boolean;
}

const FIELD_SX = {
  '& .MuiOutlinedInput-root': {
    color: '#f0f0f0',
    borderRadius: 2,
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(102,187,106,0.4)' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#66bb6a', borderWidth: '1.5px' },
  },
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
  '& .MuiInputLabel-root': { color: '#757575' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#66bb6a' },
  '& .MuiFormHelperText-root': { color: '#ef5350' },
};

const MACROS = [
  { name: 'calories' as keyof Omit<IFood, 'id'>, label: 'Calorias (kcal)', color: '#ef5350' },
  { name: 'protein' as keyof Omit<IFood, 'id'>, label: 'Proteínas (g)', color: '#66bb6a' },
  { name: 'carbohydrate' as keyof Omit<IFood, 'id'>, label: 'Carboidratos (g)', color: '#ffa726' },
  { name: 'fat' as keyof Omit<IFood, 'id'>, label: 'Gorduras (g)', color: '#ab47bc' },
  { name: 'fiber' as keyof Omit<IFood, 'id'>, label: 'Fibras (g)', color: '#29b6f6' },
];

export const DialogAddFood = ({ open, onClose, onSubmit, isPending }: DialogAddFoodProps) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<Omit<IFood, 'id'>>({
    defaultValues: { name: '', food_type: '', quantity: 0, calories: 0, protein: 0, carbohydrate: 0, fat: 0, fiber: 0 },
  });

  const handleClose = () => { reset(); onClose(); };
  const handleFormSubmit = (data: Omit<IFood, 'id'>) => { onSubmit(data); reset(); };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ background: '#1a1a1a', color: '#f0f0f0' }}>
        Adicionar Alimento
      </DialogTitle>
      <DialogContent sx={{ background: '#1a1a1a', pt: '20px !important' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Basic info */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Controller name="name" control={control} rules={{ required: 'Nome é obrigatório' }} render={({ field }) => (
              <TextField {...field} label="Nome do Alimento" fullWidth error={!!errors.name} helperText={errors.name?.message} sx={FIELD_SX} />
            )} />
            <Controller name="food_type" control={control} rules={{ required: 'Tipo é obrigatório' }} render={({ field }) => (
              <TextField {...field} label="Tipo / Grupo" fullWidth error={!!errors.food_type} helperText={errors.food_type?.message} sx={FIELD_SX} />
            )} />
          </Box>
          <Controller name="quantity" control={control} rules={{ required: 'Quantidade é obrigatória' }} render={({ field }) => (
            <TextField {...field} label="Quantidade de referência (g)" type="number" fullWidth error={!!errors.quantity} helperText={errors.quantity?.message} sx={FIELD_SX} />
          )} />

          {/* Macros section */}
          <Box sx={{ pt: 1, pb: 0.5 }}>
            <Typography sx={{ color: '#616161', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', mb: 1.5 }}>
              Informação Nutricional (por porção)
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              {MACROS.map((m) => (
                <Controller key={m.name} name={m.name} control={control} render={({ field }) => (
                  <TextField
                    {...field}
                    label={m.label}
                    type="number"
                    fullWidth
                    sx={{
                      ...FIELD_SX,
                      '& .MuiInputLabel-root.Mui-focused': { color: m.color },
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: m.color },
                    }}
                  />
                )} />
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ background: '#1a1a1a', gap: 1 }}>
        <Button onClick={handleClose} sx={{ color: '#616161' }}>Cancelar</Button>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          variant="contained"
          disabled={isPending}
          sx={{
            background: 'linear-gradient(135deg, #66bb6a, #388e3c)',
            '&:hover': { background: 'linear-gradient(135deg, #81c784, #43a047)' },
            '&:disabled': { background: '#2a2a2a', color: '#555' },
          }}
        >
          {isPending ? 'Salvando…' : 'Adicionar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
