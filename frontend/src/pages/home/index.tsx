import React from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, LinearProgress, Chip,
} from '@mui/material';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { useExpenseQuery } from '../../queries/useExpenseQuery';
import { getCategoryMeta, formatCurrency } from '../../utils/categoryColors';

interface Expense {
  id: number;
  description: string;
  category: string;
  amount: number;
  date: string;
}

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  accentColor: string;
  trend?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, accentColor, trend }) => (
  <Box
    sx={{
      flex: '1 1 0',
      minWidth: 180,
      p: 3,
      background: '#161616',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 3,
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.25s ease',
      cursor: 'default',
      '&:hover': {
        border: `1px solid ${accentColor}33`,
        transform: 'translateY(-3px)',
        boxShadow: `0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px ${accentColor}22`,
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: `linear-gradient(90deg, ${accentColor}, transparent)`,
      },
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
      <Box
        sx={{
          width: 40, height: 40, borderRadius: 2,
          backgroundColor: `${accentColor}18`,
          border: `1px solid ${accentColor}28`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: accentColor,
        }}
      >
        {icon}
      </Box>
      {trend !== undefined && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {trend >= 0 ? (
            <TrendingUpIcon sx={{ fontSize: 14, color: '#ef5350' }} />
          ) : (
            <TrendingDownIcon sx={{ fontSize: 14, color: '#66bb6a' }} />
          )}
          <Typography sx={{ fontSize: '0.75rem', color: trend >= 0 ? '#ef5350' : '#66bb6a', fontWeight: 600 }}>
            {Math.abs(trend).toFixed(0)}%
          </Typography>
        </Box>
      )}
    </Box>
    <Typography sx={{ color: '#616161', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', mb: 0.5 }}>
      {title}
    </Typography>
    <Typography sx={{ color: '#f0f0f0', fontSize: '1.75rem', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em' }}>
      {value}
    </Typography>
    {subtitle && (
      <Typography sx={{ color: '#616161', fontSize: '0.78rem', mt: 0.5 }}>
        {subtitle}
      </Typography>
    )}
  </Box>
);

export const HomePage: React.FC = () => {
  const { data: expenses = [] } = useExpenseQuery();

  const now = new Date();
  const totalExpenses = expenses.reduce((s: number, e: Expense) => s + e.amount, 0);

  const thisMonthExpenses = expenses.filter((e: Expense) => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const thisMonthTotal = thisMonthExpenses.reduce((s: number, e: Expense) => s + e.amount, 0);

  const lastMonthExpenses = expenses.filter((e: Expense) => {
    const d = new Date(e.date);
    const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear();
  });
  const lastMonthTotal = lastMonthExpenses.reduce((s: number, e: Expense) => s + e.amount, 0);
  const monthTrend = lastMonthTotal > 0 ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0;

  const recentExpenses = [...expenses]
    .sort((a: Expense, b: Expense) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  // Category breakdown
  const categoryTotals = expenses.reduce((acc: Record<string, number>, e: Expense) => {
    const cat = e.category?.toLowerCase() || 'other';
    acc[cat] = (acc[cat] || 0) + e.amount;
    return acc;
  }, {});

  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  const maxCategoryAmount = sortedCategories[0]?.[1] || 1;

  // Monthly spending (last 6 months)
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const total = expenses
      .filter((e: Expense) => {
        const ed = new Date(e.date);
        return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear();
      })
      .reduce((s: number, e: Expense) => s + e.amount, 0);
    return {
      label: d.toLocaleDateString('pt-BR', { month: 'short' }),
      total,
      isCurrent: i === 5,
    };
  });
  const maxMonthly = Math.max(...monthlyData.map(m => m.total), 1);

  const greeting = () => {
    const h = now.getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1400 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#f0f0f0', letterSpacing: '-0.02em' }}>
          {greeting()}, Leone 👋
        </Typography>
        <Typography sx={{ color: '#616161', mt: 0.5, fontSize: '0.9rem' }}>
          {now.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>
      </Box>

      {/* Stat cards */}
      <Box sx={{ display: 'flex', gap: 2.5, mb: 3, flexWrap: 'wrap' }}>
        <StatCard
          title="Total Gasto"
          value={formatCurrency(totalExpenses)}
          subtitle={`${expenses.length} despesas registradas`}
          icon={<MonetizationOnOutlinedIcon sx={{ fontSize: 20 }} />}
          accentColor="#ef5350"
        />
        <StatCard
          title="Este Mês"
          value={formatCurrency(thisMonthTotal)}
          subtitle={`${thisMonthExpenses.length} despesas`}
          icon={<CalendarTodayOutlinedIcon sx={{ fontSize: 20 }} />}
          accentColor="#ffa726"
          trend={monthTrend}
        />
        <StatCard
          title="Mês Anterior"
          value={formatCurrency(lastMonthTotal)}
          subtitle={`${lastMonthExpenses.length} despesas`}
          icon={<TrendingUpIcon sx={{ fontSize: 20 }} />}
          accentColor="#29b6f6"
        />
        <StatCard
          title="Categorias"
          value={String(Object.keys(categoryTotals).length)}
          subtitle="categorias ativas"
          icon={<RestaurantOutlinedIcon sx={{ fontSize: 20 }} />}
          accentColor="#66bb6a"
        />
      </Box>

      {/* Main content grid */}
      <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap' }}>

        {/* Recent Expenses */}
        <Paper
          sx={{
            flex: '2 1 420px',
            p: 0,
            background: '#161616',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ px: 3, pt: 2.5, pb: 2, borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontWeight: 700, color: '#f0f0f0', fontSize: '0.95rem' }}>
              Despesas Recentes
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#616161' }}>
              últimas {recentExpenses.length}
            </Typography>
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell align="right">Valor</TableCell>
                  <TableCell>Data</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentExpenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4, color: '#424242' }}>
                      Nenhuma despesa registrada
                    </TableCell>
                  </TableRow>
                ) : (
                  recentExpenses.map((expense: Expense) => {
                    const meta = getCategoryMeta(expense.category);
                    return (
                      <TableRow key={expense.id}>
                        <TableCell>
                          <Typography sx={{ color: '#e0e0e0', fontSize: '0.85rem', fontWeight: 500 }}>
                            {expense.description}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${meta.emoji} ${meta.label}`}
                            size="small"
                            sx={{
                              backgroundColor: meta.bg,
                              color: meta.color,
                              border: `1px solid ${meta.border}`,
                              fontSize: '0.72rem',
                              height: 22,
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography sx={{ color: '#f0f0f0', fontWeight: 700, fontSize: '0.9rem' }}>
                            {formatCurrency(expense.amount)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ color: '#616161', fontSize: '0.8rem' }}>
                            {new Date(expense.date).toLocaleDateString('pt-BR')}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Right column */}
        <Box sx={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: 2.5, minWidth: 260 }}>

          {/* Category breakdown */}
          <Paper sx={{ p: 0, background: '#161616', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ px: 3, pt: 2.5, pb: 2, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <Typography sx={{ fontWeight: 700, color: '#f0f0f0', fontSize: '0.95rem' }}>
                Por Categoria
              </Typography>
            </Box>
            <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {sortedCategories.length === 0 ? (
                <Typography sx={{ color: '#424242', fontSize: '0.85rem', textAlign: 'center', py: 2 }}>
                  Sem dados
                </Typography>
              ) : (
                sortedCategories.map(([cat, amount]) => {
                  const meta = getCategoryMeta(cat);
                  const pct = (amount / maxCategoryAmount) * 100;
                  return (
                    <Box key={cat}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                        <Typography sx={{ color: '#9e9e9e', fontSize: '0.8rem', fontWeight: 500 }}>
                          {meta.emoji} {meta.label}
                        </Typography>
                        <Typography sx={{ color: '#f0f0f0', fontSize: '0.8rem', fontWeight: 700 }}>
                          {formatCurrency(amount)}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={pct}
                        sx={{
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: meta.color,
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Box>
                  );
                })
              )}
            </Box>
          </Paper>

          {/* Monthly bar chart */}
          <Paper sx={{ p: 0, background: '#161616', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ px: 3, pt: 2.5, pb: 2, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <Typography sx={{ fontWeight: 700, color: '#f0f0f0', fontSize: '0.95rem' }}>
                Últimos 6 Meses
              </Typography>
            </Box>
            <Box sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 100, gap: 1 }}>
                {monthlyData.map((m) => {
                  const h = maxMonthly > 0 ? (m.total / maxMonthly) * 100 : 0;
                  return (
                    <Box key={m.label} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: 0.75 }}>
                      <Box
                        sx={{
                          width: '100%',
                          height: `${Math.max(h, 4)}%`,
                          minHeight: 4,
                          maxHeight: '100%',
                          backgroundColor: m.isCurrent ? '#66bb6a' : 'rgba(255,255,255,0.08)',
                          borderRadius: '3px 3px 0 0',
                          transition: 'height 0.3s ease',
                          position: 'relative',
                          alignSelf: 'flex-end',
                          ...(m.isCurrent && {
                            boxShadow: '0 0 8px rgba(102,187,106,0.4)',
                          }),
                        }}
                      />
                      <Typography sx={{ color: m.isCurrent ? '#66bb6a' : '#424242', fontSize: '0.7rem', fontWeight: m.isCurrent ? 700 : 400 }}>
                        {m.label}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};
