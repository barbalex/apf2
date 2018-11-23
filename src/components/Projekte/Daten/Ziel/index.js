// @flow
import React, { useState, useCallback, useEffect, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import sortBy from 'lodash/sortBy'
import compose from 'recompose/compose'
import { withApollo } from 'react-apollo'
import withProps from 'recompose/withProps'
import { observer } from 'mobx-react-lite'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import withData from './withData'
import updateZielByIdGql from './updateZielById'
import mobxStoreContext from '../../../../mobxStoreContext'

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

const enhance = compose(
  withApollo,
  withProps(() => ({
    mobxStore: useContext(mobxStoreContext),
  })),
  withData,
  observer,
)

const Ziel = ({
  treeName,
  data,
  client,
  refetchTree,
}: {
  treeName: string,
  data: Object,
  client: Object,
  refetchTree: () => void,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const { setTreeKey } = mobxStore
  const tree = mobxStore[treeName]

  const [errors, setErrors] = useState({})

  const row = get(data, 'zielById', {})

  useEffect(() => setErrors({}), [row])

  let typWerte = get(data, 'allZielTypWertes.nodes', [])
  typWerte = sortBy(typWerte, 'sort')
  typWerte = typWerte.map(el => ({
    value: el.code,
    label: el.text,
  }))
  const { activeNodeArray, openNodes } = tree

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      let value = event.target.value
      if (value === undefined) value = null
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      try {
        await client.mutate({
          mutation: updateZielByIdGql,
          variables: {
            id: row.id,
            [field]: value,
          },
          /*optimisticResponse: {
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
        },*/
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
          tree: tree.name,
          value: newActiveNodeArray,
          key: 'activeNodeArray',
        })
        setTreeKey({
          tree: tree.name,
          value: newOpenNodes,
          key: 'openNodes',
        })
        if (['typ'].includes(field)) refetchTree('ziels')
      }
    },
    [row, activeNodeArray, openNodes, treeName],
  )

  if (data.loading) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (data.error) {
    console.log('Ziel:', { error: data.error })
    return `Fehler: ${data.error.message}`
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

export default enhance(Ziel)
