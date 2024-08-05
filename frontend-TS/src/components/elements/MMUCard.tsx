import { Card, Grid, Typography, CardActions, Tooltip } from "@mui/material";
import { MMUModal } from "./modal.tsx";
import { ReactElement, ReactNode } from "react";
import placeholder from '../../assets/Placeholder.svg'

interface IMMUCardProps {
  name: string;
  id: number;
  rights: string;
  description?: string;
  ModalChildren: ReactNode;
  HandleOpenModal: () => void;
  openModal: boolean;
  DefaultButton: ReactElement;
  ReaderButton: ReactElement;
  EditorButton: ReactElement;
}

const MMUCard = (
  {
    name,
    id,
    rights,
    description,
    ModalChildren,
    HandleOpenModal,
    openModal,
    DefaultButton,
    ReaderButton,
    EditorButton,
  }:IMMUCardProps
) => {
  return (
    <Card>
      <Grid item container flexDirection="row" wrap="nowrap" justifyContent="space-between" sx={{ minHeight: '120px' }}>
        <Grid item container flexDirection="row" alignItems="center" justifyContent="flex-start" spacing={2}>
          <Grid item xs={12} sm={4}>
            <img src={placeholder} alt="placeholder" style={{ height: 100, width: 150 }} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1">{name}</Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            {description}
          </Grid>
        </Grid>
        <Grid item alignSelf="center">
          <CardActions>
            <Grid item container flexDirection="row" wrap="nowrap" spacing={2}>
              <Grid item container>
                <CardActions>
                  <Grid item container flexDirection="row" wrap="nowrap" spacing={2}>
                    <Grid item>
                      <Tooltip title={"Open project"}>
                        {DefaultButton}
                      </Tooltip>
                    </Grid>
                    {id  && (
                      <>
                        <Grid item>
                          {rights === 'READER' ? ReaderButton : EditorButton}
                        </Grid>
                      </>
                    )}
                  </Grid>
                </CardActions>
              </Grid>
            </Grid>
          </CardActions>
          <MMUModal
            width={500}
            openModal={openModal}
            setOpenModal={HandleOpenModal}
            children={ModalChildren}
          >
          </MMUModal>
        </Grid>
      </Grid>
    </Card>
  );
};

export default MMUCard;
