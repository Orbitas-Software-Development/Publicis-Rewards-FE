import {
  Box,
  Typography,
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
  Tooltip,
  IconButton,
} from '@mui/material';
import ErrorMessage from '../../components/main/utils/ErrorMessage';
import FullPageLoader from '../../components/main/utils/FullPageLoader';
//import { RiDeleteBin6Line } from "react-icons/ri";
import {MdOutlineVisibility} from 'react-icons/md';
import TableCardContainer from '../../components/main/table/TableCardContainer';
import Pagination from '../../components/main/table/Pagination';
import { useMemo, useState } from 'react';
import { API_URL } from '../../utils/ApiLinks';
//import ConfirmDialog from '../../components/main/utils/ConfirmDialog';
//import AnimatedSnackbar from '../../components/main/utils/AnimatedSnackbar';
import { useRedemptions } from '../../hooks/useRedemptions';
import { RedemptionHistoryTableToolbar } from '../../components/main/redemption/RedemptionHistoryTableToolbar';
import { useAuth } from '../../hooks/useAuth';
import { FaEdit} from 'react-icons/fa';
import type { RedemptionsHistoryDto, RedemptionUpdateDto } from '../../types/RedemptionsHistoryDto';
import RedemptionStatusDrawer from '../../components/main/redemption/RedemptionStatusDrawer';
import AnimatedSnackbar from '../../components/main/utils/AnimatedSnackbar';
import RedemptionDetailDialog from '../../components/main/redemption/RedemptionDetailDialog';

type OrderByOption = 'id' | 'employeeNumber' | 'userName'  | 'prizeName' | 'cost' | 'status' | 'date';


