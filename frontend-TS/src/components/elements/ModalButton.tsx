import { Button, Tooltip } from "@mui/material";
import { ReactElement } from "react";

interface IModalButtonProps {
  onClickFunction:()=>void,
  disabled:boolean,
  icon:  ReactElement
}
export const ModalButton = ({onClickFunction, disabled,icon}:IModalButtonProps )=>{

  return(
    <>
      <Tooltip title={"Project configuration"}>
        <Button
          disabled={disabled}
          onClick={onClickFunction}
          variant="contained"
        >
          {icon}
        </Button>
      </Tooltip>
    </>
  )
}
