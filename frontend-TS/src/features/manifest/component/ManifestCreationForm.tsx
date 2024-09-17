import { ChangeEvent, useState } from "react";
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { FieldForm } from "../../../components/elements/FieldForm.tsx";
import { ManifestItem } from "../types/types.ts";

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

  const handleSubmit = async () => {
    const manifestData = {
      title: manifestTitle,
      items: items,
    };

    const manifestToCreate: { items: ManifestItem[][] } = {
      items: items.map(() => []),
    };

    const fetchMediaForItem = async (media: any, index: number): Promise<void> => {
      try {
        const response = await fetch(media.value, { method: "GET" });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const mediaBlob = await response.blob();
        const mediaUrl = URL.createObjectURL(mediaBlob);
        const contentType = response.headers.get("Content-Type");

        if (contentType && contentType.startsWith("image")) {
          const img = new Image();
          img.src = mediaUrl;

          await new Promise<void>((resolve, reject) => {
            img.onload = () => {
              manifestToCreate.items[index].push({
                id: media.value,
                type: "Canvas",
                height: img.height,
                width: img.width,
              });
              resolve();
            };
            img.onerror = reject;
          });
        } else if (contentType && contentType.startsWith("video")) {
          const video = document.createElement("video");
          video.src = mediaUrl;

          await new Promise<void>((resolve, reject) => {
            video.onloadedmetadata = () => {
              manifestToCreate.items[index].push({
                id: media.value,
                type: "Canvas",
                height: video.videoHeight,
                width: video.videoWidth,
                duration: video.duration,
              });
              resolve();
            };
            video.onerror = reject;
          });
        } else {
          console.log("Unsupported media type:", contentType);
        }
      } catch (error) {
        console.log("Error fetching media:", error);
        throw error;
      }
    };

    const fetchMediaPromises = items.flatMap((item, index) =>
      item.media.map((media) => {
        return fetchMediaForItem(media, index);
      })
    );

    try {
      await Promise.all(fetchMediaPromises);
      console.log("All media fetched and manifestToCreate:", manifestToCreate);
      console.log("All media fetched, Manifest Data: ", manifestData);
    } catch (error) {
      console.error("Error processing media", error);
    }
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
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Create
        </Button>
      </Grid>
      <Grid>
      </Grid>
    </Grid>
  );
};

