import { Grid, styled, Typography } from "@mui/material";
import { ChangeEvent, Dispatch, ReactNode, SetStateAction, useCallback, useMemo, useState } from "react";
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
import SpeedDialTooltipOpen from "../../../components/elements/SpeedDial.tsx";
import AddLinkIcon from "@mui/icons-material/AddLink";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { DrawerLinkMedia } from "./DrawerLinkMedia.tsx";
import { createMediaLink } from "../api/createMediaWithLink.ts";
import { PaginationControls } from "../../../components/elements/Pagination.tsx";

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

const caddyUrl = import.meta.env.VITE_CADDY_URL


export const AllMedias = ({user,userPersonalGroup,medias,fetchMediaForUser,setMedias}:IAllMediasProps) => {
  const [openModalMediaId, setOpenModalMediaId] = useState<number | null>(null);
  const [searchedMedia, setSearchedMedia] = useState<Media|null>(null);
  const [userGroupsSearch, setUserGroupSearch] = useState<LinkUserGroup[]>([])
  const [userToAdd, setUserToAdd ] = useState<LinkUserGroup | null>(null)
  const [groupList, setGroupList] = useState<ProjectGroup[]>([]);
  const [mediaFiltered, setMediaFiltered] = useState<Media[]|undefined>([]);
  const [modalLinkMediaIsOpen, setModalLinkMediaIsOpen] = useState(false)

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const currentPageData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return medias.slice(start, end);
  }, [currentPage, medias]);

  const totalPages = Math.ceil(medias.length / itemsPerPage);

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
    console.log('path',path);
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
    console.log('mediaToUpdate',mediaToUpdate)
    await updateMedia(mediaToUpdate)
    const updatedListOfMedias = medias.filter(function(media) {
      return media.id != mediaToUpdate.id;
    });
    updatedListOfMedias.push(mediaToUpdate);
    setMedias(updatedListOfMedias);
  },[medias, setMedias])

  const HandleLookingForMedia = async (partialString : string) =>{
    const mediaFiltered = await lookingForMedias(partialString, userPersonalGroup.id)
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
  const handleChangeRights = async (group: ListItem, eventValue: string, mediaId: number) => {
    await updateAccessToMedia(mediaId, group.id, eventValue as MediaGroupRights)
  };

  const handleButtonClick = () => {
    document.getElementById('file-upload')!.click();
  };

  const handleFiltered = (partialString:string)=>{
    if(partialString.length < 1){
      return setMediaFiltered([])
    }
    if(partialString.length > 0 ){
      const filteredMedia = medias.filter((media)=>media.name.startsWith(partialString))
      if(filteredMedia.length >= 1){
        setMediaFiltered(filteredMedia)
      }else{
        setMediaFiltered(undefined)
      }
    }
  }

  const actions = [
    { icon: <AddLinkIcon /> as ReactNode, name: 'link' ,onClick:()=> {
        console.log('open')
        console.log('modalLinkMediaIsOpen',modalLinkMediaIsOpen)
        setModalLinkMediaIsOpen(!modalLinkMediaIsOpen);
      }},
    { icon: <UploadFileIcon /> as ReactNode, name: 'Upload' , onClick: () => {
        handleButtonClick()
      }},
  ];
  const createMediaWithLink = async (link: string) => {
    try {
      await createMediaLink({imageUrl:link, idCreator:user.id, user_group: userPersonalGroup})
    } catch (error) {
      console.error('Error fetching the image:', error);
    }
  };
  console.log('medias',medias)
  return(
    <>
      <Grid item container flexDirection="column" spacing={1}>
        <Grid item container spacing={2} alignItems="center" justifyContent="space-between"  sx={{position:'sticky', top:0, zIndex:1000, backgroundColor:'#dcdcdc', paddingBottom:"10px"}}>
          <Grid item>
            <VisuallyHiddenInput
              id="file-upload"
              type="file"
              onChange={handleCreateMedia}
            />
          </Grid>
          <Grid item>
            <SearchBar handleFiltered={handleFiltered} setFilter={setMediaFiltered} fetchFunction={HandleLookingForMedia} getOptionLabel={getOptionLabelForMediaSearchBar} label={"Filter medias"} setSearchedData={handleSetSearchMedia}/>
          </Grid>
        </Grid>
        {!medias.length && (
          <Grid
            container
            justifyContent={"center"}
          >
            <Typography variant="h6" component="h2">No medias yet, start to work when clicking on "Upload Medias" button.</Typography>
          </Grid>
        )}
        {
          !searchedMedia && mediaFiltered && mediaFiltered.length < 1 && (
            <Grid item container spacing={1} flexDirection="column" sx={{marginBottom:"70px"}}>
              {
                currentPageData.map((media)=>(
                  <Grid item key={media.id}>
                    <MMUCard
                      metadata={media.metadata}
                      searchBarLabel={"Search"}
                      id={media.id}
                      rights={media.rights}
                      description={media.description}
                      HandleOpenModal={()=>HandleOpenModal(media.id)}
                      openModal={openModalMediaId === media.id}
                      itemLabel={media.name}
                      DefaultButton={<ModalButton tooltipButton={"Copy media's link"} onClickFunction={media.path ? ()=>HandleCopyToClipBoard(`${caddyUrl}/${media.hash}/${media.path}`):()=>HandleCopyToClipBoard(media.url)} disabled={false} icon={<ContentCopyIcon/>}/>}
                      EditorButton={<ModalButton  tooltipButton={"Edit Media"} onClickFunction={()=>HandleOpenModal(media.id)} icon={<ModeEditIcon />} disabled={false}/>}
                      ReaderButton={<ModalButton tooltipButton={"Open Project"} onClickFunction={()=>console.log("You're not allowed to do this")} icon={<ModeEditIcon />} disabled={true}/>}
                      itemOwner={user}
                      deleteItem={()=>HandleDeleteMedia(media.id)}
                      item={media}
                      updateItem={HandleUpdateMedia}
                      thumbnailUrl={`${caddyUrl}/${media.hash}/thumbnail.webp`}
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
              <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}/>
            </Grid>
          )
        }
        {
          searchedMedia && (
            <Grid item container spacing={1} flexDirection="column" sx={{marginBottom:"70px"}}>
              {
                <Grid item key={searchedMedia.id}>
                  <MMUCard
                    metadata={searchedMedia.metadata}
                    id={searchedMedia.id}
                    rights={ProjectRights.ADMIN}
                    description={searchedMedia.description}
                    HandleOpenModal={()=>HandleOpenModal(searchedMedia.id)}
                    openModal={openModalMediaId === searchedMedia.id}
                    itemLabel={searchedMedia.name}
                    DefaultButton={<ModalButton tooltipButton={"Copy media's link"} onClickFunction={searchedMedia.path ? ()=>HandleCopyToClipBoard(`${caddyUrl}/${searchedMedia.hash}/${searchedMedia.path}`):()=>HandleCopyToClipBoard(searchedMedia.url)} disabled={false} icon={<ContentCopyIcon/>}/>}
                    EditorButton={<ModalButton  tooltipButton={"Edit Media"} onClickFunction={()=>HandleOpenModal(searchedMedia.id)} icon={<ModeEditIcon />} disabled={false}/>}
                    itemOwner={user}
                    deleteItem={()=>HandleDeleteMedia(searchedMedia.id)}
                    item={searchedMedia}
                    updateItem={HandleUpdateMedia}
                    thumbnailUrl={`${caddyUrl}/${searchedMedia.hash}/thumbnail.webp`}
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
          !searchedMedia && mediaFiltered && mediaFiltered.length > 0 && (
            <Grid item container spacing={1} flexDirection="column" sx={{marginBottom:"70px"}}>
              {
                mediaFiltered.map((media)=>(
                  <Grid item key={media.id}>
                    <MMUCard
                      metadata={media.metadata}
                      id={media.id}
                      rights={ProjectRights.ADMIN}
                      description={media.description}
                      HandleOpenModal={()=>HandleOpenModal(media.id)}
                      openModal={openModalMediaId === media.id}
                      itemLabel={media.name}
                      DefaultButton={<ModalButton tooltipButton={"Copy media's link"} onClickFunction={media.path ? ()=>HandleCopyToClipBoard(`${caddyUrl}/${media.hash}/${media.path}`) : ()=>HandleCopyToClipBoard(media.url)} disabled={false} icon={<ContentCopyIcon/>}/>}
                      EditorButton={<ModalButton  tooltipButton={"Edit Media"} onClickFunction={()=>HandleOpenModal(media.id)} icon={<ModeEditIcon />} disabled={false}/>}
                      itemOwner={user}
                      deleteItem={()=>HandleDeleteMedia(media.id)}
                      item={media}
                      updateItem={HandleUpdateMedia}
                      thumbnailUrl={`${caddyUrl}/${media.hash}/thumbnail.webp`}
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
          !mediaFiltered && (
            <Grid item container justifyContent="center" alignItems="center">
              <Typography variant="h6" component="h2">There is no media matching your research.</Typography>
            </Grid>
          )
        }
        <Grid>
          <DrawerLinkMedia
            toggleModalMediaCreation={()=>setModalLinkMediaIsOpen(!modalLinkMediaIsOpen)}
            CreateMediaWithLink={createMediaWithLink}
            modalCreateMediaIsOpen={modalLinkMediaIsOpen}
          />
        </Grid>
        <Grid item sx={{position:'fixed', right:'10px', bottom:'3px', zIndex:999}}>
          <SpeedDialTooltipOpen actions={actions}/>
        </Grid>
      </Grid>
    </>
  )
}
