// @flow
import React from 'react'
import styled from 'styled-components'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'

import RadioButtonGroup from '../../../shared/RadioButtonGroupGql'
import TextField from '../../../shared/TextFieldGql'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import zielByIdGql from './zielById.graphql'
import updateZielByIdGql from './updateZielById.graphql'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  padding: 10px;
  height: 100%;
  overflow: auto !important;
`

const Ziel = ({ id }: { id: String }) => (
  <Query query={zielByIdGql} variables={{ id }}>
    {({ loading, error, data }) => {
      if (loading)
        return (
          <Container>
            <FieldsContainer>Lade...</FieldsContainer>
          </Container>
        )
      if (error) return `Fehler: ${error.message}`

      const row = get(data, 'zielById')
      let typWerte = get(data, 'allZielTypWertes.nodes', [])
      typWerte = sortBy(typWerte, 'sort')
      typWerte = typWerte.map(el => ({
        value: el.code,
        label: el.text,
      }))

      return (
        <ErrorBoundary>
          <Container>
            <FormTitle apId={row.apId} title="Ziel" />
            <Mutation mutation={updateZielByIdGql}>
              {(updateZiel, { data }) => (
                <FieldsContainer>
                  <TextField
                    key={`${row.id}jahr`}
                    label="Jahr"
                    value={row.jahr}
                    type="number"
                    saveToDb={value =>
                      updateZiel({
                        variables: {
                          id,
                          jahr: value,
                        },
                      })
                    }
                  />
                  <RadioButtonGroup
                    key={`${row.id}typ`}
                    label="Zieltyp"
                    value={row.typ}
                    dataSource={typWerte}
                    saveToDb={value =>
                      updateZiel({
                        variables: {
                          id,
                          typ: value,
                        },
                      })
                    }
                  />
                  <TextField
                    key={`${row.id}bezeichnung`}
                    label="Ziel"
                    value={row.bezeichnung}
                    type="text"
                    multiLine
                    saveToDb={value =>
                      updateZiel({
                        variables: {
                          id,
                          bezeichnung: value,
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

export default Ziel
