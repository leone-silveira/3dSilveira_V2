import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useForm, Controller } from 'react-hook-form';
import type { IFood } from '../../interfaces/IFoods';

interface DialogAddFoodProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<IFood, 'id'>) => void;
  isPending: boolean;
}

export const DialogAddFood = ({
  open,
  onClose,
  onSubmit,
  isPending,
}: DialogAddFoodProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<IFood, 'id'>>({
    defaultValues: {
      name: '',
      food_type: '',
      quantity: '',
      calories: 0,
      protein: 0,
      carbohydrate: 0,
      fat: 0,
      fiber: 0,
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: Omit<IFood, 'id'>) => {
    onSubmit(data);
    reset();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Food Item</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
        <Controller
          name="name"
          control={control}
          rules={{ required: 'Name is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Name"
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          )}
        />
        <Controller
          name="food_type"
          control={control}
          rules={{ required: 'Food Type is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Food Type"
              fullWidth
              error={!!errors.food_type}
              helperText={errors.food_type?.message}
            />
          )}
        />
        <Controller
          name="quantity"
          control={control}
          rules={{ required: 'Quantity is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Quantity"
              fullWidth
              error={!!errors.quantity}
              helperText={errors.quantity?.message}
            />
          )}
        />
        <Stack direction="row" spacing={2}>
          <Controller
            name="calories"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Calories"
                type="number"
                fullWidth
              />
            )}
          />
          <Controller
            name="protein"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Protein (g)"
                type="number"
                fullWidth
              />
            )}
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <Controller
            name="carbohydrate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Carbohydrate (g)"
                type="number"
                fullWidth
              />
            )}
          />
          <Controller
            name="fat"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Fat (g)"
                type="number"
                fullWidth
              />
            )}
          />
        </Stack>
        <Controller
          name="fiber"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Fiber (g)"
              type="number"
              fullWidth
            />
          )}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          variant="contained"
          disabled={isPending}
        >
          {isPending ? 'Adding...' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
