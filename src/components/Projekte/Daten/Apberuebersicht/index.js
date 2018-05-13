// @flow
import React from 'react'
import styled from 'styled-components'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

import TextField from '../../../shared/TextField'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import apberuebersichtByIdGql from './apberuebersichtById.graphql'
import updateApberuebersichtByIdGql from './updateApberuebersichtById.graphql'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  overflow: auto !important;
  height: 100%;
  padding: 10px;
  height: 100%;
`

const enhance = compose(
  withHandlers({
    saveToDb: props => ({ row, field, value, updateApberuebersicht }) =>
      updateApberuebersicht({
        variables: {
          id: row.id,
          [field]: value,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateApberuebersichtById: {
            apberuebersicht: {
              id: row.id,
              projId: field === 'projId' ? value : row.projId,
              jahr: field === 'jahr' ? value : row.jahr,
              bemerkungen: field === 'bemerkungen' ? value : row.bemerkungen,
              __typename: 'Apberuebersicht',
            },
            __typename: 'Apberuebersicht',
          },
        },
      }),
  })
)

const Apberuebersicht = ({
  id,
  saveToDb,
}: {
  id: String,
  saveToDb: () => void,
}) => (
  <Query query={apberuebersichtByIdGql} variables={{ id }}>
    {({ loading, error, data }) => {
      if (loading)
        return (
          <Container>
            <FieldsContainer>Lade...</FieldsContainer>
          </Container>
        )
      if (error) return `Fehler: ${error.message}`

      const row = get(data, 'apberuebersichtById')

      return (
        <ErrorBoundary>
          <Container>
            <FormTitle title="AP-Bericht Jahresübersicht" />
            <Mutation mutation={updateApberuebersichtByIdGql}>
              {(updateApberuebersicht, { data }) => (
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
                        updateApberuebersicht,
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
                        updateApberuebersicht,
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

export default enhance(Apberuebersicht)
