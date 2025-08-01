import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Tooltip,
  TableSortLabel,
  Button,
} from '@mui/material';
import { PiDotsThreeOutlineVerticalBold } from "react-icons/pi";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { FcInvite } from "react-icons/fc";
import { MdOutlineVisibility } from "react-icons/md";
import UsersTableToolbar from '../../components/main/users/UserTableToolbar';
import TableCardContainer from '../../components/main/table/TableCardContainer';
import { useUsers } from '../../hooks/useUser'; 
import Pagination from '../../components/main/table/Pagination';
import RoleManagerDrawer from '../../components/main/users/RoleManagerDrawer';
import type { RewardsUser } from '../../types/RewardsUser';
import AnimatedSnackbar from '../../components/main/utils/AnimatedSnackbar';
import ConfirmDialog from '../../components/main/utils/ConfirmDialog';
import { useNavigate } from 'react-router-dom';
import FullPageLoader from '../../components/main/utils/FullPageLoader';
import ErrorMessage from '../../components/main/utils/ErrorMessage';
import { API_URL } from '../../utils/ApiLinks';
import InviteUserDrawer from '../../components/main/users/InviteUserDrawer';
import AddUserDrawer from '../../components/main/users/AddUserDrawer';
import type { CreateUserByAdminDto } from '../../types/CreateUserByAdmin';

type SortOption = '' | 'joinDateDesc' | 'joinDateAsc' | 'rolesCount';
type RoleFilter = 'all' | 'admin'  | 'manager' | 'collaborator';

const UsersPage: React.FC = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const { users, loading, error, toggleUserAccount, deleteUserAccount, inviteUserFn,createUserByAdminFn} = useUsers(); 
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<RewardsUser | null>(null);
  
  const [filterText, setFilterText] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('');
  const [sortBy, setSortBy] = useState<'employeeNumber' | 'name' | 'status' | 'roles'  | 'createdDate'>('employeeNumber');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [inviteDrawerOpen, setInviteDrawerOpen] = useState(false);
  const [addUserDrawerOpen, setAddUserDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [loadingDisable, setLoadingDisable] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDialogUser, setConfirmDialogUser] = useState<RewardsUser | null>(null);

  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<RewardsUser | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const baseUrl = API_URL.endsWith('/api') ? API_URL.slice(0, -4) : API_URL;

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, userId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedUserId(userId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUserId(null);
  };

  const handleManageRoles = () => {
    const user = users.find(u => u.id === selectedUserId);
    if (user) {
      setSelectedUser(user);
      setDrawerOpen(true);
    }
    handleMenuClose();
  };

  const handleOpenConfirmDialog = () => {
  if (!selectedUserId) return;
  const user = users.find(u => u.id === selectedUserId);
  if (user) {
    setConfirmDialogUser(user);
    setConfirmDialogOpen(true);
  }
  setAnchorEl(null); 

};

