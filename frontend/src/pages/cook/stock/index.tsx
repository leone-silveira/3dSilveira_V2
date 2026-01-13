import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import { useFoodQuery } from '../../../queries/useFoodQuery';
import type { IStockFood } from '../../../interfaces/stockFood';
import { useStockFoodMutation } from '../../../mutations/useStockFoodMutation';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70, editable: true },
  { field: 'name', headerName: 'Food Item', width: 200, editable: true },
  { field: 'food_type', headerName: 'Category', width: 150, editable: true },
  {
    field: 'quantity',
    headerName: 'Quantity',
    width: 130,
    editable: true,
    type: 'number',
  },
  { field: 'unit', headerName: 'Unit', width: 100, editable: true },
  { field: 'expiry', headerName: 'Expiry Date', width: 150, editable: true },
];

export default function FoodStockTable() {
  const { data: stockFoods = [] } = useFoodQuery();
  const stockFoodMutation = useStockFoodMutation();
  const processRowUpdate = (newRow: IStockFood, oldRow: IStockFood) => {
    console.log('Row updated from', oldRow, 'to', newRow);
    stockFoodMutation.mutate(newRow);
    return newRow;
  };
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Typography variant="h5" gutterBottom>
        Food Stock
      </Typography>
      <DataGrid
        editMode="row"
        rows={stockFoods}
        columns={columns}
        processRowUpdate={processRowUpdate}
      />
    </Box>
  );
}
