import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TodayIcon from '@mui/icons-material/Today';
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';
import FitnessCenterOutlinedIcon from '@mui/icons-material/FitnessCenterOutlined';
import GrainOutlinedIcon from '@mui/icons-material/GrainOutlined';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dishApi } from '../../../api/dishApi';
import type { IDish, IMealPlanEntry } from '../../../interfaces/IDish';

const MEAL_SLOTS = [
  { key: 'breakfast', label: 'Café da Manhã', emoji: '☀️', color: '#ffa726' },
  { key: 'lunch',     label: 'Almoço',        emoji: '🍽️', color: '#66bb6a' },
  { key: 'snack',     label: 'Lanche',         emoji: '🥪', color: '#29b6f6' },
  { key: 'dinner',    label: 'Jantar',          emoji: '🌙', color: '#ab47bc' },
];

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function computeMacros(dish: IDish, servings: number) {
  const base = dish.items.reduce(
    (t, item) => {
      const ratio = item.food.quantity ? item.quantity / item.food.quantity : 1;
      return {
        calories:     t.calories     + (item.food.calories     ?? 0) * ratio,
        protein:      t.protein      + (item.food.protein      ?? 0) * ratio,
        carbohydrate: t.carbohydrate + (item.food.carbohydrate ?? 0) * ratio,
        fat:          t.fat          + (item.food.fat          ?? 0) * ratio,
        fiber:        t.fiber        + (item.food.fiber        ?? 0) * ratio,
      };
    },
    { calories: 0, protein: 0, carbohydrate: 0, fat: 0, fiber: 0 }
  );
  return {
    calories:     base.calories     * servings,
    protein:      base.protein      * servings,
    carbohydrate: base.carbohydrate * servings,
    fat:          base.fat          * servings,
    fiber:        base.fiber        * servings,
  };
}

const DAILY_GOALS = { calories: 2000, protein: 150, carbohydrate: 250, fat: 65 };

function GoalBar({ value, goal, color }: { value: number; goal: number; color: string }) {
  const pct = Math.min((value / goal) * 100, 100);
  return (
    <Box sx={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ height: '100%', width: `${pct}%`, background: pct >= 100 ? '#ef5350' : color, borderRadius: 2, transition: 'width 0.4s ease' }} />
    </Box>
  );
}

