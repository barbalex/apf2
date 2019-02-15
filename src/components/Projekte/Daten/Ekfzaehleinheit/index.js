// @flow
import React, { useState, useCallback, useEffect, useContext } from 'react'
import sortBy from 'lodash/sortBy'
import styled from 'styled-components'
import get from 'lodash/get'
import compose from 'recompose/compose'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from 'react-apollo-hooks'

import TextField from '../../../shared/TextField'
import Select from '../../../shared/Select'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import query from './data'
import updateEkfzaehleinheitByIdGql from './updateEkfzaehleinheitById'
import withAllTpopkontrzaehlEinheitWertes from './withAllTpopkontrzaehlEinheitWertes'
import mobxStoreContext from '../../../../mobxStoreContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'

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
  observer,
)

const Ekfzaehleinheit = ({
  treeName,
  dataAllTpopkontrzaehlEinheitWertes,
}: {
  treeName: string,
  dataAllTpopkontrzaehlEinheitWertes: Object,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const { refetch } = mobxStore
  const client = useApolloClient()
  const [errors, setErrors] = useState({})
  const { activeNodeArray } = mobxStore[treeName]

  const { data, loading, error } = useQuery(query, {
    variables: {
      id:
        activeNodeArray.length > 5
          ? activeNodeArray[5]
          : '99999999-9999-9999-9999-999999999999',
    },
  })

  const row = get(data, 'ekfzaehleinheitById', {})

  useEffect(() => setErrors({}), [row])

  const ekfzaehleinheitenOfAp = get(
    row,
    'apByApId.ekfzaehleinheitsByApId.nodes',
    [],
  ).map(o => o.zaehleinheitId)
  // re-add this ones id
  const notToShow = ekfzaehleinheitenOfAp.filter(o => o !== row.zaehleinheitId)
  let zaehleinheitWerte = get(
    dataAllTpopkontrzaehlEinheitWertes,
    'allTpopkontrzaehlEinheitWertes.nodes',
    [],
  )
  // filter ap arten but the active one
  zaehleinheitWerte = zaehleinheitWerte.filter(o => !notToShow.includes(o.id))
  zaehleinheitWerte = sortBy(zaehleinheitWerte, 'text')
  zaehleinheitWerte = zaehleinheitWerte.map(el => ({
    value: el.id,
    label: el.text,
  }))

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value) || null
      try {
        await client.mutate({
          mutation: updateEkfzaehleinheitByIdGql,
          variables: {
            id: row.id,
            [field]: value,
            changedBy: mobxStore.user.name,
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
      if (['zaehleinheitId'].includes(field)) refetch.ekfzaehleinheits()
    },
    [row],
  )

  if (loading || dataAllTpopkontrzaehlEinheitWertes.loading) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (error) return `Fehler: ${error.message}`
  if (dataAllTpopkontrzaehlEinheitWertes.error) {
    return `Fehler: ${dataAllTpopkontrzaehlEinheitWertes.error.message}`
  }
  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={row.apId}
          title="EKF-Zähleinheit"
          treeName={treeName}
          table="ekfzaehleinheit"
        />
        <FieldsContainer>
          <Select
            key={`${row.id}zaehleinheitId`}
            name="zaehleinheitId"
            value={row.zaehleinheitId}
            field="zaehleinheitId"
            label="Zähleinheit"
            options={zaehleinheitWerte}
            saveToDb={saveToDb}
            error={errors.zaehleinheitId}
          />
          <TextField
            key={`${row.id}bemerkungen`}
            name="bemerkungen"
            label="Bemerkungen"
            value={row.bemerkungen}
            type="text"
            multiLine
            saveToDb={saveToDb}
            error={errors.bemerkungen}
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(Ekfzaehleinheit)
