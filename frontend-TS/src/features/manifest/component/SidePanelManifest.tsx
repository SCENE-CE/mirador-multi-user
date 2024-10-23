import { Drawer, IconButton, Box, styled, Button, ImageList, ImageListItem, Grid, Tooltip } from "@mui/material";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Manifest, ManifestGroupRights, manifestOrigin } from "../types/types.ts";
import { SearchBar } from "../../../components/elements/SearchBar.tsx";
import { UserGroup } from "../../user-group/types/types.ts";
import { User } from "../../auth/types/types.ts";
import AddLinkIcon from "@mui/icons-material/AddLink";
import { PaginationControls } from "../../../components/elements/Pagination.tsx";
import { DrawerLinkManifest } from "./DrawerLinkManifest.tsx";
import placeholder from "../../../assets/Placeholder.svg";
import { linkManifest } from "../api/linkManifest.ts";

const CustomImageItem = styled(ImageListItem)({
  position: 'relative',
  "&:hover img": {
    opacity: 0.4,
  },
  "&:hover .overlayButton": {
    opacity: 1,
  }
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
  top: 16,
  right: open ? 415 : 15,
  zIndex: 9999,
  transition: 'right 0.3s ease',
  backgroundColor: '#fff',
}));

const handleCopyToClipBoard = async (path: string) => {
  try {
    await navigator.clipboard.writeText(path);
    toast.success('Path copied to clipboard');
  } catch (error) {
    toast.error('Failed to copy path');
  }
};

interface PopUpManifestProps {
  manifest: Manifest[];
  children: ReactNode;
  userPersonalGroup:UserGroup
  user:User
  fetchManifestForUser:()=>void
  display:boolean
}

const caddyUrl = import.meta.env.VITE_CADDY_URL

