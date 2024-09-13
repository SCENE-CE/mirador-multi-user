import { ChangeEvent, useState } from "react";
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { FieldForm } from "../../../components/elements/FieldForm.tsx";

interface MediaField {
  name: string;
  value: string;
}

interface ItemGroup {
  media: MediaField[];
}

export const ManifestCreationForm = () => {
  const [manifestTitle, setManifestTitle] = useState<string>(""); // For manifest title
  const [items, setItems] = useState<ItemGroup[]>([]);

  const handleNewItemGroup = () => {
    setItems([...items, { media: [{ name: "media-1", value: "" }] }]);
  };

  const handleManifestTitleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setManifestTitle(e.target.value);
  };

  const handleMediaChange = (itemIndex: number, mediaIndex: number, value: string) => {
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

  const handleSubmit = () => {
    const manifestData = {
      title: manifestTitle,
      items: items,
    };
    console.log("Manifest Data: ", manifestData);
    // Add your submit logic here (e.g., send to an API or further processing)
  };

  return (
    <Grid container direction="column" spacing={4}>
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
                <Grid item key={mediaIndex} container spacing={2} alignItems="center">
                  <Grid item xs>
                    <FieldForm
                      name={media.name}
                      placeholder={`Media field ${mediaIndex + 1}`}
                      label={`Media ${mediaIndex + 1}`}
                      value={media.value}
                      onChange={(e) => handleMediaChange(itemIndex, mediaIndex, e.target.value)}
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleRemoveMediaField(itemIndex, mediaIndex)}
                    >
                      Remove Field
                    </Button>
                  </Grid>
                </Grid>
              ))}

              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleNewMediaField(itemIndex)}
                >
                  Add Media to Item {itemIndex + 1}
                </Button>
              </Grid>

              <Grid item>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleRemoveItem(itemIndex)}
                >
                  Remove Item {itemIndex + 1}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      ))}

      <Grid item>
        <Button variant="contained" color="primary" onClick={handleNewItemGroup}>
          Add New Item
        </Button>
      </Grid>

      <Grid item>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Create
        </Button>
      </Grid>
    </Grid>
  );
};

