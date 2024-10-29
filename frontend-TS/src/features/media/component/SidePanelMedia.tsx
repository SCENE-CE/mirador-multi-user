import { Drawer, IconButton, Box, styled, Button, ImageList, ImageListItem, Grid, Tooltip } from "@mui/material";
import { ChangeEvent, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Media } from "../types/types.ts";
import { SearchBar } from "../../../components/elements/SearchBar.tsx";
import { lookingForMedias } from "../api/lookingForMedias.ts";
import { UserGroup } from "../../user-group/types/types.ts";
import { createMedia } from "../api/createMedia.ts";
import { User } from "../../auth/types/types.ts";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AddLinkIcon from "@mui/icons-material/AddLink";
import { DrawerLinkMedia } from "./DrawerLinkMedia.tsx";
import { createMediaLink } from "../api/createMediaWithLink.ts";
import { PaginationControls } from "../../../components/elements/Pagination.tsx";
import { CloseButton } from "../../../components/elements/SideBar/CloseButton.tsx";
import { OpenButton } from "../../../components/elements/SideBar/OpenButton.tsx";
import { getTagsForObject } from "../../tag/api/getTagsForObject.ts";

const CustomImageItem = styled(ImageListItem)({
  position: 'relative',
  "&:hover img": {
    opacity: 0.4,
  },
  "&:hover .overlayButton": {
    opacity: 1,
  }
});

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

const CustomButton = styled(Button)({
  position: 'absolute',
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  textAlign: "center",
  opacity: 0,
  transition: 'opacity 0.3s ease',
});

const ToggleButton = styled(IconButton)(({ open }: { open: boolean }) => ({
  position: 'fixed',
  top: 80,
  right: open ? 450 : -50,
  zIndex: 9999,
  transition: 'right 0.3s ease',
  '&:hover': {
    backgroundColor: 'transparent',
  },
}));

const handleCopyToClipBoard = async (path: string) => {
  try {
    await navigator.clipboard.writeText(path);
    toast.success('Path copied to clipboard');
  } catch (error) {
    toast.error('Failed to copy path');
  }
};

interface PopUpMediaProps {
  medias: Media[];
  children: ReactNode;
  userPersonalGroup:UserGroup
  user:User
  fetchMediaForUser:()=>void
  display:boolean
}

const caddyUrl = import.meta.env.VITE_CADDY_URL

export const SidePanelMedia = ({ display,medias, children,userPersonalGroup, user,fetchMediaForUser}: PopUpMediaProps) => {
  const [open, setOpen] = useState(false);
  const [searchedMedia, setSearchedMedia] = useState<Media|null>(null);
  const [modalLinkMediaIsOpen, setModalLinkMediaIsOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [mediasTags, setMediasTags] = useState([]);

  const itemsPerPage = 9;

  useEffect(() => {
    const fetchTags = async () => {
      const allTags = await Promise.all(medias.map((media) => getTagsForObject(media.id)));

      // Extract titles and flatten the array
      const tagTitles = allTags
        .flat()
        .map(tag => tag.title);

      // Remove duplicates by converting to a Set and back to an array
      const uniqueTitles = [...new Set(tagTitles)];

      setMediasTags(uniqueTitles);
    };

    fetchTags();
  }, [medias]);

  const currentPageData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return medias.slice(start, end);
  }, [currentPage, medias]);

  const totalPages = Math.ceil(medias.length / itemsPerPage);

  const toggleDrawer = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleCreateMedia  = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files);
    if (event.target.files) {
      console.log(userPersonalGroup)
      const mediaCreation= await createMedia({
        idCreator: user.id,
        user_group: userPersonalGroup!,
        file: event.target.files[0],
      });
      console.log('mediaCreation',mediaCreation)
      fetchMediaForUser()
    }
  },[fetchMediaForUser, user.id, userPersonalGroup,medias])

  const handleSetSearchMedia = (mediaQuery:Media)=>{
    if(mediaQuery){
      const  searchedMedia = medias.find(media => media.id === mediaQuery.id)
      setSearchedMedia(searchedMedia!)
    }else{
      setSearchedMedia(null);
    }
  }

  const handleButtonClick = () => {
    document.getElementById('file-upload')!.click();
  };

  const HandleLookingForMedia = async (partialString : string) =>{
    return await lookingForMedias(partialString, userPersonalGroup.id)
  }

  const getOptionLabelForMediaSearchBar = (option:Media): string => {
    return option.title;
  };

  const createMediaWithLink = async (link: string) => {
    try {
      await createMediaLink({imageUrl:link, idCreator:user.id, user_group: userPersonalGroup})
      fetchMediaForUser()
    } catch (error) {
      console.error('Error fetching the image:', error);
    }
  };

