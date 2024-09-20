import { Button, Grid, styled } from "@mui/material";
import { ChangeEvent, Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { createMedia } from "../api/createMedia.ts";
import { User } from "../../auth/types/types.ts";
import { LinkUserGroup, ProjectRights, UserGroup } from "../../user-group/types/types.ts";
import { Media, MediaGroupRights} from "../types/types.ts";
import toast from "react-hot-toast";
import MMUCard from "../../../components/elements/MMUCard.tsx";

import { ModalButton } from "../../../components/elements/ModalButton.tsx";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { deleteMedia } from "../api/deleteMedia.ts";
import { updateMedia } from "../api/updateMedia.ts";
import { lookingForMedias } from "../api/lookingForMedias.ts";
import { SearchBar } from "../../../components/elements/SearchBar.tsx";
import { lookingForUserGroups } from "../../user-group/api/lookingForUserGroups.ts";
import { addMediaToGroup } from "../api/AddMediaToGroup.ts";
import { ListItem } from "../../../components/types.ts";
import {  ProjectGroup } from "../../projects/types/types.ts";
import { removeAccessToMedia } from "../api/removeAccessToMedia.ts";
import { getAllMediaGroups } from "../api/getAllMediaGroups.ts";
import { updateAccessToMedia } from "../api/updateAccessToMedia.ts";

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface IAllMediasProps{
  user:User
  userPersonalGroup:UserGroup
  medias:Media[]
  fetchMediaForUser:()=>void
  setMedias:Dispatch<SetStateAction<Media[]>>
}

export const AllMedias = ({user,userPersonalGroup,medias,fetchMediaForUser,setMedias}:IAllMediasProps) => {
  const [openModalMediaId, setOpenModalMediaId] = useState<number | null>(null);
  const [searchedMedia, setSearchedMedia] = useState<Media|null>(null);
  const [userGroupsSearch, setUserGroupSearch] = useState<LinkUserGroup[]>([])
  const [userToAdd, setUserToAdd ] = useState<LinkUserGroup | null>(null)
  const [groupList, setGroupList] = useState<ProjectGroup[]>([]);
  const [mediaFiltered, setMediaFiltered] = useState<Media[]>([]);

  const handleCreateMedia  = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files);
    if (event.target.files) {
      console.log(userPersonalGroup)
      await createMedia({
        idCreator: user.id,
        user_group: userPersonalGroup!,
        file: event.target.files[0],
      });
      fetchMediaForUser()
    }
  },[fetchMediaForUser, medias])

  const HandleCopyToClipBoard = async (path: string) => {
    await navigator.clipboard.writeText(path);
    toast.success('path copied to clipboard');
  }

  const HandleOpenModal =useCallback ((mediaId: number)=>{
    setOpenModalMediaId(openModalMediaId === mediaId ? null : mediaId);
  },[setOpenModalMediaId, openModalMediaId]);

  const HandleDeleteMedia = useCallback(
    async (mediaId: number) => {
      await deleteMedia(mediaId);
      const updatedListOfMedias = medias.filter(function(media) {
        return media.id != mediaId;
      });
      setMedias(updatedListOfMedias);
    },[medias, setMedias]
  )

  const HandleUpdateMedia = useCallback(async(mediaToUpdate:Media)=>{
    await updateMedia(mediaToUpdate)
    const updatedListOfMedias = medias.filter(function(media) {
      return media.id != mediaToUpdate.id;
    });
    updatedListOfMedias.push(mediaToUpdate);
    setMedias(updatedListOfMedias);
  },[medias, setMedias])

  const HandleLookingForMedia = async (partialString : string) =>{
    const mediaFiltered = await lookingForMedias(partialString, userPersonalGroup.id)
    console.log('toReturn',mediaFiltered)
    setMediaFiltered(mediaFiltered)
    return mediaFiltered
  }

  const getOptionLabelForMediaSearchBar = (option:Media): string => {
    return option.name;
  };

  const handleSetSearchMedia = (mediaQuery:Media)=>{
    if(mediaQuery){
      const  searchedMedia = medias.find(media => media.id === mediaQuery.id)
      setSearchedMedia(searchedMedia!)
    }else{
      setSearchedMedia(null);
      setMediaFiltered([])
    }
  }

  const handleGrantAccess = async (mediaId:number) =>{
    const linkUserGroupToAdd = userGroupsSearch.find((linkUserGroup)=> linkUserGroup.user_group.id === userToAdd!.id)
    await addMediaToGroup(mediaId, linkUserGroupToAdd!.user_group)
  }

  const getOptionLabel = (option: UserGroup): string => {
    return option.name
  };
  const listOfGroup: ListItem[] = useMemo(() => {
    return groupList.map((projectGroup) => ({
      id: projectGroup.user_group.id,
      name: projectGroup.user_group.name,
      rights: projectGroup.rights
    }));
  }, [groupList]);

  const handleLookingForUserGroups = async (partialString: string) => {
    const linkUserGroups : LinkUserGroup[] = await lookingForUserGroups(partialString);
    const uniqueUserGroups : UserGroup[] = linkUserGroups.map((linkUserGroup) => linkUserGroup.user_group)
      .filter(
        (group, index, self) =>
          index === self.findIndex((g) => g.id === group.id),
      );
    setUserGroupSearch(linkUserGroups);
    return uniqueUserGroups
  }

  const handleRemoveAccessToMedia= async (userGroupId:number, mediaId:number) => {
    await removeAccessToMedia(mediaId, userGroupId);
  }
