import React, { useState, useMemo } from 'react';
import {
  Box,
  Button,
  IconButton, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import type { RewardsBadgeCategory } from '../../types/RewardsBadgeCategory';
import TableCardContainer from '../../components/main/table/TableCardContainer';
import { BadgeCategoriesTableToolbar } from '../../components/main/category/BadgeCategoriesTableToolbar';
import Pagination from '../../components/main/table/Pagination';
import BadgeCategoryDialog from '../../components/main/category/BadgeCategoryDialog';
import { useBadgeCategories } from '../../hooks/useBadgeCategory';
import FullPageLoader from '../../components/main/utils/FullPageLoader';
import ErrorMessage from '../../components/main/utils/ErrorMessage';
import AnimatedSnackbar from '../../components/main/utils/AnimatedSnackbar';
//import ConfirmDialog from '../../components/main/utils/ConfirmDialog';
//import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaEdit, FaToggleOff, FaToggleOn } from 'react-icons/fa';


type OrderByOption = 'code' | 'description' | 'points' | 'automatic';

const BadgeCategoriesPage: React.FC = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { categories, loading, error, createCategory, updateCategory, changeCategoryStatus } = useBadgeCategories(); 
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [editingCategory, setEditingCategory] = useState<RewardsBadgeCategory | null>(null);
  const [formData, setFormData] = useState<Omit<RewardsBadgeCategory, 'id' | 'createdAt'>>({
    code: '',
    description: '',
    points: 0,
    isActive: true,
    isAutomatic: false
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<{
    orderBy: OrderByOption;
    minPoints: string;
    maxPoints: string;
  }>({
    orderBy: 'code',
    minPoints: '',
    maxPoints: '',
  });

  const [sortBy, setSortBy] = useState<'code' | 'description' | 'points' | 'roles'  | 'createdDate' | 'automatic' | 'status'>('code');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  /*
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [confirmDeleteCategory, setConfirmDeleteCategory] = useState<RewardsBadgeCategory | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  */

  /*
  const handleOpenDeleteConfirmDialog = (category: RewardsBadgeCategory) => {
    setConfirmDeleteCategory(category);
    setConfirmDeleteDialogOpen(true);
  };*/

  const handleToggleStatus = async (category: RewardsBadgeCategory) => {
    try {
      const newStatus = !category.isActive;
      const message = await changeCategoryStatus({ id: category.id, isActive: newStatus });
      showSnackbar(message, 'success');
    } catch (error) {
      showSnackbar(
        error instanceof Error ? error.message : 'Error al cambiar el estado',
        'error'
      );
    }
  };


  const handleOpen = (category?: RewardsBadgeCategory) => {
    if (category) {
      setDialogMode('edit');
      setEditingCategory(category);
      setFormData({
        code: category.code,
        description: category.description,
        points: category.points,
        isActive: category.isActive,
        isAutomatic: category.isAutomatic
      });
    } else {
      setDialogMode('add');
      setEditingCategory(null);
      setFormData({ code: '', description: '', points: 0, isActive: true, isAutomatic: false });
    }
    setOpenDialog(true);
  };


  const handleClose = () => {
    setOpenDialog(false);
    setEditingCategory(null);
    setFormData({ code: '', description: '', points: 0, isActive: true, isAutomatic: false });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'points' ? Number(value) : value,
    }));
  };

  const handleSave = async () => {
    if (!formData.code || !formData.description || formData.points <= 0) {
      return;
    }

    try {
      if (editingCategory) {
        const message = await updateCategory(editingCategory.id, formData);
        showSnackbar(message, 'success');
      } else {
        const message = await createCategory(formData);
        showSnackbar(message, 'success');
      }

      handleClose();
    } catch (err) {
      const errorMessage =
        (err as Error)?.message || 'Ocurrió un error al guardar la categoría.';
      showSnackbar(errorMessage, 'error');
    }
  };

  /*
  const handleRemoveCategory = async () => {
    if (!confirmDeleteCategory) return;

    setLoadingDelete(true);

    try {
      await deleteCategory(confirmDeleteCategory.id);
      showSnackbar('Categoría eliminada exitosamente', 'success');
    } catch (err) {
      showSnackbar(
        (err as Error).message ?? 'Error al eliminar la categoría',
        'error'
      );
    } finally {
      setLoadingDelete(false);
      setConfirmDeleteDialogOpen(false);
    }
  };*/


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
  
  
  const filteredCategories = useMemo(() => {
  return categories
    .filter(cat =>
      cat.code.toLowerCase().includes(searchText.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchText.toLowerCase())
    )
    .filter(cat => {
      const min = filters.minPoints ? parseInt(filters.minPoints, 10) : 0;
      const max = filters.maxPoints ? parseInt(filters.maxPoints, 10) : Infinity;
      return cat.points >= min && cat.points <= max;
    })
    .sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      switch (sortBy) {
        case 'code':
          aVal = a.code.toLowerCase();
          bVal = b.code.toLowerCase();
          break;
        case 'description':
          aVal = a.description.toLowerCase();
          bVal = b.description.toLowerCase();
          break;
        case 'points':
          aVal = a.points;
          bVal = b.points;
          break;
        case 'createdDate':
          aVal = new Date(a.createdAt!).getTime();
          bVal = new Date(b.createdAt!).getTime();
          break;
        case 'automatic':
          aVal = a.isAutomatic ? 1 : 0;
          bVal = b.isAutomatic ? 1 : 0;
          break;
        case 'status':
          aVal = a.isActive ? 'Activa' : 'Inactiva';
          bVal = b.isActive ? 'Activa' : 'Inactiva';
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
}, [categories, searchText, filters, sortBy, sortOrder]);


  const currentItems = filteredCategories.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );


  const isShortResult = currentItems.length > 0 && currentItems.length < 6;
  
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
            Listado de Categorías
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" mt={0.5}>
             Consulta y gestiona las categorías disponibles para asignar huellas.
          </Typography>
        </Box>

        <Box display="flex" gap={2} mt={{ xs: 2, md: 0 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            sx={{ textTransform: 'none', color: theme.palette.publicisGrey.light,  py:{md:1} }}
            onClick={() => handleOpen()}
          >
            Añadir Categoría
          </Button>
        </Box>
      </Box>

      <TableCardContainer>
         <BadgeCategoriesTableToolbar
            filterValue={searchText}
            onFilterChange={(e) => setSearchText(e.target.value)}
            onApplyFilters={(newFilters) => {
              setFilters(newFilters); 
              setSortBy(newFilters.orderBy); 
              setSortOrder('asc');  
            }}
            onClearFilters={() => {
              setFilters({ orderBy: 'code', minPoints: '', maxPoints: '' });
              setSortBy('code'); 
              setSortOrder('asc');
            }}
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
                <TableCell sx={{ backgroundColor: theme.palette.publicisGrey.main }}>
                  <TableSortLabel
                    active={sortBy === 'code'}
                    direction={sortBy === 'code' ? sortOrder : 'asc'}
                    onClick={() => handleSort('code')}
                  >
                    <Typography variant="subtitle2" fontWeight={sortBy === 'code' ? 'bold' : '500'} fontSize={16}>
                      Código
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
                    active={sortBy === 'points'}
                    direction={sortBy === 'points' ? sortOrder : 'asc'}
                    onClick={() => handleSort('points')}
                  >
                    <Typography variant="subtitle2" fontWeight={sortBy === 'points' ? 'bold' : '500'} fontSize={16}>
                      Huellas
                    </Typography>
                  </TableSortLabel>         
                </TableCell>
                <TableCell sx={{ backgroundColor: theme.palette.publicisGrey.main }}>
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
                <TableCell sx={{ backgroundColor: theme.palette.publicisGrey.main }}>
                  <TableSortLabel
                    active={sortBy === 'automatic'}
                    direction={sortBy === 'automatic' ? sortOrder : 'asc'}
                    onClick={() => handleSort('automatic')}
                  >
                    <Typography variant="subtitle2" fontWeight={sortBy === 'automatic' ? 'bold' : '500'} fontSize={16}>
                      Automática
                    </Typography>
                  </TableSortLabel>         
                </TableCell>
                <TableCell sx={{ backgroundColor: theme.palette.publicisGrey.main }}>
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
                <TableCell sx={{ backgroundColor: theme.palette.publicisGrey.main }}>
                  <Typography variant="subtitle2" fontWeight={'500'} fontSize={16}>
                    Acciones
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.map(cat => (
                <TableRow key={cat.id}>
                  <TableCell>
                    <Typography variant="body1" fontSize={16}>
                      {cat.code}
                    </Typography>             
                 </TableCell>
                  <TableCell>
                    <Typography variant="body1" fontSize={16}>
                      {cat.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" fontSize={16}>
                      {cat.points}
                    </Typography>          
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" fontSize={16}>
                      {new Date(cat.createdAt!).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {cat.isAutomatic ? (
                      <CheckIcon color="success" fontSize="small" />
                    ) : (
                      <CloseIcon color="error" fontSize="small" />
                    )}
                  </TableCell>
                   <TableCell>
                     <Box
                        sx={{
                        display: 'inline-block',
                        px: 1,
                        py: 0.5,
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: 14,
                        backgroundColor: cat.isActive
                          ? theme.palette.success.light
                          : theme.palette.error.light,
                        color: cat.isActive
                          ? theme.palette.success.dark
                          : theme.palette.error.dark,
                        textAlign: 'center',
                        }}
                      >
                        {cat.isActive ? 'Activa' : 'Inactiva'}
                      </Box>
                  </TableCell>               
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="Editar">
                        <IconButton
                          onClick={() => handleOpen(cat)}
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
                          <FaEdit size={18} />
                        </IconButton>
                      </Tooltip>

                      {/*
                      <Tooltip title="Eliminar">
                        <IconButton
                          onClick={() => handleOpenDeleteConfirmDialog(cat)}
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
                      */}

                      <Tooltip title={cat.isActive ? "Deshabilitar" : "Habilitar"}>
                        <IconButton
                          onClick={() => handleToggleStatus(cat)}
                          sx={{
                            bgcolor: 'common.white',
                            border: '1.5px solid',
                            borderColor: 'grey.400',
                            borderRadius: 2,
                            color: cat.isActive ? 'success.main' : 'error.main',
                            '&:hover': {
                              bgcolor: cat.isActive ? 'success.light' : 'error.light',
                              color: cat.isActive ? 'success.dark' : 'error.dark',
                              borderColor: cat.isActive ? 'success.dark' : 'error.dark',
                            },
                            transition: 'background-color 0.3s, border-color 0.3s, color 0.3s',
                          }}
                        >
                          {/* Icono de encendido/apagado, puedes usar cualquier icono */}
                          {cat.isActive ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                        </IconButton>
                      </Tooltip>
                    </Box>

                  </TableCell>
                </TableRow>
              ))}
              {filteredCategories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                     <Typography variant="subtitle1" color="text.secondary">
                        No se encontraron categorías
                     </Typography>
                  
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
         <Box sx={{ px: 2 }}>
          <Pagination
            count={filteredCategories.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </TableCardContainer>

      <BadgeCategoryDialog
        open={openDialog}
        onClose={handleClose}
        onChange={handleChange}
        onSave={handleSave}
        formData={formData}
        dialogMode={dialogMode}
      />
       {/*
      <ConfirmDialog
        open={confirmDeleteDialogOpen}
        title="Confirmar eliminación"
        message={
          <>
            ¿Estás seguro que quieres <strong>eliminar</strong> la categoría <strong>{confirmDeleteCategory?.code}</strong>?
          </>
        }
        onCancel={() => setConfirmDeleteDialogOpen(false)}
        onConfirm={handleRemoveCategory}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={loadingDelete}
      /> */}
      <AnimatedSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />

    </Box>
  );
};

export default BadgeCategoriesPage;
