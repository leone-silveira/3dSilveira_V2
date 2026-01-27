import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import type { IFood } from '../../../interfaces/IFoods';
import { useFoodQuery } from '../../../queries/useFoodQuery';
import { useFoodMutation } from '../../../mutations/useFoodMutation';
import { useFoodDeleteMutation } from '../../../mutations/useFoodDeleteMutation';
import { DialogAddFood } from '../../../components/DialogAddFood';

const columns: GridColDef<IFood>[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Name', width: 150, editable: true },
  { field: 'food_type', headerName: 'Food Type', width: 130, editable: true },
  {
    field: 'quantity',
    headerName: 'Quantity',
    type: 'number',
    width: 110,
    editable: true,
  },
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
  const [dishItems, setDishItems] = useState<IFood[]>([]);
  const [selectedDishIds, setSelectedDishIds] = useState<number[]>([]);

  const onSubmit = (data: Omit<IFood, 'id'>) => {
    createFood(data, {
      onSuccess: () => {
        setOpenDialog(false);
      },
    });
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDeleteSelected = () => {
    selectedIds.forEach((id) => {
      deleteFood(id);
    });
    setSelectedIds([]);
  };

  const handleAddToDish = () => {
    const selectedFoods = foods
      .filter((food) => selectedIds.includes(food.id))
      .filter((food) => !dishItems.some((item) => item.id === food.id));
    setDishItems((prev) => [...prev, ...selectedFoods]);
    setSelectedIds([]);
  };

  const handleRemoveFromDish = () => {
    setDishItems((prev) =>
      prev.filter((item) => !selectedDishIds.includes(item.id))
    );
    setSelectedDishIds([]);
  };

  const dishHeight = Math.max(100, dishItems.length * 52 + 120);

  const calculateDishTotals = () => {
    return dishItems.reduce(
      (totals, item) => {
        const caloriesPerUnit = item.calories / item.quantity;
        return {
          calories: totals.calories + caloriesPerUnit * item.quantity,
          protein: totals.protein + (item.protein / item.quantity) * item.quantity,
          carbohydrate:
            totals.carbohydrate + (item.carbohydrate / item.quantity) * item.quantity,
          fat: totals.fat + (item.fat / item.quantity) * item.quantity,
          fiber: totals.fiber + (item.fiber / item.quantity) * item.quantity,
        };
      },
      {
        calories: 0,
        protein: 0,
        carbohydrate: 0,
        fat: 0,
        fiber: 0,
      }
    );
  };

  const dishTotals = calculateDishTotals();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
      <DialogAddFood
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={onSubmit}
        isPending={isPending}
      />

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
          onRowSelectionModelChange={(
            newSelectionModel: GridRowSelectionModel
          ) => {
            const ids = [...newSelectionModel.ids].map((id) => Number(id));
            setSelectedIds(ids);
          }}
        />
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Dish
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={handleAddToDish}
            disabled={selectedIds.length === 0}
          >
            Add to Dish ({selectedIds.length})
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleRemoveFromDish}
            disabled={selectedDishIds.length === 0}
          >
            Remove from Dish ({selectedDishIds.length})
          </Button>
        </Stack>
        <Box
          sx={{
            height: dishHeight,
            width: '100%',
            transition: 'height 0.3s ease',
          }}
        >
          <DataGrid
            rows={dishItems}
            columns={columns}
            pageSizeOptions={[]}
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={(
              newSelectionModel: GridRowSelectionModel
            ) => {
              const ids = [...newSelectionModel.ids].map((id) => Number(id));
              setSelectedDishIds(ids);
            }}
            sx={{
              '& .MuiDataGrid-root': {
                border: 'none',
              },
            }}
          />
        </Box>

        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>
            Dish Totals (calculated based on quantity)
          </Typography>
          <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#666' }}>
                Calories
              </Typography>
              <Typography variant="h6">
                {dishTotals.calories.toFixed(2)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#666' }}>
                Protein (g)
              </Typography>
              <Typography variant="h6">
                {dishTotals.protein.toFixed(2)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#666' }}>
                Carbohydrate (g)
              </Typography>
              <Typography variant="h6">
                {dishTotals.carbohydrate.toFixed(2)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#666' }}>
                Fat (g)
              </Typography>
              <Typography variant="h6">{dishTotals.fat.toFixed(2)}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#666' }}>
                Fiber (g)
              </Typography>
              <Typography variant="h6">
                {dishTotals.fiber.toFixed(2)}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};
