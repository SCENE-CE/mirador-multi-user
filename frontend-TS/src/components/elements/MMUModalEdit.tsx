import {
  Button,
  Grid, SelectChangeEvent,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { ChangeEvent, Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { ProjectGroup } from "../../features/projects/types/types.ts";
import { ProjectRights } from "../../features/user-group/types/types.ts";
import { ItemOwner, ListItem, ModalEditItem, SelectorItem } from "../types.ts";
import SaveIcon from "@mui/icons-material/Save";
import { SearchBar } from "./SearchBar.tsx";
import { ItemList } from "./ItemList.tsx";
import Selector from "../Selector.tsx";
import { MMUModal } from "./modal.tsx";
import { ModalConfirmDelete } from "../../features/projects/components/ModalConfirmDelete.tsx";


interface ModalItemProps<T,G>{
  itemOwner: T,
  item: T,
  updateItem: (itemOwner: T, newItemName: string) => void,
  deleteItem: (itemId: number) => void,
  getGroupsAccessToItem: (itemId: number) => Promise<G[]>,
  updateItemGroupRights: (itemGroupId: number, itemId: number, groupId: number, rights: ProjectRights) => Promise<void>,
  searchModalEditItem: (query: string) => Promise<G[]>,
  getOptionLabel: (option: G, searchInput: string) => string,
  itemRights: ProjectRights,
  handleSelectorChange: (group: ListItem) => (event: SelectChangeEvent) => Promise<void>;
  fetchData: () => Promise<void>,
  listOfItem: ListItem[]
  setItemToAdd: Dispatch<SetStateAction<G | null>>,
  handleAddItem:()=>void,
  setSearchInput: Dispatch<SetStateAction<string>>,
  searchInput:string,
}

export const MMUModalEdit =<T,G> (
  {
    setItemToAdd,
    itemOwner,
    item,
    updateItem,
    deleteItem,
    searchModalEditItem,
    getOptionLabel,
    itemRights,
    handleSelectorChange,
    fetchData,
    listOfItem,
    handleAddItem,
    setSearchInput,
    searchInput,
  }: ModalItemProps<T,G>) => {
  const [editName, setEditName] = useState(false);
  const [newItemName, setNewItemName] = useState(item!.name);
  const [openModal, setOpenModal] = useState(false);


  const handleUpdateItem = useCallback(async () => {
    updateItem(itemOwner, newItemName);
    setEditName(!editName);
  }, [editName, newItemName, itemOwner, updateItem]);

  const handleEditName = useCallback(() => {
    setEditName(!editName);
  }, [editName]);

  const handleChangeName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNewItemName(e.target.value);
  }, []);

  const handleConfirmDeleteModal = useCallback(() => {
    setOpenModal(!openModal);
  }, [openModal]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const rightsSelectorItems: SelectorItem[] = (Object.keys(itemRights) as Array<keyof typeof ProjectRights>).map((right) => ({
    id: right,
    name: right
  }));

  return (
    <Grid container>
      <Grid item container flexDirection="column">
        {!editName ? (
          <Grid item sx={{ minHeight: '100px' }} container flexDirection="row" justifyContent="space-between" alignItems="center">
            <Typography>{item.name}</Typography>
            <Button variant="contained" onClick={handleEditName}>
              <ModeEditIcon />
            </Button>
          </Grid>
        ) : (
          <Grid item sx={{ minHeight: '100px' }} container flexDirection="row" justifyContent="space-between" alignItems="center">
            <TextField type="text" onChange={handleChangeName} variant="outlined" defaultValue={item.name} />
            <Button variant="contained" onClick={handleUpdateItem}>
              <SaveIcon />
            </Button>
          </Grid>
        )}
        {itemOwner.rights !== ProjectRights.READER && (
          <Grid item>
            <SearchBar
              handleAdd={handleAddItem}
              setSelectedData={setItemToAdd}
              getOptionLabel={(option: ModalEditItem) => getOptionLabel(option, searchInput)}
              fetchFunction={searchModalEditItem}
              setSearchInput={setSearchInput}
              actionButtonLabel={"ADD"}
            />
            <ItemList items={listOfItem}>
              {(item) => (
                <Selector
                  selectorItems={rightsSelectorItems}
                  value={item.rights!.toUpperCase()}
                  onChange={handleSelectorChange(item)}
                />
              )}
            </ItemList>
          </Grid>
        )}
        {itemOwner.rights === ProjectRights.ADMIN && (
          <Grid item container>
            <Grid item>
              <Tooltip title={"Delete item"}>
                <Button
                  color='error'
                  onClick={handleConfirmDeleteModal}
                  variant="contained"
                >
                  DELETE ITEM
                </Button>
              </Tooltip>
            </Grid>
            <MMUModal width={400} openModal={openModal} setOpenModal={handleConfirmDeleteModal} children={<ModalConfirmDelete deleteItem={deleteItem} itemId={item.id} itemName={item.name} />} />
          </Grid>
        )}
      </Grid>
    </Grid>
  )
}
