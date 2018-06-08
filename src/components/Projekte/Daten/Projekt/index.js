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
import dataGql from './data.graphql'
import updateProjektByIdGql from './updateProjektById.graphql'
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
    saveToDb: props => async ({ row, field, value, updateProjekt }) => {
      try {
        updateProjekt({
          variables: {
            id: row.id,
            [field]: value,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateProjektById: {
              projekt: {
                id: row.id,
                name: field === 'name' ? value : row.name,
                __typename: 'Projekt',
              },
              __typename: 'Projekt',
            },
          },
        })
      } catch (error) {
        return listError(error)
      }
    }
  })
)

const Projekt = ({
  saveToDb,
  id
}: {
  saveToDb: () => void,
  id: String
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

      const row = get(data, 'projektById')

      return (
        <ErrorBoundary>
          <Container>
            <FormTitle title="Projekt" />
            <Mutation mutation={updateProjektByIdGql}>
              {(updateProjekt, { data }) => (
                <FieldsContainer>
                  <TextField
                    key={`${row.id}name`}
                    label="Name"
                    value={row.name}
                    type="text"
                    saveToDb={value => 
                      saveToDb({ row, field: 'name', value, updateProjekt })
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

export default enhance(Projekt)
