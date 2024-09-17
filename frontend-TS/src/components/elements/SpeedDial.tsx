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
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
            gap: `${spacingMultiplier}px`, // Increase space between actions
          }
        }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        direction={"left"} // Controls the direction of SpeedDial actions
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
                marginLeft: `${labelSpacing}px`, // Adds space between the icon and the label
                padding: '4px 8px', // Consistent padding around label
                minWidth: '60px', // Minimum width for all labels
                textAlign: 'center', // Align text center for consistency
                fontFamily: 'monospace', // Optional: use a monospace font to ensure uniform character width
              },
            }}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}