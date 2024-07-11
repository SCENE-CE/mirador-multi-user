import { Button, Card, CardActions, Grid, Tooltip, Typography } from "@mui/material";
import { UserGroup } from "../types/types.ts";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { useCallback, useState } from "react";
import placeholder from "../../../assets/Placeholder.svg";
import { MMUModal } from "../../../components/elements/modal.tsx";
import { ModalEditGroup } from "./ModalEditGroup.tsx";

interface GroupCardProps {
  group: UserGroup;
  personalGroup: UserGroup;
}
export const GroupCard = ({ group ,personalGroup}:GroupCardProps)=>{
  const [openModal, setOpenMOdal] = useState(false)

  const HandleOpenModal = useCallback(()=>{
    setOpenMOdal(!openModal)
  },[setOpenMOdal,openModal])

  console.log('personalGroup GROUP CARD',personalGroup)
  return(
    <Card>
      <Grid item container flexDirection="row" wrap="nowrap" justifyContent="space-between" sx={{minHeight:'120px'}}>
        <Grid item container flexDirection="row"  alignItems="center" justifyContent="flex-start" spacing={2}>
          <Grid item xs={12} sm={4}>
            <img src={placeholder} alt="placeholder" style={{height:100, width:200}}/>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1">{group.name}</Typography>
          </Grid>
        </Grid>
        <Grid item
              alignSelf="center"
        >
          <CardActions>
            <Grid item>
              <Tooltip title={"Project configuration"}>
                <Button
                  onClick={HandleOpenModal}
                  variant="contained"
                >
                  <ModeEditIcon/>
                </Button>
              </Tooltip>
            </Grid>
          </CardActions>
          <MMUModal openModal={openModal} setOpenModal={HandleOpenModal} children={<ModalEditGroup group={group} personalGroup={personalGroup}/>}/>
        </Grid>
      </Grid>
    </Card>
  )
}
