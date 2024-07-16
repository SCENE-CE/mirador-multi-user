import {User} from '../../auth/types/types.ts'
import {  Grid, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CreateGroupDto, UserGroup } from "../types/types.ts";
import { getAllUserGroups } from "../api/getAllUserGroups.ts";
import { GroupCard } from "./GroupCard.tsx";
import { useUser } from "../../../utils/auth.tsx";
import { FloatingActionButton } from "../../../components/elements/FloatingActionButton.tsx";
import AddIcon from "@mui/icons-material/Add";
import { DrawerCreateGroup } from "./DrawerCreateGroup.tsx";
import { createGroup } from "../api/createGroup.ts";


interface allGroupsProps {
  user: User;
}
export const AllGroups= ({user}:allGroupsProps)=>{
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [users, setUsers] = useState<UserGroup[]>([]);
  const [modalGroupCreationIsOpen, setModalGroupCreationIsOpen] = useState(false)
  const [openEditGroupModal, setOpenEditGroupModal] = useState(false)

  const currentUser = useUser();


  const fetchGroups = async () => {
    try {
      let groups = await getAllUserGroups(user.id)
      const users : UserGroup[] = groups.filter((group:UserGroup)=> group.users.length < 2)
      groups = groups.filter(((group : UserGroup)=>{ return users.indexOf(group) < 0}))
      setGroups(groups)
      setUsers(users)
    } catch (error) {
      throw error
    }
  }

  useEffect(
    () =>{
      fetchGroups()
    },[openEditGroupModal]
  )
  const handleCreateGroup = async (name:string)=>{
    try{
      const userGroupToCreate : CreateGroupDto = {
        name: name,
        ownerId: user.id,
        users: [user]
      }
      console.log(userGroupToCreate)
      await createGroup(userGroupToCreate);
      await fetchGroups()
    }catch(error){
      console.error(error)
    }
  }

  const HandleOpenEditGroupModal = useCallback(()=>{
    setOpenEditGroupModal(!openEditGroupModal)
  },[setOpenEditGroupModal,openEditGroupModal])


  const personalGroup = useMemo(() => {
    if (!Array.isArray(groups)) return null;

    const filteredGroups = users.filter(group => Array.isArray(group.users) && group.name === currentUser.data!.name );

    return filteredGroups[0];
  }, [groups]);

  const toggleModalGroupCreation = useCallback(()=>{
    setModalGroupCreationIsOpen(!modalGroupCreationIsOpen);
  },[modalGroupCreationIsOpen,setModalGroupCreationIsOpen])

  return(
    <Grid container justifyContent='center' flexDirection='column' spacing={4}>
      <Grid item container justifyContent="center" spacing={2}>
        <Typography variant="h5" component="h1">
          {user.name}'s groups
        </Typography>
      </Grid>
      <Grid item container spacing={2} flexDirection="column" sx={{ marginBottom: "40px" }}>
        {groups.map((group) => (
          <>
            <Grid item key={group.id}>
              <GroupCard group={group} personalGroup={personalGroup!}  HandleOpenEditGroupModal={HandleOpenEditGroupModal}/>
            </Grid>
          </>
        ))}
      </Grid>
      <FloatingActionButton onClick={toggleModalGroupCreation} content={"New Group"} Icon={<AddIcon />} />
      <DrawerCreateGroup handleCreatGroup={handleCreateGroup} modalCreateGroup={modalGroupCreationIsOpen} toggleModalGroupCreation={toggleModalGroupCreation}/>
    </Grid>

  )
}
