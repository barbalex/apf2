import { Data } from './Data.tsx'
import type { HistoryDatum } from './Data.tsx'
import { ErrorBoundary } from '../ErrorBoundary.tsx'

import styles from './index.module.css'

export interface HistoryProps {
  year?: string | number | null | undefined
  dataArray?: HistoryDatum[] | null
}

export const History = ({ year, dataArray }: HistoryProps) => (
  <ErrorBoundary>
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <h4 className={styles.title}>{year}</h4>
      </div>
      <Data dataArray={dataArray} />
    </div>
  </ErrorBoundary>
)
