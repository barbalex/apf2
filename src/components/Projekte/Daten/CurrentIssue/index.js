import React, { useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import ReactMarkdown from 'react-markdown'

import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import storeContext from '../../../../storeContext'
import { currentIssue as currentIssueFragment } from '../../../shared/fragments'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  padding: 10px;
  overflow: auto !important;
  height: 100%;
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

  const row = get(data, 'currentissueById', {})

  if (loading) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (error) return `Fehler: ${error.message}`
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
          <ReactMarkdown
            source={row.issue}
            escapeHtml={false}
            linkTarget="_blank"
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default CurrentIssue
