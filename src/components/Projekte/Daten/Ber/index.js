// @flow
import React from 'react'
import styled from 'styled-components'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

import TextField from '../../../shared/TextField'
import TextFieldWithUrl from '../../../shared/TextFieldWithUrlGql'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import berByIdGql from './berById.graphql'
import updateBerByIdGql from './updateBerById.graphql'

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

const enhance = compose(
  withHandlers({
    saveToDb: props => ({ row, field, value, updateBer }) =>
      updateBer({
        variables: {
          id: row.id,
          [field]: value,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateBerById: {
            ber: {
              id: row.id,
              apId: field === 'apId' ? value : row.apId,
              autor: field === 'autor' ? value : row.autor,
              jahr: field === 'jahr' ? value : row.jahr,
              titel: field === 'titel' ? value : row.titel,
              url: field === 'url' ? value : row.url,
              __typename: 'Ber',
            },
            __typename: 'Ber',
          },
        },
      }),
  })
)

const Ber = ({ id, saveToDb }: { id: String, saveToDb: () => void }) => (
  <Query query={berByIdGql} variables={{ id }}>
    {({ loading, error, data }) => {
      if (loading)
        return (
          <Container>
            <FieldsContainer>Lade...</FieldsContainer>
          </Container>
        )
      if (error) return `Fehler: ${error.message}`

      const row = get(data, 'berById')

      return (
        <ErrorBoundary>
          <Container>
            <FormTitle apId={row.apId} title="Bericht" />
            <Mutation mutation={updateBerByIdGql}>
              {(updateBer, { data }) => (
                <FieldsContainer>
                  <TextField
                    key={`${row.id}autor`}
                    label="AutorIn"
                    value={row.autor}
                    type="text"
                    saveToDb={value =>
                      saveToDb({ row, field: 'autor', value, updateBer })
                    }
                  />
                  <TextField
                    key={`${row.id}jahr`}
                    label="Jahr"
                    value={row.jahr}
                    type="number"
                    saveToDb={value =>
                      saveToDb({ row, field: 'jahr', value, updateBer })
                    }
                  />
                  <TextField
                    key={`${row.id}titel`}
                    label="Titel"
                    value={row.titel}
                    type="text"
                    multiLine
                    saveToDb={value =>
                      saveToDb({ row, field: 'titel', value, updateBer })
                    }
                  />
                  <TextFieldWithUrl
                    key={`${row.id}url`}
                    label="URL"
                    value={row.url}
                    type="text"
                    multiLine
                    saveToDb={value =>
                      saveToDb({ row, field: 'url', value, updateBer })
                    }
                  />
                </FieldsContainer>
              )}
            </Mutation>
          </Container>
        </ErrorBoundary>
      )
    }}
  </Query>
)

export default enhance(Ber)
