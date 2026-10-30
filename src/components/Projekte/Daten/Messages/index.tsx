// TanStack Virtual is incompatible with React Compiler memoization
'use no memo'

import { useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useApolloClient } from '@apollo/client/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import MarkdownIt from 'markdown-it'
import { DateTime } from 'luxon'

import { query } from './query.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'

import styles from './index.module.css'

const mdParser = new MarkdownIt({ breaks: true, linkify: true })
const defaultLinkOpen =
  mdParser.renderer.rules.link_open ??
  ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))
mdParser.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  tokens[idx]?.attrSet('target', '_blank')
  tokens[idx]?.attrSet('rel', 'noopener noreferrer')
  return defaultLinkOpen(tokens, idx, options, env, self)
}

interface MessageRowData {
  id: string
  message: string
  time: string
  active: boolean
}

interface MessagesQueryResult {
  allMessages?: {
    nodes: MessageRowData[]
  }
}

export const Component = () => {
  const apolloClient = useApolloClient()

  const { data } = useSuspenseQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const result = await apolloClient.query<MessagesQueryResult>({
        query,
      })
      if (result.error) throw result.error
      return result.data
    },
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
        <MessageListBody rows={rows} />
      </div>
    </ErrorBoundary>
  )
}

/**
 * Owns the virtualized rows. Kept out of Component because that
 * suspends on its query before first commit, which breaks the
 * virtualizer's mount cycle (see EkPlan/Table).
 */
const MessageListBody = ({ rows }: { rows: MessageRowData[] }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: rows.length,
    // markdown rows have variable heights; single-line rows are ~41px
    estimateSize: () => 41,
    getItemKey: (index) => rows[index]?.id ?? index,
    getScrollElement: () => scrollContainerRef.current,
    overscan: 8,
  })

  return (
    <div
      className={styles.scrollContainer}
      ref={scrollContainerRef}
    >
      <div
        className={styles.rows}
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const m = rows[virtualRow.index]
          if (!m) return null
          const date = DateTime.fromISO(m.time).toFormat('yyyy.LL.dd')

          return (
            <div
              className={styles.messageRow}
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              style={{ transform: `translateY(${virtualRow.start}px)` }}
            >
              <div className={styles.date}>{date}</div>
              <div
                dangerouslySetInnerHTML={{
                  __html: mdParser.render(m.message ?? ''),
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
