import { useQuery } from '@apollo/client/react'
import Linkify from 'react-linkify'
import { DateTime } from 'luxon'

import { query } from './query.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../shared/Error.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'

import {
  container,
  scrollContainer,
  messageRow,
  date as dateClass,
  titleRow,
  title,
} from './index.module.css'

export const Component = () => {
  const { data, loading, error } = useQuery(query)

  const rows = data?.allMessages?.nodes ?? []

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <div className={container}>
        <div className={titleRow}>
          <div
            className={title}
            data-id="form-title"
          >
            Mitteilungen
          </div>
        </div>
        <div className={scrollContainer}>
          {rows.map((m) => {
            const date = DateTime.fromISO(m.time).toFormat('yyyy.LL.dd')

            return (
              <div
                className={messageRow}
                key={m.id}
              >
                <div className={dateClass}>{date}</div>
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
