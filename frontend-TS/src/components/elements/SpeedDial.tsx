import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { ReactNode } from "react";
import { Backdrop } from "@mui/material";

type Action = {
  icon: ReactNode,
  name: string,
  onClick: () => void,
};


interface ISpeedDialTooltipOpen {
  actions:Action[],
}
const spacingMultiplier = 90;
const labelSpacing = -80;

export default function SpeedDialTooltipOpen({actions}:ISpeedDialTooltipOpen) {
  const [open, setOpen] = React.useState(false);

  const handleToggle = () => setOpen((prevOpen) => !prevOpen);

  return (
    <Box sx={{ height: 330, transform: 'translateZ(0px)', flexGrow: 1 }}>
      <Backdrop open={open} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip"
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          '& .MuiSpeedDial-actions': {
            gap: `${spacingMultiplier}px`,
          }
        }}
        icon={<SpeedDialIcon />}
        onClick={handleToggle}
        open={open}
        direction={"left"}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={action.onClick}
            sx={{
              '& .MuiSpeedDialAction-staticTooltipLabel': {
                marginLeft: `${labelSpacing}px`,
                padding: '4px 8px',
                minWidth: '60px',
                textAlign: 'center',
                fontFamily: 'monospace',
              },
            }}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}