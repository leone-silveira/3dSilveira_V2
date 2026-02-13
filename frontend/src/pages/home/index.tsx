import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useExpenseQuery } from '../../queries/useExpenseQuery';

interface StatCard {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

interface Expense {
  id: number;
  description: string;
  category: string;
  amount: number;
  date: string;
}

export const HomePage: React.FC = () => {
  const { data: expenses = [] } = useExpenseQuery();

  const totalExpenses = expenses.reduce((sum: number, exp: Expense) => sum + exp.amount, 0);
  const thisMonthExpenses = expenses.filter((exp: Expense) => {
    const expDate = new Date(exp.date);
    const today = new Date();
    return expDate.getMonth() === today.getMonth() && expDate.getFullYear() === today.getFullYear();
  }).reduce((sum: number, exp: Expense) => sum + exp.amount, 0);

  const recentExpenses = expenses.slice(0, 5);

  const StatCards: StatCard[] = [
    {
      title: 'Total Expenses',
      value: `$${totalExpenses.toFixed(2)}`,
      icon: <MonetizationOnIcon sx={{ fontSize: 40 }} />,
      color: '#ff7043',
    },
    {
      title: 'This Month',
      value: `$${thisMonthExpenses.toFixed(2)}`,
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      color: '#ffa726',
    },
    {
      title: 'Total Items',
      value: '125',
      icon: <RestaurantIcon sx={{ fontSize: 40 }} />,
      color: '#66bb6a',
    },
    {
      title: 'Shopping List',
      value: '8 Items',
      icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
      color: '#29b6f6',
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: '#ffffff' }}>
        Dashboard
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        {StatCards.map((card) => (
          <Box
            key={card.title}
            sx={{
              flex: '1 1 calc(25% - 12px)',
              minWidth: '200px',
              p: 3,
              background: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)',
              border: `2px solid ${card.color}33`,
              borderRadius: 2,
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: `0 8px 16px ${card.color}40`,
                borderColor: card.color,
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ color: card.color }}>
                {card.icon}
              </Box>
              <Box>
                <Typography sx={{ color: '#b0bec5', fontSize: '0.875rem', mb: 1 }}>
                  {card.title}
                </Typography>
                <Typography sx={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 700 }}>
                  {card.value}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ flex: '1 1 calc(66.66% - 12px)', minWidth: '300px' }}>
          <Paper
            sx={{
              p: 3,
              background: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)',
              border: '1px solid #333333',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#ffffff' }}>
              Recent Expenses
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ borderBottom: '1px solid #333333' }}>
                    <TableCell sx={{ color: '#b0bec5' }}>Description</TableCell>
                    <TableCell sx={{ color: '#b0bec5' }}>Category</TableCell>
                    <TableCell align="right" sx={{ color: '#b0bec5' }}>Amount</TableCell>
                    <TableCell sx={{ color: '#b0bec5' }}>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentExpenses.map((expense: Expense) => (
                    <TableRow key={expense.id} sx={{ borderBottom: '1px solid #333333' }}>
                      <TableCell sx={{ color: '#ffffff' }}>{expense.description}</TableCell>
                      <TableCell sx={{ color: '#b0bec5' }}>{expense.category}</TableCell>
                      <TableCell align="right" sx={{ color: '#66bb6a', fontWeight: 600 }}>
                        ${expense.amount.toFixed(2)}
                      </TableCell>
                      <TableCell sx={{ color: '#b0bec5' }}>
                        {new Date(expense.date).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>

        <Box sx={{ flex: '1 1 calc(33.33% - 12px)', minWidth: '250px' }}>
          <Paper
            sx={{
              p: 3,
              background: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)',
              border: '1px solid #333333',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#ffffff' }}>
              Quick Access
            </Typography>
            <Typography sx={{ color: '#b0bec5', lineHeight: 1.8 }}>
              Welcome to your Kitchen Manager! Use the sidebar to navigate to different sections of the application.
              Start by checking your food stock, managing recipes, or planning your shopping list.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};
