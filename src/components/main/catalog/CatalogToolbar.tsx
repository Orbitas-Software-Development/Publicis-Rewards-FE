import { useState } from 'react';
import {
  Toolbar,
  OutlinedInput,
  InputAdornment,
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
import { Search } from '@mui/icons-material';
import { Icon } from '@iconify/react';
import theme from '../../../theme/theme';

type OrderByOption = 'code' | 'description' | 'cost';

type CatalogToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onApplyFilters: (filters: {
    orderBy: OrderByOption;
    minCost: string;
    maxCost: string;
  }) => void;
  onClearFilters: () => void;
};

const CatalogToolbar: React.FC<CatalogToolbarProps> = ({
  search,
  onSearchChange,
  onApplyFilters,
  onClearFilters,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [tempFilters, setTempFilters] = useState({
    orderBy: 'description' as OrderByOption,
    minCost: '',
    maxCost: '',
  });

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleInputChange = (field: keyof typeof tempFilters, value: string) => {
    setTempFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(tempFilters);
    handleCloseMenu();
  };

  const handleClear = () => {
    setTempFilters({ orderBy: 'description', minCost: '', maxCost: '' });
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
        mb: 3,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider', 
      }}
    >
      {/* Buscador */}
      <OutlinedInput
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Buscar premio..."
        startAdornment={
          <InputAdornment position="start">
            <Search fontSize="small" />
          </InputAdornment>
        }
        sx={{
          width: 320,
          height: 46,
          fontSize: 14,
          bgcolor: 'white', 
          borderRadius: 1.5,
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',  // aquí quitas el borde
            borderRadius: 1.5,
          },
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
          transition: 'box-shadow 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
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
        <Box
            onClick={handleOpenMenu}
            sx={{
            bgcolor: 'white',
            borderRadius: '50%',
            boxShadow: 1,
            width: 44,
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
                boxShadow: 4,
            },
            }}
        >
            <Icon icon="ic:round-filter-list" fontSize={24} />
        </Box>
    </Tooltip>


      {/* Menú de filtros */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        <Box
          sx={{
            px: 2,
            py: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: 280,
          }}
        >
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
              <MenuItem value="cost">Huellas</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Huellas mínimas"
            type="number"
            size="small"
            value={tempFilters.minCost}
            onChange={(e) => handleInputChange('minCost', e.target.value)}
          />

          <TextField
            label="Huellas máximas"
            type="number"
            size="small"
            value={tempFilters.maxCost}
            onChange={(e) => handleInputChange('maxCost', e.target.value)}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button size="small" onClick={handleClear}>
              Limpiar
            </Button>
            <Button size="small" variant="contained" onClick={handleApplyFilters} sx={{ color: theme.palette.publicisGrey.light }}>
              Aplicar
            </Button>
          </Box>
        </Box>
      </Menu>
    </Toolbar>
  );
};

export default CatalogToolbar;
