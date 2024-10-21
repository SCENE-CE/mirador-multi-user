import { User } from "../../auth/types/types.ts";
import { Grid, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { CreateGroupDto, LinkUserGroup, ProjectRights, UserGroup } from "../types/types.ts";
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
import { SidePanelMedia } from "../../media/component/SidePanelMedia.tsx";
import { Media } from "../../media/types/types.ts";
import { getUserGroupMedias } from "../../media/api/getUserGroupMedias.ts";
import { PaginationControls } from "../../../components/elements/Pagination.tsx";


interface allGroupsProps {
  user: User;
  medias:Media[];
  setMedias:Dispatch<SetStateAction<Media[]>>
  userPersonalGroup:UserGroup
  fetchGroups:()=>void
  groups:UserGroup[]
  setGroups:Dispatch<SetStateAction<UserGroup[]>>
}
export const AllGroups= ({user, medias, setMedias,userPersonalGroup,fetchGroups, groups,setGroups}:allGroupsProps)=>{
  const [modalGroupCreationIsOpen, setModalGroupCreationIsOpen] = useState(false)
  const [selectedUserGroup, setSelectedUserGroup] = useState<UserGroup | null>(null);
  const [openModalGroupId, setOpenModalGroupId] = useState<number | null>(null); // Updated state
  const [userToAdd, setUserToAdd ] = useState<LinkUserGroup | null>(null)
  const [userPersonalGroupList, setUserPersonalGroupList] = useState<LinkUserGroup[]>([])
  const [groupFiltered, setGroupFiltered] = useState<UserGroup[] | undefined>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const currentPageData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return groups.slice(start, end);
  }, [currentPage, groups]);

  const totalPages = Math.ceil(groups.length / itemsPerPage);

  const fetchMediaForUser = async()=>{
    const medias = await getUserGroupMedias(userPersonalGroup!.id)
    setMedias(medias);
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
        user: user
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
    if (user.name.toLowerCase().includes(searchInput.toLowerCase())) {
      return user.name;
    }
    return user.name
  };


  const handleChangeRights = async(group: ListItem,eventValue:string, groupId:number) =>{
    const userToUpdate = userPersonalGroupList.find((user)=>user.user.id=== group.id)
    await  ChangeAccessToGroup(groupId, {userId: userToUpdate!.user.id, groupId: group.id, rights: eventValue as ProjectRights} );
  }

  const HandleOpenModal =useCallback ((groupId: number)=>{
    setOpenModalGroupId(openModalGroupId === groupId ? null : groupId); // Updated logic
  },[openModalGroupId, setOpenModalGroupId])

  const handleDeleteGroup = useCallback(async (groupId: number) => {
    await deleteGroup(groupId);
    fetchGroups()
  },[groups, setGroups])

  const updateGroup= useCallback(async (groupUpdated: UserGroup) => {
    const dataForUpdate = {
      ...groupUpdated
    }

    await UpdateGroup(dataForUpdate);
    fetchGroups()
  },[groups, setGroups])


  const grantingAccessToGroup = async ( user_group_id: number) => {
    const user_group = groups.find((groups)=> groups.id === user_group_id)
    await grantAccessToGroup(userToAdd!.user, user_group! )
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
    return groups.filter((groups) => groups.name.startsWith(partialString))
  }

  const handleFiltered = (partialString:string)=>{
    if(partialString.length < 1){
      return setGroupFiltered([])
    }
    if(partialString.length > 0 ){
      const groupsFiltered = groups.filter((group)=>group.name.startsWith(partialString))
      if(groupsFiltered.length >= 1){
        setGroupFiltered(groupsFiltered)
      }else{
        setGroupFiltered(undefined)
      }
    }
  }
  console.log('groups',groups)
  return(
    <>
      <SidePanelMedia display={!!openModalGroupId} fetchMediaForUser={fetchMediaForUser} medias={medias} user={user} userPersonalGroup={userPersonalGroup!}>
        <Grid container justifyContent='center' flexDirection='column' spacing={4}>
          <Grid item container direction="row-reverse" spacing={2} alignItems="center"  sx={{position:'sticky', top:0, zIndex:1000, backgroundColor:'#dcdcdc', paddingBottom:"10px"}}>
            <Grid item>
              <SearchBar handleFiltered={handleFiltered} label={"Filter groups"} fetchFunction={handleLookingForGroup} getOptionLabel={getOptionLabel} setSelectedData={setSelectedUserGroup}/>
            </Grid>
          </Grid>
          <Grid item container spacing={2} flexDirection="column" sx={{ marginBottom: "40px" }}>
            {!groups.length && (
              <Grid
                container
                justifyContent={"center"}
              >
                <Typography variant="h6" component="h2">No groups yet, start to work when clicking on the new group button.</Typography>
              </Grid>
            )}
            {groups && groupFiltered && groupFiltered.length < 1 &&!selectedUserGroup && currentPageData.map((group) => (
              <Grid item key={group.id}>
                <MMUCard
                  isGroups={true}
                  thumbnailUrl={group.thumbnailUrl ? group.thumbnailUrl : null }
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
                  isGroups={true}
                  thumbnailUrl={selectedUserGroup.thumbnailUrl ? selectedUserGroup.thumbnailUrl : null }
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
            {groups && groupFiltered && groupFiltered.length > 0 &&!selectedUserGroup && groupFiltered.map((group) => (
              <Grid item key={group.id}>
                <MMUCard
                  isGroups={true}
                  thumbnailUrl={group.thumbnailUrl ? group.thumbnailUrl : null }
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
            {
              !groupFiltered && (
                <Grid item container justifyContent="center" alignItems="center">
                  <Typography variant="h6" component="h2">There is no group matching your research.</Typography>
                </Grid>
              )
            }
            <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}/>
          </Grid>
          <FloatingActionButton onClick={toggleModalGroupCreation} content={"New Group"} Icon={<AddIcon />} />
          <DrawerCreateGroup handleCreatGroup={handleCreateGroup} modalCreateGroup={modalGroupCreationIsOpen} toggleModalGroupCreation={toggleModalGroupCreation}/>
        </Grid>
      </SidePanelMedia>
    </>
  )
}
