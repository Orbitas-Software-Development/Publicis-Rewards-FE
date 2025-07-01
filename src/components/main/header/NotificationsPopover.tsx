import {
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Popover,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Icon } from '@iconify/react';


const mockNotifications = [
  {
    id: '1',
    title: 'Nuevo mensaje',
    description: 'Tienes un nuevo mensaje del soporte.',
    isUnRead: true,
    postedAt: 'Hace 2 minutos',
  },
  {
    id: '2',
    title: 'Solicitud aprobada',
    description: 'Tu solicitud fue aprobada exitosamente.',
    isUnRead: true,
    postedAt: 'Hace 1 hora',
  },
];

export default function NotificationsPopover() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState(mockNotifications);

  const totalUnRead = notifications.filter((n) => n.isUnRead).length;

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnRead: false })));
  };

  return (
    <>
      <IconButton onClick={handleOpen} sx={{mt:1}}>
        <Badge color="error" badgeContent={totalUnRead}>
          <Icon icon="solar:bell-bing-bold-duotone" width={24} />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: { width: 300 },
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="subtitle1">Notificaciones</Typography>
            <Typography variant="body2" color="text.secondary">
              {totalUnRead > 0
                ? `Tienes ${totalUnRead} sin leer`
                : 'Todas están leídas'}
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title="Marcar todo como leído">
              <IconButton size="small" onClick={handleMarkAllAsRead}>
                <DoneAllIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider />

        <List disablePadding>
          {notifications.map((n) => (
            <ListItemButton
              key={n.id}
              sx={{
                alignItems: 'flex-start',
                ...(n.isUnRead && { bgcolor: 'action.selected' }),
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                  {n.title.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle2" noWrap>
                    {n.title}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {n.description}
                    </Typography>
                    <Box
                      sx={{
                        mt: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        color: 'text.disabled',
                        fontSize: 12,
                        gap: 0.5,
                      }}
                    >
                      <AccessTimeIcon fontSize="inherit" />
                      {n.postedAt}
                    </Box>
                  </>
                }
              />
            </ListItemButton>
          ))}
        </List>
      </Popover>
    </>
  );
}
