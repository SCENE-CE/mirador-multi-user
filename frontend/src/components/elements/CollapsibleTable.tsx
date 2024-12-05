import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Row } from "./Row.tsx";
import { ReactNode } from "react";

interface RowData {
  value: ReactNode;
  align?: 'right' | 'left' | 'center';
}
interface RowProps {
  id: string;
  data: RowData[];
}

interface Column {
  label: string;
  align?: 'right' | 'left' | 'center';
}

interface CollapsibleTableProps {
  columns: Column[];
  rows: RowProps[];
  renderExpandableContent?: (row: RowProps) => ReactNode;
  onActionClick?: (row: RowProps) => void;
}

export default function CollapsibleTable(
  {
    columns,
    rows,
    renderExpandableContent,
    onActionClick,
  }: CollapsibleTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            {columns.map((column, index) => (
              <TableCell key={index} align={column.align || 'left'}>
                {column.label}
              </TableCell>
            ))}
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row
              key={row.id}
              row={row}
              renderExpandableContent={renderExpandableContent}
              onActionClick={onActionClick}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}