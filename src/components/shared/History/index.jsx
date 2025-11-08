import { Data } from './Data.jsx'
import { ErrorBoundary } from '../ErrorBoundary.jsx'

import { container, title, titleRow } from './index.module.css'

export const History = ({ year, dataArray }) => (
  <ErrorBoundary>
    <div className={container}>
      <div className={titleRow}>
        <h4 className={title}>{year}</h4>
      </div>
      <Data dataArray={dataArray} />
    </div>
  </ErrorBoundary>
)
