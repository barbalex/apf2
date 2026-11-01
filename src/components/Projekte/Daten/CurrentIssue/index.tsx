import { apiFetch } from '../../../../modules/api.ts'
import { currentIssueSelect } from '../../../../modules/selects.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import MarkdownIt from 'markdown-it'
import { useParams } from 'react-router'

import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'

import type Currentissue from '../../../../models/apflora/Currentissue.ts'

import styles from './index.module.css'

const mdParser = new MarkdownIt({ breaks: true })

interface CurrentIssueQueryResult {
  currentissueById: Currentissue | null
}

export const Component = () => {
  const { issueId } = useParams<{ issueId: string }>()

  const { data } = useSuspenseQuery({
    queryKey: ['currentIssue', issueId],
    queryFn: async () => {
      const rows = await apiFetch<
        NonNullable<CurrentIssueQueryResult['currentissueById']>[]
      >(`/v_currentissue?id=eq.${issueId}&select=${currentIssueSelect}`)
      return { currentissueById: rows?.[0] ?? null }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const row = data?.currentissueById

  if (!row) return null

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FormTitle title={row.title ?? ''} />
        <div className={styles.fieldsContainer}>
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{
              __html: mdParser.render(row?.issue ?? ''),
            }}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}
