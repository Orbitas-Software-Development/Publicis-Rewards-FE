import React, { useState } from 'react';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import type { RoleKey, Page } from '../../../utils/menuConfig';
import { menuConfig } from '../../../utils/menuConfig';

type SidebarMenuProps = {
  role: string;
};

// Mapeo de íconos para paths (incluye subitems)
const iconMap: Record<string, React.ReactNode> = {
  inicio: <HomeIcon />,
  colaboradores: <PeopleIcon />,
  equipo: <PeopleIcon />,
  'mis-huellas': <FavoriteIcon />,
  huellas: <FavoriteIcon />,
  asignar: <FavoriteIcon />,  
  categorias: <CardGiftcardIcon />, 
  premios: <CardGiftcardIcon />,
  catalogo: <CardGiftcardIcon />,
  reportes: <AssessmentIcon />,
  configuracion: <SettingsIcon />,
  historial: <EmojiEventsIcon />,
};

// Función para obtener la última parte del path para asignar icono
const getIconKey = (path: string) => {
  const segments = path.toLowerCase().split('/');
  return segments[segments.length - 1] || path.toLowerCase();
};

export default function SidebarMenu({ role }: SidebarMenuProps) {
  const normalizedRole = (role.trim().toLowerCase() as RoleKey) || 'colaborador';
  const location = useLocation();
  const activePath = location.pathname.toLowerCase();

  const pages: Page[] = menuConfig[normalizedRole] ?? [];

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const handleToggle = (path: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const renderMenuItems = (pages: Page[], level = 0) =>
    pages.map(({ label, path, children }) => {
      const key = path.replace(/^\//, '').toLowerCase();
      const iconKey = getIconKey(path);

      // Activo si ruta actual es igual o está dentro del path (para subitems)
      const isActive =
        activePath === path.toLowerCase() ||
        activePath.startsWith(path.toLowerCase() + '/');

      const hasChildren = Array.isArray(children) && children.length > 0;
      // Mostrar abierto si está en openMenus o si está activo (por ruta)
      const isOpen = openMenus[path] ?? isActive;

      if (hasChildren) {
        return (
          <React.Fragment key={key}>
            <ListItemButton
              onClick={() => handleToggle(path)}
              selected={isActive}
              sx={{
                mb: 0.5,
                borderRadius: 1,
                pl: 2 + level * 2, // indentación progresiva
                color: isActive ? 'primary.main' : 'text.secondary',
                bgcolor: isActive ? 'action.selected' : 'transparent',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                {iconMap[iconKey] ?? null}
              </ListItemIcon>
              <ListItemText
                primary={label}
                slotProps={{
                  primary: {
                    variant: 'body1',
                    sx: { fontWeight: isActive ? '600' : 'fontWeightRegular' },
                  },
                }}
              />
              {isOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 2 }}>
                {renderMenuItems(children!, level + 1)}
              </List>
            </Collapse>
          </React.Fragment>
        );
      }

      // Item normal, link navegable
      return (
        <ListItemButton
          key={key}
          component={Link}
          to={path}
          selected={isActive}
          sx={{
            mb: 0.5,
            borderRadius: 1,
            pl: 2 + level * 2,
            color: isActive ? 'primary.main' : 'text.secondary',
            bgcolor: isActive ? 'action.selected' : 'transparent',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            {iconMap[iconKey] ?? null}
          </ListItemIcon>
          <ListItemText
            primary={label}
            slotProps={{
              primary: {
                variant: 'body1',
                sx: { fontWeight: isActive ? '600' : 'fontWeightRegular' },
              },
            }}
          />
        </ListItemButton>
      );
    });

  return <List>{renderMenuItems(pages)}</List>;
}
