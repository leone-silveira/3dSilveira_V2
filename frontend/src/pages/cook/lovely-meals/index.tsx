import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Collapse from '@mui/material/Collapse';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';
import RamenDiningOutlinedIcon from '@mui/icons-material/RamenDiningOutlined';
import FitnessCenterOutlinedIcon from '@mui/icons-material/FitnessCenterOutlined';
import GrainOutlinedIcon from '@mui/icons-material/GrainOutlined';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dishApi } from '../../../api/dishApi';
import type { IDish, IDishItem } from '../../../interfaces/IDish';

const MACRO_COLORS = {
  calories: '#ef5350',
  protein: '#66bb6a',
  carbohydrate: '#ffa726',
  fat: '#ab47bc',
  fiber: '#29b6f6',
};

function computeTotals(dish: IDish) {
  return dish.items.reduce(
    (t, item) => {
      const ratio = item.food.quantity ? item.quantity / item.food.quantity : 1;
      return {
        calories: t.calories + (item.food.calories ?? 0) * ratio,
        protein: t.protein + (item.food.protein ?? 0) * ratio,
        carbohydrate: t.carbohydrate + (item.food.carbohydrate ?? 0) * ratio,
        fat: t.fat + (item.food.fat ?? 0) * ratio,
        fiber: t.fiber + (item.food.fiber ?? 0) * ratio,
      };
    },
    { calories: 0, protein: 0, carbohydrate: 0, fat: 0, fiber: 0 }
  );
}

