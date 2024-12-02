import {
  Box, CircularProgress, Divider, FormControl,
  Grid, InputLabel, MenuItem,
  Paper, Select, SelectChangeEvent
} from "@mui/material";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import MetadataField from "./metadataField.tsx";
import { useUser } from "../../../utils/auth.tsx";
import { labelMetadata } from "../types/types.ts";
import { uploadMetadataFormat } from "../api/uploadMetadataFormat.ts";

interface MetadataFormProps<T> {
  handleSetMetadataFormData: (data: any) => void;
  item:T
  metadataFormats:MetadataFormat[]
  loading: boolean
  fetchMetadataFormat:()=>void;
  selectedMetadataFormat:MetadataFormat | undefined;
  setSelectedMetadataFormat:(newFormat: MetadataFormat | undefined)=>void;
  selectedMetadataData:MetadataFields | undefined;
}

type MetadataFields = {
  [key: string]: string;
};


type MetadataFormat = {
  id: number;
  title: string;
  creatorId: number;
  metadata: MetadataFormatField[];
};

type MetadataFormatField = {
  term: string;
  label: string;
  uri: string;
  definition: string;
  comment?: string;
};

export const MetadataForm = <T extends { id:number },>({selectedMetadataData,setSelectedMetadataFormat,selectedMetadataFormat,fetchMetadataFormat,loading,metadataFormats, handleSetMetadataFormData, item }: MetadataFormProps<T>) => {
  const user = useUser();
  const [generatingFields, setGeneratingFields] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = useCallback((term: string, value: string | null | undefined) => {
    const newValue = value ?? '';
    handleSetMetadataFormData({
      ...selectedMetadataData,
      [term]: newValue,
    })
  }, [selectedMetadataData]);

  const doesItemContainMetadataField = (fieldTerm: string): boolean => {
    return Object.keys(item).some(itemKey => itemKey.toLowerCase() === fieldTerm.toLowerCase());
  };

  const handleFormatChange = async (event: SelectChangeEvent) => {
    setGeneratingFields(true);
    const selectedFormatTitle = event.target.value;
    if (selectedFormatTitle === "upload") {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
      return;
    }
    const selectedFormat = metadataFormats.find(format => format.title === selectedFormatTitle);
    setSelectedMetadataFormat(selectedFormat || undefined);
    setTimeout(() => {
      setGeneratingFields(false);
    }, 300);
  };

  const shouldDisplayField = (field:any): boolean => {
    if (field.term.toLowerCase() === 'date' && 'created_at' in item) return false;
    if (field.term.toLowerCase() === 'creator' && 'ownerId' in item) return false;
    return !doesItemContainMetadataField(field.term);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          try {
            const metadata = JSON.parse(e.target.result as string);
            console.log('metadata',metadata)
            const labelIndex = metadata.findIndex((item:labelMetadata) => item.term === "metadataFormatLabel");
            console.log('labelIndex',labelIndex)
            if (labelIndex !== -1) {
              const label = metadata[labelIndex].label;
              const updatedMetadata = metadata.filter((_:any, index:number) => index !== labelIndex);
              await uploadMetadataFormat(label, updatedMetadata, user.data!.id);
              fetchMetadataFormat();
            } else {
              throw new Error("Label field not found in metadata");
            }
          } catch (error) {
            console.error("Failed to parse JSON metadata", error);
          }
        }
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {},[selectedMetadataFormat])
  return (
    <>
      {loading ? (
        <Grid container alignItems='center' justifyContent="center">
          <CircularProgress/>
        </Grid>
      ) : (
        <Paper
          elevation={1}
          sx={{
            minHeight: '55px',
            height: '400px',
            overflowY: 'auto',
            width: '100%',
          }}
        >
          <Box sx={{ minWidth: 120, paddingTop: 2, paddingBottom: 2 }}>
            <FormControl sx={{ width: "90%" }}>
              <InputLabel id="metadata-format-label">Format</InputLabel>
              <Select
                labelId="metadata-format-label"
                value={selectedMetadataFormat ? selectedMetadataFormat.title : ""}
                label="Format"
                onChange={handleFormatChange}
              >
                <MenuItem value="upload">
                  ... Upload new metadata template
                </MenuItem>
                {metadataFormats.map((metadataFormat) => (
                  <MenuItem divider={true} key={metadataFormat.id} value={metadataFormat.title}>
                    {metadataFormat.title}
                  </MenuItem>
                ))}
              </Select>
              <input
                type="file"
                ref={fileInputRef}
                hidden
                onChange={handleFileChange}
                accept="application/json"
              />
            </FormControl>
            <Divider sx={{ paddingBottom: 2 }} />
          </Box>
          {
            selectedMetadataData && selectedMetadataFormat ?(
              <form style={{ width: "100%" }}>
                <>
                  {generatingFields ? (
                    <Grid container alignItems="center" justifyContent="center">
                      <CircularProgress />
                    </Grid>
                  ) : (
                    <Grid container spacing={2}>
                      {selectedMetadataFormat &&
                        selectedMetadataFormat.metadata
                          .filter(shouldDisplayField)
                          .map((field) => (
                            <MetadataField
                              key={field.term}
                              field={field}
                              value={selectedMetadataData[field.term] as unknown as string|| ""}
                              handleInputChange={handleInputChange}
                            />
                          ))}
                    </Grid>
                  )}

                </>
                <Grid
                  container
                  justifyContent="flex-end"
                  spacing={2}
                  style={{ marginTop: "16px" }}
                >
                </Grid>
              </form>
            ): null
          }
        </Paper>
      )}
    </>
  );
};
