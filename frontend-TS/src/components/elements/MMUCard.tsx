import { Card, Grid, Typography, CardActions, Tooltip, SelectChangeEvent } from "@mui/material";
import { MMUModal } from "./modal.tsx";
import { Dispatch, ReactElement, SetStateAction, useCallback, useState } from "react";
import placeholder from '../../assets/Placeholder.svg'
import { MMUModalEdit } from "./MMUModalEdit.tsx";
import { ListItem } from "../types.ts";
import { ProjectRights } from "../../features/user-group/types/types.ts";

interface IMMUCardProps<T,G,O,X> {
  id: number;
  rights: ProjectRights;
  description?: string;
  HandleOpenModal: () => void;
  openModal: boolean;
  DefaultButton?: ReactElement;
  ReaderButton?: ReactElement;
  EditorButton?: ReactElement;
  itemLabel:string;
  handleSelectorChange: (itemList: ListItem, eventValue : string, itemId:number, owner :any ) => Promise<void>,
  listOfItem: ListItem[],
  itemOwner:O,
  deleteItem: (itemId: number) => void,
  getOptionLabel: (option: any, searchInput: string) => string,
  AddAccessListItemFunction: (itemId: number ) => Promise<void>,
  item : T,
  searchModalEditItem: (query: string) => Promise<G[]>,
  setItemToAdd: Dispatch<SetStateAction<G | null>>,
  updateItem: (itemOwner: any, newItemName: string) => void,
  getAccessToItem:(itemId:number)=> Promise<any>
  removeAccessListItemFunction:(itemId:number, accessItemId:number )=>Promise<void>
  setItemList:Dispatch<SetStateAction<X[]>>
  searchBarLabel:string
}

const MMUCard = <T extends { id: number },G, O, X extends { id:number} > (
  {
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
    AddAccessListItemFunction,
    item,
    updateItem,
    setItemToAdd,
    searchModalEditItem,
    removeAccessListItemFunction,
    setItemList,
    searchBarLabel
  }:IMMUCardProps<T,G,O, X>
) => {
  const [searchInput, setSearchInput] = useState<string>('');

  const handleRemoveAccessListItem = async ( accessItemId : number) =>{
    await removeAccessListItemFunction(item.id, accessItemId)
    fetchData(); // Refresh the list after removing an item
  }


  const handleAddAccessListItem = async () =>{
    await AddAccessListItemFunction(item.id)
    fetchData(); // Refresh the list after removing an item
  }


  const fetchData = useCallback(async () => {
    const list = await getAccessToItem(item.id);
    setItemList(list);
  }, [getAccessToItem, item.id, setItemList]);

  const handleChangeSelectedItem = (itemSelected: ListItem) => async (event: SelectChangeEvent) => {

    await handleSelectorChange( itemSelected, event.target.value, item.id, itemOwner);
    await fetchData();
  };


  return (
    <Card>
      <Grid item container flexDirection="row" wrap="nowrap" justifyContent="space-between" sx={{ minHeight: '120px' }}>
        <Grid item container flexDirection="row" alignItems="center" justifyContent="flex-start" spacing={2}>
          <Grid item xs={12} sm={4}>
            <img src={placeholder} alt="placeholder" style={{ height: 100, width: 150 }} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1">{itemLabel}</Typography>
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
                      {DefaultButton &&(
                        <Tooltip title={"Open project"}>
                          {DefaultButton}
                        </Tooltip>
                      )}
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
                searchBarLabel={searchBarLabel}
                itemLabel={itemLabel}
                handleSelectorChange={handleChangeSelectedItem}
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
