import { useState } from 'react';
import {
  Toolbar,
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
  Typography,
  type SelectChangeEvent,
} from '@mui/material';
import { Icon } from '@iconify/react';
import theme from '../../../theme/theme';
import { useBadgeCategories } from '../../../hooks/useBadgeCategory';

type AssignmentFilter = 'manager' | 'collaborator';

type FilterProps = {
  assignmentFilter: AssignmentFilter;
  onAssignmentFilterChange: (value: AssignmentFilter) => void;
  search: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
};

export function BadgeAdminAssignmentTableToolbar({
  assignmentFilter,
  onAssignmentFilterChange,
  search,
  onSearchChange,
  category,
  onCategoryChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
}: FilterProps) {
  const { categories } = useBadgeCategories();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [localCategory, setLocalCategory] = useState(category);
  const [localDateFrom, setLocalDateFrom] = useState(dateFrom);
  const [localDateTo, setLocalDateTo] = useState(dateTo);
  

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setLocalCategory(category);
    setLocalDateFrom(dateFrom);
    setLocalDateTo(dateTo);
  };

  const handleClose = () => setAnchorEl(null);

  const applyFilters = () => {
    onCategoryChange(localCategory);
    onDateFromChange(localDateFrom);
    onDateToChange(localDateTo);
    handleClose();
  };

  const clearFilters = () => {
    setLocalCategory('all');
    setLocalDateFrom('');
    setLocalDateTo('');
  };

  const assignmentOptions: { key: AssignmentFilter; label: string }[] = [
    { key: 'manager', label: 'Managers' },
    { key: 'collaborator', label: 'Colaboradores' },
  ];

  const tabIndex = assignmentOptions.findIndex(opt => opt.key === assignmentFilter);

  return (
    <Toolbar
      disableGutters
      sx={{
        height: 'auto',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', md: 'center' },
        gap: 2,
        px: 2,
        py: 2,
      }}
    >
      {/* Tabs para filtro por rol */}
      <Box
        sx={{
          minWidth: { xs: '100%', md: 500 },
          bgcolor: theme.palette.publicisGrey.main,
          borderRadius: 2,
          py: 0.5,
          display: 'flex',
          position: 'relative',
        }}
      >
      {/* Fondo blanco para el item seleccionado */}
      <Box
        sx={{
          position: 'absolute',
          top: 5,
          bottom: 5,
          left: `calc(${tabIndex * (100 / assignmentOptions.length)}% + 4px)`,
          width: `calc(${100 / assignmentOptions.length}% - 8px)`,
          bgcolor: 'common.white',
          borderRadius: 2,
          boxShadow: 1,
          transition: 'all 0.3s ease',
          zIndex: 0,
        }}
      />
      
      {assignmentOptions.map((opt, i) => (
      <Box
        key={opt.key}
        onClick={() => onAssignmentFilterChange(opt.key)}
        sx={{
          flex: 1,
          mx: 0.5,
          py: 1,
          borderRadius: 2,
          fontWeight: 600,
          fontSize: 14,
          textAlign: 'center',
          cursor: 'pointer',
          position: 'relative',
          zIndex: 1,
          color: tabIndex === i ? theme.palette.primary.main : theme.palette.text.secondary,
          transition: 'all 0.2s ease',
          '&:hover': {
            color: theme.palette.text.primary,
          },
        }}
      >
        {opt.label}
      </Box>
      ))}
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          gap: 2,
          width: { xs: '100%', md: 'auto' },
        }}
      >
        <TextField
          value={search}
          onChange={onSearchChange}
          placeholder="Buscar asignación..."
          variant="standard"
          fullWidth={true}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Icon icon="eva:search-fill" width={20} />
                </InputAdornment>
               ),
             },
          }}
          sx={{
            maxWidth: { xs: '100%', sm: 200 },
            fontSize: 14,
            backgroundColor: 'transparent',
            '& .MuiInput-input::placeholder': {
              color: 'rgba(0, 0, 0, 0.54)',
              opacity: 1,
            },
          }}
        />

      {/* 🧰 Filter icon */}
      <Tooltip title="Filtros">
        <IconButton onClick={handleClick}>
          <Icon icon="ic:round-filter-list" fontSize={26} />
        </IconButton>
      </Tooltip>

      {/* 📋 Filters menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <Box sx={{ px: 2, py: 1, display: 'flex', flexDirection: 'column', gap: 2, width: 280 }}>
          <Typography variant="subtitle2">Filtros</Typography>

          {/* Mostrar filtro Categoría solo para colaboradores */}
          {assignmentFilter === 'collaborator' && (
            <FormControl fullWidth size="small">
              <InputLabel id="category-filter-label">Categoría</InputLabel>
              <Select
                labelId="category-filter-label"
                value={localCategory}
                label="Categoría"
                onChange={(e: SelectChangeEvent) => setLocalCategory(e.target.value)}
              >
                <MenuItem value="all">Todas</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.description}>
                    {cat.description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}


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
      </Box>
    </Toolbar>
  );
}
