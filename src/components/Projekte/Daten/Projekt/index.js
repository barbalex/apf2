// @flow
import React from 'react'
import styled from 'styled-components'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'

import TextField from '../../../shared/TextField'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import dataGql from './data.graphql'
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
  withState('errors', 'setErrors', {}),
  withHandlers({
    saveToDb: ({ setErrors, errors }) => async ({
      row,
      field,
      value,
      updateProjekt,
    }) => {
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      try {
        await updateProjekt({
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
        return setErrors({ [field]: error.message })
      }
      setErrors({})
    },
  }),
  withLifecycle({
    onDidUpdate(prevProps, props) {
      if (prevProps.id !== props.id) {
        props.setErrors({})
      }
    },
  }),
)

const Projekt = ({
  saveToDb,
  id,
  errors,
  treeName,
  activeNodeArray,
}: {
  saveToDb: () => void,
  id: string,
  errors: Object,
  treeName: string,
  activeNodeArray: Array<string>,
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

      const row = get(data, 'projektById', {})
      const filterTable = activeNodeArray.length === 2 ? 'projekt' : 'ap'

      return (
        <ErrorBoundary>
          <Container>
            <FormTitle
              title="Projekt"
              treeName={treeName}
              table={filterTable}
            />
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
                    error={errors.name}
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
