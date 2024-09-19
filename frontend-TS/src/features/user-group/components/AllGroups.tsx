import { User } from "../../auth/types/types.ts";
import { Grid } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CreateGroupDto,
  LinkUserGroup,
  ProjectRights,
  UserGroup,
  UserGroupTypes
} from "../types/types.ts";
import { getAllUserGroups } from "../api/getAllUserGroups.ts";
import { FloatingActionButton } from "../../../components/elements/FloatingActionButton.tsx";
import AddIcon from "@mui/icons-material/Add";
import { DrawerCreateGroup } from "./DrawerCreateGroup.tsx";
import { createGroup } from "../api/createGroup.ts";
import { SearchBar } from "../../../components/elements/SearchBar.tsx";
import MMUCard from "../../../components/elements/MMUCard.tsx";
import { ChangeAccessToGroup } from "../api/ChangeAccessToGroup.ts";
import { deleteGroup } from "../api/deleteGroup.ts";
import { grantAccessToGroup } from "../api/grantAccessToGroup.ts";
import { removeAccessToGroup } from "../api/removeAccessToGroup.ts";
import { lookingForUsers } from "../api/lookingForUsers.ts";
import { ModalButton } from "../../../components/elements/ModalButton.tsx";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { UpdateGroup } from "../api/updateGroup.ts";
import { GetAllGroupUsers } from "../api/getAllGroupUsers.ts";
import { ListItem } from "../../../components/types.ts";


