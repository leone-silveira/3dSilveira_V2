import { useMemo, useState } from 'react';
import { DataGrid, type GridColDef, type GridRenderCellParams, type GridRowSelectionModel } from '@mui/x-data-grid';
import { Box, Typography, Paper, Chip, Button, IconButton, Tooltip } from '@mui/material';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import TrendingDownOutlinedIcon from '@mui/icons-material/TrendingDownOutlined';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useFoodStockQuery } from '../../../queries/useFoodStockQuery';
import type { IStockFood } from '../../../interfaces/IStockFood';
import {
  useStockFoodMutation,
  useStockFoodCreateMutation,
  useStockFoodDeleteMutation,
} from '../../../mutations/useStockFoodMutation';
import { DialogAddStockFood } from '../../../components/DialogAddStockFood';

const UNIT_COLORS: Record<string, string> = {
  kg: '#66bb6a', g: '#81c784', l: '#29b6f6', ml: '#4fc3f7',
  un: '#ffa726', pcs: '#ffb74d',
};

const getDaysUntilExpiry = (expiry?: string | null): number => {
  if (!expiry) return Infinity;
  return Math.ceil((new Date(expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
};

const isLowStock = (item: IStockFood): boolean =>
  item.min_quantity != null && item.quantity != null && item.quantity <= item.min_quantity;

const ExpiryCell = ({ value }: { value?: string | null }) => {
  if (!value) return <Typography sx={{ color: '#424242', fontSize: '0.83rem' }}>—</Typography>;
  const days = getDaysUntilExpiry(value);
  const date = new Date(value).toLocaleDateString('pt-BR');

  if (days < 0) return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <WarningAmberOutlinedIcon sx={{ fontSize: 15, color: '#ef5350' }} />
      <Typography sx={{ color: '#ef5350', fontSize: '0.83rem', fontWeight: 600 }}>{date} (vencido)</Typography>
    </Box>
  );
  if (days <= 7) return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <WarningAmberOutlinedIcon sx={{ fontSize: 15, color: '#ffa726' }} />
      <Typography sx={{ color: '#ffa726', fontSize: '0.83rem', fontWeight: 600 }}>{date} ({days}d)</Typography>
    </Box>
  );
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <CheckCircleOutlineIcon sx={{ fontSize: 15, color: '#66bb6a' }} />
      <Typography sx={{ color: '#9e9e9e', fontSize: '0.83rem' }}>{date}</Typography>
    </Box>
  );
};

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
    '&.row-low': { backgroundColor: 'rgba(239,83,80,0.06)' },
    '&.row-low:hover': { backgroundColor: 'rgba(239,83,80,0.10)' },
  },
  '& .MuiDataGrid-footerContainer': {
    borderTop: '1px solid rgba(255,255,255,0.06)',
    backgroundColor: '#111',
  },
  '& .MuiTablePagination-root': { color: '#616161' },
  '& .MuiDataGrid-virtualScroller': { backgroundColor: '#161616' },
  '& .MuiCheckbox-root': { color: '#424242', '&.Mui-checked': { color: '#ef5350' } },
};

