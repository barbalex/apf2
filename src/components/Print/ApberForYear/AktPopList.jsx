import { Suspense } from 'react'
import styled from '@emotion/styled'
import { sumBy } from 'es-toolkit'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'

import {
  container,
  title,
  apRow,
  titleRow1,
  titleRow2,
  totalRow,
  diffLeftColumn,
  dataColumn,
  diffColumn,
  apColumn,
  ursprColumn,
  angesColumn,
  totalColumn,
  totalDiffColumn,
} from './AktPopList.module.css'

const AngesColumn = styled.div`
  min-width: 1.6cm;
  max-width: 1.6cm;
  text-align: center;
  @media print {
    min-width: 1.9cm;
    max-width: 1.9cm;
  }
`
const TotalColumn = styled.div`
  min-width: 1.6cm;
  max-width: 1.6cm;
  text-align: center;
  @media print {
    min-width: 1.9cm;
    max-width: 1.9cm;
  }
`
const TotalDiffColumn = styled.div`
  min-width: 1.2cm;
  max-width: 1.2cm;
  text-align: center;
  @media print {
    min-width: 1.5cm;
    max-width: 1.5cm;
  }
`

const fallback = (
  <ErrorBoundary>
    <div className={container}>
      <p className={title}>
        Übersicht über aktuelle Populationen aller AP-Arten
      </p>
      <div className={titleRow1}>Lade Daten...</div>
    </div>
  </ErrorBoundary>
)

export const AktPopList = ({ year }) => {
  const { projId = '99999999-9999-9999-9999-999999999999' } = useParams()

  const apolloClient = useApolloClient()

  const previousYear = year - 1
  const { data, error } = useQuery({
    queryKey: ['jberAktPopQuery', projId, previousYear, year],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query AktPopListAps($jahr: Int!) {
            jberAktPop(jahr: $jahr) {
              nodes {
                artname
                id
                pop100
                pop200
                popTotal
                pop100Diff
                pop200Diff
                popTotalDiff
              }
            }
          }
        `,
        variables: {
          projektId: projId,
          previousYear,
          jahr: year,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  const aps = data?.data?.jberAktPop?.nodes ?? []
  const pop100 = sumBy(aps, (e) => e.pop100)
  const pop200 = sumBy(aps, (e) => e.pop200)
  const popsTotal = sumBy(aps, (e) => e.popTotal)
  const pop100Diff = sumBy(aps, (e) => e.pop100Diff)
  const pop200Diff = sumBy(aps, (e) => e.pop200Diff)
  const popTotalDiff = sumBy(aps, (e) => e.popTotalDiff)

  if (error) return `Fehler: ${error.message}`

  return (
    <ErrorBoundary>
      <Suspense fallback={fallback}>
        <div className={container}>
          <p className={title}>
            Übersicht über aktuelle Populationen aller AP-Arten
          </p>
          <div className={titleRow1}>
            <div className={diffLeftColumn} />
            <div className={dataColumn}>aktuelle Werte</div>
            <div className={diffColumn}>Differenz zum Vorjahr</div>
          </div>
          <div className={titleRow2}>
            <div className={apColumn}>Aktionsplan</div>
            <div className={ursprColumn}>ursprünglich</div>
            <AngesColumn>angesiedelt</AngesColumn>
            <TotalColumn>total</TotalColumn>
            <div className={ursprColumn}>ursprünglich</div>
            <AngesColumn>angesiedelt</AngesColumn>
            <TotalDiffColumn>total</TotalDiffColumn>
          </div>
          {aps.map((ap) => (
            <div
              className={apRow}
              key={ap?.artname}
            >
              <div className={apColumn}>{ap?.artname}</div>
              <div className={ursprColumn}>{ap?.pop100}</div>
              <AngesColumn>{ap?.pop200}</AngesColumn>
              <TotalColumn>{ap?.popTotal}</TotalColumn>
              <div
                className={ursprColumn}
                style={{
                  backgroundColor:
                    ap?.pop100Diff > 0 ? '#00ff00'
                    : ap?.pop100Diff < 0 ? 'red'
                    : 'white',
                }}
              >
                {ap?.pop100Diff}
              </div>
              <AngesColumn
                style={{
                  backgroundColor:
                    ap?.pop200Diff > 0 ? '#00ff00'
                    : ap?.pop200Diff < 0 ? 'red'
                    : 'white',
                }}
              >
                {ap?.pop200Diff}
              </AngesColumn>
              <TotalDiffColumn
                style={{
                  backgroundColor:
                    ap?.popTotalDiff > 0 ? '#00ff00'
                    : ap?.popTotalDiff < 0 ? 'red'
                    : 'white',
                }}
              >
                {ap?.popTotalDiff}
              </TotalDiffColumn>
            </div>
          ))}
          <div className={totalRow}>
            <div className={apColumn}>{aps.length}</div>
            <div className={ursprColumn}>{pop100}</div>
            <AngesColumn>{pop200}</AngesColumn>
            <TotalColumn>{popsTotal}</TotalColumn>
            <div
              className={ursprColumn}
              style={{
                backgroundColor:
                  pop100Diff > 0 ? '#00ff00'
                  : pop100Diff < 0 ? 'red'
                  : 'white',
              }}
            >
              {pop100Diff}
            </div>
            <AngesColumn
              style={{
                backgroundColor:
                  pop200Diff > 0 ? '#00ff00'
                  : pop200Diff < 0 ? 'red'
                  : 'white',
              }}
            >
              {pop200Diff}
            </AngesColumn>
            <TotalDiffColumn
              style={{
                backgroundColor:
                  popTotalDiff > 0 ? '#00ff00'
                  : popTotalDiff < 0 ? 'red'
                  : 'white',
              }}
            >
              {popTotalDiff}
            </TotalDiffColumn>
          </div>
        </div>
      </Suspense>
    </ErrorBoundary>
  )
}
