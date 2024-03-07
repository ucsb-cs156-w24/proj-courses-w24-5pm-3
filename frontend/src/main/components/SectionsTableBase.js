import React, { Fragment } from 'react';
import { useTable, useGroupBy, useExpanded } from 'react-table';
import { Table, Button } from 'react-bootstrap';

export default function SectionsTableBase({
  columns,
  data,
  testid = 'testid',
  addCallback, // Make sure to pass this function as a prop from the parent component
}) {
  const extendedColumns = React.useMemo(() => [
    ...columns,
    {
      id: 'addAction',
      Header: 'Add',
      Cell: ({ row }) => {
        // Render the Add button only for section rows, identified by not being grouped
        if (row.original || (!row.original && row.subRows.length == 1)) {
          return <Button onClick={() => addCallback(row.original)}>Add</Button>;
        }
        return null; // Return null for rows that should not have an Add button (like grouped rows)
      }
    }
  ], [columns, addCallback]);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      initialState: {
        groupBy: ['courseInfo.courseId'],
        hiddenColumns: ['isSection'],
      },
      columns: extendedColumns,
      data,
    },
    useGroupBy,
    useExpanded
  );

  return (
    <Table {...getTableProps()} striped bordered hover>
      <thead key="thead">
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps()}
                data-testid={`${testid}-header-${column.id}`}
              >
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()} key="tbody">
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <Fragment key={`row-${i}`}>
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, _index) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      data-testid={`${testid}-cell-row-${cell.row.index}-col-${cell.column.id}`}
                      style={{
                        background: cell.isGrouped ? '#34859b' : cell.isAggregated ? '#34859b' : '#9dbfbe',
                        color: cell.isGrouped ? '#effcf4' : cell.isAggregated ? '#effcf4' : '#000000',
                        fontWeight: cell.isGrouped ? 'bold' : cell.isAggregated ? 'bold' : 'normal',
                      }}
                    >
                      {cell.isGrouped ? (
                        <>
                          <span {...row.getToggleRowExpandedProps()} data-testid={`${testid}-cell-row-${cell.row.index}-col-${cell.column.id}-expand-symbols`}>
                            {row.subRows.length > 1 ? (row.isExpanded ? '➖ ' : '➕ ') : null}
                          </span>
                          {cell.render('Cell')}
                        </>
                      ) : cell.isAggregated ? (
                        cell.render('Aggregated')
                      ) : (
                        <>
                        {cell.render('Cell')}
                        </>
                      )}
                    </td>
                  );
                })}
              </tr>
            </Fragment>
          );
        })}
      </tbody>
    </Table>
  );
}
