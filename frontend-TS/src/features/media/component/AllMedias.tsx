import { Button, Grid, styled } from "@mui/material";
import { ChangeEvent, useCallback, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { createMedia } from "../api/createMedia.ts";
import { User } from "../../auth/types/types.ts";
import { LinkUserGroup, ProjectRights, UserGroup } from "../../user-group/types/types.ts";
import { Media } from "../types/types.ts";
import toast from "react-hot-toast";
import MMUCard from "../../../components/elements/MMUCard.tsx";
import { addProjectToGroup } from "../../user-group/api/addProjectToGroup.ts";
import { lookingForUserGroups } from "../../user-group/api/lookingForUserGroups.ts";
import { getAccessToGroup } from "../../user-group/api/getAccessToGroup.ts";
import { removeProjectToGroup } from "../../user-group/api/removeProjectToGroup.ts";
import { ProjectGroup } from "../../projects/types/types.ts";
import { ModalButton } from "../../../components/elements/ModalButton.tsx";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ModeEditIcon from "@mui/icons-material/ModeEdit";

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
}

export const AllMedias = ({user,userPersonalGroup,medias,fetchMediaForUser}:IAllMediasProps) => {
  const [openModalMediaId, setOpenModalMediaId] = useState<number | null>(null);
  const [userToAdd, setUserToAdd ] = useState<LinkUserGroup | null>(null)
  const [userGroupsSearch, setUserGroupSearch] = useState<LinkUserGroup[]>([])
  const [groupList, setGroupList] = useState<ProjectGroup[]>([]);


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

  const handleCopyToClipBoard = async (path: string) => {
    await navigator.clipboard.writeText(path);
    toast.success('path copied to clipboard');
  }

  const HandleOpenModal =useCallback ((mediaId: number)=>{
    setOpenModalMediaId(openModalMediaId === mediaId ? null : mediaId);
  },[setOpenModalMediaId, openModalMediaId]);

  const getOptionLabel = (option: UserGroup): string => {
    return option.name
  };
  //TODO PLACEHOLDER FUNCTION TO REMOVE
  const handleAddUser = async ( mediaId: number) => {
    console.log('userToAdd',userToAdd)
    const linkUserGroupToAdd = userGroupsSearch.find((linkUserGroup)=> linkUserGroup.user_group.id === userToAdd!.id)
    console.log('linkUserGroupToAdd',linkUserGroupToAdd)
    await addProjectToGroup({ projectsId: [mediaId], groupId:linkUserGroupToAdd!.user_group.id });
  };

  const handleLookingForUserGroups = async (partialString: string) => {
    const linkUserGroups : LinkUserGroup[] = await lookingForUserGroups(partialString);
    console.log('linkUserGroups', linkUserGroups)
    const uniqueUserGroups : UserGroup[] = linkUserGroups.map((linkUserGroup) => linkUserGroup.user_group)
      .filter(
        (group, index, self) =>
          index === self.findIndex((g) => g.id === group.id),
      );
    setUserGroupSearch(linkUserGroups);
    return uniqueUserGroups
  }

  const handleRemoveUser = async ( projectId: number, userToRemoveId: number) =>{
    await removeProjectToGroup({ groupId: userToRemoveId, projectId:projectId })
  }
  console.log('medias',medias)

  return(
    <Grid item container flexDirection="column" spacing={1}>
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
      <Grid item container spacing={1} flexDirection="column" sx={{marginBottom:"70px"}}>
        {
          medias.map((media)=>(
            <Grid item>
              <MMUCard
                id={media.id}
                rights={ProjectRights.ADMIN}
                description={media.description}
                HandleOpenModal={()=>HandleOpenModal(media.id)}
                openModal={openModalMediaId === media.id}
                itemLabel={media.name}
                DefaultButton={<ModalButton tooltipButton={"Copy link to media"} onClickFunction={()=>handleCopyToClipBoard(media.path)} disabled={false} icon={<ContentCopyIcon/>}/>}
                EditorButton={<ModalButton  tooltipButton={"Edit Media"} onClickFunction={()=>HandleOpenModal(media.id)} icon={<ModeEditIcon />} disabled={false}/>}
                handleSelectorChange={()=> console.log('HANDLE SELECTOR CHANGE')}
                listOfItem={['toto','tata']}
                itemOwner={user}
                deleteItem={()=>console.log('DELETE ITEM')}
                getOptionLabel={getOptionLabel}
                AddAccessListItemFunction={handleAddUser}
                item={media}
                searchModalEditItem={handleLookingForUserGroups}
                setItemToAdd={setUserToAdd}
                updateItem={()=>console.log('UPDATE MEDIA')}
                getAccessToItem={(id)=>getAccessToGroup(id,media.id)}
                removeAccessListItemFunction={handleRemoveUser}
                setItemList={setGroupList}
                searchBarLabel={"SEARCH BAR LABEL"}
                imagePath={media.path}
              />
            </Grid>
          ))
        }
      </Grid>
    </Grid>
  )
}
