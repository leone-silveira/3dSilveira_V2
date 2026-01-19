import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import type { IFood } from '../../../interfaces/IFoods';
import { useFoodQuery } from '../../../queries/useFoodQuery';

const columns: GridColDef<IFood>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150, editable: true },
    { field: 'food_type', headerName: 'Food Type', width: 130, editable: true },
    { field: 'quantity', headerName: 'Quantity', width: 110, editable: true },
    { field: 'calories', headerName: 'Calories', type: 'number', width: 110, editable: true },
    { field: 'protein', headerName: 'Protein (g)', type: 'number', width: 120, editable: true },
    { field: 'carbohydrate', headerName: 'Carbohydrate (g)', type: 'number', width: 150, editable: true },
    { field: 'fat', headerName: 'Fat (g)', type: 'number', width: 100, editable: true },
    { field: 'fiber', headerName: 'Fiber (g)', type: 'number', width: 110, editable: true },
];

//create a forms using react-hook-form to add new food items,


export const FoodTable = () => {
    const { data: foods = [] } = useFoodQuery();
  return (
    <Box sx={{ height: 400, width: '100%', margin: '0px'}}>
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
      />
    </Box>
  );
}
