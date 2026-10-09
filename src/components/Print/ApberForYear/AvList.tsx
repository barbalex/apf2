import { groupBy } from 'es-toolkit'
import { sortBy } from 'es-toolkit'

import { ErrorBoundary } from '../../shared/ErrorBoundary.tsx'

import type { JberQueryResult } from './types.ts'

import styles from './AvList.module.css'

interface AvListProps {
  data?: JberQueryResult | undefined
}

export const AvList = ({ data }: AvListProps) => {
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
      <div className={styles.container}>
        <p className={styles.title}>Artverantwortliche</p>
        {avs.map((av) => {
          const array = sortBy(avGrouped[av] ?? [], ['art'])

          return array.map((o, i) => {
            if (i === 0) {
              return (
                <div
                  className={styles.avRow}
                  key={o.art}
                >
                  <div className={styles.avClass}>{o.av}</div>
                  <div>{o.art}</div>
                </div>
              )
            }

            return (
              <div
                className={styles.nonAvRow}
                key={o.art}
              >
                <div className={styles.avClass} />
                <div>{o.art}</div>
              </div>
            )
          })
        })}
      </div>
    </ErrorBoundary>
  )
}
