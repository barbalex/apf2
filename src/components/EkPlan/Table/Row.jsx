import { memo, useRef } from 'react'
import styled from '@emotion/styled'
import Button from '@mui/material/Button'

import { yearColumnWidth } from './yearColumnWidth.js'
import { CellForYearTitle } from './CellForYearTitle.jsx'
import { CellForEkfrequenz } from './CellForEkfrequenz/index.jsx'
import { CellForEkfrequenzStartjahr } from './CellForEkfrequenzStartjahr/index.jsx'
import { CellForEkfrequenzAbweichend } from './CellForEkfrequenzAbweichend.jsx'
import { CellForTpopLink } from './CellForTpopLink.jsx'
import { CellForValue } from './CellForValue.jsx'
import { CellForYear } from './CellForYear/index.jsx'
import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'
import { useOnScreen } from '../../../modules/useOnScreen.ts'

const RowContainer = styled.div`
  display: flex;
  height: 60px;
  min-height: 60px;
`

export const TpopRow = memo(
  ({ row, rowIndex, setProcessing, tpopColumns, years, yearRows }) => {
    const ref = useRef(null)
    const isVisible = useOnScreen(ref)

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
                  <CellForYearTitle
                    key={value.name}
                    row={row}
                    width={width}
                  />
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
              const row = yearRows[rowIndex]
              const value = row[year]

              return (
                <CellForYear
                  key={value.name}
                  row={row}
                  field={value}
                  width={yearColumnWidth}
                />
              )
            })}
        </RowContainer>
      </ErrorBoundary>
    )
  },
)
