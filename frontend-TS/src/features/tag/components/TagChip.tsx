import { Chip } from "@mui/material";
import { Tag } from "../type.ts";

interface TagChipProps {
  tag:Tag;
  handleRemoveTag?: (title:string) => void;
  onClick?:()=>void;
}
export const TagChip = ({ tag, handleRemoveTag,onClick }: TagChipProps) => {
  return (
    handleRemoveTag ? (
      <Chip label={tag.title} onDelete={() => handleRemoveTag(tag.title)} />
    ) : (
      <Chip label={tag.title} onClick={onClick} />
    )
  );
};