import {
  Box, CircularProgress, Divider, FormControl,
  Grid, InputLabel, MenuItem,
  Paper, Select, SelectChangeEvent
} from "@mui/material";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import MetadataField from "./metadataField.tsx";
import { useUser } from "../../../utils/auth.tsx";
import { getMetadataFormat } from "../api/getMetadataFormat.ts";
import { MetadataFormat } from "../types/types.ts";

interface MetadataFormProps<T> {
  setMetadataFormData: (data: any) => void;
  metadataFormData:Record<string, string>
  item:T
}
export const MetadataForm = <T extends NonNullable<unknown>,>({ metadataFormData, setMetadataFormData, item }: MetadataFormProps<T>) => {
  const user = useUser();
  const [metadataFormats, setMetadataFormats] = useState<MetadataFormat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [generatingFields, setGeneratingFields] = useState<boolean>(false);
  const [selectedMetadataFormat, setSelectedMetadataFormat] = useState<MetadataFormat | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = useCallback((term: string, value: string) => {
    setMetadataFormData((prevMetadata: { [x: string]: string }) => {
      if (prevMetadata[term] === value) return prevMetadata;
      return { ...prevMetadata, [term]: value };
    });
  }, []);

  const fetchMetadataFormat = useCallback(async () => {
    setLoading(true);
    try {
      const metadataFormat = await getMetadataFormat(user.data!.id);
      setMetadataFormats(metadataFormat);
    } catch (error) {
      console.error("Failed to fetch metadata formats", error);
    } finally {
      setLoading(false);
    }
  }, [user.data]);

  useEffect(() => {
    fetchMetadataFormat();
  }, [fetchMetadataFormat]);

  useEffect(() => {
    if (metadataFormats.length > 0) {
      setGeneratingFields(true);
      setSelectedMetadataFormat(metadataFormats[0]);
      setTimeout(() => {
        setGeneratingFields(false);
      }, 300); // Delay to ensure loading state is displayed
    }
  }, [metadataFormats]);

  const doesItemContainMetadataField = (fieldTerm: string): boolean => {
    return Object.keys(item).some(itemKey => itemKey.toLowerCase() === fieldTerm.toLowerCase());
  };


  const handleFormatChange = (event: SelectChangeEvent) => {
    setGeneratingFields(true);
    const selectedFormatTitle = event.target.value;
    if (selectedFormatTitle === "upload") {
      setSelectedMetadataFormat(null)
      if(fileInputRef.current){
      fileInputRef.current.click();
      }
      return;
    }
    const selectedFormat = metadataFormats.find(format => format.title === selectedFormatTitle);
    setSelectedMetadataFormat(selectedFormat || null);
    setTimeout(() => {
      setGeneratingFields(false);
    }, 300);
  };


  const shouldDisplayField = (field:any): boolean => {
    if (field.term.toLowerCase() === 'date' && 'created_at' in item) return false;
    if (field.term.toLowerCase() === 'creator' && 'ownerId' in item) return false;
    return !doesItemContainMetadataField(field.term);
  };


  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          try {
            const metadata = JSON.parse(e.target.result as string);
            setMetadataFormData(metadata);
          } catch (error) {
            console.error("Failed to parse JSON metadata", error);
          }
        }
      };
      reader.readAsText(file);
    }
  };



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
                {metadataFormats.map((metadataFormat) => (
                  <MenuItem divider={true} key={metadataFormat.id} value={metadataFormat.title}>
                    {metadataFormat.title}
                  </MenuItem>
                ))}
                <MenuItem value="upload">
                  ...Upload metadata with JSON
                </MenuItem>
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
          <form style={{ width: "100%" }}>
          {generatingFields && selectedMetadataFormat !== null? (
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
                        value={metadataFormData[field.term] || ""}
                        handleInputChange={handleInputChange}
                      />
                    ))}
              </Grid>
            )}
            <Grid
              container
              justifyContent="flex-end"
              spacing={2}
              style={{ marginTop: "16px" }}
            >
            </Grid>
          </form>
        </Paper>
      )}
    </>
  );
};
