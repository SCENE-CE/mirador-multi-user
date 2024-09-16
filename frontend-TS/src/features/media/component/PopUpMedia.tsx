import { Drawer, IconButton, Box, styled, Button, ImageList, ImageListItem } from "@mui/material";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { ReactNode, useState } from "react";
import toast from "react-hot-toast";
import { Media } from "../types/types.ts";

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
}

export const PopUpMedia = ({ medias, children }: PopUpMediaProps) => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen((prevOpen) => !prevOpen);
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
        <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
          {medias.map((media) => (
            <CustomImageItem key={media.path}>
              <img
                srcSet={`${media.path}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                src={`${media.path}?w=164&h=164&fit=crop&auto=format`}
                alt={media.name}
                loading="lazy"
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
      </Drawer>
      <Box sx={{ padding: 2 }}>
        {children}
      </Box>
    </div>
  );
};
