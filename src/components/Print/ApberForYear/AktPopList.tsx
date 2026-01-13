import { Suspense } from 'react'
import { sumBy } from 'es-toolkit'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'

import type { ApId } from '../../../models/apflora/public/Ap.ts'

import styles from './AktPopList.module.css'

interface JberAktPopNode {
  artname: string | null
  id: ApId
  pop100: number | null
  pop200: number | null
  popTotal: number | null
  pop100Diff: number | null
  pop200Diff: number | null
  popTotalDiff: number | null
}

interface AktPopListQueryResult {
  jberAktPop: {
    nodes: JberAktPopNode[]
  }
}

const fallback = (
  <ErrorBoundary>
    <div className={styles.container}>
      <p className={styles.title}>
        Übersicht über aktuelle Populationen aller AP-Arten
      </p>
      <div className={styles.titleRow1}>Lade Daten...</div>
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
        <div className={styles.container}>
          <p className={styles.title}>
            Übersicht über aktuelle Populationen aller AP-Arten
          </p>
          <div className={styles.titleRow1}>
            <div className={styles.diffLeftColumn} />
            <div className={styles.dataColumn}>aktuelle Werte</div>
            <div className={styles.diffColumn}>Differenz zum Vorjahr</div>
          </div>
          <div className={styles.titleRow2}>
            <div className={styles.apColumn}>Aktionsplan</div>
            <div className={styles.ursprColumn}>ursprünglich</div>
            <div className={styles.angesColumn}>angesiedelt</div>
            <div className={styles.totalColumn}>total</div>
            <div className={styles.ursprColumn}>ursprünglich</div>
            <div className={styles.angesColumn}>angesiedelt</div>
            <div className={styles.totalDiffColumn}>total</div>
          </div>
          {aps.map((ap) => (
            <div
              className={styles.apRow}
              key={ap?.artname}
            >
              <div className={styles.apColumn}>{ap?.artname}</div>
              <div className={styles.ursprColumn}>{ap?.pop100}</div>
              <div className={styles.angesColumn}>{ap?.pop200}</div>
              <div className={styles.totalColumn}>{ap?.popTotal}</div>
              <div
                className={styles.ursprColumn}
                style={{
                  backgroundColor:
                    ap?.pop100Diff > 0 ? '#00ff00'
                    : ap?.pop100Diff < 0 ? 'red'
                    : 'white',
                }}
              >
                {ap?.pop100Diff}
              </div>
              <div
                className={styles.angesColumn}
                style={{
                  backgroundColor:
                    ap?.pop200Diff > 0 ? '#00ff00'
                    : ap?.pop200Diff < 0 ? 'red'
                    : 'white',
                }}
              >
                {ap?.pop200Diff}
              </div>
              <div
                className={styles.totalDiffColumn}
                style={{
                  backgroundColor:
                    ap?.popTotalDiff > 0 ? '#00ff00'
                    : ap?.popTotalDiff < 0 ? 'red'
                    : 'white',
                }}
              >
                {ap?.popTotalDiff}
              </div>
            </div>
          ))}
          <div className={styles.totalRow}>
            <div className={styles.apColumn}>{aps.length}</div>
            <div className={styles.ursprColumn}>{pop100}</div>
            <div className={styles.angesColumn}>{pop200}</div>
            <div className={styles.totalColumn}>{popsTotal}</div>
            <div
              className={styles.ursprColumn}
              style={{
                backgroundColor:
                  pop100Diff > 0 ? '#00ff00'
                  : pop100Diff < 0 ? 'red'
                  : 'white',
              }}
            >
              {pop100Diff}
            </div>
            <div
              className={styles.angesColumn}
              style={{
                backgroundColor:
                  pop200Diff > 0 ? '#00ff00'
                  : pop200Diff < 0 ? 'red'
                  : 'white',
              }}
            >
              {pop200Diff}
            </div>
            <div
              className={styles.totalDiffColumn}
              style={{
                backgroundColor:
                  popTotalDiff > 0 ? '#00ff00'
                  : popTotalDiff < 0 ? 'red'
                  : 'white',
              }}
            >
              {popTotalDiff}
            </div>
          </div>
        </div>
      </Suspense>
    </ErrorBoundary>
  )
}
