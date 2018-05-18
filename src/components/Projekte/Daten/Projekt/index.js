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
import data1Gql from './data1.graphql'
import data2Gql from './data2.graphql'
import updateProjektByIdGql from './updateProjektById.graphql'

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
    saveToDb: props => ({ row, field, value, updateProjekt }) =>
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
      }),
  })
)

const Projekt = ({
  saveToDb,
  treeName
}: {
  saveToDb: () => void,
  treeName: String
}) => (
  <Query query={data1Gql} >
    {({ loading, error, data }) => {
      if (error) return `Fehler: ${error.message}`
      const id = get(data, `${treeName}.activeNodeArray[1]`)

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
    }}
  </Query>
)

export default enhance(Projekt)
