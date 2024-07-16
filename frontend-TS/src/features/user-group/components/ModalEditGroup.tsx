import { Button, Divider, Grid, Typography } from "@mui/material";
import { UserGroup } from "../types/types.ts";
import { GroupProjectList } from "./GroupProjectList.tsx";
import { GroupUsersList } from "./GroupUsersList.tsx";
import { updateUsersForUserGroup } from "../api/updateUsersForUserGroup.ts";
import { useCallback, useState } from "react";
import { User } from "../../auth/types/types.ts";
import { MMUModal } from "../../../components/elements/modal.tsx";
import { deleteGroup } from "../api/deleteGroup.ts";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { lookingForUsers } from "../api/lookingForUsers.ts";
import { SearchBar } from "../../../components/elements/SearchBar.tsx";
interface ModalEditGroupProps {
  group:UserGroup
  personalGroup:UserGroup
  HandleOpenModal:()=>void
}
export const ModalEditGroup = ({ group,personalGroup,HandleOpenModal }:ModalEditGroupProps)=>{
  const [userToAdd, setUserToAdd] = useState<UserGroup | null>(null);
  const [groupState, setGroupState] = useState(group);
  const [deleteModal, setDeleteModal]= useState(false)
  const [searchInput, setSearchInput] = useState<string>('');

  const handleAddUser = async () => {
    if (userToAdd) {
      const groupUsers = groupState.users
      const userToPush = userToAdd.users[0]
      groupUsers.push(userToPush)
      const updatedGroup= await updateUsersForUserGroup({ ...groupState, users: groupUsers });
      setGroupState(updatedGroup);
    }
  };
  const handleRemoveUser = useCallback( async (userToRemove:User)=>{
    const filteredGroupUsers = groupState.users.filter(user => user.id !== userToRemove.id);
    const updatedGroup = await updateUsersForUserGroup({ ...groupState, users: filteredGroupUsers });

    setGroupState({ ...updatedGroup, users:filteredGroupUsers });
  },[groupState])

  const handleDeleteModal = useCallback(()=>{
    setDeleteModal(!deleteModal);
  },[setDeleteModal,deleteModal])

  const handleDeleteGroup = useCallback(async ()=>{
    await deleteGroup(group.id)
    handleDeleteModal()
    HandleOpenModal()
  },[HandleOpenModal, group.id, handleDeleteModal])

  const getOptionLabel = (option: UserGroup): string => {
    const user = option.users[0];
    if (user.mail.toLowerCase().includes(searchInput.toLowerCase())) {
      return user.mail;
    }
    if (user.name.toLowerCase().includes(searchInput.toLowerCase())) {
      return user.name;
    }
    return user.mail;
  };

  return(
    <Grid item container flexDirection="row" spacing={1}>
      <Grid item container justifyContent="center" xs={6} >
        <Typography variant="h5">{group.name}</Typography>
        <Grid item container direction="column">
          <GroupProjectList
            group={group}
            personalGroup={personalGroup}
          />
        </Grid>
      </Grid>
      <Divider orientation="vertical" variant="middle" flexItem/>
      <Grid item container xs={5} spacing={2}>
        <Grid item>
          <Typography>Adding user to group :</Typography>
        </Grid>
        <SearchBar
          handleAdd={handleAddUser}
          setSelectedData={setUserToAdd}
          getOptionLabel={getOptionLabel}
          fetchFunction={lookingForUsers}
          setSearchInput={setSearchInput}
          actionButtonLabel={"ADD"}
        />
        <GroupUsersList ownerId={groupState.ownerId} users={groupState.users} handleRemoveUser={handleRemoveUser}/>
      </Grid>
      <Grid item container>
        <Button variant="contained" color="error" onClick={handleDeleteModal}>DELETE GROUP</Button>
        {
          deleteModal &&(
            <MMUModal openModal={deleteModal} setOpenModal={handleDeleteModal} width={400} children={
              <Grid item container spacing={2}>
                <Grid item>
                  <WarningAmberIcon sx={{color:"red"}} fontSize="large"/>
                  <Typography> WARNING This action is irreversible, are you sure you want to continue ?</Typography>
                </Grid>
                <Grid item>
                  <Button  variant="contained" color="error" onClick={handleDeleteGroup}>YES</Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" onClick={handleDeleteModal}>NO</Button>
                </Grid>
              </Grid>
            }
            />
          )
        }
      </Grid>
    </Grid>
  )
}
