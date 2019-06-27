import React from 'react'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import sortBy from 'lodash/sortBy'
import styled from 'styled-components'

const StyledTableRow = styled(TableRow)`
  &:hover {
    background: rgba(255, 211, 167, 0.3) !important;
  }
`

const typRenamed = e => {
  switch (e.typ) {
    case 'Freiwilligen-Erfolgskontrolle':
      return 'EKF'
    case 'Zwischenbeurteilung':
      return 'EK'
    default:
      return e.typ
  }
}

const EkYear = ({ data }) => {
  const ekplans = sortBy(data.filter(o => o.is === 'ekplan'), 'typ')
  const tpopkontrs = sortBy(data.filter(o => o.is === 'ek'), 'typ')

  return (
    <StyledTableRow>
      <TableCell>{data[0].jahr}</TableCell>
      <TableCell>
        {ekplans.map(e => (
          <div key={e.id}>{e.typ.toUpperCase()}</div>
        ))}
      </TableCell>
      <TableCell>
        {tpopkontrs.map(e => (
          <div key={e.id}>{typRenamed(e)}</div>
        ))}
      </TableCell>
    </StyledTableRow>
  )
}

export default EkYear
