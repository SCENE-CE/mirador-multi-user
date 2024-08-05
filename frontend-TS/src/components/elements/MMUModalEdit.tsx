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

interface ModalItemProps<T, G> {
  itemOwner: T,
  item: T,
  label: string,
  updateItem: (itemOwner: T, newItemName: string) => void,
  deleteItem: (itemId: number) => void,
  getGroupsAccessToItem: (itemId: number) => Promise<G[]>,
  searchModalEditItem: (query: string) => Promise<G[]>,
  getOptionLabel: (option: G, searchInput: string) => string,
  itemRights: typeof ProjectRights,
  handleSelectorChange: (group: ListItem) => (event: SelectChangeEvent) => Promise<void>,
  fetchData: () => Promise<void>,
  listOfItem: ListItem[],
  setItemToAdd: Dispatch<SetStateAction<G | null>>,
  handleAddItem: () => void,
  setSearchInput: Dispatch<SetStateAction<string>>,
  searchInput: string,
  rights: ProjectRights,
}

export const MMUModalEdit = <T extends { id: number }, G>(
  {
    label,
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
    rights,
  }: ModalItemProps<T, G>) => {
  const [editName, setEditName] = useState(false);
  const [newItemName, setNewItemName] = useState(label);
  const [openModal, setOpenModal] = useState(false);

  console.log('listOfItem MMUModalEdit', listOfItem);

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

  const rightsSelectorItems: SelectorItem[] = Object.values(ProjectRights).map((right) => ({
    id: right as unknown as "ADMIN" | "EDITOR" | "READER",
    name: right as unknown as "ADMIN" | "EDITOR" | "READER"
  }));

  console.log('rightsSelectorItems', rightsSelectorItems);

  return (
    <Grid container>
      <Grid item container flexDirection="column">
        {!editName ? (
          <Grid item sx={{ minHeight: '100px' }} container flexDirection="row" justifyContent="space-between" alignItems="center">
            <Typography>{label}</Typography>
            <Button variant="contained" onClick={handleEditName}>
              <ModeEditIcon />
            </Button>
          </Grid>
        ) : (
          <Grid item sx={{ minHeight: '100px' }} container flexDirection="row" justifyContent="space-between" alignItems="center">
            <TextField type="text" onChange={handleChangeName} variant="outlined" defaultValue={label} />
            <Button variant="contained" onClick={handleUpdateItem}>
              <SaveIcon />
            </Button>
          </Grid>
        )}
        {rights !== ProjectRights.READER && (
          <Grid item>
            <SearchBar
              handleAdd={handleAddItem}
              setSelectedData={setItemToAdd}
              getOptionLabel={(option) => getOptionLabel(option, searchInput)}
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
        {rights === ProjectRights.ADMIN && (
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
            <MMUModal width={400} openModal={openModal} setOpenModal={handleConfirmDeleteModal} children={<ModalConfirmDelete deleteItem={deleteItem} itemId={item.id} itemName={label} />} />
          </Grid>
        )}
      </Grid>
    </Grid>
  )
}
