import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMoreSharp";
import { FormEvent, useCallback } from "react";
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
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Submitted Metadata: ", metadataFormData);
  };

  const doesItemContainMetadataField = (fieldTerm: string): boolean => {
    return Object.keys(item).some(itemKey => itemKey.toLowerCase() === fieldTerm.toLowerCase());
  };

  return (
    <Accordion component={Paper} elevation={1}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="metadata-content"
        id="metadata-header"
      >
        <Typography variant="h6">Metadata</Typography>
      </AccordionSummary>
      <AccordionDetails style={{ maxHeight: "400px", overflowY: "auto" }}>
        <form style={{ width: "100%" }} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {dublinCoreSample
              .filter((field) => !doesItemContainMetadataField(field.term))
              .map((field) =>(
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
            <Grid item>
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
      </AccordionDetails>
    </Accordion>
  );
};

export default MetadataForm;