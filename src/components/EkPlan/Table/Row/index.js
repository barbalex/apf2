import React, { useContext } from 'react'
import TableRow from '@material-ui/core/TableRow'
import styled from 'styled-components'
import ErrorBoundary from 'react-error-boundary'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'

import CellForEkfrequenz from './CellForEkfrequenz'
import CellForEkAbrechnungstyp from './CellForEkAbrechnungstyp'
import CellForEkfrequenzAbweichend from './CellForEkfrequenzAbweichend'
import CellForTpopLink from './CellForTpopLink'
import CellForYear from './CellForYear'
import CellForYearTitle from './CellForYearTitle'
import CellForValue from './CellForValue'
import storeContext from '../../../../storeContext'

const StyledTableRow = styled(TableRow)`
  position: relative !important;
  display: block !important;
  height: 100%;
  &:hover td {
    background: hsla(45, 100%, 90%, 1) !important;
  }
  td {
    background: #fffde7;
  }
  &:nth-of-type(odd) td {
    background: #fffffc;
  }
`

const EkPlanTableRow = ({ row }) => {
  const store = useContext(storeContext)
  const { fields } = store.ekPlan

  //console.log('Row rendering')

  return (
    <ErrorBoundary>
      <>
        <StyledTableRow>
          {sortBy(
            Object.values(row)
              .filter(o => typeof o === 'object')
              .filter(o => !!o.name)
              .filter(o => fields.includes(o.name) || !!o.alwaysShow),
            'sort',
          ).map(field => {
            if (field.name === 'yearTitle') {
              return <CellForYearTitle key={field.name} field={field} />
            }
            if (field.name === 'ekAbrechnungstyp') {
              return (
                <CellForEkAbrechnungstyp
                  key={field.name}
                  row={row}
                  field={field}
                />
              )
            }
            if (field.name === 'ekfrequenz') {
              return (
                <CellForEkfrequenz key={field.name} row={row} field={field} />
              )
            }
            if (field.name === 'ekfrequenzAbweichend') {
              return (
                <CellForEkfrequenzAbweichend
                  key={field.name}
                  row={row}
                  field={field}
                />
              )
            }
            if (field.name === 'link') {
              return <CellForTpopLink key={field.name} field={field} />
            }
            // DANGER: null is also an object!!
            if (field.value && typeof field.value === 'object') {
              return <CellForYear key={field.label} row={row} field={field} />
            }
            return <CellForValue key={field.label} field={field} />
          })}
        </StyledTableRow>
      </>
    </ErrorBoundary>
  )
}

export default observer(EkPlanTableRow)
