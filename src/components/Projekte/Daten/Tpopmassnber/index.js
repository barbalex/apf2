// @flow
import React from 'react'
import styled from 'styled-components'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
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

const enhance = compose(
  withHandlers({
    saveToDb: props => ({ row, field, value, updateTpopmassnber }) =>
      updateTpopmassnber({
        variables: {
          id: row.id,
          [field]: value,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateTpopmassnberById: {
            tpopmassnber: {
              id: row.id,
              tpopId: field === 'tpopId' ? value : row.tpopId,
              jahr: field === 'jahr' ? value : row.jahr,
              beurteilung: field === 'beurteilung' ? value : row.beurteilung,
              bemerkungen: field === 'bemerkungen' ? value : row.bemerkungen,
              tpopByTpopId: row.tpopByTpopId,
              __typename: 'Tpopmassnber',
            },
            __typename: 'Tpopmassnber',
          },
        },
      }),
  })
)

const Tpopmassnber = ({
  id,
  saveToDb,
}: {
  id: String,
  saveToDb: () => void,
}) => (
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
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'jahr',
                        value,
                        updateTpopmassnber,
                      })
                    }
                  />
                  <RadioButtonGroup
                    label="Entwicklung"
                    value={row.beurteilung}
                    dataSource={tpopmassnbeurtWerte}
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'beurteilung',
                        value,
                        updateTpopmassnber,
                      })
                    }
                  />
                  <TextField
                    key={`${row.id}bemerkungen`}
                    label="Interpretation"
                    value={row.bemerkungen}
                    type="text"
                    multiLine
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'bemerkungen',
                        value,
                        updateTpopmassnber,
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

export default enhance(Tpopmassnber)
