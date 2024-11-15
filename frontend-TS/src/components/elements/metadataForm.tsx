import {
  Grid,
  Paper,
} from "@mui/material";
import {  useCallback } from "react";
import { dublinCoreSample } from "../../utils/dublinCoreSample.ts";
import MetadataField from "./metadataField.tsx";

interface MetadataFormProps<T> {
  setMetadataFormData: (data: any) => void;
  metadataFormData:Record<string, string>
  item:T
}

const MetadataForm = <T extends NonNullable<unknown>,>({metadataFormData,setMetadataFormData,item}:MetadataFormProps<T>) => {

  console.log('metadataFormData',metadataFormData)
  const handleInputChange = useCallback((term: string, value: string) => {
    setMetadataFormData((prevMetadata: { [x: string]: string; }) => {
      if (prevMetadata[term] === value) return prevMetadata;
      return { ...prevMetadata, [term]: value };
    });
  }, []);

  const doesItemContainMetadataField = (fieldTerm: string): boolean => {
    return Object.keys(item).some(itemKey => itemKey.toLowerCase() === fieldTerm.toLowerCase());
  };

  return (
      <Paper
        elevation={1}
        sx={{
          minHeight: '55px',
          height: '400px',
          overflowY: 'auto',
        }}
      >
        <form style={{ width: "100%" }}>
          <Grid container spacing={2}>
            {dublinCoreSample
              .filter((field) => {
                if (field.term.toLowerCase() === 'date' && 'created_at' in item) return false;
                if (field.term.toLowerCase() === 'creator' && 'ownerId' in item) return false;
                return !doesItemContainMetadataField(field.term);
              })
              .map((field)  =>(
              <MetadataField
                key={field.term}
                field={field}
                value={metadataFormData[field.term] || ""}
                handleInputChange={handleInputChange}
              />
            ))}
          </Grid>
          <Grid
            container
            justifyContent="flex-end"
            spacing={2}
            style={{ marginTop: "16px" }}
          >
          </Grid>
        </form>
    </Paper>
  );
};

export default MetadataForm;