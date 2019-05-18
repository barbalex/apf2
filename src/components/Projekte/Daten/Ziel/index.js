import React, { useState, useCallback, useEffect, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from 'react-apollo-hooks'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField2'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import query from './query'
import queryLists from './queryLists'
import updateZielByIdGql from './updateZielById'
import storeContext from '../../../../storeContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'

const Container = styled.div`
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  padding: 10px;
  height: 100%;
  overflow: auto !important;
`

const Ziel = ({ treeName }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { refetch } = store
  const {
    activeNodeArray,
    setActiveNodeArray,
    openNodes,
    setOpenNodes,
  } = store[treeName]

  const [errors, setErrors] = useState({})

  const { data, loading, error } = useQuery(query, {
    variables: {
      id:
        activeNodeArray.length > 6
          ? activeNodeArray[6]
          : '99999999-9999-9999-9999-999999999999',
    },
  })

  const {
    data: dataLists,
    loading: loadingLists,
    error: errorLists,
  } = useQuery(queryLists)

  const row = get(data, 'zielById', {})

  useEffect(() => setErrors({}), [row])

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value)
      try {
        await client.mutate({
          mutation: updateZielByIdGql,
          variables: {
            id: row.id,
            [field]: value,
            changedBy: store.user.name,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateZielById: {
              ziel: {
                id: row.id,
                apId: field === 'apId' ? value : row.apId,
                typ: field === 'typ' ? value : row.typ,
                jahr: field === 'jahr' ? value : row.jahr,
                bezeichnung: field === 'bezeichnung' ? value : row.bezeichnung,
                __typename: 'Ziel',
              },
              __typename: 'Ziel',
            },
          },
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors({})
      // if jahr of ziel is updated, activeNodeArray und openNodes need to change
      if (field === 'jahr') {
        const newActiveNodeArray = [...activeNodeArray]
        newActiveNodeArray[5] = +value
        const oldParentNodeUrl = [...activeNodeArray]
        oldParentNodeUrl.pop()
        const newParentNodeUrl = [...newActiveNodeArray]
        newParentNodeUrl.pop()
        let newOpenNodes = openNodes.map(n => {
          if (isEqual(n, activeNodeArray)) return newActiveNodeArray
          if (isEqual(n, oldParentNodeUrl)) return newParentNodeUrl
          return n
        })
        setActiveNodeArray(newActiveNodeArray)
        setOpenNodes(newOpenNodes)
        if (['typ'].includes(field)) refetch.ziels()
      }
    },
    [row, activeNodeArray, openNodes, treeName],
  )

  if (loading) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (error) {
    return `Fehler: ${error.message}`
  }
  if (errorLists) {
    return `Fehler: ${errorLists.message}`
  }
  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={row.apId}
          title="Ziel"
          treeName={treeName}
          table="ziel"
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
            key={`${row.id}typ`}
            name="typ"
            label="Zieltyp"
            value={row.typ}
            dataSource={get(dataLists, 'allZielTypWertes.nodes', [])}
            loading={loadingLists}
            saveToDb={saveToDb}
            error={errors.typ}
          />
          <TextField
            key={`${row.id}bezeichnung`}
            name="bezeichnung"
            label="Ziel"
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

export default observer(Ziel)
