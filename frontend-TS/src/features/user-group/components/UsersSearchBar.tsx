import { Autocomplete, Grid, TextField, Typography } from "@mui/material";
import { UserGroup } from "../types/types.ts";
import { useDebounceCallback } from 'usehooks-ts';
import { lookingForUsers } from "../api/lookingForUsers.ts";
import {SyntheticEvent, useState } from "react";


export const UsersSearchBar = () => {
  const [usersSuggestions, setUsersSuggestions]=useState<UserGroup[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserGroup | null>(null);

  const fetchUsers = async(partialUserName:string)=>{
    try{
      const users = await lookingForUsers(partialUserName);
      setUsersSuggestions(users);
    } catch (error) {
      console.error('Error fetching address data:', error);
    }
  }
  const debouncedFetch = useDebounceCallback((value: string) => {
    fetchUsers(value)
  }, 500);

  const handleInputChange= (_event:SyntheticEvent,value:string )=>{
    console.log(value)
    if(value){
      debouncedFetch(value);
    }
  }

  const handleChange = (_event: SyntheticEvent, value: UserGroup | null) => {
    setSelectedUser(value);
  };

  const handleBlur = () => {
    if (selectedUser) {
      // Perform the action with the final selected value
      console.log('Final selected user:', selectedUser);
      // Add any additional actions here
    }
  };

  return(
    <Grid item container flexDirection="column" spacing={1}>
      <Typography>Adding users to group</Typography>
      <Grid item container spacing={2}>
        <Grid item>

          <Typography>Adding user to group :</Typography>
        </Grid>
        <Grid item>

          <Autocomplete
            disablePortal
            onInputChange={handleInputChange}
            clearOnEscape
            onChange={handleChange}
            onBlur={handleBlur}
            id="combo-box-demo"
            options={usersSuggestions}
            getOptionLabel={(option: UserGroup) => option.name}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="User" />}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}
