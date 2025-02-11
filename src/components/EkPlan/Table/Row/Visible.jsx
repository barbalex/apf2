import { memo, useRef, useContext, useMemo } from 'react'
import styled from '@emotion/styled'
import { gql, useQuery } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../../mobxContext.js'
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

const isItOdd = (num) => num % 2 === 0

export const Visible = memo(
  observer(({ tpopId, index, setProcessing, years, rowContainerRef }) => {
    const store = useContext(MobxContext)
    const fieldsShown = store.ekPlan.fields
    const isOdd = isItOdd(index)

    const { data, loading, error } = useQuery(queryRow, {
      variables: {
        apIds: store.ekPlan.apValues,
        tpopId,
        years,
        showEkf: fieldsShown.includes('ekfKontrolleur'),
        showEkAbrechnungTyp: fieldsShown.includes('ekAbrechnungstyp'),
        showBekanntSeit: fieldsShown.includes('bekanntSeit'),
        showStatus: fieldsShown.includes('status'),
        showFlurname: fieldsShown.includes('flurname'),
        showGemeinde: fieldsShown.includes('gemeinde'),
        showPopStatus: fieldsShown.includes('popStatus'),
        showPopName: fieldsShown.includes('popName'),
        showLv95X: fieldsShown.includes('lv95X'),
        showLv95Y: fieldsShown.includes('lv95Y'),
      },
    })
    const ekfrequenzs = data?.allEkfrequenzs?.nodes ?? []
    const tpop = data?.tpopById
    const ekfrequenz = tpop?.ekfrequenz
    const ekfrequenzStartjahr = tpop?.ekfrequenzStartjahr
    const ekfrequenzAbweichend = tpop?.ekfrequenzAbweichend

    const row = useMemo(
      () => tpopRowFromTpop({ tpop, store }),
      [tpop, index, store],
    )
    const tpopColumns = Object.values(row)
      .filter((o) => typeof o === 'object')
      .filter((o) => !!o.name)
      .filter((o) => store.ekPlan.fields.includes(o.name) || !!o.alwaysShow)

    // console.log('Visible Row rendering')

    if (error) return `Fehler: ${error.message}`
    if (!tpop) return null

    return (
      <ErrorBoundary>
        {tpopColumns.map((tpopColumn, columnIndex) => {
          const value = row[tpopColumn.name]
          const column = tpopColumn.name
          const width = tpopColumn.width

          if (value.name === 'yearTitle') {
            return (
              <CellForYearTitle
                key={value.name}
                row={row}
                isOdd={isOdd}
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
                isOdd={isOdd}
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
                isOdd={isOdd}
                data={data}
                field={value}
                setProcessing={setProcessing}
                width={width}
                rowContainerRef={rowContainerRef}
              />
            )
          }
          if (value.name === 'ekfrequenzStartjahr') {
            return (
              <CellForEkfrequenzStartjahr
                key={value.name}
                row={row}
                isOdd={isOdd}
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
                isOdd={isOdd}
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
                isOdd={isOdd}
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
        {years.map((year) => {
          // TODO: query view/function to get these values without having to filter here?
          const ekPlan =
            tpop?.ekPlans?.nodes?.filter((n) => n.jahr === year).length > 0
          const ekfPlan =
            tpop?.ekfPlans?.nodes?.filter((n) => n.jahr === year).length > 0
          const eks = (tpop?.eks?.nodes ?? []).filter((n) => n.jahr === year)
          const ekfs = (tpop?.ekfs?.nodes ?? []).filter((n) => n.jahr === year)
          const ansiedlungs = (tpop?.ansiedlungs?.nodes ?? []).filter(
            (n) => n.jahr === year,
          )

          return (
            <CellForYear
              key={year}
              row={row}
              isOdd={isOdd}
              year={year}
              ekPlan={ekPlan}
              ekfPlan={ekfPlan}
              eks={eks}
              ekfs={ekfs}
              ansiedlungs={ansiedlungs}
            />
          )
        })}
      </ErrorBoundary>
    )
  }),
)
