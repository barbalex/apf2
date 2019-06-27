import React from 'react'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import sortBy from 'lodash/sortBy'

const EkYear = ({ data }) => {
  const ekplans = sortBy(data.filter(o => o.is === 'ekplan'), 'typ')
  const tpopkontrs = sortBy(data.filter(o => o.is === 'ek'), 'typ')

  return (
    <TableRow>
      <TableCell>{data[0].jahr}</TableCell>
      <TableCell>
        {ekplans.map(e => (
          <div>{e.typ}</div>
        ))}
      </TableCell>
      <TableCell>
        {tpopkontrs.map(e => (
          <div>{e.typ}</div>
        ))}
      </TableCell>
    </TableRow>
  )
}

export default EkYear
