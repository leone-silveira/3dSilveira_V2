import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';
import { useFoodQuery } from '../../queries/useFoodQuery';

const columns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 1 },
  { field: "food_type", headerName: "Type", flex: 1 },
  { field: "quantity", headerName: "Quantity", flex: 1 },
  { field: "calories", headerName: "Calories (kcal)", flex: 1, type: "number" },
  { field: "protein", headerName: "Protein (g)", flex: 1, type: "number" },
  { field: "carbohydrate", headerName: "Carbs (g)", flex: 1, type: "number" },
  { field: "fat", headerName: "Fat (g)", flex: 1, type: "number" },
  { field: "fiber", headerName: "Fiber (g)", flex: 1, type: "number" },
];


export default function FoodTable() {
  const { data: foods = [] }= useFoodQuery();
  const [heightTable1, setHeightTable1] = useState(300);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5}}>
      <Box sx={{ height: 400, width: '100%', background: 'blue' }}>
        <Box sx={{ height: heightTable1, width: '100%' }}>
          <DataGrid
          style={{fontSize:10}}
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
        <Box sx={{ height: 400, width: '100%' }}>
        </Box>
      </Box>
      <Box sx={{ height: 400, width: '80%' }}>
        <Button variant='contained' sx={{background: 'black',  color: 'white'}} onClick={() => setHeightTable1(heightTable1 + 50)}>
          Increase Table 1 Height
        </Button>
        <Button variant='contained' onClick={() => setHeightTable1(heightTable1 - 50)}>Increase Table 2 Height</Button>
      </Box>
    </Box>
  );
}
