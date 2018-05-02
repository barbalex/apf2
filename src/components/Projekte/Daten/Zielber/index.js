// @flow
import React from 'react'
import styled from 'styled-components'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'

import TextField from '../../../shared/TextFieldGql'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import zielberByIdGql from './zielberById.graphql'
import updateZielberByIdGql from './updateZielberById.graphql'

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

const Zielber = ({ id }: { id: String }) => (
  <Query query={zielberByIdGql} variables={{ id }}>
    {({ loading, error, data }) => {
      if (loading)
        return (
          <Container>
            <FieldsContainer>Lade...</FieldsContainer>
          </Container>
        )
      if (error) return `Fehler: ${error.message}`

      const row = get(data, 'zielberById')

      return (
        <ErrorBoundary>
          <Container>
            <FormTitle
              apId={get(row, 'zielByZielId.apId')}
              title="Ziel-Bericht"
            />
            <Mutation mutation={updateZielberByIdGql}>
              {(updateZielber, { data }) => (
                <FieldsContainer>
                  <TextField
                    key={`${row.id}jahr`}
                    label="Jahr"
                    value={row.jahr}
                    type="number"
                    saveToDb={value =>
                      updateZielber({
                        variables: {
                          id,
                          jahr: value,
                        },
                      })
                    }
                  />
                  <TextField
                    key={`${row.id}erreichung`}
                    label="Entwicklung"
                    value={row.erreichung}
                    type="text"
                    saveToDb={value =>
                      updateZielber({
                        variables: {
                          id,
                          erreichung: value,
                        },
                      })
                    }
                  />
                  <TextField
                    key={`${row.id}bemerkungen`}
                    label="Bemerkungen"
                    value={row.bemerkungen}
                    type="text"
                    multiLine
                    saveToDb={value =>
                      updateZielber({
                        variables: {
                          id,
                          bemerkungen: value,
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

export default Zielber
