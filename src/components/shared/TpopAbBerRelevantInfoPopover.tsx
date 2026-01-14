import { ErrorBoundary } from './ErrorBoundary.tsx'
import styles from './TpopAbBerRelevantInfoPopover.module.css'

export const TpopAbBerRelevantInfoPopover = (
  <ErrorBoundary>
    <div className={styles.container}>
      <div className={styles.title}>Legende</div>
      <div className={styles.content}>
        Möglichst immer ausfüllen, wenn die Teil-Population für den AP-Bericht
        nicht relevant ist.
      </div>
      <div className={styles.content}>
        <div className={styles.columnLeft}>nein (historisch):</div>
        <div className={styles.columnRight}>
          erloschen, vor 1950 ohne Kontrolle
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.columnLeft}>nein (kein Vorkommen):</div>
        <div className={styles.columnRight}>
          {'siehe bei Populationen "überprüft, kein Vorkommen"'}
        </div>
      </div>
      <div className={styles.content}>
        {
          'Bei historischen, ausserkantonalen Populationen ist der Status "ausserkantonal" zu verwenden.'
        }
      </div>
    </div>
  </ErrorBoundary>
)
