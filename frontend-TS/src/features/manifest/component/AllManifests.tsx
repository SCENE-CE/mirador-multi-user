import { Button, Grid, styled } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { ChangeEvent, useCallback, useState } from "react";
import { UserGroup } from "../../user-group/types/types.ts";
import { User } from "../../auth/types/types.ts";
import { Manifest } from "../types/types.ts";
import { createManifest } from "../api/createManifest.ts";

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

interface IAllManifests{
  userPersonalGroup:UserGroup
  user:User
  fetchManifestForUser:()=>void
  manifests:Manifest[]
}
export const AllManifests= ({userPersonalGroup, user,fetchManifestForUser,manifests}:IAllManifests) => {
  const [searchedManifest, setSearchedManifest] = useState<Manifest|null>(null);


  const handleCreateManifest  = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files);
    if (event.target.files) {
      console.log(userPersonalGroup)
      await createManifest({
        idCreator: user.id,
        user_group: userPersonalGroup!,
        file: event.target.files[0],
      });
      fetchManifestForUser()
    }
  },[fetchManifestForUser, manifests])

  return (
    <Grid item container flexDirection="column" spacing={1}>
      <Grid item container spacing={2} alignItems="center" justifyContent="space-between">
        <Grid item container spacing={2}>
          <Grid item>
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
            >
              Upload Manifest
              <VisuallyHiddenInput
                type="file"
                onChange={handleCreateManifest}
              />
            </Button>
          </Grid>
          <Grid item>
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
            >
              Create Manifest
            </Button>
          </Grid>
        </Grid>
      </Grid>
      {!searchedManifest &&(
        <Grid item container spacing={1} flexDirection="column" sx={{marginBottom:"70px"}}>
          {manifests.map((manifest) => (
            <Grid item key={manifest.id}>
              <p>{manifest.name}</p>
            </Grid>
          ))}
        </Grid>
        )}
    </Grid>
  )
}