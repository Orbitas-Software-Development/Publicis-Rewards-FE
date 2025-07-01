import enFlag from '../../../assets/icons/flags/ic-flag-en.svg';
import esFlag from '../../../assets/icons/flags/ic-flag-es.svg';


import {
  Box,
  IconButton,
  Popover,
  MenuList,
  MenuItem,
  menuItemClasses,
} from '@mui/material';
import { useState } from 'react';

// Lenguajes quemados con import de iconos
const _langs = [
  {
    value: 'es',
    label: 'Español',
    icon: esFlag,
  },
  {
    value: 'en',
    label: 'English',
    icon: enFlag,
  },
];


export default function LanguagePopover() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [locale, setLocale] = useState(_langs[0].value);

  const open = Boolean(anchorEl);
  const currentLang = _langs.find((lang) => lang.value === locale);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleChangeLang = (lang: string) => {
    setLocale(lang);
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Box
          component="img"
          alt={currentLang?.label}
          src={currentLang?.icon}
          sx={{ width: 26, height: 20, borderRadius: 0.5, objectFit: 'cover', p:0 }}
        />
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: { width: 160 },
          },
        }}
      >
        <MenuList
          sx={{
            p: 0.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: {
                bgcolor: 'action.selected',
                fontWeight: 'fontWeightSemiBold',
              },
            },
          }}
        >
          {_langs.map((lang) => (
            <MenuItem
              key={lang.value}
              selected={lang.value === locale}
              onClick={() => handleChangeLang(lang.value)}
            >
              <Box
                component="img"
                src={lang.icon}
                alt={lang.label}
                sx={{ width: 26, height: 20, borderRadius: 0.5, objectFit: 'cover' }}
              />
              {lang.label}
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
    </>
  );
}
