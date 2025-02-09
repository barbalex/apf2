import { memo, useRef, useContext } from 'react'
import styled from '@emotion/styled'
import { gql, useQuery } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../../mobxContext.js'
import { yearColumnWidth } from './yearColumnWidth.js'
import { CellForYearTitle } from '../CellForYearTitle.jsx'
import { CellForEkfrequenz } from '../CellForEkfrequenz/index.jsx'
import { CellForEkfrequenzStartjahr } from '../CellForEkfrequenzStartjahr/index.jsx'
import { CellForEkfrequenzAbweichend } from '../CellForEkfrequenzAbweichend.jsx'
import { CellForTpopLink } from '../CellForTpopLink.jsx'
import { CellForValue } from '../CellForValue.jsx'
import { CellForYear } from '../CellForYear/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { queryRow } from './queryRow.js'
import { tpopRowFromTpop } from './tpopRowFromTpop.js'

export const Visible = memo(
  observer(({ tpop, index, setProcessing, years }) => {
    const store = useContext(MobxContext)
    const fieldsShown = store.ekPlan.fields

    const { data, loading, error } = useQuery(queryRow, {
      variables: { apIds: store.ekPlan.apValues, tpopId: tpop.id,
        showEkf: fieldsShown.includes('ekfKontrolleur'),
        showEkAbrechnungTyp: fieldsShown.includes('ekAbrechnungstyp'),
        showBekanntSeit: fieldsShown.includes('bekanntSeit'),
        showStatus: fieldsShown.includes('status'),
        showFlurname: fieldsShown.includes('flurname'),
        showGemeinde: fieldsShown.includes('gemeinde'),
        showPopStatus: fieldsShown.includes('popStatus'),
        showPopName: fieldsShown.includes('popName'),
        showLv95X: fieldsShown.includes('lv95X'),
        showLv95Y: fieldsShown.includes('lv95Y'), },
    })
    const ekfrequenzs = data?.allEkfrequenzs?.nodes ?? []
    const ekfrequenz = data?.tpopById?.ekfrequenz
    const ekfrequenzStartjahr = data?.tpopById?.ekfrequenzStartjahr
    const ekfrequenzAbweichend = data?.tpopById?.ekfrequenzAbweichend

    const { row, tpopColumns } = tpopRowFromTpop({ tpop, index, years, store })

    if (error) return `Fehler: ${error.message}`

    return (
      <ErrorBoundary>
        {tpopColumns.map((tpopColumn, columnIndex) => {
          const value = row[tpopColumn.name]
          const column = tpopColumn.name
          const width = tpopColumn.width

          if (value.name === 'yearTitle') {
            return <CellForYearTitle key={value.name} row={row} width={width} />
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
                data={data}
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
                ekfrequenzStartjahr={ekfrequenzStartjahr}
                ekfrequenz={ekfrequenz}
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
                ekfrequenzAbweichend={ekfrequenzAbweichend}
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
        {years.map((year, columnIndex) => {
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
      </ErrorBoundary>
    )
  }),
)
