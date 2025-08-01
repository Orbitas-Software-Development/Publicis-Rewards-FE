import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  useTheme,
  useMediaQuery,
  TableSortLabel,
  Tooltip,
  IconButton,
} from '@mui/material';
import { MdAssignmentAdd} from 'react-icons/md';
import TableCardContainer from '../../components/main/table/TableCardContainer';
import { useBadgeAssignments } from '../../hooks/useBadgeAssignment';
import FullPageLoader from '../../components/main/utils/FullPageLoader';
import ErrorMessage from '../../components/main/utils/ErrorMessage';
import { useState, useMemo } from 'react';
import Pagination from '../../components/main/table/Pagination';
import { BadgeAdminAssignmentTableToolbar } from '../../components/main/assignment/BadgeAdminAssignmentTableToolbar';
import { RiDeleteBin6Line } from 'react-icons/ri';
import type { RewardsBadgeAssignment } from '../../types/RewardsBadgeAssignment';
import ConfirmDialog from '../../components/main/utils/ConfirmDialog';
import AnimatedSnackbar from '../../components/main/utils/AnimatedSnackbar';
import BadgeAdminAssignmentDialog from '../../components/main/assignment/BadgeAdminAssignmentDialog';
import BadgeManagerAssignmentDialog from '../../components/main/assignment/BadgeManagerAssignmentDialog';
import { useAuth } from '../../hooks/useAuth';
import type { CreateManagerGrantRequestDto } from '../../types/CreateManagerGrantRequestDto';
import type { CreateCollaboratorAssignmentRequestDto } from '../../types/CreateCollaboratorsAssignmentRequestDto';
import { BadgeManagerAssignmentTableToolbar } from '../../components/main/assignment/BadgeManagerAssignmentTableToolbar';

type AssignmentFilter = 'manager' | 'collaborator';

