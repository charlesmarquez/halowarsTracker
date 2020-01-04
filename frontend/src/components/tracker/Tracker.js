import React, { useMemo } from 'react'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks';

import CssBaseline from '@material-ui/core/CssBaseline'
import MaUTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { useTable, useSortBy, useFilters } from 'react-table'
import { AppBar } from '@material-ui/core';

import SearchAppBar from './SearchAppBar'

const leaderboardQuery = gql`
  query{
    PlayerActivity {
      LastUpdated
      Players{
        _id
        Playlist
        LastOnline
        LastOnlineVal
      }
    }
  }
`
function Table({ columns, data }) {
    // Use the state and functions returned from useTable to build your UI
    const {
      getTableProps,
      getTableHeaderProps,
      headerGroups,
      rows,
      prepareRow
    } = useTable({
      columns,
      data,
      initialState: {
        sortBy: [
          {
            id: 'lastOnlineVal',
            desc: true,
          }
        ]
      }
    }, 
    useFilters,
    useSortBy)
  
    // Render the UI for your table
    return (
      <MaUTable {...getTableProps()}>
        <TableHead>
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <TableCell {...column.getHeaderProps()}>
                  {column.render('Header')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {rows.map(
            (row, i) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <TableCell {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )}
          )}
        </TableBody>
      </MaUTable>
    )
  }

export default function Tracker() {

    const columns = useMemo(
        () => [
                {
                  Header: 'Gamertag',
                  accessor: '_id',
                  disableSorting: true,
                  Cell: props => <b>{props.row.original._id}</b>
                },
                {
                  Header: 'Last Online',
                  accessor: 'LastOnlineVal',
                  sortDescFirst: true,
                  Cell: props => <b>{props.row.original.LastOnline}</b>
                },
                {
                  Header: 'Playlist',
                  accessor: 'Playlist',
                  disableSorting: true,
                  Cell: props => <b>{props.row.original.Playlist}</b>
                }
        ],
        []
      )

      let { loading, error, data } = useQuery(leaderboardQuery, {
        pollInterval: 14444
      });

      if (loading) return 'Loading...';
      if (error) return `Error! ${error}`;

      return (
          <div>
          <SearchAppBar data={data.PlayerActivity}/>
          <CssBaseline />
          <Table columns={columns} data={data.PlayerActivity.Players} />
          </div>
          )
    }
    