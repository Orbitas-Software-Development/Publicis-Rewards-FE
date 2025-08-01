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
  Typography,
  type SelectChangeEvent,
} from '@mui/material';
import { Icon } from '@iconify/react';
import theme from '../../../theme/theme';
import { useBadgeCategories } from '../../../hooks/useBadgeCategory';

type FilterProps = {
  search: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
};

export function BadgeManagerAssignmentTableToolbar({
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
      {/* 🔍 Search input */}
      <OutlinedInput
        value={search}
        onChange={onSearchChange}
        placeholder="Buscar asignación..."
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
