import React, { useState, useCallback, useEffect, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from 'react-apollo-hooks'

import TextField from '../../../shared/TextField2'
import Select from '../../../shared/Select'
import RadioButton from '../../../shared/RadioButton'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import query from './query'
import queryLists from './queryLists'
import updateEkzaehleinheitByIdGql from './updateEkzaehleinheitById'
import storeContext from '../../../../storeContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'

const Container = styled.div`
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  overflow: auto !important;
  padding: 10px;
  height: 100%;
`

const Ekzaehleinheit = ({ treeName }) => {
  const store = useContext(storeContext)
  const { refetch } = store
  const client = useApolloClient()
  const [errors, setErrors] = useState({})
  const { activeNodeArray } = store[treeName]

  const { data, loading, error } = useQuery(query, {
    variables: {
      id:
        activeNodeArray.length > 5
          ? activeNodeArray[5]
          : '99999999-9999-9999-9999-999999999999',
    },
  })

  const row = get(data, 'ekzaehleinheitById', {})

  useEffect(() => setErrors({}), [row])

  const ekzaehleinheitenOfAp = get(
    row,
    'apByApId.ekzaehleinheitsByApId.nodes',
    [],
  ).map(o => o.zaehleinheitId)
  // re-add this ones id
  const notToShow = ekzaehleinheitenOfAp.filter(o => o !== row.zaehleinheitId)
  const zaehleinheitWerteFilter = notToShow.length
    ? { id: { notIn: notToShow } }
    : { id: { isNull: false } }
  const {
    data: dataLists,
    loading: loadingLists,
    error: errorLists,
  } = useQuery(queryLists, {
    variables: {
      filter: zaehleinheitWerteFilter,
    },
  })

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value)
      try {
        await client.mutate({
          mutation: updateEkzaehleinheitByIdGql,
          variables: {
            id: row.id,
            [field]: value,
            changedBy: store.user.name,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateEkzaehleinheitById: {
              ekzaehleinheit: {
                id: row.id,
                bemerkungen: field === 'bemerkungen' ? value : row.bemerkungen,
                zaehleinheitId:
                  field === 'zaehleinheitId' ? value : row.zaehleinheitId,
                apId: field === 'apId' ? value : row.apId,
                zielrelevant:
                  field === 'zielrelevant' ? value : row.zielrelevant,
                sort: field === 'sort' ? value : row.sort,
                tpopkontrzaehlEinheitWerteByZaehleinheitId:
                  row.tpopkontrzaehlEinheitWerteByZaehleinheitId,
                apByApId: row.apByApId,
                __typename: 'Ekzaehleinheit',
              },
              __typename: 'Ekzaehleinheit',
            },
          },
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors({})
      if (['zaehleinheitId'].includes(field)) refetch.ekzaehleinheits()
    },
    [row],
  )

  if (loading) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (error) return `Fehler: ${error.message}`
  if (errorLists) {
    return `Fehler: ${errorLists.message}`
  }
  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={row.apId}
          title="EK-Zähleinheit"
          treeName={treeName}
          table="ekzaehleinheit"
        />
        <FieldsContainer>
          <Select
            key={`${row.id}zaehleinheitId`}
            name="zaehleinheitId"
            value={row.zaehleinheitId}
            field="zaehleinheitId"
            label="Zähleinheit"
            options={get(dataLists, 'allTpopkontrzaehlEinheitWertes.nodes', [])}
            loading={loadingLists}
            saveToDb={saveToDb}
            error={errors.zaehleinheitId}
          />
          <RadioButton
            key={`${row.id}zielrelevant`}
            name="zielrelevant"
            label="zielrelevant"
            value={row.zielrelevant}
            saveToDb={saveToDb}
            error={errors.zielrelevant}
          />
          <TextField
            key={`${row.id}sort`}
            name="sort"
            label="Sortierung"
            row={row}
            type="number"
            saveToDb={saveToDb}
            errors={errors}
          />
          <TextField
            key={`${row.id}bemerkungen`}
            name="bemerkungen"
            label="Bemerkungen"
            row={row}
            type="text"
            multiLine
            saveToDb={saveToDb}
            errors={errors}
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Ekzaehleinheit)
