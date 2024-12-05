  import { Grid } from "@mui/material";
  import CollapsibleTable from "../../../components/elements/CollapsibleTable.tsx";
  import { getAllUsers } from "../api/getAllUsers.ts";
  import { User } from "../../auth/types/types.ts";
  import { useEffect, useMemo, useState } from "react";


  const columns = [
    { label: 'ID', align: 'left' as const },
    { label: 'Email', align: 'left' as const },
    { label: 'Name', align: 'left' as const },
    { label: 'Admin', align: 'center' as const },
    { label: 'Email Confirmed', align: 'center' as const },
    { label: 'Created At', align: 'left' as const },
]

  function renderExpandableContent(row: any) {
    return <div>Extra details for {row.data[0].value}</div>;
  }


  export const AdminPanel= () => {
    const [users, setUsers] = useState<User[]>([]);
    const fetchUsers= async ()=>{
    const users = await getAllUsers()
    setUsers(users)
  }

  useEffect(() => {
    fetchUsers()
  })

    const rows = useMemo(() => {
      return users.map((user) => ({
        id: user.id.toString(),
        data: [
          { value: user.id, align: 'left' as const },
          { value: user.mail, align: 'left' as const },
          { value: user.name, align: 'left' as const },
          { value: user._isAdmin ? 'Yes' : 'No', align: 'center' as const },
          { value: user.isEmailConfirmed ? 'Yes' : 'No', align: 'center' as const },
          { value: new Date(user.createdAt).toLocaleString(), align: 'left' as const },
        ],
      }));
    }, [users]);
    function handleActionClick(row: any) {
      console.log('users',users);
    }
    return (
      <Grid>
        <CollapsibleTable
          columns={columns}
          rows={rows}
          renderExpandableContent={renderExpandableContent}
          onActionClick={handleActionClick}
        />
      </Grid>
    )
  }