import {
  Box, Typography, Paper, TextField, Button, MenuItem,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Chip, InputAdornment, Alert,
} from '@mui/material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddIcon from '@mui/icons-material/Add';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import RepeatIcon from '@mui/icons-material/Repeat';
import { useState } from 'react';
import { useExpenseQuery } from '../../../queries/useExpenseQuery';
import { useExpenseMutation, useExpenseUpdateMutation, useExpenseDeleteMutation } from '../../../mutations/useExpenseMutation';
import type { Expense, ExpenseCreate } from '../../../api/expenseApi';
import { getCategoryMeta, formatCurrency, CATEGORY_META } from '../../../utils/categoryColors';

const EXPENSE_CATEGORIES = Object.keys(CATEGORY_META);

const DATAGRID_SX = {
  border: 'none',
  color: '#e0e0e0',
  fontFamily: '"Inter", sans-serif',
  '& .MuiDataGrid-columnHeader': {
    backgroundColor: '#111',
    color: '#616161',
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
    outline: 'none',
  },
  '& .MuiDataGrid-cell': {
    borderColor: 'rgba(255,255,255,0.04)',
    display: 'flex',
    alignItems: 'center',
  },
  '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
    outline: 'none',
  },
  '& .MuiDataGrid-row': {
    '&:hover': { backgroundColor: 'rgba(255,255,255,0.03)' },
    '&.Mui-selected': { backgroundColor: 'rgba(102,187,106,0.08) !important' },
  },
  '& .MuiDataGrid-footerContainer': {
    borderTop: '1px solid rgba(255,255,255,0.06)',
    backgroundColor: '#111',
  },
  '& .MuiTablePagination-root': { color: '#616161' },
  '& .MuiDataGrid-overlay': { backgroundColor: '#161616' },
  '& .MuiDataGrid-virtualScroller': { backgroundColor: '#161616' },
};

const DIALOG_FIELD_SX = {
  '& .MuiOutlinedInput-root': {
    color: '#f0f0f0',
    borderRadius: 2,
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(102,187,106,0.4)' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#66bb6a' },
  },
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
  '& .MuiInputLabel-root': { color: '#757575' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#66bb6a' },
  '& .MuiSelect-icon': { color: '#757575' },
  '& .MuiInputAdornment-root .MuiSvgIcon-root': { color: '#555', fontSize: 18 },
};

const emptyForm = (): ExpenseCreate => ({
  description: '',
  amount: 0,
  category: 'groceries',
  date: new Date().toISOString().split('T')[0],
  is_recurring: false,
  notes: '',
});

