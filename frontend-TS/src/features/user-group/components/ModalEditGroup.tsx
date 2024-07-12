import { Divider, Grid, Typography } from "@mui/material";
import { UserGroup } from "../types/types.ts";
import { GroupProjectList } from "./GroupProjectList.tsx";
import { UsersSearchBar } from "./UsersSearchBar.tsx";
import { GroupUsersList } from "./GroupUsersList.tsx";
import { updateUsersForUserGroup } from "../api/updateUsersForUserGroup.ts";
import { useCallback, useState } from "react";
import { User } from "../../auth/types/types.ts";
import { MMUModal } from "../../../components/elements/modal.tsx";
interface ModalEditGroupProps {
  group:UserGroup
  personalGroup:UserGroup
}
export const ModalEditGroup = ({ group,personalGroup }:ModalEditGroupProps)=>{
  const [userToAdd, setUserToAdd] = useState<UserGroup | null>(null);
  const [groupState, setGroupState] = useState(group); // Add state for group
  const [forbiddenModal, setForbiddenModal] = useState<boolean>(false)
  const handleAddUser = async () => {
    if (userToAdd) {
      const groupUsers = groupState.users
      const userToPush = userToAdd.users[0]
      groupUsers.push(userToPush)
      const updatedGroup= await updateUsersForUserGroup({ ...groupState, users: groupUsers });
      setGroupState(updatedGroup);
    }
  };
  console.log('groupState',groupState)
  const handleRemoveUser = async (userToRemove:User) => {
    if(groupState.users.length > 2){
      console.log('userToRemove',userToRemove);
      const filteredGroupUsers = groupState.users.filter(user => user.id !== userToRemove.id);
      console.log('filteredGroupUsers',filteredGroupUsers)
      const updatedGroup = await updateUsersForUserGroup({ ...groupState, users: filteredGroupUsers });
      console.log('AFTER REQUEST', updatedGroup)
      setGroupState(updatedGroup);
    }
    else {
      console.log('forbiden')
      return setForbiddenModal(true)
    }
  }
  const handleForbbidenModal = useCallback(()=>{
    setForbiddenModal(!forbiddenModal);
  },[setForbiddenModal, forbiddenModal])

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
        <UsersSearchBar
          handleAddUser={handleAddUser}
          setSelectedUser={setUserToAdd}
        />
        <GroupUsersList ownerId={groupState.ownerId} users={groupState.users} handleRemoveUser={handleRemoveUser}/>
        {forbiddenModal &&(
          <MMUModal openModal={forbiddenModal} setOpenModal={handleForbbidenModal} width={400} children={
            <Grid>
              /!\ A group can't contain less than two users
            </Grid>
          }/>
        )
        }
      </Grid>
    </Grid>
  )
}
