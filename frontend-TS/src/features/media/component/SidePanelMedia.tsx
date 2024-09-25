import { Drawer, IconButton, Box, styled, Button, ImageList, ImageListItem, Grid } from "@mui/material";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { ReactNode, useState } from "react";
import toast from "react-hot-toast";
import { Media } from "../types/types.ts";
import { SearchBar } from "../../../components/elements/SearchBar.tsx";
import { lookingForMedias } from "../api/lookingForMedias.ts";
import { UserGroup } from "../../user-group/types/types.ts";

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
  right: open ? 515 : 15,
  zIndex: 1300,
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

interface PopUpMediaProps {
  medias: Media[];
  children: ReactNode;
  userPersonalGroup:UserGroup
}

export const SidePanelMedia = ({ medias, children,userPersonalGroup }: PopUpMediaProps) => {
  const [open, setOpen] = useState(true);
  const [searchedMedia, setSearchedMedia] = useState<Media|null>(null);

  const toggleDrawer = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleSetSearchMedia = (mediaQuery:Media)=>{
    if(mediaQuery){
      const  searchedMedia = medias.find(media => media.id === mediaQuery.id)
      setSearchedMedia(searchedMedia!)
    }else{
      setSearchedMedia(null);
    }
  }

  const HandleLookingForMedia = async (partialString : string) =>{
    return await lookingForMedias(partialString, userPersonalGroup.id)
  }

  const getOptionLabelForMediaSearchBar = (option:Media): string => {
    return option.name;
  };
  return (
    <div>
      <ToggleButton open={open} onClick={toggleDrawer}>
        {open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </ToggleButton>
      <Drawer
        open={open}
        anchor="right"
        variant="persistent"
        ModalProps={{
          BackdropProps: {
            style: { backgroundColor: 'transparent' },
          },
        }}>
        <Grid item>
          <SearchBar fetchFunction={HandleLookingForMedia} getOptionLabel={getOptionLabelForMediaSearchBar} label={"Search Media"} setSearchedData={handleSetSearchMedia}/>
        </Grid>
        {
          searchedMedia ?(
            <ImageList sx={{ minWidth: 500, height: 450, padding: 1, width:500 }} cols={3} rowHeight={164}>

              <ImageList sx={{ minWidth: 500, height: 450, padding: 1, width: 500 }} cols={3} rowHeight={164}>
                <CustomImageItem key={searchedMedia.path}>
                  <Box
                    component="img"
                    src={`${searchedMedia.path}_thumbnail.webp`}
                    alt={searchedMedia.name}
                    loading="lazy"
                    sx={{
                      width: 164,
                      height: 164,
                      objectFit: 'cover', // Ensures cropping behavior
                      '@media(min-resolution: 2dppx)': {
                        width: 164 * 2,
                        height: 164 * 2,
                      },
                    }}
                  />
                  <CustomButton
                    className="overlayButton"
                    disableRipple
                    onClick={() => handleCopyToClipBoard(searchedMedia.path)}
                  >
                    Copy path to clipboard
                  </CustomButton>
                </CustomImageItem>
              </ImageList>
            </ImageList>

          ):(
            <ImageList sx={{ minWidth: 500, padding: 1, width:500 }} cols={3} rowHeight={164}>
              {medias.map((media) => (
                <CustomImageItem key={media.path}>
                  <Box
                    component="img"
                    src={`${media.path}_thumbnail.webp`}
                    alt={media.name}
                    loading="lazy"
                    sx={{
                      width: 164,
                      height: 164,
                      objectFit: 'cover', // Ensures cropping behavior
                      '@media(min-resolution: 2dppx)': {
                        width: 164 * 2,
                        height: 164 * 2,
                      },
                    }}
                  />
                  <CustomButton
                    className="overlayButton"
                    disableRipple
                    onClick={() => handleCopyToClipBoard(media.path)}
                  >
                    Copy path to clipboard
                  </CustomButton>
                </CustomImageItem>
              ))}
            </ImageList>
          )
        }

      </Drawer>
      <Box sx={{ padding: 2 }}>
        {children}
      </Box>
    </div>
  );
};
