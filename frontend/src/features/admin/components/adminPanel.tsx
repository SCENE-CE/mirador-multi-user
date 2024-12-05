  import { Grid } from "@mui/material";
  import CollapsibleTable from "../../../components/elements/CollapsibleTable.tsx";
  import { getAllUsers } from "../api/getAllUsers.ts";
  import { User } from "../../auth/types/types.ts";
  import { ReactNode, useEffect, useMemo, useState } from "react";

  interface RowData {
    value: ReactNode;
    align?: 'right' | 'left' | 'center';
  }
  interface RowProps {
    id: string;
    data: RowData[];
  }

  const columns = [
    { label: 'ID', align: 'left' as const, sortKey: 'id' },
    { label: 'Email', align: 'left' as const, sortKey: 'mail' },
    { label: 'Name', align: 'left' as const, sortKey: 'name' },
    { label: 'Admin', align: 'center' as const, sortKey: '_isAdmin' },
    { label: 'Email Confirmed', align: 'center' as const, sortKey: 'isEmailConfirmed' },
    { label: 'Created At', align: 'left' as const, sortKey: 'createdAt' },
  ];
  function renderExpandableContent(row: RowProps) {
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

    function handleActionClick(row: RowProps) {
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