const RedemptionsHistoryPage = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { history, loading, error, updateStatus} = useRedemptions();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [detailRedemption, setDetailRedemption] = useState<RedemptionsHistoryDto | null>(null);
  const [editingRedemption, setEditingRedemption] = useState<RedemptionsHistoryDto | null>(null);
  const [formData, setFormData] = useState<RedemptionUpdateDto>({
    id: 0,
    status: '',
  });

  const { user } = useAuth();
  const isAdmin = user?.activeRole?.id === 1;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);


  const handleOpenDetailDialog = (redemption: RedemptionsHistoryDto) => {
    setDetailRedemption(redemption);
    setOpenDetailDialog(true);
  };

  // Handle para cerrar el diálogo de detalle
  const handleCloseDetailDialog = () => {
    setDetailRedemption(null);
    setOpenDetailDialog(false);
  };



  /*
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [confirmDeletePrize, setConfirmDeletePrize] = useState<RewardsPrize | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  */

  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  

  const [searchText, setSearchText] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState<OrderByOption>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');


  const filteredRedemptionHistory = useMemo(() => {
    return history
      .filter(item => {
        const search = searchText.toLowerCase();
        return (
          item.id.toString().includes(search) ||
          item.prizeName.toLowerCase().includes(search) ||
          item.pointsUsed.toString().includes(search) ||
          (isAdmin && 'employeeNumber' in item && item.employeeNumber?.toLowerCase().includes(search)) ||
          (isAdmin && 'userName' in item && item.userName?.toLowerCase().includes(search))
        );
      })
      .filter(item => {
        const date = new Date(item.redeemedAt).toISOString().split('T')[0];
        return (!dateFrom || date >= dateFrom) && (!dateTo || date <= dateTo);
      })
      .sort((a, b) => {
        let aVal: string | number = '';
        let bVal: string | number = '';

        switch (sortBy) {
          case 'id':
            aVal = a.id;
            bVal = b.id;
            break;
          case 'employeeNumber':
            aVal = 'employeeNumber' in a && a.employeeNumber ? a.employeeNumber.toLowerCase() : '';
            bVal = 'employeeNumber' in b && b.employeeNumber ? b.employeeNumber.toLowerCase() : '';
            break;
          case 'userName':
            aVal = 'userName' in a && a.userName ? a.userName.toLowerCase() : '';
            bVal = 'userName' in b && b.userName ? b.userName.toLowerCase() : '';
            break;
          case 'prizeName':
            aVal = a.prizeName.toLowerCase();
            bVal = b.prizeName.toLowerCase();
            break;
          case 'cost':
            aVal = a.pointsUsed;
            bVal = b.pointsUsed;
            break;
          case 'status':
            aVal = a.status.toLowerCase();
            bVal = b.status.toLowerCase();
            break;
          case 'date':
            aVal = new Date(a.redeemedAt).getTime();
            bVal = new Date(b.redeemedAt).getTime();
            break;
        }

        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [history, searchText, dateFrom, dateTo, sortBy, sortOrder, isAdmin]);

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

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };


  const handleOpen = (redemption?: RedemptionsHistoryDto) => {
    if (redemption) {
      setEditingRedemption(redemption);
      setFormData({
        id: redemption.id,
        status: redemption.status
      });
    } 
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setEditingRedemption(null);
  };

   const handleSave = async (newStatus: string) => {
    if (!editingRedemption) return;

    try {
      const message = await updateStatus({ id: editingRedemption.id, status: newStatus, changedByUserId: user!.id });

      showSnackbar(message, 'success');

      handleClose();
    } catch (err) {
      const errorMessage =
        (err as Error)?.message || 'Ocurrió un error al cambiar el estado del canje.';
      showSnackbar(errorMessage, 'error');
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

  const startIndex = page * rowsPerPage;
  const currentItems = filteredRedemptionHistory.slice(startIndex, startIndex + rowsPerPage);

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
                Historial de Canjes
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" mt={0.5}>
                Revisa y administra el historial de tus canjes.
            </Typography>
          </Box>

       </Box>

        <TableCardContainer>
          <RedemptionHistoryTableToolbar
             isAdmin={isAdmin}
            filterValue={searchText}
            onFilterChange={(e) => {
              setSearchText(e.target.value);
              setPage(0);
            }}
            orderBy={sortBy}
            onOrderByChange={(value) => {
              setSortBy(value);
              setSortOrder('asc');
              setPage(0);
            }}
            dateFrom={dateFrom}
            onDateFromChange={(value) => {
              setDateFrom(value);
              setPage(0);
            }}
            dateTo={dateTo}
            onDateToChange={(value) => {
              setDateTo(value);
              setPage(0);
            }}
            onClearFilters={() => {
              setSearchText('');
              setDateFrom('');
              setDateTo('');
              setSortBy('id');
              setSortOrder('desc');
              setPage(0);
            }}
            onApplyFilters={() => {
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
              <TableCell sortDirection={sortBy === 'id' ? sortOrder : false} sx={{ backgroundColor: theme.palette.publicisGrey.main }}>
                <TableSortLabel
                    active={sortBy === 'id'}
                    direction={sortBy === 'id' ? sortOrder : 'asc'}
                    onClick={() => handleSort('id')}
                >
                    <Typography variant="subtitle2" fontWeight={sortBy === 'id' ? 'bold' : '500'} fontSize={16}>
                    Id
                    </Typography>
                </TableSortLabel>
              </TableCell>

                {isAdmin && 
                <TableCell sortDirection={sortBy === 'employeeNumber' ? sortOrder : false} sx={{ backgroundColor: theme.palette.publicisGrey.main }}>
                  <TableSortLabel
                    active={sortBy === 'employeeNumber'}
                    direction={sortBy === 'employeeNumber' ? sortOrder : 'asc'}
                    onClick={() => handleSort('employeeNumber')}
                  >
                    <Typography variant="subtitle2" fontWeight={sortBy === 'employeeNumber' ? 'bold' : '500'} fontSize={16}>
                       N° Empleado
                    </Typography>
                  </TableSortLabel>             
                </TableCell>}
                {isAdmin && 
                <TableCell sortDirection={sortBy === 'userName' ? sortOrder : false} sx={{ backgroundColor: theme.palette.publicisGrey.main }}>
                  <TableSortLabel
                    active={sortBy === 'userName'}
                    direction={sortBy === 'userName' ? sortOrder : 'asc'}
                    onClick={() => handleSort('userName')}
                  >
                    <Typography variant="subtitle2" fontWeight={sortBy === 'userName' ? 'bold' : '500'} fontSize={16}>
                      Nombre
                    </Typography>
                  </TableSortLabel>       
                </TableCell>}

                <TableCell sortDirection={sortBy === 'prizeName' ? sortOrder : false} sx={{ backgroundColor: theme.palette.publicisGrey.main }}>
                <TableSortLabel
                    active={sortBy === 'prizeName'}
                    direction={sortBy === 'prizeName' ? sortOrder : 'asc'}
                    onClick={() => handleSort('prizeName')}
                >
                    <Typography variant="subtitle2" fontWeight={sortBy === 'prizeName' ? 'bold' : '500'} fontSize={16}>
                      Premio
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
                        Huellas
                      </Typography>
                  </TableSortLabel>
                </TableCell>

                <TableCell sortDirection={sortBy === 'date' ? sortOrder : false} sx={{ backgroundColor: theme.palette.publicisGrey.main }}>
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
                {isAdmin &&
                  <TableCell sx={{ backgroundColor: theme.palette.publicisGrey.main }}>
                    <Typography variant="subtitle2" fontWeight={'500'} fontSize={16}>
                      Acciones
                    </Typography>
                  </TableCell>
                }
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
                        No se encontraron canjes
                        </Typography>
                    </Box>
                    </TableCell>
                </TableRow>
                ) : (
                currentItems.map((redemption) => {

                    return (
                      <TableRow key={redemption.id}>
                        <TableCell><Typography variant='body1' fontSize={16} >{redemption.id}</Typography></TableCell>
                        {isAdmin && 'employeeNumber' in redemption && ( 
                          <TableCell>
                            <Typography variant='body1' fontSize={16} >
                              {redemption.employeeNumber}
                            </Typography>
                          </TableCell>
                        )}
                        {isAdmin && 'userName' in redemption && (
                          <TableCell >
                            <Typography variant='body1' fontSize={16}>{redemption.userName}</Typography>                            
                          </TableCell>
                        )}
                        <TableCell>
                           <Box display="flex" alignItems="center" gap={2}>
                              <Avatar src={`${baseUrl}${redemption?.prizeImageUrl}`} alt={redemption.prizeName} />
                              <Box>
                                <Typography>{redemption.prizeName}</Typography>
                              </Box>
                          </Box>
                        </TableCell>
                        <TableCell><Typography variant='body1' fontSize={16}>{redemption.pointsUsed}</Typography></TableCell>
                        <TableCell><Typography variant='body1' fontSize={16}>{new Date(redemption.redeemedAt).toLocaleDateString()}</Typography></TableCell>
                        <TableCell>
                        <Box
                            sx={{
                            display: 'inline-block',
                            px: 1,
                            py: 0.5,
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: 14,
                            backgroundColor:
                                redemption.status === 'Entregado'
                                    ? theme.palette.success.light
                                    : redemption.status === 'Pendiente'
                                    ? theme.palette.warning.light
                                    : theme.palette.error.light,
                            color:
                                redemption.status === 'Entregado'
                                    ? theme.palette.success.dark
                                    : redemption.status === 'Pendiente'
                                    ? theme.palette.warning.dark
                                    : theme.palette.error.dark,
                        }}
                        >
                            {redemption.status}
                        </Box>
                        </TableCell>
                        {isAdmin && 'employeeNumber' in redemption && (
                        <TableCell>
                          <Box display="flex" gap={1}>
                            {redemption.status === 'Pendiente' ? (
                              <Tooltip title="Cambiar estado">
                                <IconButton
                                  onClick={() => handleOpen(redemption)}
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
                            ) : (
                              <Tooltip title="Ver detalle">
                                <IconButton
                                  onClick={() => handleOpenDetailDialog(redemption)}
                                  sx={{
                                    bgcolor: 'common.white', 
                                    border: '1.5px solid',
                                    borderColor: 'grey.400',
                                    borderRadius: 2,
                                    color: 'info.main',
                                    '&:hover': {
                                      bgcolor: 'action.selected',
                                      color: 'info.dark',
                                      borderColor: 'info.main',
                                    },
                                    transition: 'background-color 0.3s, border-color 0.3s, color 0.3s',
                                  }}
                                >
                                  <MdOutlineVisibility size={18} />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      )}

                    </TableRow>
                  );
                })
                )}
            </TableBody>
            </Table>

        </TableContainer>

        <Box sx={{ px: 2 }}>
           <Pagination
              count={filteredRedemptionHistory.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </TableCardContainer>
       <RedemptionStatusDrawer
        open={openDialog}
        onClose={handleClose}
        redemptionId={formData.id}
        userName={editingRedemption?.userName ?? ''}
        currentStatus={formData.status}
        onSave={handleSave}
      />
      <RedemptionDetailDialog
        open={openDetailDialog}
        onClose={handleCloseDetailDialog}
        redemption={detailRedemption}
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

export default RedemptionsHistoryPage;
