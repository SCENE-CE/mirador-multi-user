import { Button, Grid, TextField } from "@mui/material";
import storage from "../../utils/storage.ts";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { ModalButton } from "../../components/elements/ModalButton.tsx";
import toast from "react-hot-toast";
import { User } from "../auth/types/types.ts";
import { ProfileUpdateForm } from "./ProfileUpdateFom.tsx";
import { deleteAccount } from "../auth/api/deleteAccount.ts";
import { useState } from "react";
import { ModalConfirmDelete } from "../projects/components/ModalConfirmDelete.tsx";
import { MMUModal } from "../../components/elements/modal.tsx";

interface IUserSettingsProps {
  user:User
}
export const UserSettings = ({user}:IUserSettingsProps) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const token = storage.getToken();
  console.log(token);

  const HandleCopyToClipBoard = async () => {
    await navigator.clipboard.writeText(token);
    toast.success('token copied to clipboard');
  }

  const handleDeleteAccount= async ()=>{
    const responseDelete = await deleteAccount(user.id)
    if(responseDelete){
      window.location.reload();
    }
  }

  const handleConfirmDeleteItemModal =() => {
    setOpenDeleteModal(!openDeleteModal);
  }

  console.log('user', user);

  return (
    <Grid container spacing={2}>
      <Grid container item flexDirection="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
        <Grid item xs={10}>
          <TextField
            label="API Token"
            disabled
            fullWidth
            helperText="this is for advanced users"
            defaultValue={token}
          />
        </Grid>
        <Grid item xs={2}>
          <ModalButton tooltipButton="Copy token" onClickFunction={HandleCopyToClipBoard} disabled={false} icon={<ContentCopyIcon />} />
        </Grid>
      </Grid>

      <Grid container item xs={12}>
        <ProfileUpdateForm user={user} />
      </Grid>
      <Grid item spacing={2} sx={{ width: '100%' }}>
        <Button
          variant="contained"
          color="error"
          onClick={handleConfirmDeleteItemModal}
        >
          Delete account
        </Button>
      </Grid>
      <MMUModal width={400} openModal={openDeleteModal} setOpenModal={handleConfirmDeleteItemModal}>
        <ModalConfirmDelete
          deleteItem={handleDeleteAccount}
          itemId={user.id}
          itemName={'your account'}
        />
      </MMUModal>
    </Grid>
  )
}