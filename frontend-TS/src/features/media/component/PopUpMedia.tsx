import { Button, ImageList, ImageListItem, styled, Typography } from "@mui/material";
import { Media } from "../types/types.ts";
import toast from "react-hot-toast";

interface IpopUpMediaProps {
  medias:Media[];

}

const CustomImageItem = styled(ImageListItem)({
  position: 'relative',
  "&:hover img": {
    opacity: 0.4,
  },
  "&:hover .text": {
    opacity: 1,
  }
});

const CustomButton = styled(Button)({
  position: 'absolute',
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  textAlign: "center",
})

const CustomText = styled(Typography)({
  color: "black",
  fontSize: "20px",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  textAlign: "center",
  opacity: 0,
  transition: 'opacity 0.3s ease',
});

const handleCopyToClipBoard = async (path: string) => {
  await navigator.clipboard.writeText(path);
  toast.success('path copied to clipboard');
}

export const PopUpMedia = ({medias}:IpopUpMediaProps) => {

  return(
    <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
      {(medias ?? []).map((media) => (
        <CustomImageItem key={media.path}>
          <img
            srcSet={`${media.path}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
            src={`${media.path}?w=164&h=164&fit=crop&auto=format`}
            alt="media-img"
            loading="lazy"
          />
          <CustomButton disableRipple onClick={()=>handleCopyToClipBoard(media.path)}>
            <CustomText className="text">Copy path to clipboard</CustomText>
          </CustomButton>
        </CustomImageItem>
      ))}
    </ImageList>
  )
}
