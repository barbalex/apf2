import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { sortBy } from 'es-toolkit'

import { styledTableRow } from './EkYear.module.css'

const typRenamed = (e) => {
  switch (e.typ) {
    case 'Freiwilligen-Erfolgskontrolle':
      return 'EKF'
    case 'Zwischenbeurteilung':
      return 'EK'
    default:
      return e.typ
  }
}

export const EkYear = ({ data }) => {
  const ekplans = sortBy(
    data.filter((o) => o.is === 'ekplan'),
    ['typ'],
  )
  const tpopkontrs = sortBy(
    data.filter((o) => o.is === 'ek'),
    ['typ'],
  )

  return (
    <TableRow className={styledTableRow}>
      <TableCell>{data[0].jahr}</TableCell>
      <TableCell>
        {ekplans.map((e) => (
          <div key={e.id}>{e.typ.toUpperCase()}</div>
        ))}
      </TableCell>
      <TableCell>
        {tpopkontrs.map((e) => (
          <div key={e.id}>{typRenamed(e)}</div>
        ))}
      </TableCell>
    </TableRow>
  )
}
