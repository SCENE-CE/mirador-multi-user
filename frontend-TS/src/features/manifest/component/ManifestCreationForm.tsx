import { ChangeEvent, useState } from "react";
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { FieldForm } from "../../../components/elements/FieldForm.tsx";
import { Box } from "@mui/material";
import Divider from '@mui/material/Divider';

interface MediaField {
  name: string;
  value: string;
}

interface ItemGroup {
  media: MediaField[];
}

interface IManifestCreationFormProps{
  setCreateManifestIsOpen:()=>void
  handleSubmit: (manifestTitle: string, items: any)=>void
}


export const ManifestCreationForm = ({setCreateManifestIsOpen, handleSubmit}:IManifestCreationFormProps) => {
  const [manifestTitle, setManifestTitle] = useState<string>("");
  const [items, setItems] = useState<ItemGroup[]>([]);

  const handleNewItemGroup = () => {
    setItems([...items, { media: [{ name: "media-1", value: "" }] }]);
  };

  const handleManifestTitleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setManifestTitle(e.target.value);
  };

  const handleMediaChange = (itemIndex: number, mediaIndex: number, value: string) => {
    console.log(itemIndex, mediaIndex, value);
    console.log('items',items)
    const updatedItems = [...items];
    updatedItems[itemIndex].media[mediaIndex].value = value;
    setItems(updatedItems);
  };

  const handleNewMediaField = (itemIndex: number) => {
    const updatedItems = [...items];
    updatedItems[itemIndex].media.push({
      name: `media-${items[itemIndex].media.length + 1}`,
      value: '',
    });
    setItems(updatedItems);
  };

  const handleRemoveMediaField = (itemIndex: number, mediaIndex: number) => {
    const updatedItems = [...items];
    updatedItems[itemIndex].media = updatedItems[itemIndex].media.filter(
      (_, i) => i !== mediaIndex
    );
    setItems(updatedItems);
  };

  const handleRemoveItem = (itemIndex: number) => {
    const updatedItems = items.filter((_, i) => i !== itemIndex);
    setItems(updatedItems);
  };

//TODO: implement logic to display thumbnail of the media add to the form if it's available in db

  return (
    <Grid container direction="column" spacing={4}>
      <Grid item>
        <Button
          variant="contained"
          onClick={setCreateManifestIsOpen}>
          Back to Manifests
        </Button>
      </Grid>
      <Grid item>
        <FieldForm
          name="manifest-title"
          placeholder="Enter manifest title"
          label="Manifest Title"
          value={manifestTitle}
          onChange={(e) => handleManifestTitleChange(e)}
        />
      </Grid>

      {items.map((item, itemIndex) => (
        <Grid item key={itemIndex}>
          <Paper elevation={3} style={{ padding: '20px', width: '100%' }}>
            <Grid container direction="column" spacing={2}>
              {item.media.map((media, mediaIndex) => (
                <>
                <Grid item key={mediaIndex} container spacing={2} alignItems="center">
                  <Grid item xs>
                    <FieldForm
                      name={media.name}
                      placeholder={`Media url`}
                      label={`Media ${mediaIndex + 1} URL`}
                      value={media.value}
                      onChange={(e) => handleMediaChange(itemIndex, mediaIndex, e.target.value)}
                    />
                  </Grid>
                  { items[itemIndex].media[mediaIndex].value && (
                    <Grid item>
                      <Box
                        component="img"
                        src={items[itemIndex].media[mediaIndex].value}
                        alt={items[itemIndex].media[mediaIndex].value}
                        loading="lazy"
                        sx={{
                          width: 164,
                          height: 164,
                          objectFit: 'cover',
                          '@media(min-resolution: 2dppx)': {
                            width: 164 * 2,
                            height: 164 * 2,
                          },
                        }}
                      />
                    </Grid>
                    )
                  }

                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleRemoveMediaField(itemIndex, mediaIndex)}
                    >
                      Remove Media
                    </Button>
                  </Grid>
                </Grid>
                <Divider />
                </>
              ))}

              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleNewMediaField(itemIndex)}
                >
                  Add Media to canvas {itemIndex + 1}
                </Button>
              </Grid>

              <Grid item>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleRemoveItem(itemIndex)}
                >
                  Remove canvas {itemIndex + 1}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      ))}

      <Grid item>
        <Button variant="contained" color="primary" onClick={handleNewItemGroup}>
          Add New canvas
        </Button>
      </Grid>

      <Grid item>
        <Button variant="contained" color="primary" onClick={()=>handleSubmit(manifestTitle,items)} disabled={items.length < 1}>
          Create
        </Button>
      </Grid>
      <Grid>
      </Grid>
    </Grid>
  );
};

