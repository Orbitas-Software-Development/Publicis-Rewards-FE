// components/TableCardContainer.tsx
import React, { type ReactNode } from 'react';
import { Card, useTheme } from '@mui/material';

interface Props {
  children: ReactNode;
  sx?: object;
}

const TableCardContainer: React.FC<Props> = ({ children, sx }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.06)',
        backgroundColor: 'background.paper',
        mx: 2,
        height: '100%',
        border: `1px solid ${theme.palette.publicisGrey.main}`,
        ...sx,
      }}
    >
      {children}
    </Card>
  );
};

export default TableCardContainer;
