import Modal from '@mui/material/Modal';
import { Box } from "@mui/material";
import { ReactNode } from "react";

interface IOpenModalProps{
  openModal:boolean,
  setOpenModal: () => void,
  children: ReactNode,
  width:number
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export const MMUModal= ({ openModal, setOpenModal, children, width }:IOpenModalProps)=>{
console.log(openModal);
  return(
    <Modal
      open={openModal}
      onClose={setOpenModal}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <Box sx={{ ...style, width:width}}>
        {children}
      </Box>
    </Modal>
  )
}
