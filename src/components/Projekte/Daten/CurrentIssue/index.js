import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { useQuery, gql } from '@apollo/client'
import MarkdownIt from 'markdown-it'
import SimpleBar from 'simplebar-react'

import FormTitle from '../../../shared/FormTitle'
import storeContext from '../../../../storeContext'
import { currentIssue as currentIssueFragment } from '../../../shared/fragments'
import ErrorBoundary from '../../../shared/ErrorBoundary'

const mdParser = new MarkdownIt({ breaks: true })

const Container = styled.div`
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
`
const LoadingContainer = styled.div`
  height: calc(100vh - 64px);
  padding: 10px;
`
const FieldsContainer = styled.div`
  height: ${(props) => `calc(100% - ${props['data-form-title-height']}px)`};
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

  const row = get(data, 'currentissueById', {})

  const [formTitleHeight, setFormTitleHeight] = useState(0)

  if (loading) {
    return <LoadingContainer>Lade...</LoadingContainer>
  }
  if (error) {
    return (
      <LoadingContainer>
        {`Fehler beim Laden der Daten: ${error.message}`}
      </LoadingContainer>
    )
  }
  if (!row) return null
  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={row.id}
          title="Aktueller Fehler"
          treeName={treeName}
          table="currentissue"
          setFormTitleHeight={setFormTitleHeight}
        />
        <FieldsContainer data-form-title-height={formTitleHeight}>
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