export const ExpensesPage = () => {
  const { data: expenses = [] } = useExpenseQuery();
  const createMutation = useExpenseMutation();
  const updateMutation = useExpenseUpdateMutation();
  const deleteMutation = useExpenseDeleteMutation();

  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState<ExpenseCreate>(emptyForm());
  const [formError, setFormError] = useState('');

  // Summary stats
  const now = new Date();
  const total = expenses.reduce((s: number, e: Expense) => s + e.amount, 0);
  const thisMonth = expenses
    .filter((e: Expense) => {
      const d = new Date(e.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((s: number, e: Expense) => s + e.amount, 0);
  const recurring = expenses.filter((e: Expense) => e.is_recurring).length;

  const columns: GridColDef[] = [
    {
      field: 'description',
      headerName: 'Descrição',
      flex: 2,
      minWidth: 180,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {params.row.is_recurring && (
            <RepeatIcon sx={{ fontSize: 14, color: '#29b6f6', flexShrink: 0 }} />
          )}
          <Typography sx={{ color: '#e0e0e0', fontSize: '0.875rem', fontWeight: 500 }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'category',
      headerName: 'Categoria',
      width: 150,
      renderCell: (params: GridRenderCellParams) => {
        const meta = getCategoryMeta(params.value as string);
        return (
          <Chip
            label={`${meta.emoji} ${meta.label}`}
            size="small"
            sx={{
              backgroundColor: meta.bg,
              color: meta.color,
              border: `1px solid ${meta.border}`,
              fontSize: '0.72rem',
              height: 24,
              fontWeight: 600,
            }}
          />
        );
      },
    },
    {
      field: 'amount',
      headerName: 'Valor',
      width: 130,
      type: 'number',
      renderCell: (params: GridRenderCellParams) => (
        <Typography sx={{ color: '#f0f0f0', fontWeight: 700, fontSize: '0.9rem' }}>
          {formatCurrency(params.value as number)}
        </Typography>
      ),
    },
    {
      field: 'date',
      headerName: 'Data',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Typography sx={{ color: '#757575', fontSize: '0.83rem' }}>
          {new Date(params.value as string).toLocaleDateString('pt-BR')}
        </Typography>
      ),
    },
    {
      field: 'notes',
      headerName: 'Notas',
      flex: 1,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Typography sx={{ color: '#616161', fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {params.value || '—'}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: '',
      width: 90,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={() => handleEdit(params.row)}
            sx={{
              color: '#424242',
              '&:hover': { color: '#66bb6a', backgroundColor: 'rgba(102,187,106,0.1)' },
              borderRadius: 1.5,
            }}
          >
            <EditOutlinedIcon sx={{ fontSize: 17 }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete(params.row.id)}
            sx={{
              color: '#424242',
              '&:hover': { color: '#ef5350', backgroundColor: 'rgba(239,83,80,0.1)' },
              borderRadius: 1.5,
            }}
          >
            <DeleteOutlineIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleOpenDialog = () => {
    setIsEditing(false);
    setSelectedExpense(null);
    setFormData(emptyForm());
    setFormError('');
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
    setFormError('');
    setOpenDialog(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta despesa?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = () => {
    if (!formData.description.trim()) { setFormError('Informe uma descrição.'); return; }
    if (!formData.amount || formData.amount <= 0) { setFormError('Informe um valor válido.'); return; }
    setFormError('');

    if (isEditing && selectedExpense) {
      updateMutation.mutate({ id: selectedExpense.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
    setOpenDialog(false);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1400 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#f0f0f0', letterSpacing: '-0.02em' }}>
            Despesas
          </Typography>
          <Typography sx={{ color: '#616161', mt: 0.5, fontSize: '0.875rem' }}>
            Gerencie e acompanhe todos os seus gastos
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{
            background: 'linear-gradient(135deg, #66bb6a, #388e3c)',
            boxShadow: '0 2px 12px rgba(102,187,106,0.25)',
            '&:hover': {
              background: 'linear-gradient(135deg, #81c784, #43a047)',
              boxShadow: '0 4px 16px rgba(102,187,106,0.35)',
              transform: 'translateY(-1px)',
            },
          }}
        >
          Nova Despesa
        </Button>
      </Box>

      {/* Summary row */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Registrado', value: formatCurrency(total), color: '#ef5350' },
          { label: 'Este Mês', value: formatCurrency(thisMonth), color: '#ffa726' },
          { label: 'Recorrentes', value: `${recurring} despesa${recurring !== 1 ? 's' : ''}`, color: '#29b6f6' },
          { label: 'Total de Registros', value: `${expenses.length}`, color: '#66bb6a' },
        ].map((s) => (
          <Box
            key={s.label}
            sx={{
              flex: '1 1 160px',
              px: 2.5, py: 1.75,
              background: '#161616',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 2.5,
              borderLeft: `3px solid ${s.color}`,
            }}
          >
            <Typography sx={{ color: '#616161', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {s.label}
            </Typography>
            <Typography sx={{ color: '#f0f0f0', fontWeight: 800, fontSize: '1.2rem', mt: 0.25, letterSpacing: '-0.01em' }}>
              {s.value}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Table */}
      <Paper sx={{ background: '#161616', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
        <DataGrid
          rows={expenses}
          columns={columns}
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          sx={DATAGRID_SX}
          autoHeight
          disableRowSelectionOnClick
        />
      </Paper>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ background: '#1a1a1a', color: '#f0f0f0' }}>
          {isEditing ? 'Editar Despesa' : 'Nova Despesa'}
        </DialogTitle>
        <DialogContent sx={{ background: '#1a1a1a', pt: '20px !important' }}>
          {formError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2, backgroundColor: 'rgba(244,67,54,0.08)', border: '1px solid rgba(244,67,54,0.2)' }}>
              {formError}
            </Alert>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Descrição"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              sx={DIALOG_FIELD_SX}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Valor"
                type="number"
                inputProps={{ step: '0.01', min: '0' }}
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoneyIcon />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={DIALOG_FIELD_SX}
              />
              <TextField
                select
                fullWidth
                label="Categoria"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                sx={DIALOG_FIELD_SX}
              >
                {EXPENSE_CATEGORIES.map((cat) => {
                  const meta = getCategoryMeta(cat);
                  return (
                    <MenuItem key={cat} value={cat}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{meta.emoji}</span>
                        <span>{meta.label}</span>
                      </Box>
                    </MenuItem>
                  );
                })}
              </TextField>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Data"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                slotProps={{
                  inputLabel: { shrink: true },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayOutlinedIcon />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={DIALOG_FIELD_SX}
              />
              <TextField
                select
                fullWidth
                label="Recorrente?"
                value={formData.is_recurring ? 'yes' : 'no'}
                onChange={(e) => setFormData({ ...formData, is_recurring: e.target.value === 'yes' })}
                sx={DIALOG_FIELD_SX}
              >
                <MenuItem value="no">Não</MenuItem>
                <MenuItem value="yes">Sim</MenuItem>
              </TextField>
            </Box>
            <TextField
              fullWidth
              label="Notas (opcional)"
              multiline
              rows={3}
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              sx={DIALOG_FIELD_SX}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ background: '#1a1a1a', gap: 1 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: '#616161' }}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #66bb6a, #388e3c)',
              '&:hover': { background: 'linear-gradient(135deg, #81c784, #43a047)' },
            }}
          >
            {isEditing ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