const handleOpenDeleteConfirmDialog = () => {
  if (!selectedUserId) return;
  const user = users.find(u => u.id === selectedUserId);
  if (user) {
    setConfirmDeleteUser(user);
    setConfirmDeleteDialogOpen(true);
  }
  setAnchorEl(null); 
};

 const handleToggleUserStatus = async () => {
  if (!selectedUserId) return;

  const user = users.find(u => u.id === selectedUserId);
  if (!user) return;

  setLoadingDisable(true);

  try {
    const shouldEnable = user.status !== 'Activo';
    const msg = await toggleUserAccount(user.id, shouldEnable);
    showSnackbar(msg, 'success');
  } catch (err) {
    showSnackbar(
      (err as Error).message ?? 'Error al actualizar el estado del usuario',
      'error'
    );
  } finally {
    setLoadingDisable(false);
    handleMenuClose();
    setConfirmDialogOpen(false); 
  }
};

  const handleRemoveUser = async () => {
    if (!confirmDeleteUser) return;

    setLoadingDelete(true);

    try {
      const msg = await deleteUserAccount(confirmDeleteUser.id);
      showSnackbar(msg, 'success');
    } catch (err) {
      showSnackbar(
        (err as Error).message ?? 'Error al eliminar el usuario',
        'error'
      );
    } finally {
      setLoadingDelete(false);
      setConfirmDeleteDialogOpen(false);
      handleMenuClose();
    }
    
  };

  const handleRoleFilterChange = (value: RoleFilter) => {
    setRoleFilter(value);
    setPage(0);
  };

  const filteredUsers = useMemo(() => {
  // 1. Filtrado por texto
  let filtered = users.filter((user) =>
    [user.fullName, user.email, user.employeeNumber]
      .some((field) => field.toLowerCase().includes(filterText.toLowerCase()))
  );

  // 2. Filtrado por rol
  if (roleFilter === 'admin') {
    filtered = filtered.filter(user =>
      user.roles.some(r => r.name === 'Administrador')
    );
  } else if (roleFilter === 'manager') {
    filtered = filtered.filter(user =>
      Array.isArray(user.roles) &&
      user.roles.some(r => {
        const name = r.name.toLowerCase();
        return name.includes('manager') || name.includes('supervisor');
      })
    );
  } else if (roleFilter === 'collaborator') {
    filtered = filtered.filter(user =>
      user.roles.some(r => r.name === 'Colaborador')
    );
  }

  // 3. Ordenamiento
  const sorted = filtered.slice();

  if (sortOption !== '') {
    switch (sortOption) {
      case 'joinDateDesc':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'joinDateAsc':
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'rolesCount':
        return sorted.sort((a, b) => b.roles.length - a.roles.length);
      default:
        return sorted;
    }
  } else {
    return sorted.sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';

      switch (sortBy) {
        case 'employeeNumber':
          aValue = a.employeeNumber;
          bValue = b.employeeNumber;
          break;
        case 'name':
          aValue = a.fullName.toLowerCase();
          bValue = b.fullName.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'roles':
          aValue = a.roles.length;
          bValue = b.roles.length;
          break;
        case 'createdDate':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          break;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }
}, [users, filterText, roleFilter, sortBy, sortOrder, sortOption]);



  const handleSort = (property: typeof sortBy) => {
    const isAsc = sortBy === property && sortOrder === 'asc';
    setSortBy(property);
    setSortOrder(isAsc ? 'desc' : 'asc');
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };


  const currentItems = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const isShortResult = currentItems.length > 0 && currentItems.length < 6;

  const selectedMenuUser = selectedUserId ? users.find(u => u.id === selectedUserId) : null;


  if (loading) return <FullPageLoader />;

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: { xs: 2, md: 3 },
        display: 'flex',
        flexDirection: 'column',
        height: isDesktop ? '100%' : 'auto',
        gap: 3,
        overflow: isDesktop ? 'hidden' : 'visible',
      }}
    >
      <Box px={2} pt={1} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
        <Box>
          <Typography
            variant="h3"
            fontWeight="bold"
            color="primary.dark"
            textAlign="left"
            sx={{ fontSize: 'clamp(1.7rem, 4vw, 2rem)' }}
          >
            Listado de Usuarios
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" mt={0.5}>
            Consulta y gestiona la información de los usuarios registrados.
          </Typography>
        </Box>

        <Box display="flex" gap={2} mt={{ xs: 2, md: 0 }}>
          <Button
            variant="outlined"
            color="info"
            startIcon={<FcInvite />}
            sx={{ textTransform: 'none',py:{md:1}, borderRadius:2}}
            onClick={() => setInviteDrawerOpen(true)}
          >
            Invitar Usuario
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
            sx={{ textTransform: 'none', color: theme.palette.publicisGrey.light, py:{md:1}, borderRadius:2 }}
            onClick={() => setAddUserDrawerOpen(true)}
          >
            Añadir Usuario
          </Button>
        </Box>
      </Box>

      <TableCardContainer>
        <UsersTableToolbar
          filterValue={filterText}
          onFilterChange={(e) => setFilterText(e.target.value)}
          sortValue={sortOption}
          onSortChange={setSortOption}
          roleFilter={roleFilter}
          onRoleFilterChange={handleRoleFilterChange}
        />

        <TableContainer  
        sx={{
            flexGrow: 1,
            minHeight: '300px',
            maxHeight: '70vh',
        }}
        >
          <Table stickyHeader sx={{ height: isShortResult ? 'auto' : '100%' }}>
            <TableHead>
            <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'employeeNumber'}
                    direction={sortBy === 'employeeNumber' ? sortOrder : 'asc'}
                    onClick={() => handleSort('employeeNumber')}
                  >
                    <Typography variant="subtitle2" fontWeight={sortBy === 'employeeNumber' ? 'bold' : '500'} fontSize={16}>
                      N° Empleado
                    </Typography>
                  </TableSortLabel>               
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'name'}
                    direction={sortBy === 'name' ? sortOrder : 'asc'}
                    onClick={() => handleSort('name')}
                  >
                    <Typography variant="subtitle2" fontWeight={sortBy === 'name' ? 'bold' : '500'} fontSize={16}>
                      Nombre
                    </Typography>
                  </TableSortLabel>                                 
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'status'}
                    direction={sortBy === 'status' ? sortOrder : 'asc'}
                    onClick={() => handleSort('status')}
                  >
                    <Typography variant="subtitle2" fontWeight={sortBy === 'status' ? 'bold' : '500'} fontSize={16}>
                      Estado
                    </Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'roles'}
                    direction={sortBy === 'roles' ? sortOrder : 'asc'}
                    onClick={() => handleSort('roles')}
                  >
                    <Typography variant="subtitle2" fontWeight={sortBy === 'roles' ? 'bold' : '500'} fontSize={16}>
                      Roles
                    </Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'createdDate'}
                    direction={sortBy === 'createdDate' ? sortOrder : 'asc'}
                    onClick={() => handleSort('createdDate')}
                  >
                    <Typography variant="subtitle2" fontWeight={sortBy === 'createdDate' ? 'bold' : '500'} fontSize={16}>
                      Fecha de Creación
                    </Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell><Typography variant="subtitle2" fontSize={16}>Acciones</Typography></TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {currentItems.length === 0 ? (
                <TableRow>
                <TableCell colSpan={6} sx={{ p: 0 }}>
                    <Box
                    sx={{
                        minHeight: '300px',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    >
                    <Typography variant="subtitle1" color="text.secondary">
                        No se encontraron usuarios
                    </Typography>
                    </Box>
                </TableCell>
                </TableRow>
            ) : (
                currentItems.map((user) => (
                <TableRow key={user.id}>
                    <TableCell><Typography >{user.employeeNumber}</Typography></TableCell>

                    <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar src={`${baseUrl}${user?.profilePicture}`} alt={user.fullName} />
                        <Box>
                          <Typography>{user.fullName}</Typography>
                          <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                        </Box>
                    </Box>
                    </TableCell>

                    <TableCell>
                    <Box
                        sx={{
                        display: 'inline-block',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: 14,
                        backgroundColor:
                          user.status === 'Activo'
                            ? theme.palette.success.light
                            : user.status === 'Pendiente'
                            ? theme.palette.warning.light
                            : theme.palette.error.light,
                        color:
                          user.status === 'Activo'
                            ? theme.palette.success.dark
                            : user.status === 'Pendiente'
                            ? theme.palette.warning.dark
                            : theme.palette.error.dark,
                        }}
                    >
                        {user.status}
                    </Box>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body1" fontSize={16}>
                          {user.roles.map(r => r.name).join(', ')}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography>{new Date(user.createdAt).toLocaleDateString()}</Typography>
                    </TableCell>

                   <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="Ver perfil">
                        <IconButton onClick={() => navigate(`/perfil/${user.id}`)}
                           sx={{
                            bgcolor: 'common.white', 
                            border: '1.5px solid',
                            borderColor: 'grey.400',
                            borderRadius: 2,
                            color: theme.palette.publicisTurquoise.main,
                            '&:hover': {
                              bgcolor: 'action.focus',
                              color: theme.palette.publicisTurquoise.dark,
                              borderColor: theme.palette.publicisTurquoise.main,
                            },
                            transition: 'background-color 0.3s, border-color 0.3s, color 0.3s',
                          }}
                          >
                           <MdOutlineVisibility size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Opciones">
                        <IconButton onClick={(e) => handleMenuOpen(e, user.id)}
                            sx={{
                            bgcolor: 'common.white', 
                            border: '1.5px solid',
                            borderColor: 'grey.400',
                            borderRadius: 2,
                            color: 'primary.main',
                            '&:hover': {
                              bgcolor: 'action.selected',
                              color: 'primary.dark',
                              borderColor: 'primary.main',
                            },
                            transition: 'background-color 0.3s, border-color 0.3s, color 0.3s',
                          }}                       
                          >
                          <PiDotsThreeOutlineVerticalBold size={18} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
                ))
            )}
            </TableBody>
          </Table>
        </TableContainer>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem 
            onClick={handleManageRoles}
            sx={{
              '&:hover': {
                color: theme.palette.publicisBlue.main,
              },
            }}
          >
            <Typography variant="subtitle1" fontSize={14}>Gestionar roles</Typography>
          </MenuItem>
          {selectedMenuUser?.status !== 'Pendiente' && (
            <MenuItem
              onClick={handleOpenConfirmDialog}
              disabled={loadingDisable}
              sx={{ '&:hover': { color: theme.palette.publicisBlue.main } }}
            >
              <Typography variant="subtitle1" fontSize={14}>
                {selectedMenuUser?.status === 'Activo' ? 'Deshabilitar usuario' : 'Habilitar usuario'}
              </Typography>
            </MenuItem>
          )}
          <MenuItem
            onClick={handleOpenDeleteConfirmDialog}
            sx={{
              color: theme.palette.error.main,
              '&:hover': {
                backgroundColor: theme.palette.error.light,
              },
            }}
          >
            <Typography variant="subtitle1" fontSize={14}>Eliminar usuario</Typography>
          </MenuItem>
        </Menu>
         <Box sx={{ px: 2 }}>
          <Pagination
            count={filteredUsers.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </TableCardContainer>
      <RoleManagerDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={selectedUser}
        onSuccess={(msg) => showSnackbar(msg, 'success')}
        onError={(msg) => showSnackbar(msg, 'error')}
      />
      <InviteUserDrawer
        open={inviteDrawerOpen}
        onClose={() => setInviteDrawerOpen(false)}
        onInvite={async (employeeNumber) => {
          const msg = await inviteUserFn(employeeNumber);
          showSnackbar(msg, 'success');
          setInviteDrawerOpen(false);        
        }}
      />
      <AddUserDrawer
        open={addUserDrawerOpen}
        onClose={() => setAddUserDrawerOpen(false)}
        onAddUser={async (employeeNumber, roles) => {
           const dto: CreateUserByAdminDto = {
            employeeNumber,
            roleIds: roles.map(r => r.id),
          };
          const msg = await createUserByAdminFn(dto);
          showSnackbar(msg, 'success');
          setAddUserDrawerOpen(false);                         
        }}
      />
      <AnimatedSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
      <ConfirmDialog
        open={confirmDialogOpen}
        title="Confirmar acción"
        message={
          <>
            ¿Estás seguro que quieres{' '}
            <strong>
              {confirmDialogUser?.status === 'Activo' ? 'deshabilitar' : 'habilitar'}
            </strong>{' '}
            al usuario <strong>{confirmDialogUser?.fullName}</strong>?
          </>
        }
        onCancel={() => setConfirmDialogOpen(false)}
        onConfirm={handleToggleUserStatus} 
        confirmText="Confirmar"
        cancelText="Cancelar"
        loading={loadingDisable}
      />
      <ConfirmDialog
        open={confirmDeleteDialogOpen}
        title="Confirmar eliminación"
        message={
          <>
            ¿Estás seguro que quieres <strong>eliminar</strong> al usuario <strong>{confirmDeleteUser?.fullName}</strong>?
          </>
        }
        onCancel={() => setConfirmDeleteDialogOpen(false)}
        onConfirm={handleRemoveUser}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={loadingDelete}
      />
    </Box>
  );
};

export default UsersPage;
