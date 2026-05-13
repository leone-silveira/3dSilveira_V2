import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRowSelectionModel, GridRenderCellParams } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { IFood } from '../../../interfaces/IFoods';
import { useFoodQuery } from '../../../queries/useFoodQuery';
import { useFoodMutation } from '../../../mutations/useFoodMutation';
import { useFoodDeleteMutation } from '../../../mutations/useFoodDeleteMutation';
import { DialogAddFood } from '../../../components/DialogAddFood';
import { foodApi } from '../../../api/foodApi';
import { dishApi } from '../../../api/dishApi';

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
  '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': { outline: 'none' },
  '& .MuiDataGrid-cell': {
    borderColor: 'rgba(255,255,255,0.04)',
    display: 'flex',
    alignItems: 'center',
  },
  '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': { outline: 'none' },
  '& .MuiDataGrid-row': {
    '&:hover': { backgroundColor: 'rgba(255,255,255,0.03)' },
    '&.Mui-selected': { backgroundColor: 'rgba(102,187,106,0.08) !important' },
  },
  '& .MuiDataGrid-footerContainer': {
    borderTop: '1px solid rgba(255,255,255,0.06)',
    backgroundColor: '#111',
  },
  '& .MuiTablePagination-root': { color: '#616161' },
  '& .MuiDataGrid-virtualScroller': { backgroundColor: '#161616' },
  '& .MuiCheckbox-root': { color: '#424242', '&.Mui-checked': { color: '#66bb6a' } },
};

const MACROS = [
  { key: 'calories', label: 'Calorias', unit: 'kcal', color: '#ef5350' },
  { key: 'protein', label: 'Proteínas', unit: 'g', color: '#66bb6a' },
  { key: 'carbohydrate', label: 'Carboidratos', unit: 'g', color: '#ffa726' },
  { key: 'fat', label: 'Gorduras', unit: 'g', color: '#ab47bc' },
  { key: 'fiber', label: 'Fibras', unit: 'g', color: '#29b6f6' },
];

const columnsFood: GridColDef<IFood>[] = [
  {
    field: 'name', headerName: 'Nome', flex: 2, minWidth: 140, editable: true,
    renderCell: (p: GridRenderCellParams) => (
      <Typography sx={{ color: '#e0e0e0', fontSize: '0.875rem', fontWeight: 500 }}>{p.value}</Typography>
    ),
  },
  {
    field: 'food_type', headerName: 'Tipo', width: 120, editable: true,
    renderCell: (p: GridRenderCellParams) => (
      <Chip label={p.value || '—'} size="small" sx={{ backgroundColor: 'rgba(102,187,106,0.1)', color: '#66bb6a', border: '1px solid rgba(102,187,106,0.2)', fontSize: '0.72rem', height: 22, fontWeight: 600 }} />
    ),
  },
  { field: 'quantity', headerName: 'Qtd (g)', type: 'number', width: 100, editable: true,
    renderCell: (p: GridRenderCellParams) => <Typography sx={{ color: '#f0f0f0', fontWeight: 700, fontSize: '0.875rem' }}>{p.value}</Typography>,
  },
  { field: 'calories', headerName: 'Kcal', type: 'number', width: 90, editable: true,
    renderCell: (p: GridRenderCellParams) => <Typography sx={{ color: '#ef5350', fontWeight: 600, fontSize: '0.875rem' }}>{Number(p.value).toFixed(1)}</Typography>,
  },
  { field: 'protein', headerName: 'Prot (g)', type: 'number', width: 100, editable: true,
    renderCell: (p: GridRenderCellParams) => <Typography sx={{ color: '#66bb6a', fontWeight: 600, fontSize: '0.875rem' }}>{Number(p.value).toFixed(1)}</Typography>,
  },
  { field: 'carbohydrate', headerName: 'Carb (g)', type: 'number', width: 100, editable: true,
    renderCell: (p: GridRenderCellParams) => <Typography sx={{ color: '#ffa726', fontWeight: 600, fontSize: '0.875rem' }}>{Number(p.value).toFixed(1)}</Typography>,
  },
  { field: 'fat', headerName: 'Gord (g)', type: 'number', width: 100, editable: true,
    renderCell: (p: GridRenderCellParams) => <Typography sx={{ color: '#ab47bc', fontWeight: 600, fontSize: '0.875rem' }}>{Number(p.value).toFixed(1)}</Typography>,
  },
  { field: 'fiber', headerName: 'Fibra (g)', type: 'number', width: 100, editable: true,
    renderCell: (p: GridRenderCellParams) => <Typography sx={{ color: '#29b6f6', fontWeight: 600, fontSize: '0.875rem' }}>{Number(p.value).toFixed(1)}</Typography>,
  },
];

