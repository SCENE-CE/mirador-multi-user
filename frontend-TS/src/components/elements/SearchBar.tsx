import { Autocomplete, Button, Grid, TextField, Typography } from "@mui/material";
import { useDebounceCallback } from 'usehooks-ts';
import { Dispatch, SetStateAction, SyntheticEvent, useState } from "react";

interface IUsersSearchBarProps<T>{
  handleAddUser:()=>void
  setSelectedData:Dispatch<SetStateAction<T | null>>
  fetchFunction:(partialString:string)=>Promise<T[]>
  getOptionLabel:(option:T)=>string
  setSearchInput:(value:string)=>void
}

export const SearchBar = <T,>({getOptionLabel,setSelectedData,fetchFunction,handleAddUser,setSearchInput}:IUsersSearchBarProps<T>) => {
  const [Suggestions, setSuggestions]=useState<T[]>([]);

  const HandlefetchUsers = async(partialUserName:string)=>{
    try{
      const data = await fetchFunction(partialUserName);
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching address data:', error);
    }
  }
  const debouncedFetch = useDebounceCallback(async (value: string) => {
    await HandlefetchUsers(value)
  }, 500);

  const handleInputChange= async (_event: SyntheticEvent, value: string) => {
    console.log(value)
    setSearchInput(value);
    if (value) {
      await debouncedFetch(value);
    }
  }

  const handleChange = (_event: SyntheticEvent, value: T | null) => {
    setSelectedData(value);
  };

  return(
    <Grid item container flexDirection="column" spacing={1}>
      <Grid item container spacing={2}>
        <Grid item>
          <Typography>Adding user to group :</Typography>
        </Grid>
        <Grid item container  spacing={2} direction="row" alignItems="center">
          <Grid item >
            <Autocomplete
              disablePortal
              onInputChange={handleInputChange}
              clearOnEscape
              sx={{width:'250px'}}
              onChange={handleChange}
              id="combo-box-demo"
              options={Suggestions}
              renderInput={(params) => <TextField {...params} label="User" />}
              getOptionLabel={getOptionLabel}
            />
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={handleAddUser}>ADD</Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
