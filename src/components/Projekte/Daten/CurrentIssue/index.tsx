import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import MarkdownIt from 'markdown-it'
import { useParams } from 'react-router'

import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { currentIssue as currentIssueFragment } from '../../../shared/fragments.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { Error } from '../../../shared/Error.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'

import type Currentissue from '../../../../models/apflora/Currentissue.js'

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
  const { issueId } = useParams<{ issueId: string }>()

  const { data, loading, error } = useQuery<CurrentIssueQueryResult>(query, {
    variables: {
      id: issueId,
    },
  })

  const row = data?.currentissueById ?? {}

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  if (!row) return null

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FormTitle title={row.title} />
        <div className={styles.fieldsContainer}>
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{
              __html: mdParser.render(row.issue),
            }}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}
