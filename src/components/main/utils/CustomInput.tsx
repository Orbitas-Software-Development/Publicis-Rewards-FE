import React from 'react';
import { Box, Typography } from '@mui/material';
import theme from '../../../theme/theme';

type Props = {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  errorMessage?: string;
  type?: React.HTMLInputTypeAttribute;
  readOnly?: boolean;
};

const baseInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 10px',
  borderRadius: '6px',
  fontSize: '1rem',
  outline: 'none',
  marginBottom: '8px',
  backgroundColor: '#f2f1f6',
  border: `1px solid ${theme.palette.publicisGrey.dark}`,
  boxSizing: 'border-box',
};

const CustomInput: React.FC<Props> = ({
  label,
  name,
  value,
  onChange,
  error = false,
  errorMessage,
  type = 'text',
  readOnly = false,
}) => {
  const style = {
    ...baseInputStyle,
    border: error ? `1.5px solid ${theme.palette.error.main}` : baseInputStyle.border,
    backgroundColor: readOnly ? '#e0e0e0' : baseInputStyle.backgroundColor,
    cursor: readOnly ? 'not-allowed' : 'text',
  };

  return (
    <Box>
      <Typography variant="subtitle2" mb={0.5}>
        {label}
      </Typography>
      <input
        name={name}
        value={value}
        onChange={onChange}
        style={style}
        type={type}
        readOnly={readOnly}
      />
      {error && errorMessage && (
        <Typography color="error" sx={{ fontSize: '0.9rem', fontWeight: 500, mb: 1 }}>
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
};

export default CustomInput;