export default function MealPlansPage() {
  const queryClient = useQueryClient();
  const [date, setDate] = useState(toDateStr(new Date()));
  const [addOpen, setAddOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedDishId, setSelectedDishId] = useState<number | ''>('');
  const [servings, setServings] = useState('1');

  const { data: dishes = [] } = useQuery<IDish[]>({
    queryKey: ['dishes'],
    queryFn: dishApi.getDishes,
  });

  const { data: entries = [], isLoading } = useQuery<IMealPlanEntry[]>({
    queryKey: ['meal-plan', date],
    queryFn: () => dishApi.getMealPlanEntries(date),
  });

  const addMutation = useMutation({
    mutationFn: dishApi.addMealPlanEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meal-plan', date] });
      setAddOpen(false);
      setSelectedDishId('');
      setServings('1');
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: number) => dishApi.removeMealPlanEntry(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['meal-plan', date] }),
  });

  const shiftDate = (days: number) => {
    const d = new Date(date + 'T12:00:00');
    d.setDate(d.getDate() + days);
    setDate(toDateStr(d));
  };

  const handleAdd = () => {
    if (!selectedSlot || !selectedDishId) return;
    addMutation.mutate({
      date,
      meal_type: selectedSlot,
      dish_id: Number(selectedDishId),
      servings: parseFloat(servings) || 1,
    });
  };

  // Daily totals
  const dailyTotals = entries.reduce(
    (t, e) => {
      const m = computeMacros(e.dish, e.servings);
      return { calories: t.calories + m.calories, protein: t.protein + m.protein, carbohydrate: t.carbohydrate + m.carbohydrate, fat: t.fat + m.fat, fiber: t.fiber + m.fiber };
    },
    { calories: 0, protein: 0, carbohydrate: 0, fat: 0, fiber: 0 }
  );

  const displayDate = new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  const isToday = date === toDateStr(new Date());

  return (
    <Box sx={{ width: '100%', maxWidth: 1400 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#f0f0f0', letterSpacing: '-0.02em' }}>
            Plano Diário
          </Typography>
          <Typography sx={{ color: '#616161', mt: 0.5, fontSize: '0.875rem' }}>
            Organize suas refeições e acompanhe seus macros
          </Typography>
        </Box>

        {/* Date nav */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, background: '#161616', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2, px: 1.5, py: 0.75 }}>
          <IconButton size="small" onClick={() => shiftDate(-1)} sx={{ color: '#616161', '&:hover': { color: '#e0e0e0' } }}>
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <Box sx={{ textAlign: 'center', minWidth: 180 }}>
            <Typography sx={{ color: '#e0e0e0', fontWeight: 600, fontSize: '0.875rem', textTransform: 'capitalize' }}>
              {displayDate}
            </Typography>
            {!isToday && (
              <Button size="small" startIcon={<TodayIcon sx={{ fontSize: '13px !important' }} />} onClick={() => setDate(toDateStr(new Date()))} sx={{ color: '#66bb6a', fontSize: '0.7rem', py: 0, minHeight: 0, mt: 0.25 }}>
                Hoje
              </Button>
            )}
          </Box>
          <IconButton size="small" onClick={() => shiftDate(1)} sx={{ color: '#616161', '&:hover': { color: '#e0e0e0' } }}>
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 300px' }, gap: 3 }}>
        {/* Meal slots */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {MEAL_SLOTS.map((slot) => {
            const slotEntries = entries.filter((e) => e.meal_type === slot.key);
            const slotTotals = slotEntries.reduce(
              (t, e) => {
                const m = computeMacros(e.dish, e.servings);
                return { calories: t.calories + m.calories, protein: t.protein + m.protein };
              },
              { calories: 0, protein: 0 }
            );

            return (
              <Paper key={slot.key} sx={{ background: '#161616', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                {/* Slot header */}
                <Box sx={{ px: 2.5, py: 1.75, borderBottom: slotEntries.length > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 34, height: 34, borderRadius: 1.5, background: `${slot.color}12`, border: `1px solid ${slot.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                      {slot.emoji}
                    </Box>
                    <Box>
                      <Typography sx={{ color: '#e0e0e0', fontWeight: 700, fontSize: '0.9rem' }}>{slot.label}</Typography>
                      {slotEntries.length > 0 && (
                        <Typography sx={{ color: '#424242', fontSize: '0.72rem' }}>
                          {slotTotals.calories.toFixed(0)} kcal · {slotTotals.protein.toFixed(1)}g prot
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Tooltip title="Adicionar prato">
                    <IconButton size="small" onClick={() => { setSelectedSlot(slot.key); setAddOpen(true); }} sx={{ color: '#424242', '&:hover': { color: slot.color } }}>
                      <AddCircleOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Entries */}
                {slotEntries.length === 0 ? (
                  <Box sx={{ px: 2.5, py: 2, textAlign: 'center' }}>
                    <Typography sx={{ color: '#2a2a2a', fontSize: '0.78rem' }}>Nenhum prato adicionado</Typography>
                  </Box>
                ) : (
                  <Box sx={{ px: 2.5, py: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {slotEntries.map((entry) => {
                      const macros = computeMacros(entry.dish, entry.servings);
                      return (
                        <Box key={entry.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1, borderBottom: '1px solid rgba(255,255,255,0.03)', '&:last-child': { borderBottom: 'none' } }}>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography sx={{ color: '#e0e0e0', fontWeight: 600, fontSize: '0.875rem' }}>{entry.dish.name}</Typography>
                              {entry.servings !== 1 && (
                                <Chip label={`×${entry.servings}`} size="small" sx={{ height: 18, fontSize: '0.65rem', backgroundColor: `${slot.color}10`, color: slot.color, border: `1px solid ${slot.color}20` }} />
                              )}
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1.5, mt: 0.5 }}>
                              <Typography sx={{ color: '#ef5350', fontSize: '0.72rem', fontWeight: 600 }}>{macros.calories.toFixed(0)} kcal</Typography>
                              <Typography sx={{ color: '#66bb6a', fontSize: '0.72rem' }}>{macros.protein.toFixed(1)}g P</Typography>
                              <Typography sx={{ color: '#ffa726', fontSize: '0.72rem' }}>{macros.carbohydrate.toFixed(1)}g C</Typography>
                              <Typography sx={{ color: '#ab47bc', fontSize: '0.72rem' }}>{macros.fat.toFixed(1)}g G</Typography>
                            </Box>
                          </Box>
                          <IconButton size="small" onClick={() => removeMutation.mutate(entry.id)} sx={{ color: '#333', '&:hover': { color: '#ef5350' }, flexShrink: 0 }}>
                            <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Paper>
            );
          })}
        </Box>

        {/* Daily summary sidebar */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Paper sx={{ background: '#161616', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3, p: 2.5 }}>
            <Typography sx={{ color: '#f0f0f0', fontWeight: 700, fontSize: '0.9rem', mb: 2 }}>Resumo do Dia</Typography>

            {isLoading ? (
              <Typography sx={{ color: '#424242', fontSize: '0.8rem' }}>Carregando...</Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { key: 'calories', label: 'Calorias', unit: 'kcal', value: dailyTotals.calories, goal: DAILY_GOALS.calories, color: '#ef5350', icon: <LocalFireDepartmentOutlinedIcon sx={{ fontSize: 16 }} /> },
                  { key: 'protein', label: 'Proteínas', unit: 'g', value: dailyTotals.protein, goal: DAILY_GOALS.protein, color: '#66bb6a', icon: <FitnessCenterOutlinedIcon sx={{ fontSize: 16 }} /> },
                  { key: 'carbohydrate', label: 'Carboidratos', unit: 'g', value: dailyTotals.carbohydrate, goal: DAILY_GOALS.carbohydrate, color: '#ffa726', icon: <GrainOutlinedIcon sx={{ fontSize: 16 }} /> },
                  { key: 'fat', label: 'Gorduras', unit: 'g', value: dailyTotals.fat, goal: DAILY_GOALS.fat, color: '#ab47bc', icon: <WaterDropOutlinedIcon sx={{ fontSize: 16 }} /> },
                ].map((macro) => (
                  <Box key={macro.key}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: macro.color }}>
                        {macro.icon}
                        <Typography sx={{ color: macro.color, fontSize: '0.78rem', fontWeight: 600 }}>{macro.label}</Typography>
                      </Box>
                      <Typography sx={{ color: '#9e9e9e', fontSize: '0.78rem' }}>
                        <span style={{ color: macro.color, fontWeight: 700 }}>{macro.value.toFixed(0)}</span>
                        {' / '}{macro.goal} {macro.unit}
                      </Typography>
                    </Box>
                    <GoalBar value={macro.value} goal={macro.goal} color={macro.color} />
                  </Box>
                ))}
              </Box>
            )}
          </Paper>

          {/* Meal count */}
          <Paper sx={{ background: '#161616', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3, p: 2.5 }}>
            <Typography sx={{ color: '#f0f0f0', fontWeight: 700, fontSize: '0.9rem', mb: 1.5 }}>Refeições</Typography>
            {MEAL_SLOTS.map((slot) => {
              const count = entries.filter((e) => e.meal_type === slot.key).length;
              return (
                <Box key={slot.key} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.75 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ fontSize: '0.9rem' }}>{slot.emoji}</Typography>
                    <Typography sx={{ color: '#9e9e9e', fontSize: '0.8rem' }}>{slot.label}</Typography>
                  </Box>
                  <Chip label={`${count} prato${count !== 1 ? 's' : ''}`} size="small" sx={{ height: 20, fontSize: '0.68rem', backgroundColor: count > 0 ? `${slot.color}10` : 'rgba(255,255,255,0.04)', color: count > 0 ? slot.color : '#424242', border: `1px solid ${count > 0 ? slot.color + '20' : 'transparent'}` }} />
                </Box>
              );
            })}
          </Paper>
        </Box>
      </Box>

      {/* Add dish dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} PaperProps={{ sx: { background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, minWidth: 380 } }}>
        <DialogTitle sx={{ color: '#f0f0f0', fontWeight: 700, fontSize: '1rem', pb: 1 }}>
          Adicionar Prato
          {selectedSlot && (
            <Typography component="span" sx={{ color: '#616161', fontSize: '0.8rem', ml: 1 }}>
              — {MEAL_SLOTS.find((s) => s.key === selectedSlot)?.label}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent sx={{ pt: '8px !important', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: '#616161', '&.Mui-focused': { color: '#66bb6a' } }}>Refeição</InputLabel>
            <Select
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              label="Refeição"
              sx={{ color: '#e0e0e0', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.12)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.25)' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#66bb6a' } }}
              MenuProps={{ PaperProps: { sx: { background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' } } }}
            >
              {MEAL_SLOTS.map((s) => (
                <MenuItem key={s.key} value={s.key} sx={{ color: '#e0e0e0', '&:hover': { background: 'rgba(255,255,255,0.05)' } }}>
                  {s.emoji} {s.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: '#616161', '&.Mui-focused': { color: '#66bb6a' } }}>Prato</InputLabel>
            <Select
              value={selectedDishId}
              onChange={(e) => setSelectedDishId(e.target.value as number)}
              label="Prato"
              sx={{ color: '#e0e0e0', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.12)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.25)' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#66bb6a' } }}
              MenuProps={{ PaperProps: { sx: { background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' } } }}
            >
              {dishes.length === 0 && (
                <MenuItem disabled sx={{ color: '#424242', fontSize: '0.8rem' }}>Nenhum prato salvo</MenuItem>
              )}
              {dishes.map((d) => {
                const t = computeMacros(d, 1);
                return (
                  <MenuItem key={d.id} value={d.id} sx={{ color: '#e0e0e0', '&:hover': { background: 'rgba(255,255,255,0.05)' }, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', py: 1 }}>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>{d.name}</Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: '#ef5350' }}>{t.calories.toFixed(0)} kcal · {t.protein.toFixed(1)}g prot</Typography>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Porções"
            type="number"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            size="small"
            inputProps={{ min: 0.5, step: 0.5 }}
            helperText="1 = uma porção completa do prato"
            sx={{ '& .MuiOutlinedInput-root': { color: '#e0e0e0', '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' }, '&.Mui-focused fieldset': { borderColor: '#66bb6a' } }, '& .MuiInputLabel-root': { color: '#616161' }, '& .MuiInputLabel-root.Mui-focused': { color: '#66bb6a' }, '& .MuiFormHelperText-root': { color: '#424242' } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setAddOpen(false)} sx={{ color: '#616161' }}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleAdd}
            disabled={!selectedSlot || !selectedDishId || addMutation.isPending}
            sx={{ background: 'linear-gradient(135deg, #66bb6a, #388e3c)', '&:hover': { background: 'linear-gradient(135deg, #81c784, #43a047)' } }}
          >
            {addMutation.isPending ? 'Adicionando...' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
