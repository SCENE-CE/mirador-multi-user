import { ReactNode } from 'react';
import { Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
interface MMUToolTipProps {
  children: ReactNode;
}

export const MMUToolTip = ({ children }: MMUToolTipProps) => {
  return (
    <>
      <Tooltip title={children} placement="top">
        <IconButton>
          <InfoIcon fontSize='small' />
        </IconButton>
      </Tooltip>
    </>
  );
};
