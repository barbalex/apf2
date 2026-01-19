import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import Linkify from 'react-linkify'
import { DateTime } from 'luxon'

import { query } from './query.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'

import type { Message } from '../../../../models/apflora/index.tsx'

import styles from './index.module.css'

interface MessagesQueryResult {
  allMessages?: {
    nodes: Message[]
  }
}

export const Component = () => {
  const apolloClient = useApolloClient()

  const { data } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const result = await apolloClient.query<MessagesQueryResult>({
        query,
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

  const rows = data?.allMessages?.nodes ?? []

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
