import { Button, Grid, ImageList, ImageListItem, styled, Typography } from "@mui/material";
import { ChangeEvent, useCallback } from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { createMedia } from "../api/createMedia.ts";
import { User } from "../../auth/types/types.ts";
import { UserGroup } from "../../user-group/types/types.ts";
import { Media } from "../types/types.ts";
import toast from "react-hot-toast";

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

const CustomImageItem = styled(ImageListItem)({
  position: 'relative',
  "&:hover img": {
    opacity: 0.4,
  },
  "&:hover .text": {
    opacity: 1,
  }
});

const CustomButton = styled(Button)({
  position: 'absolute',
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  textAlign: "center",
})

const CustomText = styled(Typography)({
  color: "black",
  fontSize: "20px",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  textAlign: "center",
  opacity: 0,
  transition: 'opacity 0.3s ease',
});

interface IAllMediasProps{
  user:User
  userPersonalGroup:UserGroup
  medias:Media[]
  fetchMediaForUser:()=>void
}

export const AllMedias = ({user,userPersonalGroup,medias,fetchMediaForUser}:IAllMediasProps) => {


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

  console.log('medias',medias)
  return(
    <Grid item container flexDirection="column">
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
          <ImageList cols={5}>
            {(medias ?? []).map((media) => (
              <CustomImageItem key={media.path}>
                <img
                  srcSet={`${media.path}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                  src={`${media.path}?w=164&h=164&fit=crop&auto=format`}
                  alt="media-img"
                  loading="lazy"
                />
                <CustomButton disableRipple onClick={() => handleCopyToClipBoard(media.path)}>
                  <CustomText>Copy path to clipboard</CustomText>
                </CustomButton>
              </CustomImageItem>
            ))}
          </ImageList>
        </Grid>
    </Grid>
  )
}