const columnsDish: GridColDef<IFood>[] = [
  { field: 'name', headerName: 'Nome', flex: 2, minWidth: 140,
    renderCell: (p: GridRenderCellParams) => (
      <Typography sx={{ color: '#e0e0e0', fontSize: '0.875rem', fontWeight: 500 }}>{p.value}</Typography>
    ),
  },
  { field: 'food_type', headerName: 'Tipo', width: 120,
    renderCell: (p: GridRenderCellParams) => (
      <Chip label={p.value || '—'} size="small" sx={{ backgroundColor: 'rgba(102,187,106,0.1)', color: '#66bb6a', border: '1px solid rgba(102,187,106,0.2)', fontSize: '0.72rem', height: 22, fontWeight: 600 }} />
    ),
  },
  { field: 'quantity', headerName: 'Qtd (g)', type: 'number', width: 100, editable: true,
    renderCell: (p: GridRenderCellParams) => <Typography sx={{ color: '#f0f0f0', fontWeight: 700, fontSize: '0.875rem' }}>{Number(p.value).toFixed(1)}</Typography>,
  },
  { field: 'calories', headerName: 'Kcal', type: 'number', width: 90,
    renderCell: (p: GridRenderCellParams) => <Typography sx={{ color: '#ef5350', fontWeight: 600, fontSize: '0.875rem' }}>{Number(p.value).toFixed(1)}</Typography>,
  },
  { field: 'protein', headerName: 'Prot (g)', type: 'number', width: 100,
    renderCell: (p: GridRenderCellParams) => <Typography sx={{ color: '#66bb6a', fontWeight: 600, fontSize: '0.875rem' }}>{Number(p.value).toFixed(1)}</Typography>,
  },
  { field: 'carbohydrate', headerName: 'Carb (g)', type: 'number', width: 100,
    renderCell: (p: GridRenderCellParams) => <Typography sx={{ color: '#ffa726', fontWeight: 600, fontSize: '0.875rem' }}>{Number(p.value).toFixed(1)}</Typography>,
  },
  { field: 'fat', headerName: 'Gord (g)', type: 'number', width: 100,
    renderCell: (p: GridRenderCellParams) => <Typography sx={{ color: '#ab47bc', fontWeight: 600, fontSize: '0.875rem' }}>{Number(p.value).toFixed(1)}</Typography>,
  },
  { field: 'fiber', headerName: 'Fibra (g)', type: 'number', width: 100,
    renderCell: (p: GridRenderCellParams) => <Typography sx={{ color: '#29b6f6', fontWeight: 600, fontSize: '0.875rem' }}>{Number(p.value).toFixed(1)}</Typography>,
  },
];

interface DishItem extends IFood { originalQuantity?: number; }

