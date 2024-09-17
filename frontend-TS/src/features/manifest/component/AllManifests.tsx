import { Grid, styled } from "@mui/material";
import { ChangeEvent, ReactNode, useCallback, useMemo, useState } from "react";
import { ProjectRights, UserGroup } from "../../user-group/types/types.ts";
import { User } from "../../auth/types/types.ts";
import { Manifest } from "../types/types.ts";
import { createManifest } from "../api/createManifest.ts";
import MMUCard from "../../../components/elements/MMUCard.tsx";
import placeholder from '../../../assets/Placeholder.svg';
import { SearchBar } from "../../../components/elements/SearchBar.tsx";
import { lookingForManifests } from "../api/loonkingForManifests.ts";
import { ModalButton } from "../../../components/elements/ModalButton.tsx";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import toast from "react-hot-toast";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import CreateIcon from '@mui/icons-material/Create';
import { ManifestCreationForm } from "./ManifestCreationForm.tsx";
import { PopUpMedia } from "../../media/component/PopUpMedia.tsx";
import { Media } from "../../media/types/types.ts";
import SpeedDialTooltipOpen from "../../../components/elements/SpeedDial.tsx";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddLinkIcon from '@mui/icons-material/AddLink';
import { DrawerLinkManifest } from "./DrawerLinkManifest.tsx";
import { linkManifest } from "../api/linkManifest.ts";
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
  medias:Media[]
}

export const AllManifests= ({userPersonalGroup, user,fetchManifestForUser,manifests,medias}:IAllManifests) => {
  const [searchedManifest, setSearchedManifest] = useState<Manifest|null>(null);
  const [openModalManifestId, setOpenModalManifestId] = useState<number | null>(null);
  const [searchedManifestIndex,setSearchedManifestIndex] = useState<number | null>(null);
  const [createManifestIsOpen, setCreateManifestIsOpen ] = useState(false);
  const [modalLinkManifestIsOpen, setModalLinkManifestSIsOpen] = useState(false)

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

  const HandleCreateManifestIsOpen = ()=>{
    console.log("toto")
    setCreateManifestIsOpen(!createManifestIsOpen)
  }

  const actions = [
    { icon: <CreateIcon /> as ReactNode, name: 'Create',onClick: HandleCreateManifestIsOpen},
    { icon: <UploadFileIcon /> as ReactNode, name: 'Upload' , onClick: () => {
        console.log(document.getElementById("hiddenFileInput"))
        document.getElementById("hiddenFileInput")?.click();
      }},
    { icon: <AddLinkIcon /> as ReactNode, name: 'link' ,onClick:() => setModalLinkManifestSIsOpen(!modalLinkManifestIsOpen)},
  ];

  const thumbnailUrls = useMemo(() => {
    const thumbailUrls = [];

    for (const manifest of manifests) {

      if (manifest.json) {
        const thumbnailUrl = manifest.json.thumbnail?.['@id'];

        if (thumbnailUrl) {
          thumbailUrls.push(thumbnailUrl);
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

  const HandleCopyToClipBoard = async (path: string) => {
    await navigator.clipboard.writeText(path);
    toast.success('path copied to clipboard');
  }

  const handleLinkManifest = useCallback (async (path: string) => {
    const response = await fetch(path,{
      method:"GET"
    })

    if(response){
      const manifest = await response.json()
      await linkManifest({
        idCreator: user.id,
        user_group: userPersonalGroup!,
        path: path,
        name: manifest.label && manifest.label.type == 'string' ? manifest.label : "new Manifest",
      });
    fetchManifestForUser()
    setModalLinkManifestSIsOpen(!modalLinkManifestIsOpen)
      return toast.success('manifest created')
    }
    return toast.error('manifest could not be created')

  },[fetchManifestForUser, modalLinkManifestIsOpen, user.id, userPersonalGroup])

  return (
    <Grid item container flexDirection="column" spacing={1}>
      <Grid item container spacing={2} alignItems="center" justifyContent="space-between">
        <Grid item container spacing={2}>
          <Grid item sx={{position:'absolute', right:'10px', bottom:'10px'}}>
            <SpeedDialTooltipOpen actions={actions}/>
          </Grid>
          <Grid item>
            <VisuallyHiddenInput
              id="hiddenFileInput"
              type="file"
              onChange={handleCreateManifest}
            />
          </Grid>
          {
            !createManifestIsOpen &&(
              <Grid item>
                <SearchBar fetchFunction={HandleLookingForManifests} getOptionLabel={getOptionLabelForManifestSearchBar} label={"Search Manifest"} setSearchedData={handleSetSearchManifest}/>
              </Grid>
            )
          }
        </Grid>
      </Grid>
      {!searchedManifest && !createManifestIsOpen &&(
        <Grid item container spacing={1} flexDirection="column" sx={{marginBottom:"70px"}}>
          {manifests.map((manifest, index) => (
            <Grid item key={manifest.id}>
              <MMUCard
                DefaultButton={<ModalButton tooltipButton={"Copy manifest's link"} onClickFunction={()=>HandleCopyToClipBoard(manifest.path)} disabled={false} icon={<ContentCopyIcon/>}/>}
                id={manifest.id}
                rights={ProjectRights.ADMIN}
                description={manifest.description}
                HandleOpenModal={()=>HandleOpenModal(manifest.id)}
                openModal={openModalManifestId === manifest.id}
                itemLabel={manifest.name}
                itemOwner={user}
                item={manifest}
                imagePath={thumbnailUrls[index]}
                manifest={true}
                EditorButton={<ModalButton  tooltipButton={"Edit Media"} onClickFunction={()=>HandleOpenModal(manifest.id)} icon={<ModeEditIcon />} disabled={false}/>}
              />
            </Grid>
          ))}
        </Grid>
      )}
      {
        searchedManifest && !createManifestIsOpen &&(
          <Grid item container spacing={1} flexDirection="column" sx={{marginBottom:"70px"}}>
            <Grid item key={searchedManifest.id}>
              <MMUCard
                DefaultButton={<ModalButton tooltipButton={"Copy manifest's link"} onClickFunction={()=>HandleCopyToClipBoard(searchedManifest.path)} disabled={false} icon={<ContentCopyIcon/>}/>}
                id={searchedManifest.id}
                rights={ProjectRights.ADMIN}
                description={searchedManifest.description}
                HandleOpenModal={()=>HandleOpenModal(searchedManifest.id)}
                openModal={openModalManifestId === searchedManifest.id}
                itemLabel={searchedManifest.name}
                itemOwner={user}
                item={searchedManifest}
                imagePath={searchedManifestIndex ? thumbnailUrls[searchedManifestIndex] : placeholder}
                manifest={true}
              />
            </Grid>
          </Grid>

        )
      }
      {
        createManifestIsOpen &&(
          <Grid item container spacing={2} flexDirection="column" sx={{marginBottom:"70px"}}>
            <Grid item container>
              <PopUpMedia medias={medias}>
                <ManifestCreationForm/>
              </PopUpMedia>
            </Grid>
          </Grid>
        )
      }
      <Grid>
        <DrawerLinkManifest linkingManifest={handleLinkManifest} modalCreateManifestIsOpen={modalLinkManifestIsOpen} toggleModalManifestCreation={()=>setModalLinkManifestSIsOpen(!modalLinkManifestIsOpen)} />
      </Grid>
    </Grid>
  )
}