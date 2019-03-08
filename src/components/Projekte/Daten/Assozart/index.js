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
import updateAssozartByIdGql from './updateAssozartById'
import withAeEigenschaftens from './withAeEigenschaftens'
import query from './data'
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
  withAeEigenschaftens,
  observer,
)

const Assozart = ({
  treeName,
  dataAeEigenschaftens,
}: {
  treeName: string,
  dataAeEigenschaftens: Object,
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

  const row = get(data, 'assozartById', {})

  useEffect(() => setErrors({}), [row])

  const assozartenOfAp = get(row, 'apByApId.assozartsByApId.nodes', []).map(
    o => o.aeId,
  )
  const artenNotToShow = assozartenOfAp.filter(a => a !== row.aeId)
  let artWerte = get(dataAeEigenschaftens, 'allAeEigenschaftens.nodes', [])
  // filter ap arten but the active one
  artWerte = artWerte.filter(o => !artenNotToShow.includes(o.id))
  artWerte = sortBy(artWerte, 'artname')
  artWerte = artWerte.map(el => ({
    value: el.id,
    label: el.artname,
  }))

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value) || null
      try {
        await client.mutate({
          mutation: updateAssozartByIdGql,
          variables: {
            id: row.id,
            [field]: value,
            changedBy: mobxStore.user.name,
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
      if (['aeId'].includes(field)) refetch.assozarts()
    },
    [row],
  )

  if (loading || dataAeEigenschaftens.loading) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (error) return `Fehler: ${error.message}`

  return (
    <ErrorBoundary>
      <Container data-id="assozart">
        <FormTitle
          apId={row.apId}
          title="assoziierte Art"
          treeName={treeName}
          table="assozart"
        />
        <FieldsContainer>
          <Select
            key={`${row.id}aeId`}
            name="aeId"
            value={row.aeId}
            field="aeId"
            label="Art"
            options={artWerte}
            saveToDb={saveToDb}
            error={errors.aeId}
          />
          <TextField
            key={`${row.id}bemerkungen`}
            name="bemerkungen"
            label="Bemerkungen zur Assoziation"
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

export default enhance(Assozart)
