import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { SelectorItem } from "./types.ts";

interface SelectorProps {
  value: string;
  selectorItems: SelectorItem[];
  onChange: (event: SelectChangeEvent) => void;
}

const Selector =  ({ selectorItems, value, onChange }: SelectorProps) => {
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
