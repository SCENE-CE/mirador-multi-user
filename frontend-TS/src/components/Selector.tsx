import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { SelectorItem } from "./types.ts";

interface SelectorProps {
  defaultValue: string;
  selectorItems: SelectorItem[];
  onChange: (event: SelectChangeEvent) => void;
}

const Selector =  ({ selectorItems, defaultValue, onChange }: SelectorProps) => {
  return (
    <FormControl sx={{ width: 120, mb:1 }} size="small">
      <Select
        value={defaultValue}
        onChange={onChange}
      >
        {selectorItems.map((item ) => (
          <MenuItem key={item.id} value={item.name}>{item.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default Selector;