interface allGroupsProps {
  user: User;
}
export const AllGroups= ({user}:allGroupsProps)=>{
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [modalGroupCreationIsOpen, setModalGroupCreationIsOpen] = useState(false)
  const [selectedUserGroup, setSelectedUserGroup] = useState<UserGroup | null>(null);
  const [openModalGroupId, setOpenModalGroupId] = useState<number | null>(null); // Updated state
  const [userToAdd, setUserToAdd ] = useState<LinkUserGroup | null>(null)
  const [ userPersonalGroupList, setUserPersonalGroupList] = useState<LinkUserGroup[]>([])
  const [groupFiltered, setGroupFiltered] = useState<UserGroup[]>([]);


  const fetchGroups = async () => {
    let groups = await getAllUserGroups(user.id)
    groups = groups.filter((group : UserGroup)=> group.type == UserGroupTypes.MULTI_USER)
    setGroups(groups)
  }

  useEffect(
    () =>{
      fetchGroups()
    },[openModalGroupId, user]
  )
  const handleCreateGroup = async (name:string)=>{
    try{
      const userGroupToCreate : CreateGroupDto = {
        name: name,
        ownerId: user.id,
        users: [user]
      }
      await createGroup(userGroupToCreate);
      await fetchGroups()
    }catch(error){
      console.error(error)
    }
  }

  const toggleModalGroupCreation = useCallback(()=>{
    setModalGroupCreationIsOpen(!modalGroupCreationIsOpen);
  },[modalGroupCreationIsOpen,setModalGroupCreationIsOpen])


  const getOptionLabel = (option: UserGroup): string => {
    if(option.name){
      return option.name
    }
    return ''
  };

  const getOptionLabelForEditModal = (option: LinkUserGroup , searchInput: string): string => {
    const user = option.user;
    if (user.mail.toLowerCase().includes(searchInput.toLowerCase())) {
      return user.mail;
    }
    if (user.name.toLowerCase().includes(searchInput.toLowerCase())) {
      return user.name;
    }
    return user.mail;
  };


  const handleChangeRights = async(group: ListItem,eventValue:string, groupId:number) =>{
    const userToUpdate = userPersonalGroupList.find((user)=>user.user.id=== group.id)
    const changeAccess =await  ChangeAccessToGroup(groupId, {...userToUpdate, rights: eventValue as ProjectRights} );
    console.log(changeAccess)
  }

  const HandleOpenModal =useCallback ((groupId: number)=>{
    setOpenModalGroupId(openModalGroupId === groupId ? null : groupId); // Updated logic
  },[openModalGroupId, setOpenModalGroupId])

  const handleDeleteGroup = useCallback(async (groupId: number) => {
    await deleteGroup(groupId);
    const updateListOfGroup = groups.filter((group: UserGroup) => group.id !== groupId);
    setGroups(updateListOfGroup);
  },[groups, setGroups])

  const updateGroup= useCallback(async (groupUdated: UserGroup) => {
    const dataForUpdate = {
      ...groupUdated
    }

    const updateGroup =  await UpdateGroup(dataForUpdate);
    const updateListOfGroup = groups.filter((group: UserGroup)=> group.id !== dataForUpdate.id);
    const updatedListOfGroup = [updateGroup[0], ...updateListOfGroup]
    setGroups(updatedListOfGroup);
  },[groups, setGroups])


  const grantingAccessToGroup = async ( user_group_id: number) => {
    const user_group = groups.find((groups)=> groups.id === user_group_id)
    await grantAccessToGroup(ProjectRights.READER, userToAdd!.user, user_group! )
  }

  const listOfUserPersonalGroup = useMemo(()=>{
    return userPersonalGroupList.map((userPersonalGroup) => ({
      id: userPersonalGroup.user.id,
      name: userPersonalGroup.user.name,
      rights: userPersonalGroup.rights
    }))
  },[userPersonalGroupList])

  const handleRemoveUser= async (groupId: number, userToRemoveId: number)=>{
    await removeAccessToGroup(groupId, userToRemoveId)
  }

  const handleLookingForGroup =(partialString:string)=>{
    const groupFiltered = groups.filter((groups) => groups.name.startsWith(partialString));
    setGroupFiltered(groupFiltered)
    return groupFiltered
  }

  return(
    <Grid container justifyContent='center' flexDirection='column' spacing={4}>
      <Grid item container direction="row-reverse" spacing={2} alignItems="center">
        <Grid item>
          <SearchBar label={"Filter groups"} fetchFunction={handleLookingForGroup} getOptionLabel={getOptionLabel} setSelectedData={setSelectedUserGroup}/>
        </Grid>
      </Grid>
      <Grid item container spacing={2} flexDirection="column" sx={{ marginBottom: "40px" }}>
        {groups && groupFiltered.length < 1 &&!selectedUserGroup && groups.map((group) => (
            <Grid item key={group.id}>
              <MMUCard
                searchBarLabel={"Search Users"}
                rights={group.rights!}
                itemLabel={group.name}
                openModal={openModalGroupId === group.id}
                getOptionLabel={getOptionLabelForEditModal}
                deleteItem={handleDeleteGroup}
                item={group}
                updateItem={updateGroup}
                HandleOpenModal={()=>HandleOpenModal(group.id)}
                id={group.id}
                AddAccessListItemFunction={grantingAccessToGroup}
                EditorButton={<ModalButton tooltipButton={"Edit Group"} disabled={false} icon={<ModeEditIcon/>} onClickFunction={()=>HandleOpenModal(group.id)}/>}
                ReaderButton={<ModalButton disabled={true} tooltipButton={"OpenGroup"} icon={<ModeEditIcon/>} onClickFunction={()=>console.log("you're not allowed to do this")}/>}
                getAccessToItem={GetAllGroupUsers}
                itemOwner={group}
                listOfItem={listOfUserPersonalGroup}
                removeAccessListItemFunction={handleRemoveUser}
                searchModalEditItem={lookingForUsers}
                setItemList={setUserPersonalGroupList}
                setItemToAdd={setUserToAdd}
                description={group.description}
                handleSelectorChange={handleChangeRights}
              />
            </Grid>
        ))}
        {selectedUserGroup &&(
          <Grid item>
            <MMUCard
              searchBarLabel={"Search Users"}
              rights={selectedUserGroup.rights!}
              itemLabel={selectedUserGroup.name}
              openModal={openModalGroupId === selectedUserGroup.id}
              getOptionLabel={getOptionLabel}
              deleteItem={handleDeleteGroup}
              item={selectedUserGroup}
              updateItem={updateGroup}
              HandleOpenModal={()=>HandleOpenModal(selectedUserGroup.id)}
              id={selectedUserGroup.id}
              AddAccessListItemFunction={grantingAccessToGroup}
              EditorButton={<ModalButton tooltipButton={"Edit"} disabled={false} icon={<ModeEditIcon/>} onClickFunction={()=>HandleOpenModal(selectedUserGroup.id)}/>}
              ReaderButton={<ModalButton tooltipButton={"Open"} disabled={true} icon={<ModeEditIcon/>} onClickFunction={()=>console.log("you're not allowed to do this")}/>}
              getAccessToItem={getAllUserGroups}
              itemOwner={selectedUserGroup}
              listOfItem={listOfUserPersonalGroup}
              removeAccessListItemFunction={handleRemoveUser}
              searchModalEditItem={lookingForUsers}
              setItemList={setUserPersonalGroupList}
              setItemToAdd={setUserToAdd}
              description={selectedUserGroup.description}
              handleSelectorChange={handleChangeRights}
            />
          </Grid>
        )}
        {groups && groupFiltered.length > 0 &&!selectedUserGroup && groupFiltered.map((group) => (
          <Grid item key={group.id}>
            <MMUCard
              searchBarLabel={"Search Users"}
              rights={group.rights!}
              itemLabel={group.name}
              openModal={openModalGroupId === group.id}
              getOptionLabel={getOptionLabelForEditModal}
              deleteItem={handleDeleteGroup}
              item={group}
              updateItem={updateGroup}
              HandleOpenModal={()=>HandleOpenModal(group.id)}
              id={group.id}
              AddAccessListItemFunction={grantingAccessToGroup}
              EditorButton={<ModalButton tooltipButton={"Edit Group"} disabled={false} icon={<ModeEditIcon/>} onClickFunction={()=>HandleOpenModal(group.id)}/>}
              ReaderButton={<ModalButton disabled={true} tooltipButton={"OpenGroup"} icon={<ModeEditIcon/>} onClickFunction={()=>console.log("you're not allowed to do this")}/>}
              getAccessToItem={GetAllGroupUsers}
              itemOwner={group}
              listOfItem={listOfUserPersonalGroup}
              removeAccessListItemFunction={handleRemoveUser}
              searchModalEditItem={lookingForUsers}
              setItemList={setUserPersonalGroupList}
              setItemToAdd={setUserToAdd}
              description={group.description}
              handleSelectorChange={handleChangeRights}
            />
          </Grid>
        ))}
      </Grid>
      <FloatingActionButton onClick={toggleModalGroupCreation} content={"New Group"} Icon={<AddIcon />} />
      <DrawerCreateGroup handleCreatGroup={handleCreateGroup} modalCreateGroup={modalGroupCreationIsOpen} toggleModalGroupCreation={toggleModalGroupCreation}/>
    </Grid>

  )
}
