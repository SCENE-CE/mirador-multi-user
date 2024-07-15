import { Autocomplete, Button, Grid, TextField, Typography } from "@mui/material";
import { UserGroup } from "../types/types.ts";
import { useDebounceCallback } from 'usehooks-ts';
import { lookingForUsers } from "../api/lookingForUsers.ts";
import { Dispatch, SetStateAction, SyntheticEvent, useState } from "react";

interface IUsersSearchBarProps {
  handleAddUser:()=>void
  setSelectedUser:Dispatch<SetStateAction<UserGroup | null>>
}

export const UsersSearchBar = ({setSelectedUser,handleAddUser}:IUsersSearchBarProps) => {
  const [usersSuggestions, setUsersSuggestions]=useState<UserGroup[]>([]);

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
              options={usersSuggestions}
              getOptionLabel={(option: UserGroup) => option.name}
              renderInput={(params) => <TextField {...params} label="User" />}
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
