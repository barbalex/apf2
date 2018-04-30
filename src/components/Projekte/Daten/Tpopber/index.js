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
import tpopberByIdGql from './tpopberById.graphql'
import updateTpopberByIdGql from './updateTpopberById.graphql'

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

const Tpopber = ({ id }: { id: String }) => (
  <Query query={tpopberByIdGql} variables={{ id }}>
    {({ loading, error, data }) => {
      if (loading)
        return (
          <Container>
            <FieldsContainer>Lade...</FieldsContainer>
          </Container>
        )
      if (error) return `Fehler: ${error.message}`

      const row = get(data, 'tpopberById')
      let tpopentwicklungWerte = get(data, 'allTpopEntwicklungWertes.nodes', [])
      tpopentwicklungWerte = sortBy(tpopentwicklungWerte, 'sort')
      tpopentwicklungWerte = tpopentwicklungWerte.map(el => ({
        value: el.code,
        label: el.text,
      }))

      return (
        <ErrorBoundary>
          <Container>
            <FormTitle
              apId={get(data, 'tpopberById.tpopByTpopId.popByPopId.apId')}
              title="Kontroll-Bericht Teil-Population"
            />
            <Mutation mutation={updateTpopberByIdGql}>
              {(updateTpopber, { data }) => (
                <FieldsContainer>
                  <TextField
                    key={`${row.id}jahr`}
                    label="Jahr"
                    value={row.jahr}
                    type="number"
                    saveToDb={event =>
                      updateTpopber({
                        variables: {
                          id,
                          jahr: event.target.value,
                        },
                      })
                    }
                  />
                  <RadioButtonGroup
                    key={`${row.id}entwicklung`}
                    label="Entwicklung"
                    value={row.entwicklung}
                    dataSource={tpopentwicklungWerte}
                    saveToDb={value =>
                      updateTpopber({
                        variables: {
                          id,
                          entwicklung: value,
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
                    saveToDb={event =>
                      updateTpopber({
                        variables: {
                          id,
                          bemerkungen: event.target.value,
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

export default Tpopber
