import {
  Box, CircularProgress, Divider, FormControl,
  Grid, InputLabel, MenuItem,
  Paper, Select, SelectChangeEvent
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
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

  const handleInputChange = useCallback((term: string, value: string) => {
    setMetadataFormData((prevMetadata: { [x: string]: string }) => {
      if (prevMetadata[term] === value) return prevMetadata;
      return { ...prevMetadata, [term]: value };
    });
  }, []);

  const fetchMetadataFormat = async () => {
    setLoading(true);
    const metadataFormat = await getMetadataFormat(user.data!.id);
    setMetadataFormats(metadataFormat);
    setLoading(false);
  };

  useEffect(() => {
    fetchMetadataFormat();
  }, []);

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
    const selectedFormat = metadataFormats.find(format => format.title === selectedFormatTitle);
    setSelectedMetadataFormat(selectedFormat || null);
    setTimeout(() => {
      setGeneratingFields(false);
    }, 300);
  };

  console.log('metadataFormats', metadataFormats);
  console.log('selectedMetadataFormat', selectedMetadataFormat);

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
            <FormControl sx={{ width: '90%' }}>
              <InputLabel id="metadata-format-label">Format</InputLabel>
              <Select
                labelId="metadata-format-label"
                value={selectedMetadataFormat ? selectedMetadataFormat.title : ''}
                label="Format"
                onChange={handleFormatChange}
              >
                {metadataFormats.map((metadataFormat) => (
                  <MenuItem key={metadataFormat.id} value={metadataFormat.title}>
                    {metadataFormat.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Divider sx={{ paddingBottom: 2 }} />
          </Box>
          <form style={{ width: "100%" }}>
            {generatingFields ? (
              <Grid container alignItems='center' justifyContent="center">
              <CircularProgress/>
              </Grid>
            ) : (
              <Grid container spacing={2}>
                {selectedMetadataFormat &&
                  selectedMetadataFormat.metadata
                    .filter((field) => {
                      if (field.term.toLowerCase() === 'date' && 'created_at' in item) return false;
                      if (field.term.toLowerCase() === 'creator' && 'ownerId' in item) return false;
                      return !doesItemContainMetadataField(field.term);
                    })
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
