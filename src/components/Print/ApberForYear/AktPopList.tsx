import { sumBy } from 'es-toolkit'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { apiFetch } from '../../../modules/api.ts'

import { ErrorBoundary } from '../../shared/ErrorBoundary.tsx'


import styles from './AktPopList.module.css'

interface AktPopListProps {
  year?: number | undefined
}

export const AktPopList = ({ year }: AktPopListProps) => {
  const { projId = '99999999-9999-9999-9999-999999999999' } = useParams()

  const previousYear = (year ?? 0) - 1
  const { data, error } = useQuery({
    queryKey: ['jberAktPopQuery', projId, previousYear, year],
    queryFn: async () => ({
      data: {
        jberAktPop: {
          nodes:
            (await apiFetch<
              {
                artname: string | null
                id: string
                pop100: number | null
                pop200: number | null
                popTotal: number | null
                pop100Diff: number | null
                pop200Diff: number | null
                popTotalDiff: number | null
              }[]
            >(
              '/rpc/jber_akt_pop?select=artname,id,pop100:pop_100,pop200:pop_200,popTotal:pop_total,pop100Diff:pop_100_diff,pop200Diff:pop_200_diff,popTotalDiff:pop_total_diff',
              {
                method: 'POST',
                body: JSON.stringify({ jahr: year }),
              },
            )) ?? [],
        },
      },
    }),
  })
  const aps = data?.data?.jberAktPop?.nodes ?? []
  const pop100 = sumBy(aps, (e) => e.pop100 ?? 0)
  const pop200 = sumBy(aps, (e) => e.pop200 ?? 0)
  const popsTotal = sumBy(aps, (e) => e.popTotal ?? 0)
  const pop100Diff = sumBy(aps, (e) => e.pop100Diff ?? 0)
  const pop200Diff = sumBy(aps, (e) => e.pop200Diff ?? 0)
  const popTotalDiff = sumBy(aps, (e) => e.popTotalDiff ?? 0)

  if (error) return `Fehler: ${error.message}`

  return (
    <ErrorBoundary>
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
                  (ap?.pop100Diff ?? 0) > 0 ? '#00ff00'
                  : (ap?.pop100Diff ?? 0) < 0 ? 'red'
                  : 'white',
              }}
            >
              {ap?.pop100Diff}
            </div>
            <div
              className={styles.angesColumn}
              style={{
                backgroundColor:
                  (ap?.pop200Diff ?? 0) > 0 ? '#00ff00'
                  : (ap?.pop200Diff ?? 0) < 0 ? 'red'
                  : 'white',
              }}
            >
              {ap?.pop200Diff}
            </div>
            <div
              className={styles.totalDiffColumn}
              style={{
                backgroundColor:
                  (ap?.popTotalDiff ?? 0) > 0 ? '#00ff00'
                  : (ap?.popTotalDiff ?? 0) < 0 ? 'red'
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
    </ErrorBoundary>
  )
}
