// @flow
import React from 'react'
import styled from 'styled-components'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'

import TextField from '../../../shared/TextFieldGql'
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

const Ber = ({ id }: { id: String }) => (
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
                      updateBer({
                        variables: {
                          id,
                          autor: value,
                        },
                      })
                    }
                  />
                  <TextField
                    key={`${row.id}jahr`}
                    label="Jahr"
                    value={row.jahr}
                    type="number"
                    saveToDb={value =>
                      updateBer({
                        variables: {
                          id,
                          jahr: value,
                        },
                      })
                    }
                  />
                  <TextField
                    key={`${row.id}titel`}
                    label="Titel"
                    value={row.titel}
                    type="text"
                    multiLine
                    saveToDb={value =>
                      updateBer({
                        variables: {
                          id,
                          titel: value,
                        },
                      })
                    }
                  />
                  <TextFieldWithUrl
                    key={`${row.id}url`}
                    label="URL"
                    value={row.url}
                    type="text"
                    multiLine
                    saveToDb={value =>
                      updateBer({
                        variables: {
                          id,
                          url: value,
                        },
                      })
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

export default Ber
