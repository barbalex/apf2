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
import tpopmassnberByIdGql from './tpopmassnberById.graphql'
import updateTpopmassnberByIdGql from './updateTpopmassnberById.graphql'

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

const Tpopmassnber = ({ id }: { id: String }) => (
  <Query query={tpopmassnberByIdGql} variables={{ id }}>
    {({ loading, error, data }) => {
      if (loading)
        return (
          <Container>
            <FieldsContainer>Lade...</FieldsContainer>
          </Container>
        )
      if (error) return `Fehler: ${error.message}`

      const row = get(data, 'tpopmassnberById')
      let tpopmassnbeurtWerte = get(
        data,
        'allTpopmassnErfbeurtWertes.nodes',
        []
      )
      tpopmassnbeurtWerte = sortBy(tpopmassnbeurtWerte, 'sort')
      tpopmassnbeurtWerte = tpopmassnbeurtWerte.map(el => ({
        value: el.code,
        label: el.text,
      }))

      return (
        <ErrorBoundary>
          <Container>
            <FormTitle
              apId={get(data, 'tpopmassnberById.tpopByTpopId.popByPopId.apId')}
              title="Massnahmen-Bericht Teil-Population"
            />
            <Mutation mutation={updateTpopmassnberByIdGql}>
              {(updateTpopmassnber, { data }) => (
                <FieldsContainer>
                  <TextField
                    key={`${row.id}jahr`}
                    label="Jahr"
                    value={row.jahr}
                    type="number"
                    saveToDb={event =>
                      updateTpopmassnber({
                        variables: {
                          id,
                          jahr: event.target.value,
                        },
                      })
                    }
                  />
                  <RadioButtonGroup
                    label="Entwicklung"
                    value={row.beurteilung}
                    dataSource={tpopmassnbeurtWerte}
                    saveToDb={value =>
                      updateTpopmassnber({
                        variables: {
                          id,
                          beurteilung: value,
                        },
                      })
                    }
                  />
                  <TextField
                    key={`${row.id}bemerkungen`}
                    label="Interpretation"
                    value={row.bemerkungen}
                    type="text"
                    multiLine
                    saveToDb={event =>
                      updateTpopmassnber({
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

export default Tpopmassnber
