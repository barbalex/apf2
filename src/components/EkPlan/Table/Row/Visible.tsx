import { Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client/react'
import { useAtomValue } from 'jotai'

import { CellForYearTitle } from '../CellForYearTitle.tsx'
import { CellForEkfrequenz } from '../CellForEkfrequenz/index.tsx'
import { CellForEkfrequenzStartjahr } from '../CellForEkfrequenzStartjahr/index.tsx'
import { CellForEkfrequenzAbweichend } from '../CellForEkfrequenzAbweichend/index.tsx'
import { CellForTpopLink } from '../CellForTpopLink.tsx'
import { CellForValue } from '../CellForValue.tsx'
import { CellForYear } from '../CellForYear/index.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { queryRow } from './queryRow.ts'
import { tpopRowFromTpop } from './tpopRowFromTpop.ts'
import type { RowQueryForEkPlanResult } from '../tableTypes.ts'
import {
  ekPlanFieldsAtom,
  ekPlanApValuesAtom,
} from '../../../../store/index.ts'

const isItOdd = (num: number) => num % 2 === 0

export const Visible = ({
  tpopId,
  index,
  setProcessing,
  years,
}: {
  tpopId: string
  index: number
  setProcessing: (processing: boolean) => void
  years: number[]
}) => {
  const fieldsShown = useAtomValue(ekPlanFieldsAtom)
  const apValues = useAtomValue(ekPlanApValuesAtom)
  const isOdd = isItOdd(index)

  const apolloClient = useApolloClient()

  const { data, error } = useQuery<RowQueryForEkPlanResult>({
    queryKey: ['RowQueryForEkPlan', apValues, tpopId, years, fieldsShown],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: queryRow,
        variables: {
          apIds: apValues,
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
      return result.data as RowQueryForEkPlanResult
    },
  })

  const tpop = data?.tpopById
  const ekfrequenz = tpop?.ekfrequenz
  const ekfrequenzStartjahr = tpop?.ekfrequenzStartjahr
  const ekfrequenzAbweichend = tpop?.ekfrequenzAbweichend

  const row = tpopRowFromTpop(tpop)
  const tpopColumns = (Object.values(row) as Record<string, unknown>[])
    .filter((o) => typeof o === 'object')
    .filter((o) => !!o.name)
    .filter((o) => fieldsShown.includes(o.name as string) || !!o.alwaysShow)

  if (error) return `Fehler: ${(error as Error).message}`

  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
        {tpopColumns.map((tpopColumn, columnIndex) => {
          const value = row[tpopColumn.name as string] as Record<string, unknown>
          const width = tpopColumn.width as number

          if (value.name === 'yearTitle') {
            return (
              <CellForYearTitle
                key={value.name}
                row={row}
                isOdd={isOdd}
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
              key={String(value.label)}
              field={value}
              row={row}
              isOdd={isOdd}
              firstChild={columnIndex === 0}
              width={width}
            />
          )
        })}
        {years.map((year: number) => {
          // TODO: query view/function to get these values without having to filter here?
          const ekPlan =
            (tpop?.ekPlans?.nodes ?? []).filter((n) => n.jahr === year).length > 0
          const ekfPlan =
            (tpop?.ekfPlans?.nodes ?? []).filter((n) => n.jahr === year).length > 0
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
      </Suspense>
    </ErrorBoundary>
  )
}
