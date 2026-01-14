import { useQuery } from '@apollo/client/react'
import Linkify from 'react-linkify'
import { DateTime } from 'luxon'

import { query } from './query.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { Error } from '../../../shared/Error.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'

import type { Message } from '../../../../models/apflora/index.tsx'

import styles from './index.module.css'

interface MessagesQueryResult {
  data?: {
    allMessages?: {
      nodes: Message[]
    }
  }
}

export const Component = () => {
  const { data, loading, error } = useQuery<MessagesQueryResult>(query)

  const rows = data?.allMessages?.nodes ?? []

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <div className={styles.titleRow}>
          <div
            className={styles.title}
            data-id="form-title"
          >
            Mitteilungen
          </div>
        </div>
        <div className={styles.scrollContainer}>
          {rows.map((m) => {
            const date = DateTime.fromISO(m.time).toFormat('yyyy.LL.dd')

            return (
              <div
                className={styles.messageRow}
                key={m.id}
              >
                <div className={styles.date}>{date}</div>
                <div>
                  <Linkify properties={{ target: '_blank' }}>
                    {m.message}
                  </Linkify>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </ErrorBoundary>
  )
}
