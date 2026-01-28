import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import type { IFood } from '../../../interfaces/IFoods';
import { useFoodQuery } from '../../../queries/useFoodQuery';
import { useFoodMutation } from '../../../mutations/useFoodMutation';
import { useFoodDeleteMutation } from '../../../mutations/useFoodDeleteMutation';
import SaveIcon from '@mui/icons-material/Save';
import { DialogAddFood } from '../../../components/DialogAddFood';
import { foodApi } from '../../../api/foodApi';

const columnsFood: GridColDef<IFood>[] = [
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

const columnsDish: GridColDef<IFood>[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'food_type', headerName: 'Food Type', width: 130 },
  {
    field: 'quantity',
    headerName: 'Quantity',
    type: 'number',
    width: 110,
    editable: true,
  },
  {
    field: 'calories',
    headerName: 'Calories (calculated)',
    type: 'number',
    width: 140,
    editable: false,
  },
  {
    field: 'protein',
    headerName: 'Protein (g)',
    type: 'number',
    width: 120,
    editable: false,
  },
  {
    field: 'carbohydrate',
    headerName: 'Carbohydrate (g)',
    type: 'number',
    width: 150,
    editable: false,
  },
  {
    field: 'fat',
    headerName: 'Fat (g)',
    type: 'number',
    width: 100,
    editable: false,
  },
  {
    field: 'fiber',
    headerName: 'Fiber (g)',
    type: 'number',
    width: 110,
    editable: false,
  },
];

interface DishItem extends IFood {
  originalQuantity?: number;
}

export const FoodTable = () => {
  const { data: foods = [] } = useFoodQuery();
  const { mutate: createFood, isPending } = useFoodMutation();
  const { mutate: deleteFood, isPending: isDeleting } = useFoodDeleteMutation();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [dishItems, setDishItems] = useState<DishItem[]>([]);
  const [selectedDishIds, setSelectedDishIds] = useState<number[]>([]);
  const [editedFoods, setEditedFoods] = useState<Map<number, IFood>>(new Map());
  const [isSaving, setIsSaving] = useState(false);

  // Update dish items when food items are updated
  useEffect(() => {
    setDishItems((prevDishItems) => {
      if (prevDishItems.length === 0 || foods.length === 0) return prevDishItems;

      return prevDishItems.map((dishItem) => {
        const updatedFood = foods.find((food) => food.id === dishItem.id);
        if (updatedFood) {
          return {
            ...dishItem,
            name: updatedFood.name,
            food_type: updatedFood.food_type,
            calories: updatedFood.calories,
            protein: updatedFood.protein,
            carbohydrate: updatedFood.carbohydrate,
            fat: updatedFood.fat,
            fiber: updatedFood.fiber,
          };
        }
        return dishItem;
      });
    });
  }, [foods]);

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

  const handleFoodItemEdit = (updatedRow: IFood) => {
    setEditedFoods((prev) => {
      const newMap = new Map(prev);
      newMap.set(updatedRow.id, updatedRow);
      return newMap;
    });
    return updatedRow;
  };

  const handleSaveChanges = async () => {
    if (editedFoods.size === 0) return;

    setIsSaving(true);
    try {
      const updatePromises = Array.from(editedFoods.entries()).map(([id, food]) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _, ...foodData } = food;
        return foodApi.updateFood(id, foodData);
      });

      await Promise.all(updatePromises);
      setEditedFoods(new Map());
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddToDish = () => {
    const selectedFoods = foods
      .filter((food) => selectedIds.includes(food.id))
      .filter((food) => !dishItems.some((item) => item.id === food.id))
      .map((food) => ({
        ...food,
        originalQuantity: food.quantity,
      }));
    setDishItems((prev) => [...prev, ...selectedFoods]);
    setSelectedIds([]);
  };

  const handleRemoveFromDish = () => {
    setDishItems((prev) =>
      prev.filter((item) => !selectedDishIds.includes(item.id))
    );
    setSelectedDishIds([]);
  };

  const handleDishItemEdit = (updatedRow: DishItem) => {
    setDishItems((prev) =>
      prev.map((item) =>
        item.id === updatedRow.id
          ? {
              ...item,
              quantity: updatedRow.quantity,
              originalQuantity: item.originalQuantity,
            }
          : item
      )
    );
    // Return the row with calculated values for immediate display
    const itemToUpdate = dishItems.find((item) => item.id === updatedRow.id);
    if (itemToUpdate) {
      const updatedItem = {
        ...itemToUpdate,
        quantity: updatedRow.quantity,
        originalQuantity: itemToUpdate.originalQuantity,
      };
      return getCalculatedDishItem(updatedItem);
    }
    return updatedRow;
  };

  const calculateProportionalValue = (item: DishItem, originalValue: number) => {
    if (!item.originalQuantity) return originalValue;
    return (originalValue * item.quantity) / item.originalQuantity;
  };

  const getCalculatedDishItem = (item: DishItem): DishItem => {
    return {
      ...item,
      calories: calculateProportionalValue(item, item.calories),
      protein: calculateProportionalValue(item, item.protein),
      carbohydrate: calculateProportionalValue(item, item.carbohydrate),
      fat: calculateProportionalValue(item, item.fat),
      fiber: calculateProportionalValue(item, item.fiber),
    };
  };

  const dishHeight = Math.max(100, dishItems.length * 52 + 120);

  const calculateDishTotals = () => {
    return dishItems.reduce(
      (totals, item) => {
        const calculatedItem = getCalculatedDishItem(item);
        return {
          calories: totals.calories + calculatedItem.calories,
          protein: totals.protein + calculatedItem.protein,
          carbohydrate: totals.carbohydrate + calculatedItem.carbohydrate,
          fat: totals.fat + calculatedItem.fat,
          fiber: totals.fiber + calculatedItem.fiber,
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
        <Button
          variant="contained"
          color="success"
          startIcon={<SaveIcon />}
          onClick={handleSaveChanges}
          disabled={editedFoods.size === 0 || isSaving}
        >
          Save Changes ({editedFoods.size})
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
          columns={columnsFood}
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
          processRowUpdate={(updatedRow: IFood) =>
            handleFoodItemEdit(updatedRow)
          }
          onProcessRowUpdateError={(error) => {
            console.error('Error updating row:', error);
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
            rows={dishItems.map((item) => {
              const calculated = getCalculatedDishItem(item);
              return {
                ...calculated,
                originalQuantity: item.originalQuantity,
              };
            })}
            columns={columnsDish}
            pageSizeOptions={[]}
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={(
              newSelectionModel: GridRowSelectionModel
            ) => {
              const ids = [...newSelectionModel.ids].map((id) => Number(id));
              setSelectedDishIds(ids);
            }}
            processRowUpdate={(updatedRow: DishItem) =>
              handleDishItemEdit(updatedRow)
            }
            onProcessRowUpdateError={(error) => {
              console.error('Error updating row:', error);
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
