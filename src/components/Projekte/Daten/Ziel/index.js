// @flow
import React, { useState, useCallback, useEffect, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from 'react-apollo-hooks'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import query from './query'
import updateZielByIdGql from './updateZielById'
import mobxStoreContext from '../../../../mobxStoreContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  padding: 10px;
  height: 100%;
  overflow: auto !important;
`

const Ziel = ({ treeName }: { treeName: string }) => {
  const client = useApolloClient()
  const mobxStore = useContext(mobxStoreContext)
  const { setTreeKey, refetch } = mobxStore
  const { activeNodeArray, openNodes } = mobxStore[treeName]

  const [errors, setErrors] = useState({})

  const { data, loading, error } = useQuery(query, {
    variables: {
      id:
        activeNodeArray.length > 6
          ? activeNodeArray[6]
          : '99999999-9999-9999-9999-999999999999',
    },
  })

  const row = get(data, 'zielById', {})

  useEffect(() => setErrors({}), [row])

  let typWerte = get(data, 'allZielTypWertes.nodes', [])
  typWerte = sortBy(typWerte, 'sort')
  typWerte = typWerte.map(el => ({
    value: el.code,
    label: el.text,
  }))

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      let value = ifIsNumericAsNumber(event.target.value)
      if ([undefined, ''].includes(value)) value = null
      try {
        await client.mutate({
          mutation: updateZielByIdGql,
          variables: {
            id: row.id,
            [field]: value,
            changedBy: mobxStore.user.name,
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
        setTreeKey({
          tree: treeName,
          value: newActiveNodeArray,
          key: 'activeNodeArray',
        })
        setTreeKey({
          tree: treeName,
          value: newOpenNodes,
          key: 'openNodes',
        })
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
    console.log('Ziel:', { error: error })
    return `Fehler: ${error.message}`
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
            value={row.jahr}
            type="number"
            saveToDb={saveToDb}
            error={errors.jahr}
          />
          <RadioButtonGroup
            key={`${row.id}typ`}
            name="typ"
            label="Zieltyp"
            value={row.typ}
            dataSource={typWerte}
            saveToDb={saveToDb}
            error={errors.typ}
          />
          <TextField
            key={`${row.id}bezeichnung`}
            name="bezeichnung"
            label="Ziel"
            value={row.bezeichnung}
            type="text"
            multiLine
            saveToDb={saveToDb}
            error={errors.bezeichnung}
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Ziel)
