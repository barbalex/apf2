// @flow
import React from 'react'
import styled from 'styled-components'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import data1Gql from './data1.graphql'
import data2Gql from './data2.graphql'
import updateUserByIdGql from './updateUserById.graphql'

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
  withState('errors', 'setErrors', ({})),
  withHandlers({
    saveToDb: ({
      refetchTree,
      setErrors,
      errors
    }) => async ({
      row,
      field,
      value,
      updateUser
    }) => {
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      try {
        await updateUser({
          variables: {
            id: row.id,
            [field]: value,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateUserById: {
              user: {
                id: row.id,
                name: field === 'name' ? value : row.name,
                email: field === 'email' ? value : row.email,
                role: field === 'role' ? value : row.role,
                pass: field === 'pass' ? value : row.pass,
                __typename: 'User',
              },
              __typename: 'User',
            },
          },
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors(({}))
      if (['artId'].includes(field)) refetchTree()
    },
  }),
  withLifecycle({
    onDidUpdate(prevProps, props) {
      if (prevProps.id !== props.id) {
        props.setErrors(({}))
      }
    },
  }),
)

const User = ({
  treeName,
  saveToDb,
  errors,
}: {
  treeName: String,
  saveToDb: () => void,
  errors: Object,
}) => (
  <Query query={data1Gql}>
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

            const row = get(data, 'userById')
            let roleWerte = sortBy(
              [
                {
                  value: 'apflora_reader',
                  label: 'reader',
                  sort: 1,
                },
                {
                  value: 'apflora_freiwillig',
                  label: 'freiwillig',
                  sort: 2,
                },
                {
                  value: 'apflora_artverantwortlich',
                  label: 'artverantwortlich',
                  sort: 3,
                },
                {
                  value: 'apflora_manager',
                  label: 'manager',
                  sort: 4,
                },
              ],
              'sort'
            )

            return (
              <ErrorBoundary>
                <Container>
                  <FormTitle apId={id} title="Aktionsplan" />
                  <Mutation mutation={updateUserByIdGql}>
                    {(updateUser, { data }) => (
                      <FieldsContainer>
                        <TextField
                          key={`${row.id}name`}
                          label="Name"
                          value={row.name}
                          saveToDb={value =>
                            saveToDb({ row, field: 'name', value, updateUser })
                          }
                          error={errors.name}
                        />
                        <TextField
                          key={`${row.id}email`}
                          label="Email"
                          value={row.email}
                          saveToDb={value =>
                            saveToDb({ row, field: 'email', value, updateUser })
                          }
                          error={errors.email}
                        />
                        <RadioButtonGroup
                          key={`${row.id}role`}
                          value={row.role}
                          dataSource={roleWerte}
                          saveToDb={value =>
                            saveToDb({ row, field: 'role', value, updateUser })
                          }
                          error={errors.role}
                          label="Rolle"
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

export default enhance(User)
