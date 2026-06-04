import { useRef, Suspense } from 'react'
import { gql } from '@apollo/client'
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
import {
  ekPlanFieldsAtom,
  ekPlanApValuesAtom,
} from '../../../../store/index.ts'

import type { TpopId } from '../../../../models/apflora/Tpop.ts'
import type { PopId } from '../../../../models/apflora/Pop.ts'
import type { ApId } from '../../../../models/apflora/Ap.ts'
import type { TpopkontrId } from '../../../../models/apflora/Tpopkontr.ts'
import type { TpopkontrzaehlId } from '../../../../models/apflora/Tpopkontrzaehl.ts'
import type { TpopkontrzaehlEinheitWerteId } from '../../../../models/apflora/TpopkontrzaehlEinheitWerte.ts'
import type { TpopmassnId } from '../../../../models/apflora/Tpopmassn.ts'
import type { EkfrequenzId } from '../../../../models/apflora/Ekfrequenz.ts'
import type { ProjektId } from '../../../../models/apflora/Projekt.ts'

const isItOdd = (num) => num % 2 === 0

export const Visible = ({ tpopId, index, setProcessing, years }) => {
  const fieldsShown = useAtomValue(ekPlanFieldsAtom)
  const apValues = useAtomValue(ekPlanApValuesAtom)
  const isOdd = isItOdd(index)

  const apolloClient = useApolloClient()

  interface EkzaehleinheitCount {
    totalCount: number
  }

  interface TpopkontrzaehlEinheitWerteNode {
    id: TpopkontrzaehlEinheitWerteId
    ekzaehleinheitsByZaehleinheitId: EkzaehleinheitCount
  }

  interface TpopkontrzaehlNode {
    id: TpopkontrzaehlId
    einheit: TpopkontrzaehlEinheitWerteId | null
    anzahl: number | null
    tpopkontrzaehlEinheitWerteByEinheit: TpopkontrzaehlEinheitWerteNode | null
  }

  interface TpopkontrNode {
    id: TpopkontrId
    jahr: number | null
    tpopkontrzaehlsByTpopkontrId: {
      nodes: TpopkontrzaehlNode[]
    }
  }

  interface TpopmassnNode {
    id: TpopmassnId
    jahr: number | null
    zieleinheitAnzahl: number | null
  }

  interface EkplanNode {
    jahr: number | null
  }

  interface PopStatusWerteNode {
    code: number | null
    text: string | null
  }

  interface EkAbrechnungstypWerteNode {
    id: string
    text: string | null
  }

  interface EkfrequenzNode {
    id: EkfrequenzId
    ekAbrechnungstyp: string | null
    ekAbrechnungstypWerteByEkAbrechnungstyp: EkAbrechnungstypWerteNode | null
  }

  interface AdresseNode {
    name: string | null
  }

  interface ApNode {
    id: ApId
    projId: ProjektId | null
    label: string | null
  }

  interface PopNode {
    id: PopId
    nr: number | null
    name: string | null
    popStatusWerteByStatus: PopStatusWerteNode | null
    apByApId: ApNode | null
  }

  interface TpopNode {
    id: TpopId
    nr: number | null
    gemeinde: string | null
    flurname: string | null
    lv95X: number | null
    lv95Y: number | null
    ekfrequenz: EkfrequenzId | null
    ekfrequenzStartjahr: number | null
    ekfrequenzAbweichend: boolean | null
    ekfrequenzByEkfrequenz: EkfrequenzNode | null
    popStatusWerteByStatus: PopStatusWerteNode | null
    bekanntSeit: number | null
    adresseByEkfKontrolleur: AdresseNode | null
    popByPopId: PopNode | null
    ekPlans: {
      nodes: EkplanNode[]
    }
    ekfPlans: {
      nodes: EkplanNode[]
    }
    eks: {
      nodes: TpopkontrNode[]
    }
    ekfs: {
      nodes: TpopkontrNode[]
    }
    ansiedlungs: {
      nodes: TpopmassnNode[]
    }
  }

  interface EkfrequenzForRowNode {
    id: EkfrequenzId
    ekAbrechnungstyp: string | null
    ekAbrechnungstypWerteByEkAbrechnungstyp: EkAbrechnungstypWerteNode | null
  }

  interface RowQueryForEkPlanResult {
    allEkfrequenzs: {
      nodes: EkfrequenzForRowNode[]
    }
    tpopById: TpopNode | null
  }

  const { data, error } = useQuery<RowQueryForEkPlanResult>({
    queryKey: ['RowQueryForEkPlan', apValues, tpopId, years, fieldsShown],
    queryFn: async () => {
      const result = await apolloClient.query<RowQueryForEkPlanResult>({
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
      return result.data
    },
  })

  const ekfrequenzs = data?.allEkfrequenzs?.nodes ?? []
  const tpop = data?.tpopById
  const ekfrequenz = tpop?.ekfrequenz
  const ekfrequenzStartjahr = tpop?.ekfrequenzStartjahr
  const ekfrequenzAbweichend = tpop?.ekfrequenzAbweichend

  const row = tpopRowFromTpop(tpop)
  const tpopColumns = Object.values(row)
    .filter((o) => typeof o === 'object')
    .filter((o) => !!o.name)
    .filter((o) => fieldsShown.includes(o.name) || !!o.alwaysShow)

  if (error) return `Fehler: ${(error as Error).message}`

  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
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
              isOdd={isOdd}
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
      </Suspense>
    </ErrorBoundary>
  )
}
