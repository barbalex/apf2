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
import popberByIdGql from './popberById.graphql'
import updatePopberByIdGql from './updatePopberById.graphql'

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

const Popber = ({ id }: { id: String }) => (
  <Query query={popberByIdGql} variables={{ id }}>
    {({ loading, error, data }) => {
      if (loading)
        return (
          <Container>
            <FieldsContainer>Lade...</FieldsContainer>
          </Container>
        )
      if (error) return `Fehler: ${error.message}`

      const row = get(data, 'popberById')
      let popentwicklungWerte = get(data, 'allTpopEntwicklungWertes.nodes', [])
      popentwicklungWerte = sortBy(popentwicklungWerte, 'sort')
      popentwicklungWerte = popentwicklungWerte.map(el => ({
        value: el.code,
        label: el.text,
      }))

      return (
        <ErrorBoundary>
          <Container>
            <FormTitle
              apId={get(data, 'popberById.popByPopId.apId')}
              title="Kontroll-Bericht Population"
            />
            <Mutation mutation={updatePopberByIdGql}>
              {(updatePopber, { data }) => (
                <FieldsContainer>
                  <TextField
                    key={`${row.id}jahr`}
                    label="Jahr"
                    value={row.jahr}
                    type="number"
                    saveToDb={value =>
                      updatePopber({
                        variables: {
                          id,
                          jahr: value,
                        },
                      })
                    }
                  />
                  <RadioButtonGroup
                    key={`${row.id}entwicklung`}
                    label="Entwicklung"
                    value={row.entwicklung}
                    dataSource={popentwicklungWerte}
                    saveToDb={value =>
                      updatePopber({
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
                    saveToDb={value =>
                      updatePopber({
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

export default Popber
