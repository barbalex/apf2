import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import MarkdownIt from 'markdown-it'
import { useParams } from 'react-router'

import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { currentIssue as currentIssueFragment } from '../../../shared/fragments.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'

import type Currentissue from '../../../../models/apflora/Currentissue.ts'

import styles from './index.module.css'

const mdParser = new MarkdownIt({ breaks: true })

const query = gql`
  query currentissueById($id: UUID!) {
    currentissueById(id: $id) {
      ...CurrentIssueFields
    }
  }
  ${currentIssueFragment}
`

interface CurrentIssueQueryResult {
  currentissueById: Currentissue
}

export const Component = () => {
  const apolloClient = useApolloClient()

  const { issueId } = useParams<{ issueId: string }>()

  const { data } = useQuery({
    queryKey: ['currentIssue', issueId],
    queryFn: async () => {
      const result = await apolloClient.query<CurrentIssueQueryResult>({
        query,
        variables: {
          id: issueId,
        },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const row = data?.currentissueById

  if (!row) return null

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FormTitle title={row.title} />
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