//TODO handleChange rights must be adapt to Media Entity
  const handleChangeRights = async (group: ListItem, eventValue: string, mediaId: number) => {
    await updateAccessToMedia(mediaId, group.id, eventValue as MediaGroupRights)
  };

  return(
    <Grid item container flexDirection="column" spacing={1}>
      <Grid item container spacing={2} alignItems="center" justifyContent="space-between">
        <Grid item>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Upload file
            <VisuallyHiddenInput
              type="file"
              onChange={handleCreateMedia}
            />
          </Button>
        </Grid>
        <Grid item>
          <SearchBar setFilter={setMediaFiltered} fetchFunction={HandleLookingForMedia} getOptionLabel={getOptionLabelForMediaSearchBar} label={"Filter medias"} setSearchedData={handleSetSearchMedia}/>
        </Grid>
      </Grid>
      {
        !searchedMedia && mediaFiltered.length < 1 && (
          <Grid item container spacing={1} flexDirection="column" sx={{marginBottom:"70px"}}>
            {
              medias.map((media)=>(
                <Grid item key={media.id}>
                  <MMUCard
                    searchBarLabel={"Search"}
                    id={media.id}
                    rights={ProjectRights.ADMIN}
                    description={media.description}
                    HandleOpenModal={()=>HandleOpenModal(media.id)}
                    openModal={openModalMediaId === media.id}
                    itemLabel={media.name}
                    DefaultButton={<ModalButton tooltipButton={"Copy media's link"} onClickFunction={()=>HandleCopyToClipBoard(media.path)} disabled={false} icon={<ContentCopyIcon/>}/>}
                    EditorButton={<ModalButton  tooltipButton={"Edit Media"} onClickFunction={()=>HandleOpenModal(media.id)} icon={<ModeEditIcon />} disabled={false}/>}
                    itemOwner={user}
                    deleteItem={()=>HandleDeleteMedia(media.id)}
                    item={media}
                    updateItem={HandleUpdateMedia}
                    imagePath={media.path}
                    AddAccessListItemFunction={handleGrantAccess}
                    getOptionLabel={getOptionLabel}
                    listOfItem={listOfGroup}
                    removeAccessListItemFunction={handleRemoveAccessToMedia}
                    searchModalEditItem={handleLookingForUserGroups}
                    setItemList={setGroupList}
                    setItemToAdd={setUserToAdd}
                    getAccessToItem={getAllMediaGroups}
                    handleSelectorChange={handleChangeRights}
                  />
                </Grid>
              ))
            }
          </Grid>
        )
      }
      {
        searchedMedia && (
          <Grid item container spacing={1} flexDirection="column" sx={{marginBottom:"70px"}}>
            {
                <Grid item key={searchedMedia.id}>
                  <MMUCard
                    id={searchedMedia.id}
                    rights={ProjectRights.ADMIN}
                    description={searchedMedia.description}
                    HandleOpenModal={()=>HandleOpenModal(searchedMedia.id)}
                    openModal={openModalMediaId === searchedMedia.id}
                    itemLabel={searchedMedia.name}
                    DefaultButton={<ModalButton tooltipButton={"Copy media's link"} onClickFunction={()=>HandleCopyToClipBoard(searchedMedia.path)} disabled={false} icon={<ContentCopyIcon/>}/>}
                    EditorButton={<ModalButton  tooltipButton={"Edit Media"} onClickFunction={()=>HandleOpenModal(searchedMedia.id)} icon={<ModeEditIcon />} disabled={false}/>}
                    itemOwner={user}
                    deleteItem={()=>HandleDeleteMedia(searchedMedia.id)}
                    item={searchedMedia}
                    updateItem={HandleUpdateMedia}
                    imagePath={searchedMedia.path}
                    AddAccessListItemFunction={handleGrantAccess}
                    getOptionLabel={getOptionLabel}
                    listOfItem={listOfGroup}
                    removeAccessListItemFunction={handleRemoveAccessToMedia}
                    searchModalEditItem={handleLookingForUserGroups}
                    setItemList={setGroupList}
                    setItemToAdd={setUserToAdd}
                    getAccessToItem={getAllMediaGroups}
                    handleSelectorChange={handleChangeRights}
                  />
                </Grid>
            }
          </Grid>
        )
      }
      {
        !searchedMedia && mediaFiltered.length > 0 && (
          <Grid item container spacing={1} flexDirection="column" sx={{marginBottom:"70px"}}>
            {
              mediaFiltered.map((media)=>(
                <Grid item key={media.id}>
                  <MMUCard
                    id={media.id}
                    rights={ProjectRights.ADMIN}
                    description={media.description}
                    HandleOpenModal={()=>HandleOpenModal(media.id)}
                    openModal={openModalMediaId === media.id}
                    itemLabel={media.name}
                    DefaultButton={<ModalButton tooltipButton={"Copy media's link"} onClickFunction={()=>HandleCopyToClipBoard(media.path)} disabled={false} icon={<ContentCopyIcon/>}/>}
                    EditorButton={<ModalButton  tooltipButton={"Edit Media"} onClickFunction={()=>HandleOpenModal(media.id)} icon={<ModeEditIcon />} disabled={false}/>}
                    itemOwner={user}
                    deleteItem={()=>HandleDeleteMedia(media.id)}
                    item={media}
                    updateItem={HandleUpdateMedia}
                    imagePath={media.path}
                    AddAccessListItemFunction={handleGrantAccess}
                    getOptionLabel={getOptionLabel}
                    listOfItem={listOfGroup}
                    removeAccessListItemFunction={handleRemoveAccessToMedia}
                    searchModalEditItem={handleLookingForUserGroups}
                    setItemList={setGroupList}
                    setItemToAdd={setUserToAdd}
                    getAccessToItem={getAllMediaGroups}
                    handleSelectorChange={handleChangeRights}
                  />
                </Grid>
              ))
            }
          </Grid>
        )
      }
    </Grid>
  )
}
