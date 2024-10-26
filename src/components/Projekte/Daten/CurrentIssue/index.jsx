import styled from '@emotion/styled'
import { useQuery, gql } from '@apollo/client'
import MarkdownIt from 'markdown-it'
import SimpleBar from 'simplebar-react'
import { useParams } from 'react-router-dom'

import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { currentIssue as currentIssueFragment } from '../../../shared/fragments.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import Error from '../../../shared/Error.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'

const mdParser = new MarkdownIt({ breaks: true })

const Container = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const FieldsContainer = styled.div`
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

const CurrentIssue = () => {
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
        <FormTitle title="Aktueller Fehler" />
        <FieldsContainer>
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
            tabIndex={-1}
          >
            <Content
              dangerouslySetInnerHTML={{
                __html: mdParser.render(row.issue),
              }}
            />
          </SimpleBar>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export const Component = CurrentIssue
