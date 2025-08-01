import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Box,
  useTheme,
  Pagination,
  Avatar,
} from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
import { usePrizes } from '../../hooks/usePrize';
import CatalogToolbar from '../../components/main/catalog/CatalogToolbar';
import FullPageLoader from '../../components/main/utils/FullPageLoader';
import ErrorMessage from '../../components/main/utils/ErrorMessage';
import { API_URL } from '../../utils/ApiLinks';
import huella from '../../assets/images/huella.png';
import { useUsers } from '../../hooks/useUser';
import { useAuth } from '../../hooks/useAuth';
import type { RedeemPrizeDto } from '../../types/ReddeemPrizeDto';
import type { RewardsPrize } from '../../types/RewardsPrize';
import AnimatedSnackbar from '../../components/main/utils/AnimatedSnackbar';
import ConfirmDialog from '../../components/main/utils/ConfirmDialog';

const baseUrl = API_URL.endsWith('/api') ? API_URL.slice(0, -4) : API_URL;
const fallbackImage = `${baseUrl}/images/default-prize.png`;
const ITEMS_PER_PAGE = 8;

const CatalogPage = () => {
  const theme = useTheme();
  const { prizes, loading, error, redeem } = usePrizes();
  const { getCollaboratorAvailablePoints} = useUsers();
  const { user} = useAuth();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    orderBy: 'description',
    minCost: '',
    maxCost: '',
  });
  const [page, setPage] = useState(1);

  const [userPoints, setUserPoints] = useState<number>(0);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState<RewardsPrize | null>(null);
  const [loadingRedeem, setLoadingRedeem] = useState(false);


  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleClickRedeem = (prize: RewardsPrize) => {
    setSelectedPrize(prize);
    setConfirmDialogOpen(true);
  };



  useEffect(() => {
    if (user?.id) {
      getCollaboratorAvailablePoints(user.id).then(points => {
        if (points !== null) setUserPoints(points);
      });
    }
  }, [getCollaboratorAvailablePoints, user]);


  const handleConfirmRedeem = async () => {
    if (!selectedPrize || !user) return;
    setLoadingRedeem(true);

    try {
      const dto: RedeemPrizeDto = {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        prizeId: selectedPrize.id,
        prizeName: selectedPrize.description,
        pointsUsed: selectedPrize.cost,
    };

    const msg = await redeem(dto);     
      const updatedPoints = await getCollaboratorAvailablePoints(user.id);
      if (updatedPoints !== null) setUserPoints(updatedPoints);
      showSnackbar(msg, 'success');
    }catch (err) {
      showSnackbar(
        (err as Error).message ?? 'Error al canjear el premio',
        'error'
      );
    }
      finally {
        setLoadingRedeem(false);
        setConfirmDialogOpen(false);
      }

   }

  const handleApplyFilters = (newFilters: typeof filters) => {
    setPage(1);
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({ orderBy: 'description', minCost: '', maxCost: '' });
  };

  const filteredPrizes = useMemo(() => {
    const activePrizes = prizes.filter(p => p.isActive === true);

    let result = activePrizes.filter((p) =>
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLocaleLowerCase().includes(search.toLowerCase()) ||
      p.cost.toString().includes(search.toLowerCase())
    );

    if (filters.minCost) result = result.filter(p => p.cost >= Number(filters.minCost));
    if (filters.maxCost) result = result.filter(p => p.cost <= Number(filters.maxCost));

    switch (filters.orderBy) {
      case 'code':
        result.sort((a, b) => a.code.localeCompare(b.code));
        break;
      case 'description':
        result.sort((a, b) => a.description.localeCompare(b.description));
        break;
      case 'cost':
        result.sort((a, b) => a.cost - b.cost);
        break;
    }

    return result;
  }, [prizes, search, filters]);

  const totalPages = Math.ceil(filteredPrizes.length / ITEMS_PER_PAGE);
  const paginatedPrizes = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredPrizes.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPrizes, page]);


  if (loading) return <FullPageLoader />;
  if (error) return <ErrorMessage message={error} />;

  return (
  <Box
    sx={{
      flexGrow: 1,
      p: { xs: 2, md: 3 },
      display: 'flex',
      flexDirection: 'column',
      height: 'auto',
      gap: 3,
    }}
  >
    {/* Header */}
    <Box px={2} pt={1}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
      >
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

          <Typography
            variant="body1"
            color="text.secondary"
            mt={0.5}
          >
            Visualiza los premios disponibles para canjear con tus huellas.
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <Avatar src={huella} alt="huellita" sx={{ width: 55, height: 55 }} />
          <Box textAlign="left" sx={{ mr: { xs: 1, md: 4 } }}>
            <Typography variant="body2" fontSize={16} fontWeight={600} color="text.secondary">
              Huellas disponibles para canje
            </Typography>
            <Typography
              variant="h6"
              fontWeight="bold"
              fontSize={22}
              color={userPoints < 0 ? 'error' : 'primary'}
            >
              {userPoints}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>


    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        px: 2,
        flexGrow: 1,
       }}>

    {/* Toolbar */}
    <CatalogToolbar
        search={search}
        onSearchChange={setSearch}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
    />

    {/* Grid de premios */}
    <Grid container spacing={3} py={1}>
      {paginatedPrizes.map((prize) => {
        const isAvailable = prize.isActive && prize.stock > 0;
        const canRedeem = isAvailable && userPoints >= prize.cost;

        return (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={prize.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                py:2,
                borderRadius: 3,
                boxShadow: 3,
                opacity: isAvailable ? 1 : 0.5,
                border: canRedeem
                  ? `2px solid ${theme.palette.publicisTurquoise.main}`
                  : '1px solid #ccc',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)',
                  cursor: 'pointer'
                },
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={prize.imageUrl ? `${baseUrl}/${prize.imageUrl}` : fallbackImage}
                alt={prize.description}
                sx={{ objectFit: 'contain' }}
              />

              <CardContent sx={{ p: 2 }}>
                {/* Descripción: máximo 2 líneas */}
                <Typography
                    variant="h6"
                    fontSize="1rem"
                    gutterBottom
                    sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: 1.2, 
                    }}
                >
                    {prize.description}
                </Typography>

                {/* Código: máximo 1 línea */}
                <Typography
                    variant="caption"
                    fontSize="0.9rem"
                    sx={{                 
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    Código: {prize.code}
                </Typography>

                {/* Costo: máximo 1 línea */}
                <Typography
                    variant="body2"
                    color="text.secondary"
                    fontSize="1.1rem"
                    sx={{
                        color:theme.palette.publicisTurquoise.main,
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    Costo: <strong>{prize.cost}</strong> huellas
                </Typography>
                </CardContent>


              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  px: 2,
                  gap: 1,
                }}
              >
                {/* Stock */}
                <Box
                  sx={{
                    flex: 1,
                    borderRadius: 2,
                    p: 1,
                    textAlign: 'center',
                    backgroundColor: prize.stock > 0 ? theme.palette.success.light : theme.palette.error.light,
                    color: prize.stock > 0 ? theme.palette.success.dark : theme.palette.error.dark,
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                  }}
                >
                  {prize.stock > 0 ? `Stock: ${prize.stock}` : 'Sin stock'}
                </Box>

                {/* Botón Canjear */}
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!canRedeem}
                  onClick={() => handleClickRedeem(prize)}
                  sx={{
                    flex: 1,
                    borderRadius: 2,
                    fontWeight: 'bold',
                    px:1,
                    color: theme.palette.publicisGrey.light,
                  }}
                >
                  {!prize.isActive || prize.stock === 0
                    ? 'No disponible'
                    : canRedeem
                    ? 'Canjear'
                    : 'Faltan huellas'}
                </Button>
              </Box>

            </Card>
          </Grid>
        );
      })}
    </Grid>
     {totalPages > 1 && (
        <Box display="flex" justifyContent="center"  sx={{ mt: 'auto', pt: 2 }} >
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              shape="rounded"
            />
        </Box>
      )}
    </Box>
       <AnimatedSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
      <ConfirmDialog
        open={confirmDialogOpen}
        title="Confirmar canje"
        message={
          <>
            ¿Estás seguro que quieres canjear el premio{' '}
            <strong>{selectedPrize?.description}</strong> por{' '}
            <strong>{selectedPrize?.cost} huellas</strong>?
          </>
        }
        onCancel={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmRedeem}
        confirmColor="primary"
        confirmText="Confirmar"
        cancelText="Cancelar"
        loading={loadingRedeem}
      />

  </Box>
 );
};

export default CatalogPage;
