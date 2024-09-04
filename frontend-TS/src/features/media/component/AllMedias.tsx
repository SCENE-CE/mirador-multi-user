import { Button, Grid, styled } from "@mui/material";
import { ChangeEvent, Dispatch, SetStateAction, useCallback, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { createMedia } from "../api/createMedia.ts";
import { User } from "../../auth/types/types.ts";
import { ProjectRights, UserGroup } from "../../user-group/types/types.ts";
import { Media } from "../types/types.ts";
import toast from "react-hot-toast";
import MMUCard from "../../../components/elements/MMUCard.tsx";

import { ModalButton } from "../../../components/elements/ModalButton.tsx";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { deleteMedia } from "../api/deleteMedia.ts";
import { updateMedia } from "../api/updateMedia.ts";
import { lookingForMedias } from "../api/lookingForMedias.ts";
import { SearchBar } from "../../../components/elements/SearchBar.tsx";

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
    return await lookingForMedias(partialString, userPersonalGroup.id)
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
          <SearchBar fetchFunction={HandleLookingForMedia} getOptionLabel={getOptionLabelForMediaSearchBar} label={"Search Media"} setSearchedData={handleSetSearchMedia}/>
        </Grid>
      </Grid>
      {
        !searchedMedia && (
          <Grid item container spacing={1} flexDirection="column" sx={{marginBottom:"70px"}}>
            {
              medias.map((media)=>(
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
                  />
                </Grid>
            }
          </Grid>
        )
      }
    </Grid>
  )
}
