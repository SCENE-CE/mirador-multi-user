import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Grid,
  IconButton, Paper,
  Typography
} from "@mui/material";
import { ListItem } from "../types.ts";
import { BigSpinner } from "./spinner.tsx";
import { Dispatch, ReactNode, SetStateAction } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { SearchBar } from "./SearchBar.tsx";
import { MMUToolTip } from "./MMUTootlTip.tsx";
import { UserGroupTypes } from "../../features/user-group/types/types.ts";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import ExpandMoreIcon from "@mui/icons-material/ExpandMoreSharp";
import { ShareLink } from "./shareLink.tsx";

interface IProjectUserGroup<G,T> {
  items: ListItem[];
  children?: (item: ListItem) => ReactNode;
  removeItem: (itemId: number) => void;
  setSearchInput: Dispatch<SetStateAction<string>>;
  handleSearchModalEditItem:(partialString:string)=>Promise<any[]> | any[]
  handleGetOptionLabel: (option: G) => string;
  setItemToAdd?: Dispatch<SetStateAction<G | null>>,
  handleAddAccessListItem: () => void;
  searchBarLabel: string;
  getGroupByOption?:(option:any)=>string;
  item:T
  snapShotHash:string
}

export const ItemList = <G,T extends { id: number,snapShotHash:string}>(
  {
    items,
    children,
    removeItem,
    searchBarLabel,
    handleAddAccessListItem,
    setItemToAdd,
    handleGetOptionLabel,
    handleSearchModalEditItem,
    setSearchInput,
    getGroupByOption,
    item
  }: IProjectUserGroup<G,T>): JSX.Element => {
  console.log('items',items)
  return (
    <Accordion component={Paper} elevation={1} sx={{ minHeight:'55px' }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="metadata-content"
        id="metadata-header"
      >
        <Typography variant="h6">Share</Typography>
      </AccordionSummary>
      <AccordionDetails style={{ maxHeight: "400px", overflowY: "auto" }}>
        <Grid container item spacing={2}>
          <Grid container item alignItems="center" spacing={2}>
            <ShareLink  itemId={item.id} snapShotHash={item.snapShotHash}/>
          </Grid>
          <Grid container item alignItems="center" spacing={2}>
            <Grid item>
              <Typography variant="h5">Permissions</Typography>
            </Grid>
            <Grid item>
              <MMUToolTip children={<div>
                Admin: Can Access / Modify / Delete <br />
                Editor: Can Access / Modify <br />
                Reader: Can Access
              </div>} />
            </Grid>
          </Grid>
          <Grid item>
            <SearchBar
              label={searchBarLabel}
              handleAdd={handleAddAccessListItem}
              setSelectedData={setItemToAdd}
              getOptionLabel={handleGetOptionLabel}
              fetchFunction={handleSearchModalEditItem}
              setSearchInput={setSearchInput}
              actionButtonLabel={"ADD"}
              groupByOption={getGroupByOption}
            />
          </Grid>
          <Grid item container flexDirection="column" spacing={1}>
            {items && items.map((item) => (
              item ? (
                <Grid key={item.id} item container spacing={1} flexDirection="row" alignItems="center" justifyContent="spaceBetween">
                  <Grid item container xs={8}>
                    <Grid item sx={{ flexGrow: 1 }}>
                      <Typography>{item.title}</Typography>
                    </Grid>
                    <Grid item>
                      {
                        item.type === UserGroupTypes.PERSONAL ? (
                          <PersonIcon/>
                        ):(
                          <GroupsIcon/>
                        )
                      }
                    </Grid>
                  </Grid>
                  {children && (
                    <Grid item>
                      {children(item)}
                    </Grid>
                  )}
                  <Grid item>
                    <IconButton onClick={() => removeItem(item.id)} aria-label="delete" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                  <Grid item xs={12} sx={{ mb: "5px" }}>
                    <Divider />
                  </Grid>
                </Grid>
              ) : (
                <BigSpinner />
              )
            ))}
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
