import { Data } from './Data.jsx'
import { ErrorBoundary } from '../ErrorBoundary.jsx'

import styles from './index.module.css'

export const History = ({ year, dataArray }) => (
  <ErrorBoundary>
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <h4 className={styles.title}>{year}</h4>
      </div>
      <Data dataArray={dataArray} />
    </div>
  </ErrorBoundary>
)
