import React, { useContext } from 'react'
import { useQuery } from 'react-apollo-hooks'
import TableRow from '@material-ui/core/TableRow'
import styled from 'styled-components'
import ErrorBoundary from 'react-error-boundary'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import groupBy from 'lodash/groupBy'
import { observer } from 'mobx-react-lite'

import queryLists from './queryLists'
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

const EkPlanTableRow = ({
  row,
  setColumnHovered,
  resetYearHovered,
  scrollPositions,
  yearClickedState,
  yearClickedDispatch,
  setYearMenuAnchor,
  einheitsByAp,
  refetch,
}) => {
  const store = useContext(storeContext)
  const { apValues } = store
  const { fields } = store.ekPlan

  const { data: dataLists } = useQuery(queryLists, {
    variables: {
      apIds: apValues,
    },
  })

  const ekfrequenzOptions = get(dataLists, 'allEkfrequenzs.nodes', []).map(
    o => {
      const ekTypeArray = [o.ek ? 'ek' : null, o.ekf ? 'ekf' : null].filter(
        field => !!field,
      )
      const code = (o.code || '').padEnd(2)
      const anwendungsfall = (
        `${o.anwendungsfall}, ${ekTypeArray.join(' und ')}` || ''
      ).padEnd(26)
      const name = (o.name || '').padEnd(27)
      return {
        value: o.code,
        label: `${code}: ${name} | ${o.periodizitaet}`,
        anwendungsfall,
        apId: o.apId,
      }
    },
  )
  const ekfOptionsGroupedPerAp = groupBy(ekfrequenzOptions, 'apId')
  Object.keys(ekfOptionsGroupedPerAp).forEach(
    k =>
      (ekfOptionsGroupedPerAp[k] = groupBy(
        ekfOptionsGroupedPerAp[k],
        'anwendungsfall',
      )),
  )

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
              return (
                <CellForYearTitle
                  key={field.name}
                  field={field}
                  scrollPositions={scrollPositions}
                />
              )
            }
            if (field.name === 'ekAbrechnungstyp') {
              return (
                <CellForEkAbrechnungstyp
                  key={field.name}
                  row={row}
                  field={field}
                  setColumnHovered={setColumnHovered}
                  resetYearHovered={resetYearHovered}
                  scrollPositions={scrollPositions}
                  dataLists={dataLists}
                />
              )
            }
            if (field.name === 'ekfrequenz') {
              return (
                <CellForEkfrequenz
                  key={field.name}
                  row={row}
                  field={field}
                  setColumnHovered={setColumnHovered}
                  resetYearHovered={resetYearHovered}
                  scrollPositions={scrollPositions}
                  ekfOptionsGroupedPerAp={ekfOptionsGroupedPerAp}
                />
              )
            }
            if (field.name === 'ekfrequenzAbweichend') {
              return (
                <CellForEkfrequenzAbweichend
                  key={field.name}
                  row={row}
                  field={field}
                  setColumnHovered={setColumnHovered}
                  resetYearHovered={resetYearHovered}
                  scrollPositions={scrollPositions}
                />
              )
            }
            if (field.name === 'link') {
              return (
                <CellForTpopLink
                  key={field.name}
                  field={field}
                  setColumnHovered={setColumnHovered}
                  resetYearHovered={resetYearHovered}
                  scrollPositions={scrollPositions}
                />
              )
            }
            // DANGER: null is also an object!!
            if (field.value && typeof field.value === 'object') {
              return (
                <CellForYear
                  key={field.label}
                  row={row}
                  field={field}
                  setColumnHovered={setColumnHovered}
                  resetYearHovered={resetYearHovered}
                  scrollPositions={scrollPositions}
                  yearClickedState={yearClickedState}
                  yearClickedDispatch={yearClickedDispatch}
                  setYearMenuAnchor={setYearMenuAnchor}
                  einheitsByAp={einheitsByAp}
                />
              )
            }
            return (
              <CellForValue
                key={field.label}
                field={field}
                setColumnHovered={setColumnHovered}
                resetYearHovered={resetYearHovered}
                scrollPositions={scrollPositions}
              />
            )
          })}
        </StyledTableRow>
      </>
    </ErrorBoundary>
  )
}

export default observer(EkPlanTableRow)
