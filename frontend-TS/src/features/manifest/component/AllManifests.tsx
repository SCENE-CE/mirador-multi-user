import { Button, Grid, styled } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { ProjectRights, UserGroup } from "../../user-group/types/types.ts";
import { User } from "../../auth/types/types.ts";
import { Manifest } from "../types/types.ts";
import { createManifest } from "../api/createManifest.ts";
import MMUCard from "../../../components/elements/MMUCard.tsx";
import placeholder from '../../../assets/Placeholder.svg';
import { SearchBar } from "../../../components/elements/SearchBar.tsx";
import { lookingForManifests } from "../api/loonkingForManifests.ts";

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
  const [searchedManifestIndex,setSearchedManifestIndex] = useState<number | null>(null);

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

  const HandleLookingForManifests = async (partialString : string) =>{
    return await lookingForManifests(partialString, userPersonalGroup.id)
  }

  const getOptionLabelForManifestSearchBar = (option:Manifest): string => {
    return option.name;
  };


  const handleSetSearchManifest = (manifestQuery: Manifest) => {
    if (manifestQuery) {
      const manifestIndex = manifests.findIndex((manifest: Manifest) => manifest.id === manifestQuery.id);
      if (manifestIndex !== -1) {
        setSearchedManifest(manifests[manifestIndex]); // Set the searched manifest
        setSearchedManifestIndex(manifestIndex); // Set the index
      } else {
        setSearchedManifest(null); // Clear if not found
        setSearchedManifestIndex(null); // Clear index if not found
      }
    } else {
      setSearchedManifest(null); // Clear if no query
      setSearchedManifestIndex(null); // Clear index if no query
    }
  };

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
          <Grid item>
              <SearchBar fetchFunction={HandleLookingForManifests} getOptionLabel={getOptionLabelForManifestSearchBar} label={"Search Manifest"} setSearchedData={handleSetSearchManifest}/>
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
      {
        searchedManifest &&(
          <Grid item container spacing={1} flexDirection="column" sx={{marginBottom:"70px"}}>
            <Grid item key={searchedManifest.id}>
              <MMUCard
                id={searchedManifest.id}
                rights={ProjectRights.ADMIN}
                description={searchedManifest.description}
                HandleOpenModal={()=>HandleOpenModal(searchedManifest.id)}
                openModal={openModalManifestId === searchedManifest.id}
                itemLabel={searchedManifest.name}
                itemOwner={user}
                item={searchedManifest}
                imagePath={searchedManifestIndex ? thumbnailUrls[searchedManifestIndex] : placeholder}
              />
            </Grid>
          </Grid>

          )
      }
    </Grid>
  )
}