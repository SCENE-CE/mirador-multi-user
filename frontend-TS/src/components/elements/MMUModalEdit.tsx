import {
  Button,
  Grid, SelectChangeEvent,
  TextField,
  Tooltip,
} from "@mui/material";
import { ChangeEvent, Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import { ItemList } from "./ItemList.tsx";
import Selector from "../Selector.tsx";
import { MMUModal } from "./modal.tsx";
import { ModalConfirmDelete } from "../../features/projects/components/ModalConfirmDelete.tsx";
import { ProjectRights } from "../../features/user-group/types/types.ts";
import { ListItem, SelectorItem } from "../types.ts";
import CancelIcon from '@mui/icons-material/Cancel';
import { MediaGroupRights } from "../../features/media/types/types.ts";
interface ModalItemProps<T, G,O> {
  itemOwner: O,
  item: T,
  itemLabel: string,
  updateItem?: (newItem: T) => void,
  deleteItem?: (itemId: number) => void,
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
  rights: ProjectRights | MediaGroupRights,
  searchBarLabel:string,
  description:string,
  HandleOpenModalEdit:()=>void,
  thumbnailUrl?:string | null
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
    description,
    HandleOpenModalEdit,
    thumbnailUrl
  }: ModalItemProps<T, G, O>) => {
  const [newItemName, setNewItemName] = useState(itemLabel);
  const [newItemDescription, setNewItemDescription] = useState(description);
  const [newItemThumbnailUrl, setNewItemThumbnailUrl] = useState(thumbnailUrl);
  const [openModal, setOpenModal] = useState(false);

  const handleUpdateItemName = useCallback(async () => {
    console.log('newItemThumbnailUrl',newItemThumbnailUrl)
    const itemToUpdate = {...item,
      thumbnailUrl:newItemThumbnailUrl,
      name:newItemName,
      description:newItemDescription,
    }
    console.log("itemToUpdate",itemToUpdate)
    if(updateItem){
      updateItem(itemToUpdate);
    }
  }, [item, newItemName, newItemDescription, updateItem, itemOwner]);


  const handleChangeName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNewItemName(e.target.value);
  }, []);

  const handleChangeThumbnailUrl = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNewItemThumbnailUrl(e.target.value);
    console.log(e.target.value)
  }, []);

  const handleChangeDescription= useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNewItemDescription(e.target.value);
  }, []);

  const handleConfirmDeleteItemModal = useCallback(() => {
    setOpenModal(!openModal);
  }, [openModal]);

  useEffect(() => {
    fetchData();
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

  const handleSubmit = () => {
    handleUpdateItemName();
    HandleOpenModalEdit()
  };
  return (
    <Grid container>
      <Grid item container flexDirection="column">
        <Grid
          item
          sx={{ minHeight: '200px' }}
          container
          flexDirection="column"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid
            item
            sx={{ minHeight: '100px', width: '100%' }}
            container
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <TextField
              type="text"
              label="Name"
              onChange={handleChangeName}
              variant="outlined"
              defaultValue={itemLabel}
              fullWidth
            />
          </Grid>
          <Grid
            item
            sx={{ minHeight: '100px', width: '100%' }}
            container
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <TextField
              type="text"
              label="Description"
              onChange={handleChangeDescription}
              variant="outlined"
              defaultValue={description}
              multiline
              fullWidth
            />
          </Grid>
          <Grid
            item
            sx={{ minHeight: '50px', width: '100%' }}
            container
            justifyContent="flex-end"
            alignItems="center"
          >
            <TextField
              type="text"
              label="Thumbnail Url"
              onChange={handleChangeThumbnailUrl}
              variant="outlined"
              defaultValue={thumbnailUrl ? thumbnailUrl : undefined }
              multiline
              fullWidth
            />
          </Grid>
        </Grid>
        {rights !== ProjectRights.READER && listOfItem && setItemToAdd && getOptionLabel !==undefined &&(
          <Grid item>
            <ItemList handleAddAccessListItem={handleAddAccessListItem} setItemToAdd={setItemToAdd} items={listOfItem} handleSearchModalEditItem={handleSearchModalEditItem} removeItem={handleDeleteAccessListItem} searchBarLabel={searchBarLabel} setSearchInput={setSearchInput} handleGetOptionLabel={handleGetOtpionLabel}>
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
          <Grid
            item
            container
            justifyContent="space-between"
            alignItems="center"
            flexDirection="row"
            sx={{paddingTop:"20px"}}
          >
            <Grid item>
              <Tooltip title={"Delete item"}>
                <Button
                  color="error"
                  onClick={handleConfirmDeleteItemModal}
                  variant="contained"
                >
                  DELETE
                </Button>
              </Tooltip>
            </Grid>
            <Grid
              item
              container
              justifyContent="flex-end"
              flexDirection="row"
              alignItems="center"
              spacing={2}
              sx={{ width: 'auto' }}
            >
              <Grid item>
                <Button variant="contained" type="button" onClick={HandleOpenModalEdit}>
                  <CancelIcon />
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" type="submit" onClick={handleSubmit}>
                  <SaveIcon />
                  Save
                </Button>
              </Grid>
            </Grid>
            <MMUModal width={400} openModal={openModal} setOpenModal={handleConfirmDeleteItemModal} children={
              <ModalConfirmDelete
                deleteItem={deleteItem}
                itemId={item.id}
                itemName={itemLabel}
              />}/>
          </Grid>

        )}
      </Grid>
    </Grid>
  )
}
