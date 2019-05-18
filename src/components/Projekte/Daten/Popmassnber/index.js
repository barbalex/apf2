import React, { useState, useCallback, useEffect, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from 'react-apollo-hooks'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField2'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import query from './query'
import queryLists from './queryLists'
import updatePopmassnberByIdGql from './updatePopmassnberById'
import storeContext from '../../../../storeContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'

const Container = styled.div`
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  padding: 10px;
  overflow: auto !important;
  height: 100%;
`

const Popmassnber = ({ treeName }) => {
  const store = useContext(storeContext)
  const { refetch } = store
  const client = useApolloClient()
  const [errors, setErrors] = useState({})
  const { activeNodeArray } = store[treeName]

  const { data, loading, error } = useQuery(query, {
    variables: {
      id:
        activeNodeArray.length > 7
          ? activeNodeArray[7]
          : '99999999-9999-9999-9999-999999999999',
    },
  })

  const {
    data: dataLists,
    loading: loadingLists,
    error: errorLists,
  } = useQuery(queryLists)

  const row = get(data, 'popmassnberById', {})

  useEffect(() => setErrors({}), [row])

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value)
      try {
        await client.mutate({
          mutation: updatePopmassnberByIdGql,
          variables: {
            id: row.id,
            [field]: value,
            changedBy: store.user.name,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updatePopmassnberById: {
              popmassnber: {
                id: row.id,
                popId: field === 'popId' ? value : row.popId,
                jahr: field === 'jahr' ? value : row.jahr,
                beurteilung: field === 'beurteilung' ? value : row.beurteilung,
                bemerkungen: field === 'bemerkungen' ? value : row.bemerkungen,
                tpopmassnErfbeurtWerteByBeurteilung:
                  row.tpopmassnErfbeurtWerteByBeurteilung,
                popByPopId: row.popByPopId,
                __typename: 'Popmassnber',
              },
              __typename: 'Popmassnber',
            },
          },
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors({})
      if (['beurteilung'].includes(field)) refetch.popmassnbers()
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
          apId={get(data, 'popmassnberById.popByPopId.apId')}
          title="Massnahmen-Bericht Population"
          treeName={treeName}
          table="popmassnber"
        />
        <FieldsContainer>
          <TextField
            key={`${row.id}jahr`}
            name="jahr"
            label="Jahr"
            row={row}
            type="number"
            saveToDb={saveToDb}
            errors={errors}
          />
          <RadioButtonGroup
            key={`${row.id}beurteilung`}
            name="beurteilung"
            label="Entwicklung"
            value={row.beurteilung}
            dataSource={get(dataLists, 'allTpopmassnErfbeurtWertes.nodes', [])}
            loading={loadingLists}
            saveToDb={saveToDb}
            error={errors.beurteilung}
          />
          <TextField
            key={`${row.id}bemerkungen`}
            name="bemerkungen"
            label="Interpretation"
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

export default observer(Popmassnber)
