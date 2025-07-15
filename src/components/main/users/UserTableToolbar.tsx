import React from 'react';
import {
  Toolbar,
  InputAdornment,
  Box,
  Typography,
  MenuItem,
  Select,
  useTheme,
  TextField,
  type SelectChangeEvent,
} from '@mui/material';
import { Icon } from '@iconify/react';

type SortOption = '' | 'joinDateDesc' | 'joinDateAsc' | 'rolesCount';

type RoleFilter = 'all' | 'admin' | 'manager' | 'collaborator';

type UsersTableToolbarProps = {
  filterValue: string;
  onFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  sortValue: SortOption;
  onSortChange: (value: SortOption) => void;
  roleFilter: RoleFilter;
  onRoleFilterChange: (value: RoleFilter) => void;
};

export default function UsersTableToolbar({
  filterValue,
  onFilterChange,
  sortValue,
  onSortChange,
  roleFilter,
  onRoleFilterChange,
}: UsersTableToolbarProps) {
  const theme = useTheme();

  const labels: Record<Exclude<SortOption, ''>, string> = {
    joinDateDesc: 'Más recientes',
    joinDateAsc: 'Más antiguos',
    rolesCount: 'Cantidad de roles',
  };

  const roleOptions: { key: RoleFilter; label: string }[] = [
    { key: 'all', label: 'Todos' },
    { key: 'admin', label: 'Admin' },
    { key: 'manager', label: 'Supervisor' },
    { key: 'collaborator', label: 'Colaborador' },
  ];

  const tabIndex = roleOptions.findIndex(opt => opt.key === roleFilter);

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
            left: `calc(${tabIndex * (100 / roleOptions.length)}% + 4px)`,
            width: `calc(${100 / roleOptions.length}% - 8px)`,
            bgcolor: 'common.white',
            borderRadius: 2,
            boxShadow: 1,
            transition: 'all 0.3s ease',
            zIndex: 0,
          }}
        />

        {roleOptions.map((opt, i) => (
          <Box
            key={opt.key}
            onClick={() => onRoleFilterChange(opt.key)}
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

      {/* Search + Select */}
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
          placeholder="Buscar usuario..."
          value={filterValue}
          onChange={onFilterChange}
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

        <Select
          value={sortValue}
          onChange={(e: SelectChangeEvent) => onSortChange(e.target.value as SortOption)}
          displayEmpty
          variant="standard"
          disableUnderline
          renderValue={(value) => (
            <Box sx={{ display: 'flex', alignItems: 'center', userSelect: 'none' }}>
              <Icon icon="mdi:sort" width={18} />
              <Typography variant="body1" sx={{ fontWeight: 500, fontSize: 14, ml: 1 }}>
                Ordenar por{value ? `: ${labels[value as Exclude<SortOption, ''>]}` : ''}
              </Typography>
            </Box>
          )}
          sx={{
            minWidth: 150,
            borderRadius: 2,
            px: 1.5,
            py: 0.6,
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            cursor: 'pointer',
            transition: 'border-color 0.3s ease',
            '&:hover': {
              borderColor: theme.palette.text.primary,
            },
            '& .MuiSelect-select': {
              paddingRight: '32px',
              display: 'flex',
              alignItems: 'center',
            },
          }}
        >
          <MenuItem value="">
            <Typography variant="body1">Ninguno</Typography>
          </MenuItem>
          <MenuItem value="joinDateDesc">
            <Typography variant="body1">Más recientes</Typography>
          </MenuItem>
          <MenuItem value="joinDateAsc">
            <Typography variant="body1">Más antiguos</Typography>
          </MenuItem>
          <MenuItem value="rolesCount">
            <Typography variant="body1">Cantidad de roles</Typography>
          </MenuItem>
        </Select>
      </Box>
    </Toolbar>

  );
}
