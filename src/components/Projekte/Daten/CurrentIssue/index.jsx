import styled from '@emotion/styled'
import { gql } from '@apollo/client';
import { useQuery } from "@apollo/client/react";
import MarkdownIt from 'markdown-it'
import { useParams } from 'react-router'

import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { currentIssue as currentIssueFragment } from '../../../shared/fragments.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../shared/Error.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'

const mdParser = new MarkdownIt({ breaks: true })

const Container = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  scrollbar-width: thin;
`
const Content = styled.div`
  padding: 10px;
`

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
      <Container>
        <FormTitle title={row.title} />
        <FieldsContainer>
          <Content
            dangerouslySetInnerHTML={{
              __html: mdParser.render(row.issue),
            }}
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}
