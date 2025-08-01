import {
  Box,
  Typography,
  Button,
  useTheme,
  TableCell,
  TableRow,
  TableBody,
  TableSortLabel,
  Table,
  TableContainer,
  TableHead,
  Avatar,
  useMediaQuery,
  IconButton,
  Tooltip,
} from '@mui/material';
import { usePrizes } from '../../hooks/usePrize';
import ErrorMessage from '../../components/main/utils/ErrorMessage';
import FullPageLoader from '../../components/main/utils/FullPageLoader';
import { FaEdit, FaToggleOff, FaToggleOn } from "react-icons/fa";
//import { RiDeleteBin6Line } from "react-icons/ri";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TableCardContainer from '../../components/main/table/TableCardContainer';
import Pagination from '../../components/main/table/Pagination';
import { useMemo, useState } from 'react';
import type { RewardsPrize } from '../../types/RewardsPrize';
import { API_URL } from '../../utils/ApiLinks';
import { PrizeTableToolbar } from '../../components/main/prize/PrizeTableToolbar';
import PrizeDialog from '../../components/main/prize/PrizeDialog';
//import ConfirmDialog from '../../components/main/utils/ConfirmDialog';
import AnimatedSnackbar from '../../components/main/utils/AnimatedSnackbar';

type OrderByOption = 'code' | 'description' | 'cost' | 'stock' | 'status';

const PrizesPage = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { prizes, loading, error, create, update, changeStatus} = usePrizes();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingPrize, setEditingPrize] = useState<RewardsPrize | null>(null);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [formData, setFormData] = useState<
    Omit<RewardsPrize, 'createdAt' | 'imageUrl'> & {
      imageFile?: File | null;
      imagePreview?: string;
    }
  >({
    id: 0,
    code: '',
    description: '',
    cost: 0,
    stock: 0,
    isActive: true,
    imageFile: null,
    imagePreview: '',
  });

  /*
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [confirmDeletePrize, setConfirmDeletePrize] = useState<RewardsPrize | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  */

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  

  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<{
    orderBy: OrderByOption;
    minCost: string;
    maxCost: string;
  }>({
    orderBy: 'code',
    minCost: '',
    maxCost: '',
  });

const [sortBy, setSortBy] = useState<OrderByOption | 'createdDate'>('code');
const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');


