import { ReactNode } from 'react';
import { Tooltip, IconButton } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';

interface MMUToolTipProps {
  children: ReactNode;
}

export const MMUToolTip = ({ children }: MMUToolTipProps) => {
  return (
    <>
      <Tooltip title={children} placement="top">
        <IconButton>
          <HelpIcon fontSize='small' />
        </IconButton>
      </Tooltip>
    </>
  );
};