console.log(mediasTags)
  return (
    <div>
      {display && (
        <ToggleButton
          open={open} onClick={toggleDrawer}>
          {open ? <CloseButton text="Medias"/> : <OpenButton text="Medias"/>}
        </ToggleButton>
      )

      }
      {display && (

        <Drawer
          open={open}
          anchor="right"
          variant="persistent"
          sx={{  position: 'relative', zIndex:9998}}
          ModalProps={{
            BackdropProps: {
              style: { backgroundColor: 'transparent'},
            },
          }}>
          <Grid item container spacing={1} sx={{padding:'10px'}} alignItems="center">
            <Grid item>
              <SearchBar fetchFunction={HandleLookingForMedia} getOptionLabel={getOptionLabelForMediaSearchBar} label={"Search Media"} setSearchedData={handleSetSearchMedia}/>
            </Grid>
            <Grid item>
              <VisuallyHiddenInput
                id="file-upload"
                type="file"
                onChange={handleCreateMedia}
              />
              <Tooltip title="Upload Media">
                <Button onClick={handleButtonClick} variant="contained"> <UploadFileIcon/></Button>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Link Media">
                <Button variant="contained" onClick={()=>setModalLinkMediaIsOpen(!modalLinkMediaIsOpen)}>
                  <AddLinkIcon />
                </Button>
              </Tooltip>
            </Grid>
          </Grid>
          {
            searchedMedia ?(
              <ImageList sx={{ minWidth: 500, height: 450, padding: 1, width:500 }} cols={3} rowHeight={164}>

                <ImageList sx={{ minWidth: 500, height: 450, padding: 1, width: 500 }} cols={3} rowHeight={164}>
                  <CustomImageItem key={searchedMedia.path}>
                    <Box
                      component="img"
                      src={`${caddyUrl}/${searchedMedia.hash}/thumbnail.webp`}
                      alt={searchedMedia.title}
                      loading="lazy"
                      sx={{
                        width: 150,
                        height: 150,
                        objectFit: 'cover', // Ensures cropping behavior
                        '@media(min-resolution: 2dppx)': {
                          width: 150 * 2,
                          height: 150 * 2,
                        },
                      }}
                    />
                    <CustomButton
                      className="overlayButton"
                      disableRipple
                      onClick={searchedMedia.path ? () => handleCopyToClipBoard(`${caddyUrl}/${searchedMedia.hash}/${searchedMedia.path}`) :() => handleCopyToClipBoard(`${searchedMedia.url}`) }
                    >
                      Copy URL to clipboard
                    </CustomButton>
                  </CustomImageItem>
                </ImageList>
              </ImageList>

            ):(
              <ImageList sx={{ minWidth: 500, padding: 1, width:500 }} cols={3} rowHeight={164}>
                {currentPageData.map((media) => (
                  <CustomImageItem key={media.hash}>
                    <Box
                      component="img"
                      src={`${caddyUrl}/${media.hash}/thumbnail.webp`}
                      alt={media.title}
                      loading="lazy"
                      sx={{
                        width: 150,
                        height: 150,
                        objectFit: 'cover', // Ensures cropping behavior
                        '@media(min-resolution: 2dppx)': {
                          width: 150 * 2,
                          height: 150 * 2,
                        },
                      }}
                    />
                    <CustomButton
                      className="overlayButton"
                      disableRipple
                      onClick={media.path ? () => handleCopyToClipBoard(`${caddyUrl}/${media.hash}/${media.path}`) :() => handleCopyToClipBoard(`${media.url}`) }
                    >
                      Copy path to clipboard
                    </CustomButton>
                  </CustomImageItem>
                ))}
              </ImageList>
            )
          }
          <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}/>
        </Drawer>
      )
      }
      <Box sx={{ padding: 2 }}>
        {children}
      </Box>
      <Grid>
        <DrawerLinkMedia
          toggleModalMediaCreation={()=>setModalLinkMediaIsOpen(!modalLinkMediaIsOpen)}
          CreateMediaWithLink={createMediaWithLink}
          modalCreateMediaIsOpen={modalLinkMediaIsOpen}
        />
      </Grid>
    </div>
  );
};
