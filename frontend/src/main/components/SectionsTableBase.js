import React, { Fragment } from "react";
import { useTable, useGroupBy, useExpanded } from "react-table";
import { Table, Button } from "react-bootstrap";

// Stryker disable StringLiteral, ArrayDeclaration
export default function SectionsTableBase({
  columns,
  data,
  testid = "testid",
  addCallback,
}) {
  const extendedColumns = React.useMemo(
    () => [
      ...columns,
      {
        id: "addAction",
        Header: "Add Section",
        Cell: ({ row }) => {
          if (row.original || (!row.original && row.subRows.length === 1)) {
            return (
              <Button
                style={{ backgroundColor: "#003660", borderColor: "#003660" }}
                onClick={() => addCallback(row.original ? row.original : row)}
              >
                Add
              </Button>
            );
          }
          return null;
        },
      },
    ],
    [columns, addCallback],
  );
  // Stryker disable next-line ObjectLiteral
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        initialState: {
          groupBy: ["courseInfo.courseId"],
          hiddenColumns: ["isSection"],
        },
        columns: extendedColumns,
        data,
      },
      useGroupBy,
      useExpanded,
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
              {row.cells[0].isGrouped ||
              (!row.cells[0].isGrouped && row.allCells[3].value) ? (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell, _index) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        data-testid={`${testid}-cell-row-${cell.row.index}-col-${cell.column.id}`}
                        // Stryker disable next-line ObjectLiteral
                        style={{
                          background: cell.isGrouped
                            ? "#34859b"
                            : cell.isAggregated
                            ? "#34859b"
                            : "#9dbfbe",
                          color: cell.isGrouped
                            ? "#effcf4"
                            : cell.isAggregated
                            ? "#effcf4"
                            : "#000000",
                          fontWeight: cell.isGrouped
                            ? "bold"
                            : cell.isAggregated
                            ? "bold"
                            : "normal",
                        }}
                      >
                        {cell.isGrouped ? (
                          <>
                            <span
                              {...row.getToggleRowExpandedProps()}
                              data-testid={`${testid}-cell-row-${cell.row.index}-col-${cell.column.id}-expand-symbols`}
                            >
                              {row.subRows.length > 1
                                ? row.isExpanded
                                  ? "➖ "
                                  : "➕ "
                                : null}
                            </span>
                            {cell.render("Cell")}
                          </>
                        ) : cell.isAggregated ? (
                          cell.render("Aggregated")
                        ) : (
                          <>{cell.render("Cell")}</>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ) : null}
            </Fragment>
          );
        })}
      </tbody>
    </Table>
  );
}
