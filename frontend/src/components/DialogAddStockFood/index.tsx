import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useForm, Controller } from 'react-hook-form';
import type { IStockFood } from '../../interfaces/IStockFood';

type StockFormValues = {
  name: string;
  food_type: string;
  quantity: number | string;
  unit: string;
  min_quantity: number | string;
  expiry: string;
};

interface DialogAddStockFoodProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<IStockFood, 'id'>) => void;
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
  '& .MuiSvgIcon-root': { color: '#757575' },
};

const UNIT_OPTIONS = ['kg', 'g', 'l', 'ml', 'un', 'pcs'];

const TYPE_SUGGESTIONS = ['Grão', 'Carne', 'Fruta', 'Vegetal', 'Laticínio', 'Óleo', 'Tempero', 'Bebida', 'Outro'];

const DEFAULTS: StockFormValues = {
  name: '',
  food_type: '',
  quantity: '',
  unit: 'un',
  min_quantity: '',
  expiry: '',
};

export const DialogAddStockFood = ({ open, onClose, onSubmit, isPending }: DialogAddStockFoodProps) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<StockFormValues>({
    defaultValues: DEFAULTS,
  });

  const handleClose = () => { reset(DEFAULTS); onClose(); };

  const handleFormSubmit = (data: StockFormValues) => {
    const payload: Omit<IStockFood, 'id'> = {
      name: data.name.trim(),
      food_type: data.food_type.trim(),
      quantity: Number(data.quantity),
      unit: data.unit,
      min_quantity: data.min_quantity === '' ? null : Number(data.min_quantity),
      expiry: data.expiry ? data.expiry : null,
    };
    onSubmit(payload);
    reset(DEFAULTS);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 } }}
    >
      <DialogTitle sx={{ background: '#1a1a1a', color: '#f0f0f0', fontWeight: 700 }}>
        Adicionar ao Estoque
      </DialogTitle>
      <DialogContent sx={{ background: '#1a1a1a', pt: '20px !important' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Nome é obrigatório' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Item"
                  fullWidth
                  autoFocus
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  sx={FIELD_SX}
                />
              )}
            />
            <Controller
              name="food_type"
              control={control}
              rules={{ required: 'Tipo é obrigatório' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Tipo"
                  fullWidth
                  error={!!errors.food_type}
                  helperText={errors.food_type?.message}
                  sx={FIELD_SX}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: { sx: { background: '#1a1a1a', color: '#f0f0f0', border: '1px solid rgba(255,255,255,0.08)' } },
                    },
                  }}
                >
                  {TYPE_SUGGESTIONS.map((t) => (
                    <MenuItem key={t} value={t}>{t}</MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Controller
              name="quantity"
              control={control}
              rules={{ required: 'Quantidade é obrigatória', validate: (v) => Number(v) >= 0 || 'Inválida' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Quantidade"
                  fullWidth
                  inputProps={{ step: 'any', min: 0 }}
                  error={!!errors.quantity}
                  helperText={errors.quantity?.message}
                  sx={FIELD_SX}
                />
              )}
            />
            <Controller
              name="unit"
              control={control}
              rules={{ required: 'Unidade é obrigatória' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Unidade"
                  fullWidth
                  error={!!errors.unit}
                  helperText={errors.unit?.message}
                  sx={FIELD_SX}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: { sx: { background: '#1a1a1a', color: '#f0f0f0', border: '1px solid rgba(255,255,255,0.08)' } },
                    },
                  }}
                >
                  {UNIT_OPTIONS.map((u) => (
                    <MenuItem key={u} value={u}>{u}</MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>

          <Box sx={{ pt: 0.5 }}>
            <Typography sx={{ color: '#616161', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', mb: 1 }}>
              Opcional
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Controller
                name="min_quantity"
                control={control}
                rules={{ validate: (v) => v === '' || Number(v) >= 0 || 'Inválida' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Quantidade mínima (alerta)"
                    fullWidth
                    inputProps={{ step: 'any', min: 0 }}
                    error={!!errors.min_quantity}
                    helperText={errors.min_quantity?.message || 'Avisa quando o estoque cair abaixo'}
                    sx={{ ...FIELD_SX, '& .MuiFormHelperText-root': { color: '#616161' } }}
                  />
                )}
              />
              <Controller
                name="expiry"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="date"
                    label="Validade"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    sx={FIELD_SX}
                  />
                )}
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ background: '#1a1a1a', gap: 1, px: 3, pb: 2.5 }}>
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