export const FoodTable = () => {
  const { data: foods = [] } = useFoodQuery();
  const { mutate: createFood, isPending } = useFoodMutation();
  const { mutate: deleteFood, isPending: isDeleting } = useFoodDeleteMutation();
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [dishItems, setDishItems] = useState<DishItem[]>([]);
  const [selectedDishIds, setSelectedDishIds] = useState<number[]>([]);
  const [editedFoods, setEditedFoods] = useState<Map<number, IFood>>(new Map());
  const [isSaving, setIsSaving] = useState(false);
  const [saveDishOpen, setSaveDishOpen] = useState(false);
  const [dishName, setDishName] = useState('');
  const [dishDesc, setDishDesc] = useState('');
  const [isSavingDish, setIsSavingDish] = useState(false);
  const [savedDishName, setSavedDishName] = useState<string | null>(null);

  useEffect(() => {
    setDishItems((prev) => {
      if (prev.length === 0 || foods.length === 0) return prev;
      return prev.map((dishItem) => {
        const updated = foods.find((f) => f.id === dishItem.id);
        return updated ? { ...dishItem, name: updated.name, food_type: updated.food_type, calories: updated.calories, protein: updated.protein, carbohydrate: updated.carbohydrate, fat: updated.fat, fiber: updated.fiber } : dishItem;
      });
    });
  }, [foods]);

  const calculateProportionalValue = (item: DishItem, originalValue: number) => {
    if (!item.originalQuantity) return originalValue;
    return (originalValue * item.quantity) / item.originalQuantity;
  };

  const getCalculatedDishItem = (item: DishItem): DishItem => ({
    ...item,
    calories: calculateProportionalValue(item, item.calories ?? 0),
    protein: calculateProportionalValue(item, item.protein ?? 0),
    carbohydrate: calculateProportionalValue(item, item.carbohydrate ?? 0),
    fat: calculateProportionalValue(item, item.fat ?? 0),
    fiber: calculateProportionalValue(item, item.fiber ?? 0),
  });

  const dishTotals = dishItems.reduce((t, item) => {
    const c = getCalculatedDishItem(item);
    return { calories: t.calories + c.calories, protein: t.protein + c.protein, carbohydrate: t.carbohydrate + c.carbohydrate, fat: t.fat + c.fat, fiber: t.fiber + c.fiber };
  }, { calories: 0, protein: 0, carbohydrate: 0, fat: 0, fiber: 0 });

  const handleSaveChanges = async () => {
    if (editedFoods.size === 0) return;
    setIsSaving(true);
    try {
      await Promise.all(Array.from(editedFoods.entries()).map(([id, food]) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _, ...foodData } = food;
        return foodApi.updateFood(id, foodData);
      }));
      setEditedFoods(new Map());
    } catch (e) { console.error('Error saving:', e); }
    finally { setIsSaving(false); }
  };

  const handleSaveDish = async () => {
    if (!dishName.trim() || dishItems.length === 0) return;
    setIsSavingDish(true);
    try {
      await dishApi.createDish({
        name: dishName.trim(),
        description: dishDesc.trim() || undefined,
        items: dishItems.map((item) => {
          const calc = getCalculatedDishItem(item);
          return { food_id: item.id, quantity: calc.quantity };
        }),
      });
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
      setSavedDishName(dishName.trim());
      setDishName('');
      setDishDesc('');
      setDishItems([]);
      setSaveDishOpen(false);
    } catch (e) { console.error('Error saving dish:', e); }
    finally { setIsSavingDish(false); }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1400 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#f0f0f0', letterSpacing: '-0.02em' }}>
          Receitas & Alimentos
        </Typography>
        <Typography sx={{ color: '#616161', mt: 0.5, fontSize: '0.875rem' }}>
          Gerencie alimentos e monte pratos com cálculo nutricional automático
        </Typography>
      </Box>

      {/* Saved confirmation */}
      {savedDishName && (
        <Box sx={{ mb: 2, px: 2.5, py: 1.5, background: 'rgba(102,187,106,0.08)', border: '1px solid rgba(102,187,106,0.25)', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 18, color: '#66bb6a' }} />
          <Typography sx={{ color: '#66bb6a', fontSize: '0.875rem', fontWeight: 600 }}>
            Prato "<strong>{savedDishName}</strong>" salvo com sucesso!
          </Typography>
          <Button size="small" sx={{ ml: 'auto', color: '#66bb6a', minWidth: 0 }} onClick={() => setSavedDishName(null)}>✕</Button>
        </Box>
      )}

      {/* Food library */}
      <Paper sx={{ background: '#161616', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', mb: 3 }}>
        <Box sx={{ px: 3, pt: 2.5, pb: 2, borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: '#f0f0f0', fontSize: '0.95rem' }}>
              Biblioteca de Alimentos
            </Typography>
            <Typography sx={{ color: '#616161', fontSize: '0.78rem', mt: 0.25 }}>
              {foods.length} item{foods.length !== 1 ? 's' : ''} · Selecione para editar ou adicionar ao prato
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            {editedFoods.size > 0 && (
              <Button
                variant="outlined"
                startIcon={<SaveOutlinedIcon />}
                onClick={handleSaveChanges}
                disabled={isSaving}
                size="small"
                sx={{ borderColor: 'rgba(102,187,106,0.4)', color: '#66bb6a', '&:hover': { borderColor: '#66bb6a', backgroundColor: 'rgba(102,187,106,0.08)' } }}
              >
                Salvar ({editedFoods.size})
              </Button>
            )}
            {selectedIds.length > 0 && (
              <>
                <Button
                  variant="outlined"
                  startIcon={<DeleteOutlineIcon />}
                  onClick={() => { selectedIds.forEach((id) => deleteFood(id)); setSelectedIds([]); }}
                  disabled={isDeleting}
                  size="small"
                  sx={{ borderColor: 'rgba(239,83,80,0.4)', color: '#ef5350', '&:hover': { borderColor: '#ef5350', backgroundColor: 'rgba(239,83,80,0.08)' } }}
                >
                  Remover ({selectedIds.length})
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    const selectedFoods = foods.filter((f) => selectedIds.includes(f.id)).filter((f) => !dishItems.some((d) => d.id === f.id)).map((f) => ({ ...f, originalQuantity: f.quantity }));
                    setDishItems((prev) => [...prev, ...selectedFoods]);
                    setSelectedIds([]);
                  }}
                  size="small"
                  sx={{ background: 'linear-gradient(135deg, #66bb6a, #388e3c)', '&:hover': { background: 'linear-gradient(135deg, #81c784, #43a047)' } }}
                >
                  Adicionar ao Prato ({selectedIds.length})
                </Button>
              </>
            )}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              size="small"
              sx={{ background: 'rgba(255,255,255,0.07)', color: '#e0e0e0', '&:hover': { background: 'rgba(255,255,255,0.12)' } }}
            >
              Novo Alimento
            </Button>
          </Box>
        </Box>
        <DataGrid
          rows={foods}
          columns={columnsFood}
          initialState={{ pagination: { paginationModel: { pageSize: 8 } } }}
          pageSizeOptions={[8, 20]}
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={(m: GridRowSelectionModel) => setSelectedIds([...m.ids].map(Number))}
          processRowUpdate={(row: IFood) => {
            setEditedFoods((prev) => new Map(prev).set(row.id, row));
            return row;
          }}
          onProcessRowUpdateError={(e) => console.error(e)}
          sx={DATAGRID_SX}
          autoHeight
        />
      </Paper>

      {/* Dish builder */}
      <Paper sx={{ background: '#161616', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ px: 3, pt: 2.5, pb: 2, borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: '#f0f0f0', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <LocalFireDepartmentOutlinedIcon sx={{ fontSize: 18, color: '#ef5350' }} />
              Composição do Prato
            </Typography>
            <Typography sx={{ color: '#616161', fontSize: '0.78rem', mt: 0.25 }}>
              {dishItems.length} ingrediente{dishItems.length !== 1 ? 's' : ''} · Edite a quantidade para recalcular nutrição
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            {selectedDishIds.length > 0 && (
              <Button
                variant="outlined"
                startIcon={<DeleteOutlineIcon />}
                onClick={() => { setDishItems((prev) => prev.filter((i) => !selectedDishIds.includes(i.id))); setSelectedDishIds([]); }}
                size="small"
                sx={{ borderColor: 'rgba(239,83,80,0.4)', color: '#ef5350', '&:hover': { borderColor: '#ef5350', backgroundColor: 'rgba(239,83,80,0.08)' } }}
              >
                Remover ({selectedDishIds.length})
              </Button>
            )}
            {dishItems.length > 0 && (
              <Button
                variant="contained"
                startIcon={<BookmarkAddOutlinedIcon />}
                onClick={() => setSaveDishOpen(true)}
                size="small"
                sx={{ background: 'linear-gradient(135deg, #66bb6a, #388e3c)', '&:hover': { background: 'linear-gradient(135deg, #81c784, #43a047)' } }}
              >
                Salvar como Prato
              </Button>
            )}
          </Box>
        </Box>

        {dishItems.length === 0 ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <LocalFireDepartmentOutlinedIcon sx={{ fontSize: 40, color: '#2a2a2a', mb: 1.5 }} />
            <Typography sx={{ color: '#424242', fontSize: '0.875rem' }}>
              Selecione alimentos acima e clique em "Adicionar ao Prato"
            </Typography>
          </Box>
        ) : (
          <>
            <DataGrid
              rows={dishItems.map((item) => ({ ...getCalculatedDishItem(item), originalQuantity: item.originalQuantity }))}
              columns={columnsDish}
              pageSizeOptions={[]}
              hideFooter={dishItems.length < 10}
              checkboxSelection
              disableRowSelectionOnClick
              onRowSelectionModelChange={(m: GridRowSelectionModel) => setSelectedDishIds([...m.ids].map(Number))}
              processRowUpdate={(row: DishItem) => {
                setDishItems((prev) => prev.map((item) => item.id === row.id ? { ...item, quantity: row.quantity } : item));
                const itemToUpdate = dishItems.find((i) => i.id === row.id);
                return itemToUpdate ? getCalculatedDishItem({ ...itemToUpdate, quantity: row.quantity }) : row;
              }}
              onProcessRowUpdateError={(e) => console.error(e)}
              sx={{ ...DATAGRID_SX, minHeight: 120 }}
              autoHeight
            />

            {/* Nutrition totals */}
            <Box sx={{ px: 3, py: 2.5, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {MACROS.map((m) => (
                <Box key={m.key} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', px: 2, py: 1.25, background: `${m.color}10`, border: `1px solid ${m.color}25`, borderRadius: 2, minWidth: 90 }}>
                  <Typography sx={{ color: m.color, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', mb: 0.25 }}>
                    {m.label}
                  </Typography>
                  <Typography sx={{ color: m.color, fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.01em' }}>
                    {dishTotals[m.key as keyof typeof dishTotals].toFixed(1)}
                  </Typography>
                  <Typography sx={{ color: `${m.color}99`, fontSize: '0.7rem' }}>{m.unit}</Typography>
                </Box>
              ))}
            </Box>
          </>
        )}
      </Paper>

      {/* Save Dish Dialog */}
      <Dialog
        open={saveDishOpen}
        onClose={() => setSaveDishOpen(false)}
        PaperProps={{ sx: { background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, minWidth: 380 } }}
      >
        <DialogTitle sx={{ color: '#f0f0f0', fontWeight: 700, fontSize: '1rem', pb: 1 }}>
          Salvar Prato
        </DialogTitle>
        <DialogContent sx={{ pt: '8px !important' }}>
          <Typography sx={{ color: '#616161', fontSize: '0.8rem', mb: 2 }}>
            {dishItems.length} ingrediente{dishItems.length !== 1 ? 's' : ''} · {dishTotals.calories.toFixed(0)} kcal total
          </Typography>
          <TextField
            fullWidth
            label="Nome do prato"
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
            variant="outlined"
            size="small"
            autoFocus
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { color: '#e0e0e0', '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' }, '&.Mui-focused fieldset': { borderColor: '#66bb6a' } }, '& .MuiInputLabel-root': { color: '#616161' }, '& .MuiInputLabel-root.Mui-focused': { color: '#66bb6a' } }}
          />
          <TextField
            fullWidth
            label="Descrição (opcional)"
            value={dishDesc}
            onChange={(e) => setDishDesc(e.target.value)}
            variant="outlined"
            size="small"
            multiline
            rows={2}
            sx={{ '& .MuiOutlinedInput-root': { color: '#e0e0e0', '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' }, '&.Mui-focused fieldset': { borderColor: '#66bb6a' } }, '& .MuiInputLabel-root': { color: '#616161' }, '& .MuiInputLabel-root.Mui-focused': { color: '#66bb6a' } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setSaveDishOpen(false)} sx={{ color: '#616161' }}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSaveDish}
            disabled={!dishName.trim() || isSavingDish}
            sx={{ background: 'linear-gradient(135deg, #66bb6a, #388e3c)', '&:hover': { background: 'linear-gradient(135deg, #81c784, #43a047)' } }}
          >
            {isSavingDish ? 'Salvando...' : 'Salvar Prato'}
          </Button>
        </DialogActions>
      </Dialog>

      <DialogAddFood open={openDialog} onClose={() => setOpenDialog(false)} onSubmit={(data) => { createFood(data, { onSuccess: () => setOpenDialog(false) }); }} isPending={isPending} />
    </Box>
  );
};
