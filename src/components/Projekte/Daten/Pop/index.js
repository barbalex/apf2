// @flow
import React, { useContext, useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from 'react-apollo-hooks'

import TextField from '../../../shared/TextField'
import TextFieldWithInfo from '../../../shared/TextFieldWithInfo'
import Status from '../../../shared/Status'
import RadioButton from '../../../shared/RadioButton'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import updatePopByIdGql from './updatePopById'
import query from './data'
import mobxStoreContext from '../../../../mobxStoreContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import filterNodesByNodeFilterArray from '../../TreeContainer/filterNodesByNodeFilterArray'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${props => (props.showfilter ? '#ffd3a7' : 'unset')};
`
const FieldsContainer = styled.div`
  padding: 10px;
  overflow: auto !important;
  height: 100%;
`

const Pop = ({ treeName }: { treeName: string }) => {
  const mobxStore = useContext(mobxStoreContext)
  const client = useApolloClient()
  const { nodeFilter, nodeFilterSetValue, refetch } = mobxStore
  const showFilter = !!nodeFilter[treeName].activeTable
  const { activeNodeArray } = mobxStore[treeName]

  const { data, loading, error } = useQuery(query, {
    variables: {
      id:
        activeNodeArray.length > 5
          ? activeNodeArray[5]
          : '99999999-9999-9999-9999-999999999999',
      showFilter,
    },
  })

  let popTotal = []
  let popFiltered = []
  let row
  if (showFilter) {
    row = nodeFilter[treeName].pop
    // get filter values length
    popTotal = get(data, 'allPops.nodes', [])
    const nodeFilterArray = Object.entries(nodeFilter[treeName].pop).filter(
      ([key, value]) => value || value === 0 || value === false,
    )
    popFiltered = popTotal.filter(node =>
      filterNodesByNodeFilterArray({
        node,
        nodeFilterArray,
        table: 'pop',
      }),
    )
  } else {
    row = get(data, 'popById', {})
  }

  const [errors, setErrors] = useState({})

  useEffect(() => setErrors({}), [row])

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value) || null
      if (showFilter) {
        nodeFilterSetValue({
          treeName,
          table: 'pop',
          key: field,
          value,
        })
      } else {
        try {
          client.mutate({
            mutation: updatePopByIdGql,
            variables: {
              id: row.id,
              [field]: value,
              changedBy: mobxStore.user.name,
            },
            optimisticResponse: {
              __typename: 'Mutation',
              updatePopById: {
                pop: {
                  id: row.id,
                  apId: field === 'apId' ? value : row.apId,
                  nr: field === 'nr' ? value : row.nr,
                  name: field === 'name' ? value : row.name,
                  status: field === 'status' ? value : row.status,
                  statusUnklar:
                    field === 'statusUnklar' ? value : row.statusUnklar,
                  statusUnklarBegruendung:
                    field === 'statusUnklarBegruendung'
                      ? value
                      : row.statusUnklarBegruendung,
                  bekanntSeit:
                    field === 'bekanntSeit' ? value : row.bekanntSeit,
                  x: field === 'x' ? value : row.x,
                  y: field === 'y' ? value : row.y,
                  apByApId: row.apByApId,
                  __typename: 'Pop',
                },
                __typename: 'Pop',
              },
            },
          })
        } catch (error) {
          return setErrors({ [field]: error.message })
        }
        // update pop on map
        if (
          (value && ((field === 'y' && row.x) || (field === 'x' && row.y))) ||
          (!value && (field === 'y' || field === 'x'))
        ) {
          console.log('Daten, Pop, refetch.popForMap:', refetch.popForMap)
          if (refetch.popForMap) refetch.popForMap()
        }
        setErrors({})
      }
    },
    [row, showFilter],
  )

  if (loading) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (error) return `Fehler: ${error.message}`
  return (
    <ErrorBoundary>
      <Container showfilter={showFilter}>
        <FormTitle
          apId={get(data, 'popById.apId')}
          title="Population"
          treeName={treeName}
          table="pop"
          totalNr={popTotal.length}
          filteredNr={popFiltered.length}
        />
        <FieldsContainer>
          <TextField
            key={`${row.id}nr`}
            label="Nr."
            name="nr"
            value={row.nr}
            type="number"
            saveToDb={saveToDb}
            error={errors.nr}
          />
          <TextFieldWithInfo
            key={`${row.id}name`}
            label="Name"
            name="name"
            value={row.name}
            type="text"
            saveToDb={saveToDb}
            error={errors.name}
            popover="Dieses Feld möglichst immer ausfüllen"
          />
          <Status
            key={`${row.id}status`}
            apJahr={get(row, 'apByApId.startJahr')}
            herkunftValue={row.status}
            bekanntSeitValue={row.bekanntSeit}
            saveToDb={saveToDb}
            treeName={treeName}
          />
          <RadioButton
            key={`${row.id}statusUnklar`}
            label="Status unklar"
            name="statusUnklar"
            value={row.statusUnklar}
            saveToDb={saveToDb}
            error={errors.statusUnklar}
          />
          <TextField
            key={`${row.id}statusUnklarBegruendung`}
            label="Begründung"
            name="statusUnklarBegruendung"
            value={row.statusUnklarBegruendung}
            type="text"
            multiLine
            saveToDb={saveToDb}
            error={errors.statusUnklarBegruendung}
          />
          <TextField
            key={`${row.id}x`}
            label="X-Koordinaten"
            name="x"
            value={row.x}
            type="number"
            saveToDb={saveToDb}
            error={errors.x}
          />
          <TextField
            key={`${row.id}y`}
            label="Y-Koordinaten"
            name="y"
            value={row.y}
            type="number"
            saveToDb={saveToDb}
            error={errors.y}
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Pop)
