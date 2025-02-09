import { memo, useRef, useContext } from 'react'
import styled from '@emotion/styled'
import Button from '@mui/material/Button'
import { gql, useQuery } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../../mobxContext.js'
import { yearColumnWidth } from '../yearColumnWidth.js'
import { CellForYearTitle } from '../CellForYearTitle.jsx'
import { CellForEkfrequenz } from '../CellForEkfrequenz/index.jsx'
import { CellForEkfrequenzStartjahr } from '../CellForEkfrequenzStartjahr/index.jsx'
import { CellForEkfrequenzAbweichend } from '../CellForEkfrequenzAbweichend.jsx'
import { CellForTpopLink } from '../CellForTpopLink.jsx'
import { CellForValue } from '../CellForValue.jsx'
import { CellForYear } from '../CellForYear/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { useOnScreen } from '../../../../modules/useOnScreen.js'
import { queryRow } from './queryRow.js'
import { tpopRowFromTpop } from './tpopRowFromTpop.js'
import { yearRowFromTpop } from './yearRowFromTpop.js'

const RowContainer = styled.div`
  display: flex;
  height: 60px;
  min-height: 60px;
`

export const TpopRow = memo(
  observer(({ tpop, index, setProcessing, years }) => {
    const store = useContext(MobxContext)
    const ref = useRef(null)
    const isVisible = useOnScreen(ref)

    const row = tpopRowFromTpop({ tpop, index, store })
    const tpopColumns = Object.values(row)
      .filter((o) => typeof o === 'object')
      .filter((o) => !!o.name)
      .filter((o) => store.ekPlan.fields.includes(o.name) || !!o.alwaysShow)
    const yearRow = yearRowFromTpop({
      tpop,
      years,
      index,
    })

    return (
      <ErrorBoundary>
        <RowContainer ref={ref}>
          {isVisible &&
            tpopColumns.map((tpopColumn, columnIndex) => {
              const value = row[tpopColumn.name]
              const column = tpopColumn.name
              const width = tpopColumn.width

              if (value.name === 'yearTitle') {
                return (
                  <CellForYearTitle key={value.name} row={row} width={width} />
                )
              }
              if (value.name === 'ekAbrechnungstyp') {
                return (
                  <CellForValue
                    key={value.name}
                    field={value}
                    row={row}
                    firstChild={columnIndex === 0}
                    width={width}
                  />
                )
              }
              if (value.name === 'ekfrequenz') {
                return (
                  <CellForEkfrequenz
                    key={value.name}
                    row={row}
                    field={value}
                    setProcessing={setProcessing}
                    width={width}
                  />
                )
              }
              if (value.name === 'ekfrequenzStartjahr') {
                return (
                  <CellForEkfrequenzStartjahr
                    key={value.name}
                    row={row}
                    setProcessing={setProcessing}
                    width={width}
                  />
                )
              }
              if (value.name === 'ekfrequenzAbweichend') {
                return (
                  <CellForEkfrequenzAbweichend
                    key={value.name}
                    row={row}
                    field={value}
                    width={width}
                  />
                )
              }
              if (value.name === 'link') {
                return (
                  <CellForTpopLink
                    key={value.name}
                    field={value}
                    row={row}
                    width={width}
                  />
                )
              }
              return (
                <CellForValue
                  key={value.label}
                  field={value}
                  row={row}
                  firstChild={columnIndex === 0}
                  width={width}
                />
              )
            })}
          {isVisible &&
            years.map((year, columnIndex) => {
              const value = yearRow[year]

              return (
                <CellForYear
                  key={value.name}
                  row={yearRow}
                  field={value}
                  width={yearColumnWidth}
                />
              )
            })}
        </RowContainer>
      </ErrorBoundary>
    )
  }),
)
