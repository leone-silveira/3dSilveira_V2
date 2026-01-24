import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { IFood } from '../../../interfaces/IFoods';
import { useFoodQuery } from '../../../queries/useFoodQuery';
import { useFoodMutation } from '../../../mutations/useFoodMutation';
import { useFoodDeleteMutation } from '../../../mutations/useFoodDeleteMutation';

const columns: GridColDef<IFood>[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Name', width: 150, editable: true },
  { field: 'food_type', headerName: 'Food Type', width: 130, editable: true },
  { field: 'quantity', headerName: 'Quantity', width: 110, editable: true },
  {
    field: 'calories',
    headerName: 'Calories',
    type: 'number',
    width: 110,
    editable: true,
  },
  {
    field: 'protein',
    headerName: 'Protein (g)',
    type: 'number',
    width: 120,
    editable: true,
  },
  {
    field: 'carbohydrate',
    headerName: 'Carbohydrate (g)',
    type: 'number',
    width: 150,
    editable: true,
  },
  {
    field: 'fat',
    headerName: 'Fat (g)',
    type: 'number',
    width: 100,
    editable: true,
  },
  {
    field: 'fiber',
    headerName: 'Fiber (g)',
    type: 'number',
    width: 110,
    editable: true,
  },
];

export const FoodTable = () => {
  const { data: foods = [] } = useFoodQuery();
  const { mutate: createFood, isPending } = useFoodMutation();
  const { mutate: deleteFood, isPending: isDeleting } = useFoodDeleteMutation();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
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

  const onSubmit = (data: Omit<IFood, 'id'>) => {
    createFood(data, {
      onSuccess: () => {
        reset();
        setOpenDialog(false);
      },
    });
  };

  const handleOpenDialog = () => {
    reset();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    reset();
    setOpenDialog(false);
  };

  const handleDeleteSelected = () => {
    
    selectedIds.forEach((id) => {
      console.log('Deleting IDs:', id, selectedIds);
      deleteFood(id);
    });
    setSelectedIds([]);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Stack direction="row" spacing={1}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add Food Item
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDeleteSelected}
          disabled={selectedIds.length === 0 || isDeleting}
        >
          Remove Selected ({selectedIds.length})
        </Button>
      </Stack>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Food Item</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}
        >
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
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disabled={isPending}
          >
            {isPending ? 'Adding...' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={foods}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={(newSelectionModel: GridRowSelectionModel) => {
            console.log(newSelectionModel);
            const ids = [...newSelectionModel.ids].map((id) => Number(id));
            setSelectedIds(ids);
          }}
        />
      </Box>
    </Box>
  );
};
