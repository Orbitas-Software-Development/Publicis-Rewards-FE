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


type OrderByOption = 'id' |  'employeeNumber' | 'userName' | 'prizeName' | 'cost' | 'status' | 'date';


type RedemptionHistoryToolbarProps = {
  isAdmin: boolean
  filterValue: string;
  onFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

  orderBy: OrderByOption;
  onOrderByChange: (value: OrderByOption) => void;

  dateFrom: string;
  onDateFromChange: (value: string) => void;

  dateTo: string;
  onDateToChange: (value: string) => void;

  onClearFilters: () => void;
  onApplyFilters: () => void;
};

export function RedemptionHistoryTableToolbar({
  isAdmin,
  filterValue,
  onFilterChange,
  orderBy,
  onOrderByChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  onClearFilters,
  onApplyFilters,
}: RedemptionHistoryToolbarProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [localOrderBy, setLocalOrderBy] = useState<OrderByOption>(orderBy);
  const [localDateFrom, setLocalDateFrom] = useState<string>(dateFrom);
  const [localDateTo, setLocalDateTo] = useState<string>(dateTo);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setLocalOrderBy(orderBy);
    setLocalDateFrom(dateFrom);
    setLocalDateTo(dateTo);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const applyFilters = () => {
    onOrderByChange(localOrderBy);
    onDateFromChange(localDateFrom);
    onDateToChange(localDateTo);
    onApplyFilters();
    handleClose();
  };

  const clearFilters = () => {
    setLocalOrderBy('id');
    setLocalDateFrom('');
    setLocalDateTo('');
    onClearFilters();
    handleClose();
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
        placeholder="Buscar canje..."
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
           <FormControl fullWidth size="small">
        <InputLabel id="order-by-label">Ordenar por</InputLabel>
        <Select
            labelId="order-by-label"
            value={localOrderBy}
            label="Ordenar por"
            onChange={(e: SelectChangeEvent) => setLocalOrderBy(e.target.value as OrderByOption)}
        >
            <MenuItem value="id">ID</MenuItem>
            {isAdmin && <MenuItem value="employeeNumber">Número de empleado</MenuItem>}
            {isAdmin && <MenuItem value="userName">Nombre del usuario</MenuItem>}
            <MenuItem value="prizeName">Nombre del premio</MenuItem>
            <MenuItem value="pointsUsed">Huellas usadas</MenuItem>
            <MenuItem value="status">Estado</MenuItem> {/* Agregado */}
            <MenuItem value="date">Fecha</MenuItem> {/* Agregado */}
        </Select>
        </FormControl>


          <TextField
            label="Fecha desde"
            type="date"
            size="small"
            value={localDateFrom}
            onChange={(e) => setLocalDateFrom(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <TextField
            label="Fecha hasta"
            type="date"
            size="small"
            value={localDateTo}
            onChange={(e) => setLocalDateTo(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button size="small" onClick={clearFilters}>
              Limpiar
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={applyFilters}
              sx={{ color: theme.palette.publicisGrey.light }}
            >
              Aplicar
            </Button>
          </Box>
        </Box>
      </Menu>
    </Toolbar>
  );
}
