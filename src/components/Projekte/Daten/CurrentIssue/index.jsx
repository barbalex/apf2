import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import MarkdownIt from 'markdown-it'
import { useParams } from 'react-router'

import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { currentIssue as currentIssueFragment } from '../../../shared/fragments.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../shared/Error.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'

import { container, fieldsContainer, content } from './index.module.css'

const mdParser = new MarkdownIt({ breaks: true })

const query = gql`
  query currentissueById($id: UUID!) {
    currentissueById(id: $id) {
      ...CurrentIssueFields
    }
  }
  ${currentIssueFragment}
`

export const Component = () => {
  const { issueId } = useParams()

  const { data, loading, error } = useQuery(query, {
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
      <div className={container}>
        <FormTitle title={row.title} />
        <div className={fieldsContainer}>
          <div
            className={content}
            dangerouslySetInnerHTML={{
              __html: mdParser.render(row.issue),
            }}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}
