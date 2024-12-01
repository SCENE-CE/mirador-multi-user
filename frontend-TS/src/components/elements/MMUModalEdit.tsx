import { Button, Grid, SelectChangeEvent, Tab, Tabs, TextField, Tooltip, Typography } from "@mui/material";
import { ChangeEvent, Dispatch, SetStateAction, SyntheticEvent, useCallback, useEffect, useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import { ItemList } from "./ItemList.tsx";
import Selector from "../Selector.tsx";
import { MMUModal } from "./modal.tsx";
import { ModalConfirmDelete } from "../../features/projects/components/ModalConfirmDelete.tsx";
import { ItemsRights } from "../../features/user-group/types/types.ts";
import { ListItem, SelectorItem } from "../types.ts";
import CancelIcon from "@mui/icons-material/Cancel";
import { MediaGroupRights } from "../../features/media/types/types.ts";
import { ManifestGroupRights } from "../../features/manifest/types/types.ts";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { ObjectTypes } from "../../features/tag/type.ts";
import { a11yProps } from "./SideBar/allyProps.tsx";
import { CustomTabPanel } from "./CustomTabPanel.tsx";
import { MetadataForm } from "../../features/Metadata/components/metadataForm.tsx";
import { getMetadataFormat } from "../../features/Metadata/api/getMetadataFormat.ts";
import { MetadataFormat } from "../../features/Metadata/types/types.ts";
import { useUser } from "../../utils/auth.tsx";
import { createMetadataForItem } from "../../features/Metadata/api/createMetadataForItem.ts";
import { gettingMetadataForObject } from "../../features/Metadata/api/gettingMetadataForObject.ts";


interface ModalItemProps<T, G> {
  item: T,
  itemLabel: string,
  updateItem?: (newItem: T) => void,
  deleteItem?: (itemId: number) => void,
  duplicateItem?: (itemId: number) => void,
  handleDeleteAccessListItem: (itemId: number) => void,
  searchModalEditItem?:(partialString:string)=>Promise<any[]> | any[]
  getOptionLabel?: (option: G, searchInput: string) => string,
  handleSelectorChange: (listItem: ListItem) => (event: SelectChangeEvent) => Promise<void>,
  fetchData: () => Promise<void>,
  listOfItem?: ListItem[],
  setItemToAdd?: Dispatch<SetStateAction<G | null>>,
  handleAddAccessListItem: () => void,
  setSearchInput: Dispatch<SetStateAction<string>>,
  searchInput: string,
  rights: ItemsRights | MediaGroupRights | ManifestGroupRights,
  searchBarLabel:string,
  description:string,
  HandleOpenModalEdit:()=>void,
  thumbnailUrl?:string | null
  metadata?: Record<string, string>;
  isGroups?:boolean
  objectTypes?:ObjectTypes
  getGroupByOption?:(option:any)=>string

}

type MetadataFields = {
  [key: string]: string; // Abstracts all possible key-value pairs where keys are strings and values are strings
};

type MetadataItem = {
  metadata: MetadataFields;
  metadataFormatTitle: string;
};

type MetadataArray = MetadataItem[];

export const MMUModalEdit = <T extends { id: number, created_at:Dayjs,snapShotHash?:string }, G>(
  {
    itemLabel,
    setItemToAdd,
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
    thumbnailUrl,
    metadata,
    isGroups,
    getGroupByOption,
    duplicateItem,
    objectTypes
  }: ModalItemProps<T, G>) => {
  const [newItemTitle, setNewItemTitle] = useState(itemLabel);
  const [newItemDescription, setNewItemDescription] = useState(description);
  const [newItemThumbnailUrl, setNewItemThumbnailUrl] = useState(thumbnailUrl);
  const [newItemDate, setNewItemDate] = useState<Dayjs | null>(dayjs(item.created_at));
  const [newItemMetadataCreator, setNewItemMetadataCreator] = useState(metadata?.creator ? metadata.creator : null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDuplicateModal, setOpenDuplicateModal] = useState(false);
  const [metadataFormData, setMetadataFormData] = useState<MetadataArray>();
  const [tabValue, setTabValue] = useState(0);
  const [metadataFormats, setMetadataFormats] = useState<MetadataFormat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMetadataFormat, setSelectedMetadataFormat] = useState<MetadataFormat | undefined>();
  const user = useUser()
  const handeUpdateMetadata = (updateData:any)=>{
    setMetadataFormData(updateData)
  }


  console.log('metadataFormData',metadataFormData)


  const handleSetSelectedMetadataFormat = (newFormat : MetadataFormat | undefined)=>{
    setSelectedMetadataFormat(newFormat!);
  }
  const handleUpdateItem =  async () => {
    const itemToUpdate = {
      ...item,
      thumbnailUrl: newItemThumbnailUrl,
      title: newItemTitle,
      description: newItemDescription,
    }
    if (objectTypes !== ObjectTypes.GROUP) {
      console.log('metadataFormData',metadataFormData)
      console.log('SAVE -  selected Metadata Format', selectedMetadataFormat)
      await createMetadataForItem( objectTypes! ,item.id, selectedMetadataFormat!.title,metadataFormData  );
    }
    if (updateItem) {
      updateItem(itemToUpdate);
    }
  };



  const fetchMetadataFormat = useCallback(async () => {
    setLoading(true);
    try {
      const metadataFormat = await getMetadataFormat(user.data!.id);
      setMetadataFormats(metadataFormat);
      console.log('metadataFormat',metadataFormat)
      setSelectedMetadataFormat(metadataFormat[0])
    } catch (error) {
      console.error("Failed to fetch metadata formats", error);
    } finally {
      setLoading(false);
    }
  },[user.data]);

  const handleFetchMetadataForObject= async ()=>{
    try{
      if(selectedMetadataFormat !== null){
      const objectMetadata = await gettingMetadataForObject(item.id,objectTypes!);
      console.log('objectMetadata',objectMetadata);
      setMetadataFormData(objectMetadata);
      }
    }catch(error){
      console.error("Failed to fetch metadata formats", error);
    }
  }

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setNewItemTitle(e.target.value);
  }

  const handleChangeThumbnailUrl = (e: ChangeEvent<HTMLInputElement>) => {
    setNewItemThumbnailUrl(e.target.value);
  }

  const handleChangeCreator= (e:ChangeEvent<HTMLInputElement>) =>{
    setNewItemMetadataCreator(e.target.value)
  }

  const handleChangeDescription=(e: ChangeEvent<HTMLInputElement>) => {
    setNewItemDescription(e.target.value);
  }

  const handleConfirmDeleteItemModal =() => {
    setOpenDeleteModal(!openDeleteModal);
  }
  const handleConfirmDuplicateItem =() => {
    setOpenDuplicateModal(!openDuplicateModal);
  }

  const handleDuplicateModal = ()=>{
    setOpenDuplicateModal(!openDuplicateModal)
  }

  useEffect(() => {
    fetchData();
    fetchMetadataFormat();
    handleFetchMetadataForObject()
  }, []);

  const rightsSelectorItems: SelectorItem[] = Object.values(ItemsRights).map((right) => ({
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
    handleUpdateItem();
    HandleOpenModalEdit()
  };

  const confirmDuplicate = (itemId:number)=>{
    if(duplicateItem){
      duplicateItem(itemId)
      setOpenDuplicateModal(!openDuplicateModal)
    }
  }

  const handleChangeTab = (_event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  return (
    <Grid container sx={{overflow:'scroll'}}>
      <Tabs value={tabValue} onChange={handleChangeTab} aria-label="basic tabs example">
        <Tab label="General" {...a11yProps(0)} />
        <Tab label="Share" {...a11yProps(2)} />
        {
          objectTypes !== ObjectTypes.GROUP &&(
            <Tab label="Metadata" {...a11yProps(1)} />
          )
        }
      </Tabs>
      <Grid item container flexDirection="column">
        <CustomTabPanel value={tabValue} index={0}>
          <Grid
            item
            sx={{ minHeight: '200px' }}
            container
            flexDirection="column"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Grid
              item
              sx={{ minHeight: '50px', width: '100%', marginTop:'10px' }}
              container
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <TextField
                type="text"
                label="title"
                onChange={handleChangeTitle}
                variant="outlined"
                defaultValue={itemLabel}
                fullWidth
              />
            </Grid>
            <Grid
              item
              sx={{ minHeight: '50px', width: '100%' }}
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
                label="Creator"
                onChange={handleChangeCreator}
                variant="outlined"
                defaultValue={newItemMetadataCreator}
                multiline
                fullWidth
              />
            </Grid>
            <Grid
              item
              sx={{ minHeight: '50px', width: '100%' }}
              container
              justifyContent="flex-start"
              alignItems="center"
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={"created at"}
                  onChange={(newValue)=>setNewItemDate(newValue)}
                  value={newItemDate }
                />
              </LocalizationProvider>
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
            {/*<Grid*/}
            {/*item*/}
            {/*container*/}
            {/*justifyContent="flex-end"*/}
            {/*alignItems="center"*/}
            {/*>*/}
            {/*  <TaggingForm objectTypes={objectTypes} object={item}/>*/}
            {/*</Grid>*/}
          </Grid>
        </CustomTabPanel>
        {rights !== ItemsRights.READER && listOfItem && setItemToAdd && getOptionLabel !==undefined &&(
          <CustomTabPanel value={tabValue} index={1}>
            <Grid item>
              <ItemList
                item={item}
                objectTypes={objectTypes!}
                snapShotHash={item.snapShotHash? item.snapShotHash : "" }
                handleAddAccessListItem={handleAddAccessListItem}
                setItemToAdd={setItemToAdd}
                items={listOfItem}
                handleSearchModalEditItem={handleSearchModalEditItem}
                removeItem={handleDeleteAccessListItem}
                searchBarLabel={searchBarLabel}
                setSearchInput={setSearchInput}
                handleGetOptionLabel={handleGetOtpionLabel}
                getGroupByOption={getGroupByOption}
              >
                {(accessListItem) => (
                  <Selector
                    selectorItems={rightsSelectorItems}
                    value={accessListItem.rights!}
                    onChange={handleSelectorChange(accessListItem)}
                  />
                )}
              </ItemList>
            </Grid>
          </CustomTabPanel>
        )}
        {
          !isGroups && (
            <CustomTabPanel value={tabValue} index={2}>
              <Grid
                item
                container
                justifyContent="flex-end"
                alignItems="center"
              >
                <MetadataForm
                  objectTypes={objectTypes!}
                  fetchMetadataFormat={fetchMetadataFormat}
                  item={item}
                  setMetadataFormData={handeUpdateMetadata}
                  metadataFormData={metadataFormData!}
                  metadataFormats={metadataFormats}
                  loading={loading}
                  selectedMetadataFormat={selectedMetadataFormat}
                  setSelectedMetadataFormat={handleSetSelectedMetadataFormat}
                  handleFetchMetadataForObject={handleFetchMetadataForObject}
                />
              </Grid>
            </CustomTabPanel>
          )
        }
        {(rights === ItemsRights.ADMIN || rights === ItemsRights.EDITOR) && (
          <Grid
            item
            container
            justifyContent="space-between"
            alignItems="center"
            flexDirection="row"
            sx={{ paddingTop: "20px" }}
          >
            <Grid item container xs={5} spacing={3}>
              <Grid item>
                {rights === ItemsRights.ADMIN && (
                  <Tooltip title={"Delete item"}>
                    <Button
                      color="error"
                      onClick={handleConfirmDeleteItemModal}
                      variant="contained"
                    >
                      DELETE
                    </Button>
                  </Tooltip>
                )}
              </Grid>
              <Grid item>
                {(rights === ItemsRights.ADMIN || rights === ItemsRights.EDITOR) && duplicateItem &&(
                  <Tooltip title="Duplicate">
                    <Button
                      color="primary"
                      onClick={handleDuplicateModal}
                      variant="contained"
                    >
                      DUPLICATE
                    </Button>
                  </Tooltip>
                )}
              </Grid>
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
            <MMUModal width={400} openModal={openDeleteModal} setOpenModal={handleConfirmDeleteItemModal}>
              <ModalConfirmDelete
                deleteItem={deleteItem}
                itemId={item.id}
                itemName={itemLabel}
              />
            </MMUModal>
            <MMUModal width={400} openModal={openDuplicateModal} setOpenModal={handleConfirmDuplicateItem}>
              <Grid>
                <Typography> Are you sure you want to duplicate <b>{itemLabel}</b> ?</Typography>
                <Button onClick={()=>confirmDuplicate(item.id)}>Yes</Button>
                <Button onClick={()=>setOpenDuplicateModal(!openDuplicateModal)}>No</Button>
              </Grid>
            </MMUModal>
          </Grid>
        )}
      </Grid>
    </Grid>
  )
}
