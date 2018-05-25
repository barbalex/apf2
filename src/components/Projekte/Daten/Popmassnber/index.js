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

const enhance = compose(
  withHandlers({
    saveToDb: props => ({ row, field, value, updatePopmassnber }) =>
      updatePopmassnber({
        variables: {
          id: row.id,
          [field]: value,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updatePopmassnberById: {
            popmassnber: {
              id: row.id,
              popId: field === 'popId' ? value : row.popId,
              jahr: field === 'jahr' ? value : row.jahr,
              beurteilung: field === 'beurteilung' ? value : row.beurteilung,
              bemerkungen: field === 'bemerkungen' ? value : row.bemerkungen,
              tpopmassnErfbeurtWerteByBeurteilung:
                row.tpopmassnErfbeurtWerteByBeurteilung,
              popByPopId: row.popByPopId,
              __typename: 'Popmassnber',
            },
            __typename: 'Popmassnber',
          },
        },
      }),
  })
)

const Popmassnber = ({
  id,
  saveToDb,
}: {
  id: String,
  saveToDb: () => void,
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
                    saveToDb={value =>
                      saveToDb({ row, field: 'jahr', value, updatePopmassnber })
                    }
                  />
                  <RadioButtonGroup
                    key={`${row.id}beurteilung`}
                    label="Entwicklung"
                    value={row.beurteilung}
                    dataSource={popbeurteilungWerte}
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'beurteilung',
                        value,
                        updatePopmassnber,
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
                        updatePopmassnber,
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

export default enhance(Popmassnber)
