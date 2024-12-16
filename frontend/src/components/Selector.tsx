import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { SelectorItem } from "./types.ts";
import { useEffect, useState } from "react";

interface SelectorProps {
  value: string;
  selectorItems: SelectorItem[];
  onChange: (event: SelectChangeEvent) => void;
}

export const Selector = ({ selectorItems, value, onChange }: SelectorProps) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleLocalChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value;
    setLocalValue(newValue);
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <FormControl sx={{ width: 120, mb: 1 }} size="small">
      <Select value={localValue} onChange={handleLocalChange}>
        {selectorItems.map((item) => (
          <MenuItem key={item.name} value={item.name}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