const filteredPrizes = useMemo(() => {
  return prizes
    .filter(prize => {
      const lowerText = searchText.toLowerCase();
      return (
        prize.code.toLowerCase().includes(lowerText) ||
        prize.description.toLowerCase().includes(lowerText)
      );
    })
    .filter(prize => {
      const min = filters.minCost ? parseInt(filters.minCost, 10) : 0;
      const max = filters.maxCost ? parseInt(filters.maxCost, 10) : Infinity;
      return prize.cost >= min && prize.cost <= max;
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
        case 'cost':
          aVal = a.cost;
          bVal = b.cost;
          break;
        case 'stock':
          aVal = a.stock;
          bVal = b.stock;
          break;
        case 'createdDate':
          aVal = new Date(a.createdAt!).getTime();
          bVal = new Date(b.createdAt!).getTime();
          break;
        case 'status':
          aVal = a.isActive ? 'Activo' : 'Inactivo';
          bVal = b.isActive ? 'Activo' : 'Inactivo';
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [prizes, searchText, filters, sortBy, sortOrder]);



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

  /*
  const handleOpenDeleteConfirmDialog = (prize: RewardsPrize) => {
    setConfirmDeletePrize(prize);
    setConfirmDeleteDialogOpen(true);
  };
 */

 const handleOpen = (prize?: RewardsPrize) => {
  if (prize) {
    setEditingPrize(prize);
    setDialogMode('edit');
    setFormData({
      id: prize.id,
      code: prize.code,
      description: prize.description,
      cost: prize.cost,
      stock: prize.stock,
      isActive: prize.isActive,
      imageFile: null,
      imagePreview: prize.imageUrl ? `${baseUrl}${prize.imageUrl}` : '',
    });
  } else {
    setEditingPrize(null);
    setDialogMode('add');
    setFormData({
      id: 0,
      code: '',
      description: '',
      cost: 0,
      stock: 0,
      isActive: true,
      imageFile: null,
      imagePreview: '',
    });
  }

  setOpenDialog(true);
};

  const handleClose = () => {
    setOpenDialog(false);
    setEditingPrize(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cost' || name === 'stock' ? Number(value) : value,
    }));
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleImageChange = (file: File | null) => {
    setFormData(prev => ({
      ...prev,
      imageFile: file,
      imagePreview: file ? URL.createObjectURL(file) : '',
    }));
  };


   const handleSave = async () => {
    if (!formData.code || !formData.description || formData.cost <= 0  || formData.stock < 0) {
      return;
    }

    try {
      if (editingPrize) {
        await update(editingPrize.id, formData);
        showSnackbar('Premio actualizado exitosamente', 'success');
      } else {
        const message = await create(formData);
        showSnackbar(message, 'success');
      }

      handleClose();
    } catch (err) {
      const errorMessage =
        (err as Error)?.message || 'Ocurrió un error al guardar el premio.';
      showSnackbar(errorMessage, 'error');
      console.error(err);
    }
  };

  /*
  const handleRemovePrize = async () => {
    if (!confirmDeletePrize) return;

    setLoadingDelete(true);

    try {
      await remove(confirmDeletePrize.id);
      showSnackbar('Premio eliminado exitosamente', 'success');
    } catch (err) {
      showSnackbar(
        (err as Error).message ?? 'Error al eliminar el premio',
        'error'
      );
    } finally {
      setLoadingDelete(false);
      setConfirmDeleteDialogOpen(false);
    }
  };
  */

  const handleToggleStatus = async (prize: RewardsPrize) => {
    try {
      const newStatus = !prize.isActive;
      const message = await changeStatus({ id: prize.id, isActive: newStatus });
      showSnackbar(message, 'success');
  
    } catch (error) {
      showSnackbar(
        error instanceof Error ? error.message : 'Error al cambiar el estado',
        'error'
      );
    }
  };

  const startIndex = page * rowsPerPage;
  const currentItems = filteredPrizes.slice(startIndex, startIndex + rowsPerPage);

  const isShortResult = currentItems.length > 0 && currentItems.length < 6;

  const baseUrl = API_URL.endsWith('/api') ? API_URL.slice(0, -4) : API_URL;

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
      {/* Encabezado */}
       <Box px={2} pt={1} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <Box>
            <Typography
                variant="h3"
                fontWeight="bold"
                color="primary.dark"
                textAlign="left"
                sx={{ fontSize: 'clamp(1.7rem, 4vw, 2rem)' }}
            >
                Catálogo de Premios
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" mt={0.5}>
                Consulta y administra los premios disponibles en el sistema.
            </Typography>
          </Box>

        <Box mt={{ xs: 2, md: 0 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            sx={{
              textTransform: 'none',
              color: theme.palette.publicisGrey.light,
              py: { md: 1 },
            }}
            onClick={() => handleOpen()}
          >
            Añadir Premio
          </Button>
        </Box>
       </Box>

        <TableCardContainer>
          <PrizeTableToolbar
            filterValue={searchText}
            onFilterChange={(e) => setSearchText(e.target.value)}
            onApplyFilters={(newFilters) => {
              setFilters(newFilters);
              setSortBy(newFilters.orderBy);
              setSortOrder('asc');
              setPage(0);
            }}
            onClearFilters={() => {
              setFilters({ orderBy: 'code', minCost: '', maxCost: '' });
              setSortBy('code');
              setSortOrder('asc');
              setPage(0);
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
              <TableCell sortDirection={sortBy === 'code' ? sortOrder : false} sx={{ backgroundColor: theme.palette.publicisGrey.main }}>
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

                <TableCell sortDirection={sortBy === 'description' ? sortOrder : false} sx={{ backgroundColor: theme.palette.publicisGrey.main }}>
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

                <TableCell sortDirection={sortBy === 'cost' ? sortOrder : false} sx={{ backgroundColor: theme.palette.publicisGrey.main }}>
                  <TableSortLabel
                      active={sortBy === 'cost'}
                      direction={sortBy === 'cost' ? sortOrder : 'asc'}
                      onClick={() => handleSort('cost')}
                  >
                      <Typography variant="subtitle2" fontWeight={sortBy === 'cost' ? 'bold' : '500'} fontSize={16}>
                      Costo
                      </Typography>
                  </TableSortLabel>
                </TableCell>

                <TableCell sortDirection={sortBy === 'stock' ? sortOrder : false} sx={{ backgroundColor: theme.palette.publicisGrey.main }}>
                  <TableSortLabel
                      active={sortBy === 'stock'}
                      direction={sortBy === 'stock' ? sortOrder : 'asc'}
                      onClick={() => handleSort('stock')}
                  >
                      <Typography variant="subtitle2" fontWeight={sortBy === 'stock' ? 'bold' : '500'} fontSize={16}>
                        Existencias
                      </Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={sortBy === 'createdDate' ? sortOrder : false} sx={{ backgroundColor: theme.palette.publicisGrey.main }}>
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
                        No se encontraron premios
                        </Typography>
                    </Box>
                    </TableCell>
                </TableRow>
                ) : (
                currentItems.map((prize) => {

                    return (
                      <TableRow key={prize.id}>
                        <TableCell><Typography variant='body1' fontSize={16} >{prize.code}</Typography></TableCell>
                        <TableCell>
                           <Box display="flex" alignItems="center" gap={2}>
                              <Avatar src={`${baseUrl}${prize?.imageUrl}`} alt={prize.description} />
                              <Box>
                                <Typography>{prize.description}</Typography>
                              </Box>
                          </Box>
                        </TableCell>
                        <TableCell><Typography variant='body1' fontSize={16}>{prize.cost}</Typography></TableCell>
                        <TableCell><Typography variant='body1' fontSize={16}>{prize.stock}</Typography></TableCell>
                        <TableCell><Typography variant='body1' fontSize={16}>{new Date(prize.createdAt!).toLocaleDateString()}</Typography></TableCell>
                        <TableCell>
                        <Box
                            sx={{
                            display: 'inline-block',
                            px: 1,
                            py: 0.5,
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: 14,
                            backgroundColor: prize.isActive
                                ? theme.palette.success.light
                                : theme.palette.error.light,
                            color: prize.isActive
                                ? theme.palette.success.dark
                                : theme.palette.error.dark,
                            textAlign: 'center',
                            }}
                        >
                            {prize.isActive ? 'Activo' : 'Inactivo'}
                        </Box>
                        </TableCell>
                        <TableCell>
                        <Box display="flex" gap={1}>
                          <Tooltip title="Editar">
                            <IconButton
                              onClick={() => handleOpen(prize)}
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

                          <Tooltip title={prize.isActive ? "Deshabilitar" : "Habilitar"}>
                            <IconButton
                              onClick={() => handleToggleStatus(prize)}
                              sx={{
                                bgcolor: 'common.white',
                                border: '1.5px solid',
                                borderColor: 'grey.400',
                                borderRadius: 2,
                                color: prize.isActive ? 'success.main' : 'error.main',
                                '&:hover': {
                                  bgcolor: prize.isActive ? 'success.light' : 'error.light',
                                  color: prize.isActive ? 'success.dark' : 'error.dark',
                                  borderColor: prize.isActive ? 'success.dark' : 'error.dark',
                                },
                                 transition: 'background-color 0.3s, border-color 0.3s, color 0.3s',
                              }}
                              >
                              {/* Icono de encendido/apagado, puedes usar cualquier icono */}
                              {prize.isActive ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                            </IconButton>
                          </Tooltip>

                          {/*
                          <Tooltip title="Eliminar">
                            <IconButton
                              onClick={() => handleOpenDeleteConfirmDialog(prize)}
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
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
                )}
            </TableBody>
            </Table>

        </TableContainer>

        <Box sx={{ px: 2 }}>
           <Pagination
              count={filteredPrizes.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </TableCardContainer>
 
      <PrizeDialog
        open={openDialog}
        onClose={handleClose}
        onChange={handleChange}
        onImageChange={handleImageChange}
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
            ¿Estás seguro que quieres <strong>eliminar</strong> la categoría <strong>{confirmDeletePrize?.code}</strong>?
          </>
        }
        onCancel={() => setConfirmDeleteDialogOpen(false)}
        onConfirm={handleRemovePrize}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={loadingDelete}
      />
      */}
      <AnimatedSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
    </Box>
  );
};

export default PrizesPage;
