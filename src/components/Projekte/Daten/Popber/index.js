// @flow
import React from 'react'
import styled from 'styled-components'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import data1Gql from './data1.graphql'
import data2Gql from './data2.graphql'
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

const enhance = compose(
  withHandlers({
    saveToDb: props => ({ row, field, value, updatePopber }) =>
      updatePopber({
        variables: {
          id: row.id,
          [field]: value,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updatePopberById: {
            popber: {
              id: row.id,
              popId: field === 'popId' ? value : row.popId,
              jahr: field === 'jahr' ? value : row.jahr,
              entwicklung: field === 'entwicklung' ? value : row.entwicklung,
              bemerkungen: field === 'bemerkungen' ? value : row.bemerkungen,
              tpopEntwicklungWerteByEntwicklung:
                row.tpopEntwicklungWerteByEntwicklung,
              popByPopId: row.popByPopId,
              __typename: 'Popber',
            },
            __typename: 'Popber',
          },
        },
      }),
  })
)

const Popber = ({
  treeName,
  saveToDb
}: {
  treeName: String,
  saveToDb: () => void
}) => (
  <Query query={data1Gql}>
    {({ loading, error, data }) => {
      if (error) return `Fehler: ${error.message}`
      const id = get(data, `${treeName}.activeNodeArray[7]`)

      return (
        <Query query={data2Gql} variables={{ id }}>
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
                            saveToDb({ row, field: 'jahr', value, updatePopber })
                          }
                        />
                        <RadioButtonGroup
                          key={`${row.id}entwicklung`}
                          label="Entwicklung"
                          value={row.entwicklung}
                          dataSource={popentwicklungWerte}
                          saveToDb={value =>
                            saveToDb({
                              row,
                              field: 'entwicklung',
                              value,
                              updatePopber,
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
                            saveToDb({
                              row,
                              field: 'bemerkungen',
                              value,
                              updatePopber,
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
    }}
  </Query>
)

export default enhance(Popber)
