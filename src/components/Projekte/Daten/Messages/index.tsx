import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import MarkdownIt from 'markdown-it'
import { DateTime } from 'luxon'

import { query } from './query.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'

import type { Message } from '../../../../models/apflora/index.tsx'

import styles from './index.module.css'

const mdParser = new MarkdownIt({ breaks: true, linkify: true })
const defaultLinkOpen =
  mdParser.renderer.rules.link_open ??
  ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))
mdParser.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  tokens[idx].attrSet('target', '_blank')
  tokens[idx].attrSet('rel', 'noopener noreferrer')
  return defaultLinkOpen(tokens, idx, options, env, self)
}

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
    </ErrorBoundary>
  )
}
