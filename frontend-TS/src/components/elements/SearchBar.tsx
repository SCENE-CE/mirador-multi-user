import { Autocomplete, Button, Grid, TextField } from "@mui/material";
import { useDebounceCallback } from 'usehooks-ts';
import { Dispatch, SetStateAction, SyntheticEvent, useState } from "react";

interface IUsersSearchBarProps<T>{
  handleAdd?:()=>void
  setSelectedData?:Dispatch<SetStateAction<T | null>>
  setSearchedProject?:any
  fetchFunction:(partialString:string)=>Promise<any[]>
  getOptionLabel:(option:T)=>string
  setSearchInput?:(value:string)=>void
  actionButtonLabel?:string
}

export const SearchBar = <T,>({getOptionLabel,setSearchedProject, setSelectedData,fetchFunction,handleAdd,setSearchInput,actionButtonLabel}:IUsersSearchBarProps<T>) => {
  const [Suggestions, setSuggestions]=useState<T[]>([]);

  const HandlefetchUsers = async(partialUserName:string)=>{
    try{
      const data = await fetchFunction(partialUserName);
      console.log('data',data)
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
    if(setSearchInput){
      setSearchInput(value);
    }
    if (value) {
      await debouncedFetch(value);
    }
  }

  const handleChange = (_event: SyntheticEvent, value: T | null) => {
    if(setSelectedData){
      setSelectedData(value);
    }else if(setSearchedProject){
      setSearchedProject(value);
    }
  };

  return(
    <Grid item container flexDirection="column" spacing={1}>
      <Grid item container spacing={2}>
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
              renderInput={(params) => <TextField {...params} label="Search" />}
              getOptionLabel={getOptionLabel}
            />
          </Grid>
          <Grid item>
            {actionButtonLabel &&(
              <>
                <Button variant="contained" onClick={handleAdd}>{actionButtonLabel}</Button>
              </>
            )
            }
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
