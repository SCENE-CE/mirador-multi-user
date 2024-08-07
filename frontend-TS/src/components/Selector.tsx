import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { ListItem, SelectorItem } from "./types.ts";
import { useEffect } from "react";

interface SelectorProps {
  value: string;
  selectorItems: SelectorItem[];
  onChange: (event: SelectChangeEvent) => void;
  item:ListItem
}

const Selector =  ({ selectorItems, value, onChange, item }: SelectorProps) => {
  return (
    <FormControl sx={{ width: 120, mb:1 }} size="small">
      <Select
        value={value}
        onChange={onChange}
      >
        {selectorItems.map((item ) => (
          <MenuItem key={item.name} value={item.name}>{item.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default Selector;
