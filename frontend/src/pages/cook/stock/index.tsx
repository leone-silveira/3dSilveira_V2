import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Food Item', width: 200 },
    { field: 'quantity', headerName: 'Quantity', width: 130 },
    { field: 'unit', headerName: 'Unit', width: 100 },
    { field: 'expiry', headerName: 'Expiry Date', width: 150 },
];
const rows = [
    { id: 1, name: 'Banana', quantity: 80, unit: 'g', expiry: '2024-07-15' },
    { id: 2, name: 'Tomatoes', quantity: 20, unit: 'kg', expiry: '2024-07-10' },
    { id: 3, name: 'Rice', quantity: 50, unit: 'kg', expiry: '2025-01-01' },
    { id: 4, name: 'Chicken Breast', quantity: 15, unit: 'kg', expiry: '2024-06-20' },
    { id: 5, name: 'Olive Oil', quantity: 10, unit: 'L', expiry: '2025-03-15' },
    { id: 6, name: 'Potatoes', quantity: 30, unit: 'kg', expiry: '2024-07-05' },
];


export default function FoodStockTable() {
    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <Typography variant="h5" gutterBottom>
                Food Stock
            </Typography>
            <DataGrid
                rows={rows}
                columns={columns}
                disableRowSelectionOnClick
            />
        </Box>
    );
}