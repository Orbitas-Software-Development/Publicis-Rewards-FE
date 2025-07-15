import React from 'react';
import {
  Snackbar,
  Alert,
  Typography,
  useTheme,
  Slide,
  type SlideProps,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import { keyframes } from '@emotion/react';

type Severity = 'success' | 'error' | 'warning' | 'info';

interface AnimatedSnackbarProps {
  open: boolean;
  message: string;
  severity?: Severity;
  onClose: () => void;
  autoHideDuration?: number;
}

const pulseSoft = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

// Transición combinada: deslizamiento + fundido suave
const TransitionSlide = React.forwardRef(function Transition(
  props: SlideProps,
  ref: React.Ref<unknown>
) {
  return (
    <Slide
      {...props}
      ref={ref}
      direction="left"
      timeout={{ enter: 500, exit: 300 }} // más suave
      easing={{
        enter: 'cubic-bezier(0.4, 0, 0.2, 1)',
        exit: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    />
  );
});

const AnimatedSnackbar: React.FC<AnimatedSnackbarProps> = ({
  open,
  message,
  severity = 'info',
  onClose,
  autoHideDuration = 4000,
}) => {
  const theme = useTheme();
  const iconColor = theme.palette.publicisGrey.light;

  const iconProps = {
    sx: {
      mr: 1,
      color: iconColor,
      animation: `${pulseSoft} 1.5s ease-in-out infinite`,
    },
  };

  const getAnimatedIcon = (severity: Severity) => {
    switch (severity) {
      case 'success':
        return <CheckCircleIcon {...iconProps} />;
      case 'error':
        return <ErrorIcon {...iconProps} />;
      case 'warning':
        return <WarningIcon {...iconProps} />;
      case 'info':
      default:
        return <InfoIcon {...iconProps} />;
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ mt: 10}}
      slots={{ transition: TransitionSlide }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        icon={getAnimatedIcon(severity)}
        sx={{
          width: '100%',
          fontSize: 14,
          color: iconColor,
          py:0.5,
        }}
        variant="filled"
      >
        <Typography sx={{ color: iconColor }}>{message}</Typography>
      </Alert>
    </Snackbar>
  );
};

export default AnimatedSnackbar;
