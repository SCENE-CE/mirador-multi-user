import { Button, Grid, styled } from "@mui/material";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from "@mui/icons-material/Save";
import { createMedia } from "../api/createMedia.ts";
import { User } from "../../auth/types/types.ts";
import { getUserAllProjects } from "../../projects/api/getUserAllProjects.ts";
import { getUserPersonalGroup } from "../../projects/api/getUserPersonalGroup.ts";
import { UserGroup } from "../../user-group/types/types.ts";

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
}

export const AllMedias = ({user}:IAllMediasProps) => {
  const [userPersonalGroup, setUserPersonalGroup] = useState<UserGroup>()


  const fetchUserPersonalGroup = async()=>{
    const personalGroup = await getUserPersonalGroup(user.id)
    setUserPersonalGroup(personalGroup)
  }
  useEffect(() => {
    fetchUserPersonalGroup()
  }, [user]);

  const handleCreateMedia  = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files);
    if (event.target.files) {
      const userGroups = await getUserAllProjects(user.id);
      console.log('idCreator :',user.id)

      createMedia({
        idCreator: user.id,
        user_group: userPersonalGroup!,
        file: event.target.files[0],
      });
      console.log(userGroups);
    }
  },[])

  return(
    <Grid>
      <Grid item>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Upload file
          <VisuallyHiddenInput
            type="file"
            onChange={handleCreateMedia}
          />
        </Button>
        <LoadingButton
          loading
          loadingPosition="start"
          startIcon={<SaveIcon />}
          variant="outlined"
        >
          Save
        </LoadingButton>
      </Grid>
    </Grid>
  )
}
