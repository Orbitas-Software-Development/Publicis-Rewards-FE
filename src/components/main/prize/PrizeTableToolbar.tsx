import { useState } from 'react';
import {
  Toolbar,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Tooltip,
  Menu,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Button,
} from '@mui/material';
import { Icon } from '@iconify/react';
import theme from '../../../theme/theme';

type OrderByOption = 'code' | 'description' | 'stock';

type FilterValues = {
  orderBy: OrderByOption;
  minCost: string;
  maxCost: string;
};

type PrizeTableToolbarProps = {
  filterValue: string;
  onFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onApplyFilters: (filters: FilterValues) => void;
  onClearFilters: () => void;
};

export function PrizeTableToolbar({
  filterValue,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
}: PrizeTableToolbarProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [tempFilters, setTempFilters] = useState<FilterValues>({
    orderBy: 'code',
    minCost: '',
    maxCost: '',
  });

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleInputChange = (field: keyof FilterValues, value: string) => {
    setTempFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(tempFilters);
    handleCloseMenu();
  };

  const handleClear = () => {
    setTempFilters({ orderBy: 'code', minCost: '', maxCost: '' });
    onClearFilters();
    handleCloseMenu();
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
        placeholder="Buscar premio..."
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
        <IconButton onClick={handleOpenMenu}>
          <Icon icon="ic:round-filter-list" fontSize={26} />
        </IconButton>
      </Tooltip>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        <Box sx={{ px: 2, py: 1, display: 'flex', flexDirection: 'column', gap: 2, width: 280 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="order-by-label">Ordenar por</InputLabel>
            <Select
              labelId="order-by-label"
              value={tempFilters.orderBy}
              label="Ordenar por"
              onChange={(e) => handleInputChange('orderBy', e.target.value)}
            >
              <MenuItem value="code">Código</MenuItem>
              <MenuItem value="description">Descripción</MenuItem>
              <MenuItem value="stock">Stock</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Costo mínimo"
            type="number"
            size="small"
            value={tempFilters.minCost}
            onChange={(e) => handleInputChange('minCost', e.target.value)}
          />
          <TextField
            label="Costo máximo"
            type="number"
            size="small"
            value={tempFilters.maxCost}
            onChange={(e) => handleInputChange('maxCost', e.target.value)}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button size="small" onClick={handleClear}>
              Limpiar
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={handleApplyFilters}
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