const BadgeAssignmentPage = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { user } = useAuth(); 
  const { managerAssignments, collaboratorAssignments, error, loading, assignToManagers, assignToCollaborators, deleteManagerAssignment, deleteCollaboratorAssignment } = useBadgeAssignments();

  const [assignmentFilter, setAssignmentFilter] = useState<AssignmentFilter>('manager');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [sortBy, setSortBy] = useState<'employeeNumber' | 'name' | 'description' | 'quantity'  | 'assignedBy' | 'date'>('employeeNumber');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const [openDialogType, setOpenDialogType] = useState<'admin' | 'manager' | null>(null);

  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [confirmDeleteAssignment, setConfirmDeleteAssignment] = useState<RewardsBadgeAssignment | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleOpenDeleteConfirmDialog = (assignment: RewardsBadgeAssignment) => {
    setConfirmDeleteAssignment(assignment);
    setConfirmDeleteDialogOpen(true);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

const assignments = useMemo(() => {
  if (user?.activeRole.id === 1) {
    return assignmentFilter === 'manager'
      ? managerAssignments ?? []
      : collaboratorAssignments ?? [];
  }

  return collaboratorAssignments ?? [];
}, [user?.activeRole.id, assignmentFilter, managerAssignments, collaboratorAssignments]);



const filteredAssignments = useMemo(() => {
  return assignments.filter((a) => {
    const term = search.toLowerCase();

    const matchesSearch =
      a.employeeNumber.toString().includes(term) ||
      a.fullName.toLowerCase().includes(term) ||
      a.description.toLowerCase().includes(term) ||
      a.quantity.toString().includes(term) ||
      a.assignedBy.toLowerCase().includes(term);

    const matchesCategory = category === 'all' || a.description?.toString() === category;

    const assignedDate = new Date(a.assignedAt);
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;

    const matchesDateFrom = !fromDate || assignedDate >= fromDate;
    const matchesDateTo = !toDate || assignedDate <= toDate;

    return matchesSearch && matchesCategory && matchesDateFrom && matchesDateTo;
  });
}, [assignments, search, category, dateFrom, dateTo]);

// 3. Ordenamiento y paginación
const currentItems = useMemo(() => {
  const sorted = [...filteredAssignments].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'employeeNumber':
        aValue = a.employeeNumber;
        bValue = b.employeeNumber;
        break;
      case 'name':
        aValue = a.fullName.toLowerCase();
        bValue = b.fullName.toLowerCase();
        break;
      case 'description':
        aValue = a.description.toLowerCase();
        bValue = b.description.toLowerCase();
        break;
      case 'quantity':
        aValue = a.quantity;
        bValue = b.quantity;
        break;
      case 'assignedBy':
        aValue = a.assignedBy.toLowerCase();
        bValue = b.assignedBy.toLowerCase();
        break;
      case 'date':
        aValue = new Date(a.assignedAt).getTime();
        bValue = new Date(b.assignedAt).getTime();
        break;
      default:
        aValue = bValue = 0;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}, [filteredAssignments, sortBy, sortOrder, page, rowsPerPage]);


  const isShortResult = currentItems.length > 0 && currentItems.length < 6;
  
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

  const handleOpenAssignDialog = () => {
    if (user?.activeRole.id === 1) {
      setOpenDialogType('admin');
    } else if (user?.activeRole.id === 2) {
      setOpenDialogType('manager');
    } else {
      showSnackbar('No tienes permisos para asignar huellas', 'error');
    }
  };

  const handleAssignmentFilterChange = (value: AssignmentFilter) => {
    setAssignmentFilter(value);
    // Limpiar filtros al cambiar tab
    setSearch('');
    setCategory('all');
    setDateFrom('');
    setDateTo('');
    setPage(0);
  };


  const handleAssignToManagers = async (data: {
    assignments: { userId: number; quantity: number }[];
  }) => {
    if (!user) {
      showSnackbar('Usuario no autenticado', 'error');
      return;
    }

    const fromUserId = user.id;
    const year = new Date().getFullYear();

    try {
      const toUserIds = data.assignments.map(assignment => {
        const userId = assignment.userId;
        return userId;
      });

      const payload: CreateManagerGrantRequestDto = {
        fromUserId,
        toUserIds, 
        year,
        pointsGranted: data.assignments[0]?.quantity || 0,
      };

      const message = await assignToManagers(payload);
      showSnackbar(message, 'success');
   
    }catch (error) {
      showSnackbar(
        error instanceof Error ? error.message : 'Error al asignar las huellas',
        'error'
      );
    }finally{
      setOpenDialogType(null);
    }
  };

  const handleAssignToCollaborators = async (data: {
    assignments: { userId: number; categoryId: number; points: number }[];
  }) => {
    try {
      const assignments = data.assignments.map(a => ({
        userId: a.userId,
        categoryId: a.categoryId,
        points: a.points,
      }));

      const dto: CreateCollaboratorAssignmentRequestDto = {
        assignments,
        assignedBy: user?.id ?? 0, 
        notes: '', 
      };

      const message = await assignToCollaborators(dto);
      showSnackbar(message, 'success');
    } catch (error) {
        showSnackbar(
        error instanceof Error ? error.message : 'Error al asignar las huellas',
        'error'
      );
    }finally{
        setOpenDialogType(null);
    }
};


  const handleRemoveAssignment = async () => {
    if (!confirmDeleteAssignment) return;

    setLoadingDelete(true);

    try {
      let message;
      if(user?.activeRole.id === 1 && assignmentFilter === 'manager'){
         message = await deleteManagerAssignment(confirmDeleteAssignment.id);
      }
      else{
        message = await deleteCollaboratorAssignment(confirmDeleteAssignment.id);
      }
      
     
      showSnackbar(message, 'success');
    } catch (error) {
      showSnackbar(
        error instanceof Error ? error.message : 'Error al eliminar la asignación',
        'error'
      );
    } finally {
      setLoadingDelete(false);
      setConfirmDeleteDialogOpen(false);
    }
  };

  if (loading) return <FullPageLoader />;
  if (error) return <ErrorMessage message={error} />;

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
      <Box
        px={2}
        pt={1}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
      >
        <Box>
          <Typography
            variant="h3"
            fontWeight="bold"
            color="primary.dark"
            sx={{ fontSize: 'clamp(1.7rem, 4vw, 2rem)' }}
          >
            Asignación de Huellas
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" mt={0.5}>
            {user?.activeRole.id === 1
              ? 'Asigna, revisa y gestiona las huellas otorgadas a managers y colaboradores.'
              : 'Asigna, revisa y gestiona las huellas otorgadas a los colaboradores.'}
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<MdAssignmentAdd />}
          sx={{color: theme.palette.publicisGrey.light, textTransform: 'none', py: { md: 1 }, borderRadius: 2, mt: { xs: 2, md: 0 } }}
          onClick={handleOpenAssignDialog}
        >
          Asignar Huellas
        </Button>
      </Box>

      <TableCardContainer>
         {user?.activeRole.id === 1 ? (
           <BadgeAdminAssignmentTableToolbar
                assignmentFilter={assignmentFilter}
                onAssignmentFilterChange={handleAssignmentFilterChange}
                search={search}
                onSearchChange={(e) => {
                    setSearch(e.target.value);
                    setPage(0);
                }}
                category={category}
                onCategoryChange={(value) => {
                    setCategory(value);
                    setPage(0);
                }}
                dateFrom={dateFrom}
                dateTo={dateTo}
                onDateFromChange={(value) => {
                    setDateFrom(value);
                    setPage(0);
                }}
                onDateToChange={(value) => {
                    setDateTo(value);
                    setPage(0);
                }}
          />
              ):(
            <BadgeManagerAssignmentTableToolbar
                search={search}
                onSearchChange={(e) => {
                    setSearch(e.target.value);
                    setPage(0);
                }}
                category={category}
                onCategoryChange={(value) => {
                    setCategory(value);
                    setPage(0);
                }}
                dateFrom={dateFrom}
                dateTo={dateTo}
                onDateFromChange={(value) => {
                    setDateFrom(value);
                    setPage(0);
                }}
                onDateToChange={(value) => {
                    setDateTo(value);
                    setPage(0);
                }}
            />
          )}
        <TableContainer sx={{ flexGrow: 1, minHeight: '300px', maxHeight: '70vh' }}>
          <Table stickyHeader sx={{ height: isShortResult ? 'auto' : '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: theme.palette.publicisGrey.main }}>
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
                <TableCell sx={{ backgroundColor: theme.palette.publicisGrey.main }}>
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
                <TableCell sx={{ backgroundColor: theme.palette.publicisGrey.main }}>
                      <TableSortLabel
                        active={sortBy === 'description'}
                        direction={sortBy === 'description' ? sortOrder : 'asc'}
                        onClick={() => handleSort('description')}
                    >
                        <Typography variant="subtitle2" fontWeight={sortBy === 'description' ? 'bold' : '500'} fontSize={16}>
                            Descripción
                        </Typography>
                  </TableSortLabel>           
                </TableCell>
                <TableCell sx={{ backgroundColor: theme.palette.publicisGrey.main }}>
                    <TableSortLabel
                        active={sortBy === 'quantity'}
                        direction={sortBy === 'quantity' ? sortOrder : 'asc'}
                        onClick={() => handleSort('quantity')}
                    >
                        <Typography variant="subtitle2" fontWeight={sortBy === 'quantity' ? 'bold' : '500'} fontSize={16}>
                            Cantidad
                        </Typography>
                   </TableSortLabel>           
                </TableCell>
                <TableCell sx={{ backgroundColor: theme.palette.publicisGrey.main }}>
                     <TableSortLabel
                        active={sortBy === 'assignedBy'}
                        direction={sortBy === 'assignedBy' ? sortOrder : 'asc'}
                        onClick={() => handleSort('assignedBy')}
                    >
                        <Typography variant="subtitle2" fontWeight={sortBy === 'assignedBy' ? 'bold' : '500'} fontSize={16}>
                            Asignado por
                        </Typography>
                  </TableSortLabel>           
                </TableCell>
                <TableCell sx={{ backgroundColor: theme.palette.publicisGrey.main }}>
                     <TableSortLabel
                        active={sortBy === 'date'}
                        direction={sortBy === 'date' ? sortOrder : 'asc'}
                        onClick={() => handleSort('date')}
                    >
                        <Typography variant="subtitle2" fontWeight={sortBy === 'date' ? 'bold' : '500'} fontSize={16}>
                            Fecha
                        </Typography>
                  </TableSortLabel>           
                </TableCell>
                <TableCell sx={{ backgroundColor: theme.palette.publicisGrey.main }}><Typography variant="subtitle2" fontSize={16}>Acciones</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {currentItems.length === 0 ? (
                <TableRow>
                <TableCell colSpan={7} sx={{ p: 0 }}>
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
                        No se encontraron asignaciones
                    </Typography>
                    </Box>
                </TableCell>
                </TableRow>
            ) : (
                currentItems.map((item) => (
                <TableRow key={item.id}>
                    <TableCell>
                    <Typography>{item.employeeNumber}</Typography>
                    </TableCell>
                    <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Avatar>{item.fullName.charAt(0)}</Avatar>
                        <Typography>{item.fullName}</Typography>
                    </Box>
                    </TableCell>
                    <TableCell>
                    <Typography>{item.description}</Typography>
                    </TableCell>
                    <TableCell>
                    <Typography>{item.quantity}</Typography>
                    </TableCell>
                    <TableCell>
                    <Typography>{item.assignedBy}</Typography>
                    </TableCell>
                    <TableCell>
                    <Typography>{new Date(item.assignedAt).toLocaleDateString()}</Typography>
                    </TableCell>
                    <TableCell>
                     <Box display="flex" gap={1}>
                      <Tooltip title="Eliminar">
                        <IconButton
                          onClick={() => handleOpenDeleteConfirmDialog(item)}
                          sx={{
                            bgcolor: 'common.white',
                            border: '1.5px solid',
                            borderColor: 'grey.400',
                            borderRadius: 2,
                            color: 'error.main',
                            '&:hover': {
                              bgcolor: 'error.light',
                              color: 'error.dark',
                              borderColor: 'error.main',
                            },
                            transition: 'background-color 0.3s, border-color 0.3s, color 0.3s',
                          }}
                        >
                          <RiDeleteBin6Line size={18} />
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

        <Box sx={{ px: 2 }}>
          <Pagination
            count={filteredAssignments.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </TableCardContainer>
        {openDialogType === 'admin' && (
          <BadgeAdminAssignmentDialog
            open
            onClose={() => setOpenDialogType(null)}
            onAssign={handleAssignToManagers}
          />
        )}

        {openDialogType === 'manager' && (
          <BadgeManagerAssignmentDialog
            open
            onClose={() => setOpenDialogType(null)}
            onAssign={handleAssignToCollaborators}
          />
        )}

        <ConfirmDialog
          open={confirmDeleteDialogOpen}
          title="Confirmar eliminación"
          message={
            <>
              ¿Estás seguro que quieres <strong>eliminar</strong> la asignación <strong>{confirmDeleteAssignment?.description}</strong>?
            </>
          }
          onCancel={() => setConfirmDeleteDialogOpen(false)}
          onConfirm={handleRemoveAssignment}
          confirmText="Eliminar"
          cancelText="Cancelar"
          loading={loadingDelete}
        /> 
        <AnimatedSnackbar
          open={snackbarOpen}
          message={snackbarMessage}
          severity={snackbarSeverity}
          onClose={() => setSnackbarOpen(false)}
        />
    </Box>
  );
};

export default BadgeAssignmentPage;
