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
import popmassnberByIdGql from './popmassnberById.graphql'
import updatePopmassnberByIdGql from './updatePopmassnberById.graphql'

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

const Popmassnber = ({ id }: { id: String }) => (
  <Query query={popmassnberByIdGql} variables={{ id }}>
    {({ loading, error, data }) => {
      if (loading)
        return (
          <Container>
            <FieldsContainer>Lade...</FieldsContainer>
          </Container>
        )
      if (error) return `Fehler: ${error.message}`

      const row = get(data, 'popmassnberById')
      let popbeurteilungWerte = get(
        data,
        'allTpopmassnErfbeurtWertes.nodes',
        []
      )
      popbeurteilungWerte = sortBy(popbeurteilungWerte, 'sort')
      popbeurteilungWerte = popbeurteilungWerte.map(el => ({
        value: el.code,
        label: el.text,
      }))

      return (
        <ErrorBoundary>
          <Container>
            <FormTitle
              apId={get(data, 'popmassnberById.popByPopId.apId')}
              title="Massnahmen-Bericht Population"
            />
            <Mutation mutation={updatePopmassnberByIdGql}>
              {(updatePopmassnber, { data }) => (
                <FieldsContainer>
                  <TextField
                    key={`${row.id}jahr`}
                    label="Jahr"
                    value={row.jahr}
                    type="number"
                    saveToDb={event =>
                      updatePopmassnber({
                        variables: {
                          id,
                          jahr: event.target.value,
                        },
                      })
                    }
                  />
                  <RadioButtonGroup
                    key={`${row.id}beurteilung`}
                    label="Entwicklung"
                    value={row.beurteilung}
                    dataSource={popbeurteilungWerte}
                    saveToDb={value =>
                      updatePopmassnber({
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
                      updatePopmassnber({
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

export default Popmassnber
