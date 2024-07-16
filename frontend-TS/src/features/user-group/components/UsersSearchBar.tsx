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
  const [searchInput, setSearchInput] = useState<string>('');

  const fetchUsers = async(partialUserName:string)=>{
    try{
      const users = await lookingForUsers(partialUserName);
      console.log(users)
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
    setSearchInput(value);
    if(value){
      debouncedFetch(value);
    }
  }

  const handleChange = (_event: SyntheticEvent, value: UserGroup | null) => {
    setSelectedUser(value);
  };

  const getOptionLabel = (option: UserGroup): string => {
    const user = option.users[0];
    if (user.mail.toLowerCase().includes(searchInput.toLowerCase())) {
      return user.mail;
    }
    if (user.name.toLowerCase().includes(searchInput.toLowerCase())) {
      return user.name;
    }
    return user.mail;
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
