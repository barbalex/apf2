import { ErrorBoundary } from './ErrorBoundary.jsx'
import {
  container,
  title,
  content,
  columnLeft,
  columnRight,
} from './TpopAbBerRelevantInfoPopover.module.css'

export const TpopAbBerRelevantInfoPopover = (
  <ErrorBoundary>
    <div className={container}>
      <div className={title}>Legende</div>
      <div className={content}>
        Möglichst immer ausfüllen, wenn die Teil-Population für den AP-Bericht
        nicht relevant ist.
      </div>
      <div className={content}>
        <div className={columnLeft}>nein (historisch):</div>
        <div className={columnRight}>erloschen, vor 1950 ohne Kontrolle</div>
      </div>
      <div className={content}>
        <div className={columnLeft}>nein (kein Vorkommen):</div>
        <div className={columnRight}>
          {'siehe bei Populationen "überprüft, kein Vorkommen"'}
        </div>
      </div>
      <div className={content}>
        {
          'Bei historischen, ausserkantonalen Populationen ist der Status "ausserkantonal" zu verwenden.'
        }
      </div>
    </div>
  </ErrorBoundary>
)
