import { Button, Grid, styled } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { ProjectRights, UserGroup } from "../../user-group/types/types.ts";
import { User } from "../../auth/types/types.ts";
import { Manifest } from "../types/types.ts";
import { createManifest } from "../api/createManifest.ts";
import MMUCard from "../../../components/elements/MMUCard.tsx";
import placeholder from '../../../assets/Placeholder.svg';

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
  const [openModalManifestId, setOpenModalManifestId] = useState<number | null>(null);


  const handleCreateManifest  = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      await createManifest({
        idCreator: user.id,
        user_group: userPersonalGroup!,
        file: event.target.files[0],
      });
      fetchManifestForUser()
    }
  },[fetchManifestForUser, manifests])

  const HandleOpenModal =useCallback ((manifestId: number)=>{
    setOpenModalManifestId(openModalManifestId === manifestId ? null : manifestId);
  },[setOpenModalManifestId, openModalManifestId]);


  const thumbnailUrls = useMemo(() => {
    const thumbailUrls = [];

    for (const manifest of manifests) {

      if (manifest.json) {
        const thumbnailUrl = manifest.json.thumbnail?.['@id'];

        if (thumbnailUrl) {
          thumbailUrls.push(thumbnailUrl);
        } else if (manifest.json.sequences) {
          const canvases = manifest.json.sequences[0].canvases;

          for (const canvas of canvases) {
            const images = canvas.images;

            for (const image of images) {
              if (image.on) {
                thumbailUrls.push(image.on);
              }
            }
          }
        } else {
          thumbailUrls.push(placeholder);
        }
      }
    }
    return thumbailUrls;
  }, [manifests]);


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
          {manifests.map((manifest, index) => (
            <Grid item key={manifest.id}>
              <MMUCard
                id={manifest.id}
                rights={ProjectRights.ADMIN}
                description={manifest.description}
                HandleOpenModal={()=>HandleOpenModal(manifest.id)}
                openModal={openModalManifestId === manifest.id}
                itemLabel={manifest.name}
                itemOwner={user}
                item={manifest}
                imagePath={thumbnailUrls[index]}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Grid>
  )
}