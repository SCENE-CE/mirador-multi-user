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

  const handleDeleteMedia = useCallback(
    async (mediaId: number) => {
      await deleteMedia(mediaId);
      const updatedListOfMedias = medias.filter(function(media) {
        return media.id != mediaId;
      });
      setMedias(updatedListOfMedias);
    },[medias, setMedias]
  )

  const handleUpdateMedia = useCallback(async(mediaToUpdate:Media)=>{
    await updateMedia(mediaToUpdate)
    const updatedListOfMedias = medias.filter(function(media) {
      return media.id != mediaToUpdate.id;
    });
    updatedListOfMedias.push(mediaToUpdate);
    setMedias(updatedListOfMedias);
  },[medias, setMedias])

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
                DefaultButton={<ModalButton tooltipButton={"Copy media's link"} onClickFunction={()=>handleCopyToClipBoard(media.path)} disabled={false} icon={<ContentCopyIcon/>}/>}
                EditorButton={<ModalButton  tooltipButton={"Edit Media"} onClickFunction={()=>HandleOpenModal(media.id)} icon={<ModeEditIcon />} disabled={false}/>}
                itemOwner={user}
                deleteItem={()=>handleDeleteMedia(media.id)}
                item={media}
                updateItem={handleUpdateMedia}
                imagePath={media.path}
              />
            </Grid>
          ))
        }
      </Grid>
    </Grid>
  )
}
