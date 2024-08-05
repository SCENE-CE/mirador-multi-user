import {
  Button,
  Grid, SelectChangeEvent,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { ProjectGroup } from "../../features/projects/types/types.ts";
import { ProjectRights, UserGroup } from "../../features/user-group/types/types.ts";
import { ListItem, SelectorItem } from "../types.ts";
import SaveIcon from "@mui/icons-material/Save";
import { SearchBar } from "./SearchBar.tsx";
import { ItemList } from "./ItemList.tsx";
import Selector from "../Selector.tsx";
import { MMUModal } from "./modal.tsx";
import { ModalConfirmDelete } from "../../features/projects/components/ModalConfirmDelete.tsx";


interface ModalItemProps<T> {
  itemUser: T,
  item: T,
  updateItem: (itemUser: T, newItemName: string) => void,
  deleteItem: (itemId: number) => void,
  getGroupsAccessToItem: (itemId: number) => Promise<ProjectGroup[]>,
  addItemToGroup: (itemId: number, groupId: number) => Promise<void>,
  updateItemGroupRights: (itemGroupId: number, itemId: number, groupId: number, rights: ProjectRights) => Promise<void>,
  searchUsers: (query: string) => Promise<UserGroup[]>,
  getOptionLabel: (option: UserGroup, searchInput: string) => string,
  itemRights: typeof ProjectRights,
  handleSelectorChange: (group: ListItem) => (event: SelectChangeEvent) => Promise<void>;
  fetchData: () => Promise<void>,
  listOfItem: ListItem[]
}

export const MMUModalEdit = <T extends { id: number, name: string, rights: ProjectRights,  }>(
  {
    itemUser,
    item,
    updateItem,
    deleteItem,
    addItemToGroup,
    searchUsers,
    getOptionLabel,
    itemRights,
    handleSelectorChange,
    fetchData,
    listOfItem
  }: ModalItemProps<T>) => {
  const [editName, setEditName] = useState(false);
  const [newItemName, setNewItemName] = useState(item!.name);
  const [openModal, setOpenModal] = useState(false);
  const [userToAdd, setUserToAdd] = useState<UserGroup | null>(null);
  const [searchInput, setSearchInput] = useState<string>('');


  const handleUpdateItem = useCallback(async () => {
    updateItem(itemUser, newItemName);
    setEditName(!editName);
  }, [editName, newItemName, itemUser, updateItem]);

  const handleEditName = useCallback(() => {
    setEditName(!editName);
  }, [editName]);

  const handleChangeName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNewItemName(e.target.value);
  }, []);

  const handleConfirmDeleteModal = useCallback(() => {
    setOpenModal(!openModal);
  }, [openModal]);

  const handleAddUser = async () => {
    if (userToAdd) {
      await addItemToGroup(item.id, userToAdd.id);
      await fetchData(); // Refresh the list after adding a user
    }
  };

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
        {itemUser.rights !== ProjectRights.READER && (
          <Grid item>
            <SearchBar
              handleAdd={handleAddUser}
              setSelectedData={setUserToAdd}
              getOptionLabel={(option: UserGroup) => getOptionLabel(option, searchInput)}
              fetchFunction={searchUsers}
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
        {itemUser.rights === ProjectRights.ADMIN && (
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
