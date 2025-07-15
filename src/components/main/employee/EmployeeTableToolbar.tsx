import { useState } from 'react';
import {
  Toolbar,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Box,
  Button,
  type SelectChangeEvent,
} from '@mui/material';
import { Icon } from '@iconify/react';
import theme from '../../../theme/theme';

type StatusOption = 'all' | 'active' | 'inactive';

type EmployeeTableToolbarProps = {
  filterValue: string;
  onFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  statusFilter: StatusOption;
  onStatusFilterChange: (value: StatusOption) => void;
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
};

export function EmployeeTableToolbar({
  filterValue,
  onFilterChange,
  statusFilter,
  onStatusFilterChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
}: EmployeeTableToolbarProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [statusSelectOpen, setStatusSelectOpen] = useState(false);

  const [localStatus, setLocalStatus] = useState<StatusOption>(statusFilter);
  const [localDateFrom, setLocalDateFrom] = useState<string>(dateFrom);
  const [localDateTo, setLocalDateTo] = useState<string>(dateTo);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setLocalStatus(statusFilter);
    setLocalDateFrom(dateFrom);
    setLocalDateTo(dateTo);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const applyFilters = () => {
    onStatusFilterChange(localStatus);
    onDateFromChange(localDateFrom);
    onDateToChange(localDateTo);
    handleClose();
  };

  const clearFilters = () => {
    setLocalStatus('all');
    setLocalDateFrom('');
    setLocalDateTo('');
  };

  return (
    <Toolbar
      disableGutters
      sx={{
        height: 80,
        display: 'flex',
        justifyContent: 'space-between',
        px: 2,
        py: 4,
      }}
    >
      <OutlinedInput
        value={filterValue}
        onChange={onFilterChange}
        placeholder="Buscar empleado..."
        startAdornment={
          <InputAdornment position="start">
            <Icon icon="eva:search-fill" width={20} />
          </InputAdornment>
        }
       sx={{
        width: 320,
        height: 46,
        fontSize: 14,
        borderRadius: 1.5,
        '& .MuiOutlinedInput-notchedOutline': {
          borderRadius: 1.5,
        },
        '& input': {
          padding: '8px 12px',
          fontSize: 16,
          '&::placeholder': {
            color: 'rgba(0, 0, 0, 0.54)',
            opacity: 1,
          },
        },
      }}

      />

      <Tooltip title="Filtros">
        <IconButton onClick={handleClick}>
          <Icon icon="ic:round-filter-list" fontSize={26} />
        </IconButton>
      </Tooltip>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <Box sx={{ px: 2, py: 1, display: 'flex', flexDirection: 'column', gap: 2, width: 280 }}>
          {/* Status Filter */}
          <FormControl fullWidth size="small">
            <InputLabel id="status-filter-label">Estado</InputLabel>
            <Select
              labelId="status-filter-label"
              open={statusSelectOpen}
              onOpen={() => setStatusSelectOpen(true)}
              onClose={() => setStatusSelectOpen(false)}
              value={localStatus}
              label="Estado"
              onChange={(e: SelectChangeEvent) => {
                setLocalStatus(e.target.value as StatusOption);
                setStatusSelectOpen(false);
              }}
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="active">Activo</MenuItem>
              <MenuItem value="inactive">Inactivo</MenuItem>
            </Select>
          </FormControl>

          {/* Date From */}
          <TextField
            label="Fecha desde"
            type="date"
            size="small"
            value={localDateFrom}
            onChange={(e) => setLocalDateFrom(e.target.value)}
            slotProps={{ 
                inputLabel:{ shrink: true } 
            }}
          />

          {/* Date To */}
          <TextField
            label="Fecha hasta"
            type="date"
            size="small"
            value={localDateTo}
            onChange={(e) => setLocalDateTo(e.target.value)}
            slotProps={{ 
                inputLabel:{ shrink: true } 
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button size="small" onClick={clearFilters}>
              Limpiar
            </Button>
            <Button size="small" variant="contained" onClick={applyFilters} sx={{color: theme.palette.publicisGrey.light}}>
              Aplicar
            </Button>
          </Box>
        </Box>
      </Menu>
    </Toolbar>
  );
}
