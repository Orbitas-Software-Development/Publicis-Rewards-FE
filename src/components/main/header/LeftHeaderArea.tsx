import {
  Box,
  InputBase,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import type { RoleKey } from '../../../utils/menuConfig'; 
import { menuConfig } from '../../../utils/menuConfig';


const formatPath = (pathname: string) =>
  pathname
    .replace(/^\//, '')
    .split('/')
    .map((segment) =>
      segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
    )
    .join(' / ');

export default function LeftHeaderArea() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuth();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  const currentRoute = formatPath(pathname);
  const searchRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState('');
  const [showFloatingSearch, setShowFloatingSearch] = useState(false);

  const role = (user?.role?.name?.toLowerCase() ?? 'colaborador') as RoleKey;
  const pages = menuConfig[role] ?? [];

  // Cerrar el buscador si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowFloatingSearch(false);
      }
    };

    if (showFloatingSearch) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFloatingSearch]);

  // Autofocus al abrir
  useEffect(() => {
    if (showFloatingSearch) {
      const input = document.getElementById('floating-search-input');
      input?.focus();
    }
  }, [showFloatingSearch]);

  // Función recursiva para buscar en todas las rutas y subrutas
  const findMatchingPath = (
    items: typeof pages,
    query: string
  ): string | null => {
    for (const item of items) {
      if (item.label.toLowerCase().includes(query)) {
        return item.path;
      }
      if (item.children) {
        const childMatch = findMatchingPath(item.children, query);
        if (childMatch) return childMatch;
      }
    }
    return null;
  };

  // Buscar y redirigir
  const handleSearch = () => {
    const trimmedQuery = query.trim().toLowerCase();

    if (!trimmedQuery) return;

    const matchPath = findMatchingPath(pages, trimmedQuery);

    if (matchPath) {
      navigate(matchPath);
      setQuery('');
      setShowFloatingSearch(false);
    }
  };



  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {!isXs && (
          <Typography variant="h6" fontWeight={600} noWrap>
            {currentRoute || 'Inicio'}
          </Typography>
        )}

        {isXs ? (
          <IconButton
            onClick={() => setShowFloatingSearch(true)}
            size="small"
            aria-label="Buscar"
          >
            <SearchIcon />
          </IconButton>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 1.5,
              py: 0.5,
              backgroundColor: theme.palette.publicisGrey.main,
              borderRadius: 1,
            }}
          >

            <InputBase
              placeholder="Buscar página..."
              sx={{ ml: 1, fontSize: 14}}
              inputProps={{ 'aria-label': 'buscar' }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
                if (e.key === 'Escape') setShowFloatingSearch(false);
              }}
            />
            <IconButton
              size="small"
              onClick={handleSearch}
              aria-label="Buscar"
            >
              <SearchIcon />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* Buscador flotante (móvil) */}
      <Box
        ref={searchRef}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bgcolor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(5px)',
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          zIndex: 1300,
          borderBottomLeftRadius: 6,
          borderBottomRightRadius: 6,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          transform: showFloatingSearch ? 'translateY(0)' : 'translateY(-100%)',
          opacity: showFloatingSearch ? 1 : 0,
          visibility: showFloatingSearch ? 'visible' : 'hidden',
          pointerEvents: showFloatingSearch ? 'auto' : 'none',
          transition: 'transform 0.3s ease, opacity 0.3s ease, visibility 0.3s ease',
        }}
      >
        <InputBase
          id="floating-search-input"
          placeholder="Buscar página..."
          sx={{ flexGrow: 1, fontSize: 14 }}
          inputProps={{ 'aria-label': 'buscar' }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
            if (e.key === 'Escape') setShowFloatingSearch(false);
          }}
        />
        <IconButton
          size="small"
          onClick={() => setShowFloatingSearch(false)}
          aria-label="Cerrar búsqueda"
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </>
  );
}
