// @flow
import React from 'react'
import sortBy from 'lodash/sortBy'
import styled from 'styled-components'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'

import TextField from '../../../shared/TextField'
import Select from '../../../shared/Select'
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
  withState('errors', 'setErrors', {}),
  withHandlers({
    saveToDb: ({ refetchTree, setErrors, errors }) => async ({
      row,
      field,
      value,
      updateAssozart,
    }) => {
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      try {
        await updateAssozart({
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
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors({})
      if (['aeId'].includes(field)) refetchTree()
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

const Assozart = ({
  id,
  saveToDb,
  errors,
}: {
  id: String,
  saveToDb: () => void,
  errors: Object,
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
        o => o.aeId,
      )
      const artenNotToShow = assozartenOfAp.filter(a => a !== row.aeId)
      let artWerte = get(data, 'allAeEigenschaftens.nodes', [])
      // filter ap arten but the active one
      artWerte = artWerte.filter(o => !artenNotToShow.includes(o.id))
      artWerte = sortBy(artWerte, 'artname')
      artWerte = artWerte.map(el => ({
        value: el.id,
        label: el.artname,
      }))

      return (
        <ErrorBoundary>
          <Container>
            <FormTitle apId={row.apId} title="assoziierte Art" />
            <Mutation mutation={updateAssozartByIdGql}>
              {(updateAssozart, { data }) => (
                <FieldsContainer>
                  <Select
                    key={`${row.id}aeId`}
                    value={row.aeId}
                    field="aeId"
                    label="Art"
                    options={artWerte.map(a => ({
                      label: a.value,
                      value: a.id,
                    }))}
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'aeId',
                        value,
                        updateAssozart,
                      })
                    }
                    error={errors.aeId}
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
                    error={errors.bemerkungen}
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
