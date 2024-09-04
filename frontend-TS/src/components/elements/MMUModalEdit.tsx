import {
  Button,
  Grid, SelectChangeEvent,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { ChangeEvent, Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import { SearchBar } from "./SearchBar.tsx";
import { ItemList } from "./ItemList.tsx";
import Selector from "../Selector.tsx";
import { MMUModal } from "./modal.tsx";
import { ModalConfirmDelete } from "../../features/projects/components/ModalConfirmDelete.tsx";
import { ProjectRights } from "../../features/user-group/types/types.ts";
import { ListItem, SelectorItem } from "../types.ts";

interface ModalItemProps<T, G,O> {
  itemOwner: O,
  item: T,
  itemLabel: string,
  updateItem: (newItem: T) => void,
  deleteItem: (itemId: number) => void,
  handleDeleteAccessListItem: (itemId: number) => void,
  searchModalEditItem?: (query: string) => Promise<G[]>,
  getOptionLabel?: (option: G, searchInput: string) => string,
  handleSelectorChange: (listItem: ListItem) => (event: SelectChangeEvent) => Promise<void>,
  fetchData: () => Promise<void>,
  listOfItem?: ListItem[],
  setItemToAdd?: Dispatch<SetStateAction<G | null>>,
  handleAddAccessListItem: () => void,
  setSearchInput: Dispatch<SetStateAction<string>>,
  searchInput: string,
  rights: ProjectRights,
  searchBarLabel:string
  description:string
}

export const MMUModalEdit = <O, T extends { id: number }, G>(
  {
    itemLabel,
    setItemToAdd,
    itemOwner,
    item,
    updateItem,
    deleteItem,
    searchModalEditItem,
    getOptionLabel,
    handleSelectorChange,
    fetchData,
    listOfItem,
    handleAddAccessListItem,
    setSearchInput,
    searchInput,
    rights,
    searchBarLabel,
    handleDeleteAccessListItem,
    description
  }: ModalItemProps<T, G, O>) => {
  const [editName, setEditName] = useState(false);
  const [editDescription, setEditDescription] = useState(false);
  const [newItemName, setNewItemName] = useState(itemLabel);
  const [newItemDescription, setNewItemDescription] = useState(description);
  const [openModal, setOpenModal] = useState(false);

  const handleUpdateItemName = useCallback(async () => {
    const itemToUpdate = {...item,
      name:newItemName,
      description:newItemDescription,
    }
    updateItem(itemToUpdate);
    setEditName(false);
    setEditDescription(false)
  }, [item, newItemName, newItemDescription, updateItem, itemOwner, editName, editDescription]);

  const handleEditName = useCallback(() => {
    setEditName(!editName);
  }, [editName]);

  const handleEditDescription = useCallback(() => {
    setEditDescription(!editDescription);
  }, [editDescription]);


  const handleChangeName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNewItemName(e.target.value);
  }, []);

  const handleChangeDescription= useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNewItemDescription(e.target.value);
  }, []);

  const handleConfirmDeleteItemModal = useCallback(() => {
    setOpenModal(!openModal);
  }, [openModal]);

  useEffect(() => {
    fetchData();
    console.log('editModal rerender')
  }, [fetchData, item, itemOwner]);

  const rightsSelectorItems: SelectorItem[] = Object.values(ProjectRights).map((right) => ({
    id: right as unknown as "ADMIN" | "EDITOR" | "READER",
    name: right as unknown as "ADMIN" | "EDITOR" | "READER"
  }));

  const handleGetOtpionLabel = (option : G) =>{
      return getOptionLabel ? getOptionLabel(option, searchInput) : ""
  }
  const handleSearchModalEditItem = (query: string)=>{
    return searchModalEditItem ? searchModalEditItem(query) : [""] as unknown as Promise<string[]>
  }

  return (
    <Grid container>
      <Grid item container flexDirection="column">
        {!editName ? (
          <Grid item sx={{ minHeight: '100px' }} container flexDirection="row" justifyContent="space-between" alignItems="center">
            <Typography>{itemLabel}</Typography>
            <Button variant="contained" onClick={handleEditName}>
              <ModeEditIcon />
            </Button>
          </Grid>
        ) : (
          <Grid item sx={{ minHeight: '100px' }} container flexDirection="row" justifyContent="space-between" alignItems="center">
            <TextField type="text" onChange={handleChangeName} variant="outlined" defaultValue={itemLabel} />
            <Button variant="contained" onClick={handleUpdateItemName}>
              <SaveIcon />
            </Button>
          </Grid>
        )}
        {!editDescription ? (
          <Grid item sx={{ minHeight: '100px' }} container flexDirection="row" justifyContent="space-between" alignItems="center">
            <Typography>{description}</Typography>
            <Button variant="contained" onClick={handleEditDescription}>
              <ModeEditIcon />
            </Button>
          </Grid>
        ) : (
          <Grid item sx={{ minHeight: '100px' }} container flexDirection="row" justifyContent="space-between" alignItems="center">
            <TextField type="text" onChange={handleChangeDescription} variant="outlined" defaultValue={description} />
            <Button variant="contained" onClick={handleUpdateItemName}>
              <SaveIcon />
            </Button>
          </Grid>
        )}

        {rights !== ProjectRights.READER && listOfItem && getOptionLabel !==undefined &&(
          <Grid item>
            <SearchBar
              label={searchBarLabel}
              handleAdd={handleAddAccessListItem}
              setSelectedData={setItemToAdd}
              getOptionLabel={handleGetOtpionLabel}
              fetchFunction={handleSearchModalEditItem}
              setSearchInput={setSearchInput}
              actionButtonLabel={"ADD"}
            />
            <ItemList items={listOfItem} removeItem={handleDeleteAccessListItem}>
              {(accessListItem) => (
                <Selector
                  selectorItems={rightsSelectorItems}
                  value={accessListItem.rights!}
                  onChange={handleSelectorChange(accessListItem)}
                />
              )}
            </ItemList>
          </Grid>
        )}
        {rights === ProjectRights.ADMIN && (
          <Grid item container>
            <Grid item>
              <Tooltip title={"Delete item"}>
                <Button
                  color='error'
                  onClick={handleConfirmDeleteItemModal}
                  variant="contained"
                >
                  DELETE ITEM
                </Button>
              </Tooltip>
            </Grid>
            <MMUModal width={400} openModal={openModal} setOpenModal={handleConfirmDeleteItemModal} children={
              <ModalConfirmDelete
                deleteItem={deleteItem}
                itemId={item.id}
                itemName={itemLabel}
              />
            }
            />
          </Grid>
        )}
      </Grid>
    </Grid>
  )
}
