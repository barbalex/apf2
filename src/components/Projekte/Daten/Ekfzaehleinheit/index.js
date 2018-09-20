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
import updateEkfzaehleinheitByIdGql from './updateEkfzaehleinheitById.graphql'
import withAllTpopkontrzaehlEinheitWertes from './withAllTpopkontrzaehlEinheitWertes'

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
  withAllTpopkontrzaehlEinheitWertes,
  withState('errors', 'setErrors', {}),
  withHandlers({
    saveToDb: ({ refetchTree, setErrors, errors }) => async ({
      row,
      field,
      value,
      updateEkfzaehleinheit,
    }) => {
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      try {
        await updateEkfzaehleinheit({
          variables: {
            id: row.id,
            [field]: value,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateEkfzaehleinheitById: {
              ekfzaehleinheit: {
                id: row.id,
                bemerkungen: field === 'bemerkungen' ? value : row.bemerkungen,
                zaehleinheitId:
                  field === 'zaehleinheitId' ? value : row.zaehleinheitId,
                apId: field === 'apId' ? value : row.apId,
                tpopkontrzaehlEinheitWerteByZaehleinheitId:
                  row.tpopkontrzaehlEinheitWerteByZaehleinheitId,
                apByApId: row.apByApId,
                __typename: 'Ekfzaehleinheit',
              },
              __typename: 'Ekfzaehleinheit',
            },
          },
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors({})
      if (['zaehleinheitId'].includes(field)) refetchTree('ekfzaehleinheits')
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

const Ekfzaehleinheit = ({
  id,
  saveToDb,
  errors,
  treeName,
  dataAllTpopkontrzaehlEinheitWertes,
}: {
  id: string,
  saveToDb: () => void,
  errors: Object,
  treeName: string,
  dataAllTpopkontrzaehlEinheitWertes: Object,
}) => (
  <Query query={dataGql} variables={{ id }}>
    {({ loading, error, data }) => {
      if (loading || dataAllTpopkontrzaehlEinheitWertes.loading)
        return (
          <Container>
            <FieldsContainer>Lade...</FieldsContainer>
          </Container>
        )
      if (error) return `Fehler: ${error.message}`
      if (dataAllTpopkontrzaehlEinheitWertes.error)
        return `Fehler: ${dataAllTpopkontrzaehlEinheitWertes.error.message}`

      const row = get(data, 'ekfzaehleinheitById', {})
      console.log('Ekfzaehleinheit', { row, data })
      const ekfzaehleinheitenOfAp = get(
        row,
        'apByApId.ekfzaehleinheitsByApId.nodes',
        [],
      ).map(o => o.zaehleinheitId)
      // re-add this ones id
      const notToShow = ekfzaehleinheitenOfAp.filter(
        o => o !== row.zaehleinheitId,
      )
      let zaehleinheitWerte = get(
        dataAllTpopkontrzaehlEinheitWertes,
        'allTpopkontrzaehlEinheitWertes.nodes',
        [],
      )
      // filter ap arten but the active one
      zaehleinheitWerte = zaehleinheitWerte.filter(
        o => !notToShow.includes(o.id),
      )
      zaehleinheitWerte = sortBy(zaehleinheitWerte, 'text')
      zaehleinheitWerte = zaehleinheitWerte.map(el => ({
        value: el.id,
        label: el.text,
      }))

      return (
        <ErrorBoundary>
          <Container>
            <FormTitle
              apId={row.apId}
              title="EKF-Zähleinheit"
              treeName={treeName}
              table="ekfzaehleinheit"
            />
            <Mutation mutation={updateEkfzaehleinheitByIdGql}>
              {(updateEkfzaehleinheit, { data }) => (
                <FieldsContainer>
                  <Select
                    key={`${row.id}zaehleinheitId`}
                    value={row.zaehleinheitId}
                    field="zaehleinheitId"
                    label="Zähleinheit"
                    options={zaehleinheitWerte}
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'zaehleinheitId',
                        value,
                        updateEkfzaehleinheit,
                      })
                    }
                    error={errors.zaehleinheitId}
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
                        updateEkfzaehleinheit,
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

export default enhance(Ekfzaehleinheit)
