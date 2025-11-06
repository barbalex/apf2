import { groupBy } from 'es-toolkit'
import { sortBy } from 'es-toolkit'

import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'
import { container, avRow, nonAvRow, avClass, title } from './AvList.module.css'

export const AvList = ({ data }) => {
  const nodes = data?.jberAbc?.nodes ?? []
  const avGrouped = groupBy(
    nodes.map((ap) => ({
      av: ap?.bearbeiter ?? '(kein Wert)',
      art: ap?.artname ?? '(keine Art gewählt)',
    })),
    (e) => e.av,
  )
  const avs = Object.keys(avGrouped).sort()

  return (
    <ErrorBoundary>
      <div className={container}>
        <p className={title}>Artverantwortliche</p>
        {avs.map((av) => {
          const array = sortBy(avGrouped[av], ['art'])

          return array.map((o, i) => {
            if (i === 0) {
              return (
                <div
                  className={avRow}
                  key={o.art}
                >
                  <div className={avClass}>{o.av}</div>
                  <div>{o.art}</div>
                </div>
              )
            }

            return (
              <div
                className={nonAvRow}
                key={o.art}
              >
                <div className={avClass} />
                <div>{o.art}</div>
              </div>
            )
          })
        })}
      </div>
    </ErrorBoundary>
  )
}