export const SidePanelManifest = ({ display,manifest, children,userPersonalGroup, user,fetchManifestForUser}: PopUpManifestProps) => {
  const [open, setOpen] = useState(false);
  const [searchedManifest, setsearchedManifest] = useState<Manifest|null>(null);
  const [modalLinkManifestIsOpen, setModalLinkManifestIsOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [thumbnailUrls, setThumbnailUrls] = useState<string[]>([]);

  const itemsPerPage = 9;

  const currentPageData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return manifest.slice(start, end);
  }, [currentPage, manifest]);

  const totalPages = Math.ceil(manifest.length / itemsPerPage);

  const toggleDrawer = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleSetSearchManifest = (mediaQuery:Manifest)=>{
    if(mediaQuery){
      const  searchedMedia = manifest.find(media => media.id === mediaQuery.id)
      setsearchedManifest(searchedMedia!)
    }else{
      setsearchedManifest(null);
    }
  }

  const HandleLookingForManifest = async (partialString : string) =>{
    console.log("TO DO : Code looking for manifest", partialString)
    return manifest
  }

  const getOptionLabelForManifestSearchBar = (option:Manifest): string => {
    return option.name;
  };

  const handleLinkManifest = useCallback (async (path: string) => {
    console.log('ENTER HANDLE LINK MANIFEST')
    const response = await fetch(path,{
      method:"GET"
    })
    console.log('response',response)
    if(response){
      const manifest = await response.json()
      console.log('Fetched manifest',manifest)
      console.log(manifest.label.en[0])
      const manifestToCreate = await linkManifest({
        url: path,
        rights: ManifestGroupRights.ADMIN,
        idCreator: user.id,
        user_group: userPersonalGroup!,
        path: path,
        name: manifest.label.en
          ? manifest.label.en[0]
          : "new Manifest",
      });
      console.log('manifestToCreate',manifestToCreate)
      fetchManifestForUser()
      setModalLinkManifestIsOpen(!modalLinkManifestIsOpen)
      console.log('OUT OF HANDLE LINK MANIFEST')
      return toast.success('manifest created')
    }
    return toast.error('manifest could not be created')

  },[fetchManifestForUser, modalLinkManifestIsOpen, user.id, userPersonalGroup])

  const fetchThumbnails = useCallback(async () => {
    const urls: string[] = await Promise.all(
      currentPageData.map(async (manifest) => {
        if (manifest.thumbnailUrl) {
          return manifest.thumbnailUrl;
        }

        let manifestUrl = '';
        if (manifest.origin === manifestOrigin.UPLOAD) {
          manifestUrl = `${caddyUrl}/${manifest.hash}/${manifest.name}`;
        } else if (manifest.origin === manifestOrigin.LINK) {
          manifestUrl = manifest.path;
        } else {
          return placeholder;
        }

        try {
          const manifestResponse = await fetch(manifestUrl);
          const manifestFetched = await manifestResponse.json();

          if (manifestFetched.thumbnail?.["@id"]) {
            return manifestFetched.thumbnail["@id"];
          } else {
            return placeholder;
          }
        } catch (error) {
          console.error("Error fetching manifest:", error);
          return placeholder;
        }
      })
    );
    console.log('urls',urls)
    setThumbnailUrls(urls);
  }, [currentPageData, caddyUrl]);

  useEffect(() => {
    fetchThumbnails();
  }, [fetchThumbnails]);

  return (
    <div>
      {display && (
        <ToggleButton
          open={open} onClick={toggleDrawer}>
          {open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
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
              <SearchBar fetchFunction={HandleLookingForManifest} getOptionLabel={getOptionLabelForManifestSearchBar} label={"Search Manifest"} setSearchedData={handleSetSearchManifest}/>
            </Grid>
            <Grid item>
              <Tooltip title="Link Manifest">
                <Button variant="contained" onClick={()=>setModalLinkManifestIsOpen(!modalLinkManifestIsOpen)}>
                  <AddLinkIcon />
                </Button>
              </Tooltip>
            </Grid>
          </Grid>
          {
            searchedManifest ?(
              <ImageList sx={{ minWidth: 400, height: 450, padding: 1, width:400 }} cols={3} rowHeight={164}>

                <ImageList sx={{ minWidth: 400, height: 450, padding: 1, width: 400 }} cols={3} rowHeight={164}>
                  <CustomImageItem key={searchedManifest.thumbnailUrl}>
                    <Box
                      component="img"
                      src={''}
                      alt={searchedManifest.name}
                      loading="lazy"
                      sx={{
                        width: 150,
                        height: 150,
                        objectFit: 'cover',
                        '@media(min-resolution: 200px)': {
                          width: 150 * 2,
                          height: 150 * 2,
                        },
                      }}
                    />
                    <CustomButton
                      className="overlayButton"
                      disableRipple
                      onClick={
                        searchedManifest.path ? () => handleCopyToClipBoard(
                            `${caddyUrl}/${searchedManifest.hash}/${searchedManifest.path}`) :
                          () => handleCopyToClipBoard(`${searchedManifest.path}`) }
                    >
                      Copy URL to clipboard
                    </CustomButton>
                  </CustomImageItem>
                </ImageList>
              </ImageList>

            ):(
              <ImageList sx={{ minWidth: 400, padding: 1, width:400 }} cols={2} rowHeight={164}>
                {currentPageData.map((manifest, index) => (
                  <CustomImageItem key={manifest.hash}>
                    <Box
                      component="img"
                      src={thumbnailUrls[index]}
                      alt={manifest.name}
                      loading="lazy"
                      sx={{
                        width: 150,
                        height: 150,
                        objectFit: 'cover', // Ensures cropping behavior
                        '@media(min-resolution: 200px)': {
                          width: 150 * 2,
                          height: 150 * 2,
                        },
                      }}
                    />
                    <CustomButton
                      className="overlayButton"
                      disableRipple
                      onClick={manifest.path ? () => handleCopyToClipBoard(`${caddyUrl}/${manifest.hash}/${manifest.path}`) :() => handleCopyToClipBoard(`${manifest.path}`) }
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
        <DrawerLinkManifest
          modalCreateManifestIsOpen={modalLinkManifestIsOpen}
          toggleModalManifestCreation={()=>setModalLinkManifestIsOpen(!modalLinkManifestIsOpen)}
          linkingManifest={handleLinkManifest}
        />
      </Grid>
    </div>
  );
};
