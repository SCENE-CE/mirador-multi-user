import {
  Button,
  Grid,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import { MMUModal } from "../../../components/elements/modal.tsx";
import { ModalConfirmDelete } from "./ModalConfirmDelete.tsx";
import { SearchBar } from "../../../components/elements/SearchBar.tsx";

interface ModalEditProps {
  item: any;
  updateItem: (item: any, newName: string) => void;
  deleteItem: (itemId: number) => void;
  fetchGroups: (itemId: number) => Promise<any[]>;
  addItemToGroup: (itemId: number, groupId: number) => Promise<void>;
  rights: string;
  groupLabel: string;
  fetchUsers: (searchInput: string) => Promise<any[]>;
}

export const ModalEdit = (
  {
    item,
    updateItem,
    deleteItem,
    fetchGroups,
    addItemToGroup,
    rights,
    groupLabel,
    fetchUsers,
  }: ModalEditProps) => {
  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState(item.name);
  const [openModal, setOpenModal] = useState(false);
  const [userToAdd, setUserToAdd] = useState<any | null>(null);
  const [searchInput, setSearchInput] = useState<string>('');
  const [groupList, setGroupList] = useState<any[]>([]);

  const HandleUpdateItem = useCallback(async () => {
    updateItem(item, newName);
    setEditName(!editName);
  }, [editName, newName, item, updateItem]);

  const handleEditName = useCallback(() => {
    setEditName(!editName);
  }, [editName]);

  const fetchGroupsForItem = useCallback(async () => {
    const groups = await fetchGroups(item.id);
    setGroupList(groups);
  }, [item.id, fetchGroups]);

  const handleChangeName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  }, []);

  const handleConfirmDeleteModal = useCallback(() => {
    setOpenModal(!openModal);
  }, [openModal]);

  const handleAddUser = async () => {
    if (userToAdd) {
      await addItemToGroup(item.id, userToAdd.id);
      fetchGroupsForItem(); // Refresh the list after adding a user
    }
  };

  const getOptionLabel = (option: any): string => {
    const user = option.users[0];
    if (user.mail.toLowerCase().includes(searchInput.toLowerCase())) {
      return user.mail;
    }
    if (user.name.toLowerCase().includes(searchInput.toLowerCase())) {
      return user.name;
    }
    return user.mail;
  };

  useEffect(() => {
    fetchGroupsForItem();
  }, [fetchGroupsForItem]);

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
            <Button variant="contained" onClick={HandleUpdateItem}>
              <SaveIcon />
            </Button>
          </Grid>
        )}
        {rights !== 'READER' && (
          <Grid item>
            <SearchBar
              handleAdd={handleAddUser}
              setSelectedData={setUserToAdd}
              getOptionLabel={getOptionLabel}
              fetchFunction={fetchUsers}
              setSearchInput={setSearchInput}
              actionButtonLabel={"ADD"}
            />
            <GroupList groupList={groupList} setGroupList={setGroupList} />
          </Grid>
        )}
        {rights === 'ADMIN' && (
          <Grid item container>
            <Grid item>
              <Tooltip title={`Delete ${groupLabel}`}>
                <Button
                  color='error'
                  onClick={handleConfirmDeleteModal}
                  variant="contained"
                >
                  DELETE {groupLabel.toUpperCase()}
                </Button>
              </Tooltip>
            </Grid>
            <MMUModal width={400} openModal={openModal} setOpenModal={handleConfirmDeleteModal} children={<ModalConfirmDelete deleteItem={deleteItem} itemId={item.id} itemName={item.name} />} />
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};