function MacroBadge({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', px: 1.5, py: 0.75, background: `${color}10`, border: `1px solid ${color}20`, borderRadius: 1.5, minWidth: 72 }}>
      <Typography sx={{ color, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</Typography>
      <Typography sx={{ color, fontWeight: 800, fontSize: '0.9rem' }}>{value.toFixed(1)}</Typography>
      <Typography sx={{ color: `${color}80`, fontSize: '0.65rem' }}>{unit}</Typography>
    </Box>
  );
}

function DishCard({ dish, onDelete }: { dish: IDish; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const totals = computeTotals(dish);

  return (
    <Paper sx={{ background: '#161616', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', transition: 'border-color 0.2s', '&:hover': { borderColor: 'rgba(102,187,106,0.2)' } }}>
      {/* Card header */}
      <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Box sx={{ width: 42, height: 42, borderRadius: 2, background: 'rgba(239,83,80,0.1)', border: '1px solid rgba(239,83,80,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <RamenDiningOutlinedIcon sx={{ fontSize: 20, color: '#ef5350' }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ color: '#f0f0f0', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.3 }}>
            {dish.name}
          </Typography>
          {dish.description && (
            <Typography sx={{ color: '#616161', fontSize: '0.78rem', mt: 0.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {dish.description}
            </Typography>
          )}
          <Typography sx={{ color: '#424242', fontSize: '0.72rem', mt: 0.5 }}>
            {dish.items.length} ingrediente{dish.items.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title={expanded ? 'Ocultar ingredientes' : 'Ver ingredientes'}>
            <IconButton size="small" onClick={() => setExpanded(!expanded)} sx={{ color: '#424242', '&:hover': { color: '#e0e0e0' } }}>
              {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir prato">
            <IconButton size="small" onClick={() => setConfirmOpen(true)} sx={{ color: '#424242', '&:hover': { color: '#ef5350' } }}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Macro row */}
      <Box sx={{ px: 2.5, pb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <MacroBadge label="Kcal" value={totals.calories} unit="kcal" color={MACRO_COLORS.calories} />
        <MacroBadge label="Prot" value={totals.protein} unit="g" color={MACRO_COLORS.protein} />
        <MacroBadge label="Carb" value={totals.carbohydrate} unit="g" color={MACRO_COLORS.carbohydrate} />
        <MacroBadge label="Gord" value={totals.fat} unit="g" color={MACRO_COLORS.fat} />
        <MacroBadge label="Fibra" value={totals.fiber} unit="g" color={MACRO_COLORS.fiber} />
      </Box>

      {/* Ingredients collapse */}
      <Collapse in={expanded}>
        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.05)', px: 2.5, py: 1.5 }}>
          {dish.items.map((item: IDishItem) => {
            const ratio = item.food.quantity ? item.quantity / item.food.quantity : 1;
            const kcal = ((item.food.calories ?? 0) * ratio).toFixed(1);
            return (
              <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.75, borderBottom: '1px solid rgba(255,255,255,0.03)', '&:last-child': { borderBottom: 'none' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Typography sx={{ color: '#e0e0e0', fontSize: '0.835rem', fontWeight: 500 }}>{item.food.name}</Typography>
                  <Chip label={item.food.food_type} size="small" sx={{ height: 18, fontSize: '0.65rem', backgroundColor: 'rgba(102,187,106,0.08)', color: '#66bb6a', border: '1px solid rgba(102,187,106,0.15)' }} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography sx={{ color: '#ef5350', fontSize: '0.78rem', fontWeight: 600 }}>{kcal} kcal</Typography>
                  <Typography sx={{ color: '#424242', fontSize: '0.78rem', minWidth: 52, textAlign: 'right' }}>{item.quantity.toFixed(1)} g</Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Collapse>

      {/* Delete confirm */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} PaperProps={{ sx: { background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 } }}>
        <DialogTitle sx={{ color: '#f0f0f0', fontWeight: 700, fontSize: '1rem' }}>Excluir prato?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#9e9e9e', fontSize: '0.875rem' }}>
            "<strong style={{ color: '#e0e0e0' }}>{dish.name}</strong>" será removido permanentemente.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setConfirmOpen(false)} sx={{ color: '#616161' }}>Cancelar</Button>
          <Button variant="contained" onClick={() => { onDelete(); setConfirmOpen(false); }} sx={{ background: '#ef5350', '&:hover': { background: '#e53935' } }}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default function LovelyMealsPage() {
  const queryClient = useQueryClient();
  const { data: dishes = [], isLoading } = useQuery<IDish[]>({
    queryKey: ['dishes'],
    queryFn: dishApi.getDishes,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => dishApi.deleteDish(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dishes'] }),
  });

  const totalCalories = dishes.reduce((sum, d) => sum + computeTotals(d).calories, 0);

  return (
    <Box sx={{ width: '100%', maxWidth: 1400 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#f0f0f0', letterSpacing: '-0.02em' }}>
          Meus Pratos
        </Typography>
        <Typography sx={{ color: '#616161', mt: 0.5, fontSize: '0.875rem' }}>
          Pratos salvos para uso no plano diário
        </Typography>
      </Box>

      {/* Stats row */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {[
          { icon: <RamenDiningOutlinedIcon sx={{ fontSize: 18 }} />, label: 'Pratos Salvos', value: dishes.length, color: '#66bb6a' },
          { icon: <LocalFireDepartmentOutlinedIcon sx={{ fontSize: 18 }} />, label: 'Kcal Total', value: `${totalCalories.toFixed(0)} kcal`, color: '#ef5350' },
          { icon: <FitnessCenterOutlinedIcon sx={{ fontSize: 18 }} />, label: 'Proteína Média', value: `${(dishes.length ? dishes.reduce((s, d) => s + computeTotals(d).protein, 0) / dishes.length : 0).toFixed(1)} g`, color: '#66bb6a' },
          { icon: <GrainOutlinedIcon sx={{ fontSize: 18 }} />, label: 'Carb Médio', value: `${(dishes.length ? dishes.reduce((s, d) => s + computeTotals(d).carbohydrate, 0) / dishes.length : 0).toFixed(1)} g`, color: '#ffa726' },
        ].map((stat) => (
          <Box key={stat.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 1.5, background: '#161616', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2.5, borderLeft: `3px solid ${stat.color}` }}>
            <Box sx={{ color: stat.color }}>{stat.icon}</Box>
            <Box>
              <Typography sx={{ color: '#616161', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{stat.label}</Typography>
              <Typography sx={{ color: '#f0f0f0', fontWeight: 800, fontSize: '1.05rem' }}>{stat.value}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Dishes grid */}
      {isLoading ? (
        <Typography sx={{ color: '#424242', textAlign: 'center', py: 6 }}>Carregando pratos...</Typography>
      ) : dishes.length === 0 ? (
        <Paper sx={{ background: '#161616', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3, py: 8, textAlign: 'center' }}>
          <RamenDiningOutlinedIcon sx={{ fontSize: 56, color: '#1e1e1e', mb: 2 }} />
          <Typography sx={{ color: '#424242', fontWeight: 600, mb: 0.5 }}>Nenhum prato salvo ainda</Typography>
          <Typography sx={{ color: '#333', fontSize: '0.875rem' }}>
            Monte um prato na página "Receitas" e clique em "Salvar como Prato"
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 2 }}>
          {dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} onDelete={() => deleteMutation.mutate(dish.id)} />
          ))}
        </Box>
      )}
    </Box>
  );
}
