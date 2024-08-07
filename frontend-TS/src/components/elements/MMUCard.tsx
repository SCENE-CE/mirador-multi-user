import { Card, Grid, Typography, CardActions, Tooltip, SelectChangeEvent } from "@mui/material";
import { MMUModal } from "./modal.tsx";
import { Dispatch, ReactElement, SetStateAction, useCallback, useState } from "react";
import placeholder from '../../assets/Placeholder.svg'
import { MMUModalEdit } from "./MMUModalEdit.tsx";
import { ListItem } from "../types.ts";
import { ProjectRights } from "../../features/user-group/types/types.ts";

interface IMMUCardProps<T,G> {
  name: string;
  id: number;
  rights: ProjectRights;
  description?: string;
  HandleOpenModal: () => void;
  openModal: boolean;
  DefaultButton: ReactElement;
  ReaderButton: ReactElement;
  EditorButton: ReactElement;
  itemLabel:string;
  handleSelectorChange: (group: ListItem) => (event: SelectChangeEvent) => Promise<void>,
  listOfItem: ListItem[],
  itemOwner: T,
  deleteItem: (itemId: number) => void,
  getOptionLabel: (option: G, searchInput: string) => string,
  handleAddAccessListItem: () => void,
  item : T,
  searchModalEditItem: (query: string) => Promise<G[]>,
  setItemToAdd: Dispatch<SetStateAction<G | null>>,
  updateItem: (itemOwner: T, newItemName: string) => void,
  getAccessToItem:(itemId:number)=> Promise<any>
  setItemList:Dispatch<SetStateAction<T>>
  removeAccessListItemFunction:(itemId:number, accessItemId:number )=>Promise<void>
}

const MMUCard = <T extends { id: number },G> (
  {
    name,
    id,
    rights,
    description,
    HandleOpenModal,
    openModal,
    DefaultButton,
    ReaderButton,
    EditorButton,
    itemLabel,
    handleSelectorChange,
    getAccessToItem,
    itemOwner,
    listOfItem,
    deleteItem,
    getOptionLabel,
    handleAddAccessListItem,
    item,
    updateItem,
    setItemToAdd,
    searchModalEditItem,
    setItemList,
    removeAccessListItemFunction
  }:IMMUCardProps<T,G>
) => {
  const [searchInput, setSearchInput] = useState<string>('');

  const handleRemoveAccessListItem = async ( accessItemId : number) =>{
    await removeAccessListItemFunction(item.id, accessItemId)
    fetchData(); // Refresh the list after removing an item
  }


  const fetchData = useCallback(async () => {
    const list = await getAccessToItem(item.id);
    setItemList(list, searchInput);
  }, [getAccessToItem, item.id, setItemList]);

  return (
    <Card>
      <Grid item container flexDirection="row" wrap="nowrap" justifyContent="space-between" sx={{ minHeight: '120px' }}>
        <Grid item container flexDirection="row" alignItems="center" justifyContent="flex-start" spacing={2}>
          <Grid item xs={12} sm={4}>
            <img src={placeholder} alt="placeholder" style={{ height: 100, width: 150 }} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1">{name}</Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            {description}
          </Grid>
        </Grid>
        <Grid item alignSelf="center">
          <CardActions>
            <Grid item container flexDirection="row" wrap="nowrap" spacing={2}>
              <Grid item container>
                <CardActions>
                  <Grid item container flexDirection="row" wrap="nowrap" spacing={2}>
                    <Grid item>
                      <Tooltip title={"Open project"}>
                        {DefaultButton}
                      </Tooltip>
                    </Grid>
                    {id  && (
                      <>
                        <Grid item>
                          {rights == ProjectRights.READER ? ReaderButton : EditorButton}
                        </Grid>
                      </>
                    )}
                  </Grid>
                </CardActions>
              </Grid>
            </Grid>
          </CardActions>
          <MMUModal
            width={500}
            openModal={openModal}
            setOpenModal={HandleOpenModal}
            children={
              <MMUModalEdit
                itemLabel={itemLabel}
                handleSelectorChange={handleSelectorChange}
                fetchData={fetchData}
                listOfItem={listOfItem}
                itemOwner={itemOwner}
                deleteItem={deleteItem}
                getOptionLabel={getOptionLabel}
                setSearchInput={setSearchInput}
                handleAddAccessListItem={handleAddAccessListItem}
                item={item}
                searchInput={searchInput}
                searchModalEditItem={searchModalEditItem}
                setItemToAdd={setItemToAdd}
                updateItem={updateItem}
                rights={rights}
                handleDeleteAccessListItem={handleRemoveAccessListItem}
              />
            }/>
        </Grid>
      </Grid>
    </Card>
  );
};

export default MMUCard;
