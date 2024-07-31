import { Card, Grid, Typography, CardActions } from '@mui/material';
import { MMUModal } from "./modal.tsx";
import { ReactNode } from "react";
import placeholder from '../../assets/Placeholder.svg'
interface IMMUCardProps {
  item: {
    name: string;
  };
  description?: string;
  ModalChildren: ReactNode;
  HandleOpenModal: () => void;
  openModal: boolean;
  ButtonChildren: ReactNode;
}

const MMUCard = (
  {
    item,
    description,
    ModalChildren,
    HandleOpenModal,
    openModal,
    ButtonChildren,
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
            <Typography variant="subtitle1">{item.name}</Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            {description}
          </Grid>
        </Grid>
        <Grid item alignSelf="center">
          <CardActions>
            <Grid item container flexDirection="row" wrap="nowrap" spacing={2}>
              <Grid item container>
                {ButtonChildren}
              </Grid>
            </Grid>
          </CardActions>
          <MMUModal
            width={500}
            openModal={openModal}
            setOpenModal={HandleOpenModal}
          >
            {ModalChildren}
          </MMUModal>
        </Grid>
      </Grid>
    </Card>
  );
};

export default MMUCard;
