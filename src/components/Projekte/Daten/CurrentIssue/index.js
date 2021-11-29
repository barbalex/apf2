import React, { useContext } from 'react'
import styled from 'styled-components'
import { useQuery, gql } from '@apollo/client'
import MarkdownIt from 'markdown-it'
import SimpleBar from 'simplebar-react'

import FormTitle from '../../../shared/FormTitle'
import storeContext from '../../../../storeContext'
import { currentIssue as currentIssueFragment } from '../../../shared/fragments'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'

const mdParser = new MarkdownIt({ breaks: true })

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const LoadingContainer = styled.div`
  height: 100%;
  padding: 10px;
`
const FieldsContainer = styled.div`
  overflow-y: auto;
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

const CurrentIssue = ({ treeName }) => {
  const store = useContext(storeContext)
  const { activeNodeArray } = store[treeName]

  const { data, loading, error } = useQuery(query, {
    variables: {
      id:
        activeNodeArray.length > 1
          ? activeNodeArray[1]
          : '99999999-9999-9999-9999-999999999999',
    },
  })

  const row = data?.currentissueById ?? {}

  if (loading) {
    return <LoadingContainer>Lade...</LoadingContainer>
  }
  if (error) return <Error error={error} />
  if (!row) return null
  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={row.id}
          title="Aktueller Fehler"
          treeName={treeName}
          table="currentissue"
        />
        <FieldsContainer>
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
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

export default CurrentIssue
