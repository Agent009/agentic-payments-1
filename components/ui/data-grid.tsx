"use client";

import * as React from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";

import { DataTablePagination } from "./data-table-pagination.tsx";
import { DataTableToolbar } from "./data-table-toolbar.tsx";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterColumn?: string;
  searchPlaceholder?: string;
}

export function DataGrid<TData, TValue>({
  columns,
  data,
  filterColumn = "name",
  searchPlaceholder = "Filter...",
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const columns2: ColumnDef<TData, TValue>[] = columns.map((column) => ({
    ...column,
    enableSorting: true,
    sortingFn: column.sortingFn || "basic",
  }));

  const table = useReactTable({
    data,
    columns: columns2,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} filterColumn={filterColumn} searchPlaceholder={searchPlaceholder} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const columnSize = header.column.columnDef.size;
                  const columnMaxSize = header.column.columnDef.maxSize;
                  // const columnSizeCls = columnSize ? `w-${columnSize}` : "";
                  // const columnMaxSizeCls = columnMaxSize ? `max-w-${columnMaxSize}` : "";

                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        width: typeof columnSize === "number" ? `${columnSize}px` : columnSize,
                        maxWidth: typeof columnMaxSize === "number" ? `${columnMaxSize}px` : columnMaxSize,
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort() ? "cursor-pointer select-none" : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => {
                    const columnSize = cell.column.columnDef.size;
                    const columnMaxSize = cell.column.columnDef.maxSize;
                    // const columnSizeCls = columnSize ? `w-${columnSize}` : "";
                    // const columnMaxSizeCls = columnMaxSize ? `max-w-${columnMaxSize}` : "";
                    return (
                      <TableCell
                        key={cell.id}
                        // className={cn(columnSizeCls, columnMaxSizeCls)}
                        style={{
                          width: typeof columnSize === "number" ? `${columnSize}px` : columnSize,
                          maxWidth: typeof columnMaxSize === "number" ? `${columnMaxSize}px` : columnMaxSize,
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
