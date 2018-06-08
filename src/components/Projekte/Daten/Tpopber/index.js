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
import dataGql from './data.graphql'
import updateTpopberByIdGql from './updateTpopberById.graphql'
import listError from '../../../../modules/listError'

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
    saveToDb: ({ refetchTree }) => async ({ row, field, value, updateTpopber }) => {
      try {
        await updateTpopber({
          variables: {
            id: row.id,
            [field]: value,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateTpopberById: {
              tpopber: {
                id: row.id,
                tpopId: field === 'tpopId' ? value : row.tpopId,
                jahr: field === 'jahr' ? value : row.jahr,
                entwicklung: field === 'entwicklung' ? value : row.entwicklung,
                bemerkungen: field === 'bemerkungen' ? value : row.bemerkungen,
                tpopEntwicklungWerteByEntwicklung:
                  row.tpopEntwicklungWerteByEntwicklung,
                tpopByTpopId: row.tpopByTpopId,
                __typename: 'Tpopber',
              },
              __typename: 'Tpopber',
            },
          },
        })
      } catch (error) {
        return listError(error)
      }
      if (['entwicklung'].includes(field)) refetchTree()
    },
  })
)

const Tpopber = ({
  id,
  saveToDb
}: {
  id: String,
  saveToDb: () => void
}) => (
  <Query query={dataGql} variables={{ id }}>
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
                    saveToDb={value =>
                      saveToDb({ row, field: 'jahr', value, updateTpopber })
                    }
                  />
                  <RadioButtonGroup
                    key={`${row.id}entwicklung`}
                    label="Entwicklung"
                    value={row.entwicklung}
                    dataSource={tpopentwicklungWerte}
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'entwicklung',
                        value,
                        updateTpopber,
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
                        updateTpopber,
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

export default enhance(Tpopber)
