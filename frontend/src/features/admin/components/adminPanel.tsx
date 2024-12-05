import { Grid } from "@mui/material";
import CollapsibleTable from "../../../components/elements/CollapsibleTable.tsx";


const columns = [
  { label: 'Dessert (100g serving)', align: 'left' as const },
  { label: 'Calories', align: 'right' as const },
  { label: 'Fat (g)', align: 'right' as const },
  { label: 'Carbs (g)', align: 'right' as const },
  { label: 'Protein (g)', align: 'right' as const },
];

const rows = [
  {
    id: '1',
    data: [
      { value: 'Ice Cream', align: 'left' as const },
      { value: 200, align: 'right' as const },
      { value: 10, align: 'right' as const },
      { value: 30, align: 'right' as const },
      { value: 5, align: 'right' as const },
    ],
  },
  {
    id: '2',
    data: [
      { value: 'Cake', align: 'left' as const },
      { value: 300, align: 'right' as const },
      { value: 15, align: 'right' as const },
      { value: 40, align: 'right' as const },
      { value: 6, align: 'right' as const },
    ],
  },
];

function renderExpandableContent(row: any) {
  return <div>Extra details for {row.data[0].value}</div>;
}


export const AdminPanel= () => {

  function handleActionClick(row: any) {
    console.log(`Action clicked for row:`, row);
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