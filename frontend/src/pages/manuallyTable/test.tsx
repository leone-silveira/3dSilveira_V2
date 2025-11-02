import * as React from 'react';
import {
  DataGrid,
  GridColDef,
  GridRenderHeaderParams,
} from '@mui/x-data-grid';
import {
  IconButton,
  Menu,
  MenuItem,
  Checkbox,
  TextField,
  Button,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

interface Row {
  id: number;
  name: string;
  role: string;
}

const rows: Row[] = [
  { id: 1, name: 'Alice', role: 'Admin' },
  { id: 2, name: 'Bob', role: 'User' },
  { id: 3, name: 'Charlie', role: 'User' },
  { id: 4, name: 'David', role: 'Admin' },
];

export default function ExcelStyleHeader() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [filterText, setFilterText] = React.useState('');
  const [selectedRoles, setSelectedRoles] = React.useState<string[]>([]);
  const [currentColumn, setCurrentColumn] = React.useState<string | null>(null);

  const allRoles = React.useMemo(() => {
    return Array.from(new Set(rows.map((r) => r.role)));
  }, []);

  const filteredRoles = allRoles.filter((role) =>
    role.toLowerCase().includes(filterText.toLowerCase())
  );

  const filteredRows = rows.filter((row) =>
    selectedRoles.length > 0 ? selectedRoles.includes(row.role) : true
  );

  const handleOpenFilter = (event: React.MouseEvent<HTMLButtonElement>, colId: string) => {
    setCurrentColumn(colId);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseFilter = () => {
    setAnchorEl(null);
    setFilterText('');
  };

  const handleToggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 150 },
    {
      field: 'role',
      headerName: 'Role',
      width: 150,
      renderHeader: (params: GridRenderHeaderParams) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>{params.colDef.headerName}</span>
          <IconButton
            size="small"
            onClick={(e) => handleOpenFilter(e, params.colDef.field)}
          >
            <FilterListIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataGrid
        rows={filteredRows}
        columns={columns}
      />

      {/* Filter Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseFilter}
      >
        <MenuItem>
          <TextField
            placeholder="Search..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            fullWidth
          />
        </MenuItem>
        {filteredRoles.map((role) => (
          <MenuItem key={role}>
            <Checkbox
              checked={selectedRoles.includes(role)}
              onChange={() => handleToggleRole(role)}
            />
            {role}
          </MenuItem>
        ))}
        <MenuItem>
          <Button onClick={handleCloseFilter} fullWidth>
            Close
          </Button>
        </MenuItem>
      </Menu>
    </>
  );
}
