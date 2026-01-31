import { Box, Typography, Paper, TextField, Button, MenuItem, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { useExpenseQuery } from '../../../queries/useExpenseQuery';
import { useExpenseMutation, useExpenseUpdateMutation, useExpenseDeleteMutation } from '../../../mutations/useExpenseMutation';
import type { Expense, ExpenseCreate } from '../../../api/expenseApi';

const EXPENSE_CATEGORIES = [
    'groceries',
    'utilities',
    'transportation',
    'entertainment',
    'healthcare',
    'education',
    'household',
    'dining',
    'shopping',
    'other',
];

export const ExpensesPage = () => {
    const { data: expenses = [] } = useExpenseQuery();
    const createMutation = useExpenseMutation();
    const updateMutation = useExpenseUpdateMutation();
    const deleteMutation = useExpenseDeleteMutation();

    const [openDialog, setOpenDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
    const [formData, setFormData] = useState<ExpenseCreate>({
        description: '',
        amount: 0,
        category: 'groceries',
        date: new Date().toISOString().split('T')[0],
        is_recurring: false,
        notes: '',
    });

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'description', headerName: 'Description', width: 200 },
        { field: 'amount', headerName: 'Amount', width: 120, type: 'number' },
        { field: 'category', headerName: 'Category', width: 120 },
        {
            field: 'date',
            headerName: 'Date',
            width: 150,
            valueFormatter: (value) => new Date(value).toLocaleDateString(),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                        size="small"
                        onClick={() => handleEdit(params.row)}
                        sx={{ color: '#66bb6a' }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => handleDelete(params.row.id)}
                        sx={{ color: '#ff7043' }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            ),
        },
    ];

    const handleOpenDialog = () => {
        setIsEditing(false);
        setSelectedExpense(null);
        setFormData({
            description: '',
            amount: 0,
            category: 'groceries',
            date: new Date().toISOString().split('T')[0],
            is_recurring: false,
            notes: '',
        });
        setOpenDialog(true);
    };

    const handleEdit = (expense: Expense) => {
        setIsEditing(true);
        setSelectedExpense(expense);
        setFormData({
            description: expense.description,
            amount: expense.amount,
            category: expense.category,
            date: expense.date.split('T')[0],
            is_recurring: expense.is_recurring,
            notes: expense.notes || '',
        });
        setOpenDialog(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this expense?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleSave = () => {
        if (isEditing && selectedExpense) {
            updateMutation.mutate({ id: selectedExpense.id, data: formData });
        } else {
            createMutation.mutate(formData);
        }
        setOpenDialog(false);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#ffffff' }}>
                    Expenses
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenDialog}
                    sx={{
                        backgroundColor: '#66bb6a',
                        color: '#ffffff',
                        '&:hover': { backgroundColor: '#558b2f' },
                    }}
                >
                    New Expense
                </Button>
            </Box>

            <Paper
                sx={{
                    p: 2,
                    background: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)',
                    border: '1px solid #333333',
                    borderRadius: 2,
                }}
            >
                <DataGrid
                    rows={expenses}
                    columns={columns}
                    pageSizeOptions={[5, 10, 25]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    sx={{
                        color: '#ffffff',
                        '& .MuiDataGrid-cell': { borderColor: '#333333' },
                        '& .MuiDataGrid-columnHeader': { backgroundColor: '#2d2d2d', borderColor: '#333333' },
                    }}
                />
            </Paper>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ backgroundColor: '#1e1e1e', color: '#ffffff' }}>
                    {isEditing ? 'Edit Expense' : 'New Expense'}
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: '#1e1e1e', pt: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            sx={{
                                '& .MuiOutlinedInput-root': { color: '#ffffff' },
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333333' },
                            }}
                        />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                fullWidth
                                label="Amount"
                                type="number"
                                inputProps={{ step: '0.01' }}
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                sx={{
                                    '& .MuiOutlinedInput-root': { color: '#ffffff' },
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333333' },
                                }}
                            />
                            <TextField
                                select
                                fullWidth
                                label="Category"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                sx={{
                                    '& .MuiOutlinedInput-root': { color: '#ffffff' },
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333333' },
                                }}
                            >
                                {EXPENSE_CATEGORIES.map((cat) => (
                                    <MenuItem key={cat} value={cat}>
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                fullWidth
                                label="Date"
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                slotProps={{ inputLabel: { shrink: true } }}
                                sx={{
                                    '& .MuiOutlinedInput-root': { color: '#ffffff' },
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333333' },
                                }}
                            />
                            <TextField
                                select
                                fullWidth
                                label="Recurring"
                                value={formData.is_recurring ? 'yes' : 'no'}
                                onChange={(e) => setFormData({ ...formData, is_recurring: e.target.value === 'yes' })}
                                sx={{
                                    '& .MuiOutlinedInput-root': { color: '#ffffff' },
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333333' },
                                }}
                            >
                                <MenuItem value="no">No</MenuItem>
                                <MenuItem value="yes">Yes</MenuItem>
                            </TextField>
                        </Box>
                        <TextField
                            fullWidth
                            label="Notes"
                            multiline
                            rows={3}
                            value={formData.notes || ''}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            sx={{
                                '& .MuiOutlinedInput-root': { color: '#ffffff' },
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333333' },
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: '#1e1e1e', p: 2, gap: 1 }}>
                    <Button onClick={handleCloseDialog} sx={{ color: '#b0bec5' }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        sx={{ backgroundColor: '#66bb6a', color: '#ffffff' }}
                    >
                        {isEditing ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