const StatCard = ({
  label,
  value,
  icon,
  color,
  emphasize = false,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  emphasize?: boolean;
}) => (
  <Box
    sx={{
      flex: '1 1 180px',
      minWidth: 180,
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      px: 2.5,
      py: 1.5,
      background: emphasize ? `${color}10` : '#161616',
      border: emphasize ? `1px solid ${color}40` : '1px solid rgba(255,255,255,0.06)',
      borderRadius: 2.5,
      borderLeft: `3px solid ${color}`,
    }}
  >
    <Box sx={{ color, display: 'flex' }}>{icon}</Box>
    <Box>
      <Typography sx={{ color: '#616161', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {label}
      </Typography>
      <Typography sx={{ color: emphasize ? color : '#f0f0f0', fontWeight: 800, fontSize: '1.1rem' }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

export default function FoodStockTable() {
  const { data: stockFoods = [] } = useFoodStockQuery();
  const stockFoodMutation = useStockFoodMutation();
  const createMutation = useStockFoodCreateMutation();
  const deleteMutation = useStockFoodDeleteMutation();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const processRowUpdate = (newRow: IStockFood) => {
    stockFoodMutation.mutate(newRow);
    return newRow;
  };

  const stats = useMemo(() => {
    let expired = 0;
    let expiringSoon = 0;
    let lowStock = 0;
    const lowItems: IStockFood[] = [];
    for (const f of stockFoods as IStockFood[]) {
      const days = getDaysUntilExpiry(f.expiry);
      if (days < 0) expired += 1;
      else if (days <= 7) expiringSoon += 1;
      if (isLowStock(f)) {
        lowStock += 1;
        lowItems.push(f);
      }
    }
    return { expired, expiringSoon, lowStock, lowItems };
  }, [stockFoods]);

  const columns: GridColDef<IStockFood>[] = useMemo(() => [
    {
      field: 'name',
      headerName: 'Item',
      flex: 2,
      minWidth: 160,
      editable: true,
      renderCell: (params: GridRenderCellParams<IStockFood>) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          {isLowStock(params.row) && (
            <Tooltip title="Estoque abaixo do mínimo">
              <ReportProblemOutlinedIcon sx={{ fontSize: 16, color: '#ef5350' }} />
            </Tooltip>
          )}
          <Typography sx={{ color: '#e0e0e0', fontSize: '0.875rem', fontWeight: 500 }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'food_type',
      headerName: 'Tipo',
      width: 120,
      editable: true,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value || '—'}
          size="small"
          sx={{
            backgroundColor: 'rgba(102,187,106,0.1)',
            color: '#66bb6a',
            border: '1px solid rgba(102,187,106,0.2)',
            fontSize: '0.72rem',
            height: 22,
            fontWeight: 600,
          }}
        />
      ),
    },
    {
      field: 'quantity',
      headerName: 'Quantidade',
      width: 120,
      editable: true,
      type: 'number',
      renderCell: (params: GridRenderCellParams<IStockFood>) => {
        const low = isLowStock(params.row);
        return (
          <Typography sx={{ color: low ? '#ef5350' : '#f0f0f0', fontWeight: 700, fontSize: '0.9rem' }}>
            {params.value}
          </Typography>
        );
      },
    },
    {
      field: 'unit',
      headerName: 'Unidade',
      width: 100,
      editable: true,
      renderCell: (params: GridRenderCellParams) => {
        const color = UNIT_COLORS[(params.value as string)?.toLowerCase()] || '#78909c';
        return (
          <Chip
            label={params.value || '—'}
            size="small"
            sx={{
              backgroundColor: `${color}18`,
              color,
              border: `1px solid ${color}30`,
              fontSize: '0.72rem',
              height: 22,
              fontWeight: 600,
            }}
          />
        );
      },
    },
    {
      field: 'min_quantity',
      headerName: 'Mín.',
      width: 90,
      editable: true,
      type: 'number',
      renderCell: (params: GridRenderCellParams) =>
        params.value == null
          ? <Typography sx={{ color: '#424242', fontSize: '0.83rem' }}>—</Typography>
          : <Typography sx={{ color: '#9e9e9e', fontSize: '0.83rem' }}>{params.value}</Typography>,
    },
    {
      field: 'expiry',
      headerName: 'Validade',
      width: 180,
      editable: true,
      renderCell: (params: GridRenderCellParams) => <ExpiryCell value={params.value as string} />,
    },
    {
      field: 'actions',
      headerName: '',
      width: 60,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<IStockFood>) => (
        <Tooltip title="Remover">
          <IconButton
            size="small"
            onClick={() => deleteMutation.mutate(params.row.id)}
            disabled={deleteMutation.isPending}
            sx={{ color: '#616161', '&:hover': { color: '#ef5350', backgroundColor: 'rgba(239,83,80,0.08)' } }}
          >
            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      ),
    },
  ], [deleteMutation]);

  return (
    <Box sx={{ width: '100%', maxWidth: 1400 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#f0f0f0', letterSpacing: '-0.02em' }}>
            Estoque
          </Typography>
          <Typography sx={{ color: '#616161', mt: 0.5, fontSize: '0.875rem' }}>
            Controle de validade, quantidade e itens críticos
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{
            background: 'linear-gradient(135deg, #66bb6a, #388e3c)',
            '&:hover': { background: 'linear-gradient(135deg, #81c784, #43a047)' },
            fontWeight: 700,
            textTransform: 'none',
          }}
        >
          Adicionar Item
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <StatCard
          label="Total no Estoque"
          value={`${stockFoods.length} ite${stockFoods.length === 1 ? 'm' : 'ns'}`}
          icon={<InventoryOutlinedIcon sx={{ fontSize: 18 }} />}
          color="#66bb6a"
        />
        <StatCard
          label="Itens Críticos"
          value={stats.lowStock}
          icon={<TrendingDownOutlinedIcon sx={{ fontSize: 18 }} />}
          color="#ef5350"
          emphasize={stats.lowStock > 0}
        />
        <StatCard
          label="Vencendo em Breve"
          value={stats.expiringSoon}
          icon={<WarningAmberOutlinedIcon sx={{ fontSize: 18 }} />}
          color="#ffa726"
          emphasize={stats.expiringSoon > 0}
        />
        <StatCard
          label="Vencidos"
          value={stats.expired}
          icon={<WarningAmberOutlinedIcon sx={{ fontSize: 18 }} />}
          color="#ef5350"
          emphasize={stats.expired > 0}
        />
      </Box>

      {stats.lowItems.length > 0 && (
        <Paper sx={{ background: 'rgba(239,83,80,0.05)', border: '1px solid rgba(239,83,80,0.2)', borderRadius: 3, p: 2.5, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <ReportProblemOutlinedIcon sx={{ fontSize: 18, color: '#ef5350' }} />
            <Typography sx={{ color: '#ef5350', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Itens Críticos — Reabastecer
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {stats.lowItems.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 1.25,
                  py: 0.5,
                  background: 'rgba(239,83,80,0.08)',
                  border: '1px solid rgba(239,83,80,0.25)',
                  borderRadius: 1.5,
                }}
              >
                <Typography sx={{ color: '#f0f0f0', fontSize: '0.8rem', fontWeight: 600 }}>{item.name}</Typography>
                <Typography sx={{ color: '#ef5350', fontSize: '0.75rem', fontWeight: 700 }}>
                  {item.quantity} / {item.min_quantity} {item.unit}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      )}

      <Paper sx={{ background: '#161616', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', '& .MuiDataGrid-virtualScroller': { overflowX: 'auto' } }}>
        {selectedIds.length > 0 && (
          <Box sx={{ px: 2.5, py: 1.25, borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(239,83,80,0.05)' }}>
            <Typography sx={{ color: '#e0e0e0', fontSize: '0.85rem' }}>
              {selectedIds.length} selecionado{selectedIds.length !== 1 ? 's' : ''}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<DeleteOutlineIcon />}
              disabled={deleteMutation.isPending}
              onClick={() => {
                selectedIds.forEach((id) => deleteMutation.mutate(id));
                setSelectedIds([]);
              }}
              sx={{ borderColor: 'rgba(239,83,80,0.4)', color: '#ef5350', textTransform: 'none', '&:hover': { borderColor: '#ef5350', backgroundColor: 'rgba(239,83,80,0.08)' } }}
            >
              Remover
            </Button>
          </Box>
        )}
        <DataGrid
          editMode="row"
          rows={stockFoods}
          columns={columns}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={(e) => console.error(e)}
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={(m: GridRowSelectionModel) => setSelectedIds([...m.ids].map(Number))}
          getRowClassName={(params) => (isLowStock(params.row as IStockFood) ? 'row-low' : '')}
          sx={DATAGRID_SX}
          autoHeight
        />
      </Paper>

      <DialogAddStockFood
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={(data) => createMutation.mutate(data, { onSuccess: () => setOpenDialog(false) })}
        isPending={createMutation.isPending}
      />
    </Box>
  );
}
