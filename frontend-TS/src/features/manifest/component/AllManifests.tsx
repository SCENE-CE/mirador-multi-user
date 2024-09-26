import { Box, Grid, styled, Typography } from "@mui/material";
import { ChangeEvent, ReactNode, useCallback, useMemo, useState } from "react";
import { ProjectRights, UserGroup } from "../../user-group/types/types.ts";
import { User } from "../../auth/types/types.ts";
import { Manifest, ManifestCreationMedia } from "../types/types.ts";
import { uploadManifest } from "../api/uploadManifest.ts";
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
import { SidePanelMedia } from "../../media/component/SidePanelMedia.tsx";
import { Media } from "../../media/types/types.ts";
import SpeedDialTooltipOpen from "../../../components/elements/SpeedDial.tsx";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddLinkIcon from '@mui/icons-material/AddLink';
import { DrawerLinkManifest } from "./DrawerLinkManifest.tsx";
import { linkManifest } from "../api/linkManifest.ts";
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
  medias:Media[]
}


const caddyUrl = import.meta.env.VITE_CADDY_URL


export const AllManifests= ({userPersonalGroup, user,fetchManifestForUser,manifests,medias}:IAllManifests) => {
  const [searchedManifest, setSearchedManifest] = useState<Manifest|null>(null);
  const [openModalManifestId, setOpenModalManifestId] = useState<number | null>(null);
  const [searchedManifestIndex,setSearchedManifestIndex] = useState<number | null>(null);
  const [createManifestIsOpen, setCreateManifestIsOpen ] = useState(false);
  const [modalLinkManifestIsOpen, setModalLinkManifestSIsOpen] = useState(false)
  const [manifestFiltered, setManifestFiltered] = useState<Manifest[] | undefined>([])

  const handleCreateManifest  = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      await uploadManifest({
        idCreator: user.id,
        user_group: userPersonalGroup!,
        file: event.target.files[0],
      });
      fetchManifestForUser()
      console.log(setCreateManifestIsOpen)
      setCreateManifestIsOpen(false)
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
    { icon: <AddLinkIcon /> as ReactNode, name: 'link' ,onClick:() => setModalLinkManifestSIsOpen(!modalLinkManifestIsOpen)},
    { icon: <CreateIcon /> as ReactNode, name: 'Create',onClick: HandleCreateManifestIsOpen},
    { icon: <UploadFileIcon /> as ReactNode, name: 'Upload' , onClick: () => {
        console.log(document.getElementById("hiddenFileInput"))
        document.getElementById("hiddenFileInput")?.click();
      }},
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
    console.log(partialString)
    const userManifests =  await lookingForManifests(partialString, userPersonalGroup.id)
    return userManifests
  }

  const getOptionLabelForManifestSearchBar = (option:Manifest): string => {
    return option.name;
  };


  const handleSetSearchManifest = (manifestQuery: Manifest) => {
    if (manifestQuery) {
      const manifestIndex = manifests.findIndex((manifest: Manifest) => manifest.id === manifestQuery.id);
      if (manifestIndex !== -1) {
        setSearchedManifest(manifests[manifestIndex]);
        setSearchedManifestIndex(manifestIndex);
      } else {
        setSearchedManifest(null);
        setSearchedManifestIndex(null);
      }
    } else {
      setSearchedManifest(null);
      setSearchedManifestIndex(null);
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

  const handleSubmitManifestCreationForm = async (manifestTitle:string,items:ManifestCreationMedia[]) => {
      console.log('items',items)
    // const manifestToCreate: { ['@Context']:string,id:string,type:string,label:{en:string[]},items: ManifestItem[] } = {
    //   ['@Context']:'https://iiif.io/api/presentation/3/context.json',
    //   id:"",
    //   type:"Manifest",
    //   label:{
    //     en:[manifestTitle]
    //   },
    //   items: [],
    // };
    // const fetchMediaForItem = async (media:MediaItem  ): Promise<void> => {
    //   try {
    //     console.log('ENTER FETCH MEDIA FOR ITEM')
    //     console.log(media.value)
    //     const response = await fetch(media.value, { method: "GET" });
    //
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }
    //     console.log(response.ok)
    //     const mediaBlob = await response.blob();
    //     console.log('mediaBlob',mediaBlob)
    //     const mediaUrl = URL.createObjectURL(mediaBlob);
    //     const contentType = response.headers.get("Content-Type");
    //
    //     if (contentType && contentType.startsWith("image")) {
    //       const img = new Image();
    //       img.src = mediaUrl;
    //       console.log('img',img)
    //       await new Promise<void>((resolve, reject) => {
    //         img.onload = () => {
    //           manifestToCreate.items.push({
    //             id: media.value,
    //             type: "Canvas",
    //             height: img.height,
    //             width: img.width,
    //             label: { en:["image"] },
    //             items:[{
    //               id:media.value+`/annotation/${Date.now}`,
    //               type:"AnnotationPage",
    //               items:[
    //                 {
    //                   id:media.value+`/annotation/${Date.now}`,
    //                   type:"Annotation",
    //                   motivation:"painting",
    //                   target:media.value,
    //                   body:{
    //                     id:media.value,
    //                     type:"Image",
    //                     format:`Image/${response.headers.get("Content-Type")}`,
    //                     height:img.height,
    //                     width:img.width,
    //                   }
    //                 }
    //               ]
    //             }]
    //           });
    //           resolve();
    //         };
    //         img.onerror = reject;
    //       });
    //     } else if (contentType && contentType.startsWith("video")) {
    //       // const video = document.createElement("video");
    //       // video.src = mediaUrl;
    //       //
    //       // await new Promise<void>((resolve, reject) => {
    //       //   video.onloadedmetadata = () => {
    //       //     manifestToCreate.items.push({
    //       //       id: media.value,
    //       //       type: "Canvas",
    //       //       height: video.videoHeight,
    //       //       width: video.videoWidth,
    //       //       duration: video.duration,
    //       //       label:"video"
    //       //     });
    //       //     resolve();
    //       //   };
    //       //   video.onerror = reject;
    //       // });
    //       toast.error('video will be handle in a future release')
    //     } else {
    //       console.log("Unsupported media type:", contentType);
    //     }
    //   } catch (error) {
    //     console.log("Error fetching media:", error);
    //     throw error;
    //   }
    // };
    //
    // const fetchMediaPromises = items.flatMap((item) =>
    //   item.media.map((media) => {
    //     return fetchMediaForItem(media);
    //   })
    // );

    try {
      // await Promise.all(fetchMediaPromises);
      await createManifest({
        manifestMedias : items,
        name: manifestTitle,
        user_group: userPersonalGroup,
        idCreator:user.id
      })
      fetchManifestForUser()
      setCreateManifestIsOpen(false)
    } catch (error) {
      console.error("Error processing media", error);
    }
  };

  const handleFiltered = (partialString:string)=>{
    if(partialString.length < 1){
      return setManifestFiltered([])
    }
    if(partialString.length > 0 ){
      const manifetsFiltered = manifests.filter((manifest) =>manifest.name.startsWith(partialString))
      if(manifetsFiltered.length >= 1){
        setManifestFiltered(manifetsFiltered)
      }else{
        setManifestFiltered(undefined)
      }
    }
  }

  console.log(manifests)

  return (
    <Grid item container flexDirection="column" spacing={1}>
      <Grid item container direction="row-reverse" spacing={2} alignItems="center" sx={{position:'sticky', top:0, zIndex:1000, backgroundColor:'#dcdcdc', paddingBottom:"10px"}}>
        <Grid item container spacing={2}>
          {!createManifestIsOpen &&(
            <Grid item sx={{position:'fixed', right:'10px', bottom:'3px', zIndex:999}}>
              <SpeedDialTooltipOpen actions={actions}/>
            </Grid>
          )}
          <Grid item>
            <VisuallyHiddenInput
              id="hiddenFileInput"
              type="file"
              onChange={handleCreateManifest}
            />
          </Grid>
          {
            !createManifestIsOpen && (
              <Grid item container direction="row" sx={{justifyContent: "flex-end", alignItems: "center", }}>
                <Grid item>
                  <SearchBar
                    fetchFunction={HandleLookingForManifests}
                    getOptionLabel={getOptionLabelForManifestSearchBar}
                    label="Filter manifests"
                    setSearchedData={handleSetSearchManifest}
                    setFilter={setManifestFiltered}
                    handleFiltered={handleFiltered}
                  />
                </Grid>
              </Grid>
            )
          }
        </Grid>
      </Grid>
      {!manifests.length && (
        <Grid
          container
          justifyContent={"center"}
        >
          <Typography variant="h6" component="h2">No manifests yet, start to work when clicking on the + button.</Typography>
        </Grid>
      )}
      {!searchedManifest && !createManifestIsOpen && manifestFiltered && manifestFiltered.length < 1 &&(
        <Grid item container spacing={1} flexDirection="column" sx={{marginBottom:"70px"}}>
          {manifests.map((manifest, index) => (
            <Grid item key={manifest.id}>
              <MMUCard
                DefaultButton={<ModalButton tooltipButton={"Copy manifest's link"} onClickFunction={manifest.hash ? ()=>HandleCopyToClipBoard(`${caddyUrl}/${manifest.hash}/${manifest.path}`) : ()=>HandleCopyToClipBoard(manifest.path)} disabled={false} icon={<ContentCopyIcon/>}/>}
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
      {!searchedManifest && !createManifestIsOpen && manifestFiltered && manifestFiltered.length > 0 &&(
        <Grid item container spacing={1} flexDirection="column" sx={{marginBottom:"70px"}}>
          {manifestFiltered.map((manifest, index) => (
            <Grid item key={manifest.id}>
              <MMUCard
                DefaultButton={<ModalButton tooltipButton={"Copy manifest's link"} onClickFunction={manifest.hash ? ()=>HandleCopyToClipBoard(`${caddyUrl}/${manifest.hash}/${manifest.path}`): ()=>HandleCopyToClipBoard(manifest.path)} disabled={false} icon={<ContentCopyIcon/>}/>}
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
                DefaultButton={<ModalButton tooltipButton={"Copy manifest's link"} onClickFunction={ searchedManifest.hash ? ()=>HandleCopyToClipBoard(`${caddyUrl}/${searchedManifest.hash}/${searchedManifest.path}`) : ()=>HandleCopyToClipBoard(searchedManifest.path)} disabled={false} icon={<ContentCopyIcon/>}/>}
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
        !manifestFiltered && (
          <Grid item container justifyContent="center" alignItems="center">
            <Typography variant="h6" component="h2">There is no manifest matching your research.</Typography>
          </Grid>
        )
      }
      {
        createManifestIsOpen &&(
          <Grid item container spacing={2} flexDirection="column" sx={{marginBottom:"70px", width: '70%'}}>
            <SidePanelMedia medias={medias} userPersonalGroup={userPersonalGroup}>
              <ManifestCreationForm handleSubmit={handleSubmitManifestCreationForm} setCreateManifestIsOpen={HandleCreateManifestIsOpen}/>
            </SidePanelMedia>
          </Grid>
        )
      }
      <Grid>
        <DrawerLinkManifest
          linkingManifest={handleLinkManifest}
          modalCreateManifestIsOpen={modalLinkManifestIsOpen}
          toggleModalManifestCreation={()=>setModalLinkManifestSIsOpen(!modalLinkManifestIsOpen)} />
      </Grid>
      {
        !createManifestIsOpen && (
          <Grid item sx={{ position: 'fixed', bottom: 0, left: 0, width: '100%', backgroundColor: '#fff', zIndex: 998}}>
            <Box sx={{ padding: '40px', textAlign: 'center'}}>
            </Box>
          </Grid>
        )
      }
    </Grid>
  )
}