import Modal from '@mui/material/Modal';
import { Box } from "@mui/material";
import { ReactNode } from "react";

interface OpenModalProps{
  openModal:boolean,
  setOpenModal: () => void,
  children: ReactNode
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export const MMUModal= ({ openModal, setOpenModal, children }:OpenModalProps)=>{

  return(
    <Modal
      open={openModal}
      onClose={setOpenModal}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <Box sx={{ ...style }}>
        {children}
      </Box>
    </Modal>
  )
}
