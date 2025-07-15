import React, { useState } from 'react';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { IoHome } from "react-icons/io5";
import { IoIosPeople } from "react-icons/io";
import { PiPawPrintFill } from "react-icons/pi";
import { BiSolidCategory } from "react-icons/bi";
import { HiTrophy } from "react-icons/hi2";
import { GiTeamIdea } from "react-icons/gi";
import { BiSolidReport } from "react-icons/bi";
import { RiFileHistoryFill } from "react-icons/ri";
import { MdOutlineMenuBook } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import { RiSettings5Fill } from "react-icons/ri";

import type { RoleKey, Page } from '../../../utils/menuConfig';
import { menuConfig } from '../../../utils/menuConfig';

type SidebarMenuProps = {
  role: string;
};

// Mapeo de íconos para paths (incluye subitems)
const iconMap: Record<string, React.ReactNode> = {
  inicio: <IoHome size={22} />,
  colaboradores: <IoIosPeople size={24} />,
  usuarios: <FaUsers size={24}/>,
  equipo: <GiTeamIdea size={24} />,
  'mis-huellas': <PiPawPrintFill size={24}/>,
  huellas: <PiPawPrintFill size={24}/>,
  asignar: <PiPawPrintFill size={22}/>,  
  categorias: <BiSolidCategory size={22}/>, 
  premios: <HiTrophy size={24} />,
  catalogo: <MdOutlineMenuBook size={24}/>,
  reportes: <BiSolidReport size={24}/>,
  configuracion: <RiSettings5Fill size={24}/>,
  historial: <RiFileHistoryFill size={24}/>,
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

      const isActive =
        activePath === path.toLowerCase() ||
        activePath.startsWith(path.toLowerCase() + '/');

      const hasChildren = Array.isArray(children) && children.length > 0;
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
