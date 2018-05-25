// @flow
import React from 'react'
import sortBy from 'lodash/sortBy'
import styled from 'styled-components'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

import TextField from '../../../shared/TextField'
import AutoComplete from '../../../shared/Autocomplete'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import dataGql from './data.graphql'
import updateAssozartByIdGql from './updateAssozartById.graphql'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  overflow: auto !important;
  padding: 10px;
  height: 100%;
`

const enhance = compose(
  withHandlers({
    saveToDb: props => ({ row, field, value, updateAssozart }) =>
      updateAssozart({
        variables: {
          id: row.id,
          [field]: value,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateAssozartById: {
            assozart: {
              id: row.id,
              bemerkungen: field === 'bemerkungen' ? value : row.bemerkungen,
              aeId: field === 'aeId' ? value : row.aeId,
              apId: field === 'apId' ? value : row.apId,
              aeEigenschaftenByAeId: row.aeEigenschaftenByAeId,
              apByApId: row.apByApId,
              __typename: 'Assozart',
            },
            __typename: 'Assozart',
          },
        },
      }),
  })
)

const Assozart = ({
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

      const row = get(data, 'assozartById')
      const assozartenOfAp = get(row, 'apByApId.assozartsByApId.nodes', []).map(
        o => o.aeId
      )
      const artenNotToShow = [
        ...assozartenOfAp,
        get(row, 'apByApId.artId', null),
      ]
      let artWerte = get(data, 'allAeEigenschaftens.nodes', [])
      // filter ap arten but the active one
      artWerte = artWerte.filter(o => !artenNotToShow.includes(o.id))
      artWerte = sortBy(artWerte, 'artname')
      artWerte = artWerte.map(el => ({
        id: el.id,
        value: el.artname,
      }))

      return (
        <ErrorBoundary>
          <Container>
            <FormTitle apId={row.apId} title="assoziierte Art" />
            <Mutation mutation={updateAssozartByIdGql}>
              {(updateAssozart, { data }) => (
                <FieldsContainer>
                  <AutoComplete
                    key={`${row.id}aeId`}
                    label="Art"
                    value={get(row, 'aeEigenschaftenByAeId.artname', '')}
                    objects={artWerte}
                    saveToDb={value =>
                      saveToDb({ row, field: 'aeId', value, updateAssozart })
                    }
                  />
                  <TextField
                    key={`${row.id}bemerkungen`}
                    label="Bemerkungen zur Assoziation"
                    value={row.bemerkungen}
                    type="text"
                    multiLine
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'bemerkungen',
                        value,
                        updateAssozart,
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

export default enhance(Assozart)
