import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Container,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Icon } from '@iconify/react';

import AccountPopover from './AccountPopover';
import LanguagePopover from './LanguagePopover';
import NotificationsPopover from './NotificationsPopover';
import LeftHeaderArea from './LeftHeaderArea';

type MainHeaderProps = {
  onMenuClick?: () => void;
  sidebarOpen: boolean;
};

export default function MainHeader({ onMenuClick, sidebarOpen }: MainHeaderProps) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const disableGutters = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="default"
      sx={{
        px:{xs:0, lg:2},
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        zIndex: theme.zIndex.drawer + 1,
         boxShadow: '1px 0 4px rgba(0,0,0,0.15)', 
      }}
    >
      <Container maxWidth={false} disableGutters={disableGutters}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: { xs: 56, lg: 64 },
          }}
        >
          {/* Left Area */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isDesktop && (
              <IconButton onClick={onMenuClick}>
                <Icon
                  icon={sidebarOpen ? 'mdi:menu-open' : 'mdi:menu'}
                  width={28}
                  height={28}
                />
              </IconButton>
            )}
            <LeftHeaderArea />
          </Box>

          {/* Right Area */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ mr: 0.5 }}>
              <LanguagePopover />
            </Box>

            <Box sx={{ mr: 2 }}>
              <NotificationsPopover />
            </Box>

            <Box>
              <AccountPopover />
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
