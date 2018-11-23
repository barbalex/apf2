// @flow
import React, { useState, useCallback, useEffect, useContext } from 'react'
import sortBy from 'lodash/sortBy'
import styled from 'styled-components'
import get from 'lodash/get'
import compose from 'recompose/compose'
import withProps from 'recompose/withProps'
import { withApollo } from 'react-apollo'
import { observer } from 'mobx-react-lite'

import TextField from '../../../shared/TextField'
import Select from '../../../shared/Select'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import updateAssozartByIdGql from './updateAssozartById'
import withAeEigenschaftens from './withAeEigenschaftens'
import withData from './withData'
import mobxStoreContext from '../../../../mobxStoreContext'

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
  withApollo,
  withProps(() => ({
    mobxStore: useContext(mobxStoreContext),
  })),
  withData,
  withAeEigenschaftens,
  observer,
)

const Assozart = ({
  treeName,
  dataAeEigenschaftens,
  data,
  client,
  refetchTree,
}: {
  treeName: string,
  dataAeEigenschaftens: Object,
  data: Object,
  client: Object,
  refetchTree: () => void,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const { activeNodeArray } = mobxStore[treeName]
  const id =
    activeNodeArray.length > 5
      ? activeNodeArray[5]
      : '99999999-9999-9999-9999-999999999999'

  const [errors, setErrors] = useState({})

  useEffect(() => setErrors({}), [row])

  const row = get(data, 'assozartById', {})
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
      const value = event.target.value || null
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      try {
        await client.mutate({
          mutation: updateAssozartByIdGql,
          variables: {
            id: row.id,
            [field]: value,
          },
          /*optimisticResponse: {
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
        },*/
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors({})
      if (['aeId'].includes(field)) refetchTree('assozarts')
    },
    [row],
  )

  if (data.loading || dataAeEigenschaftens.loading) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (data.error) return `Fehler: ${data.error.message}`

  return (
    <ErrorBoundary>
      <Container>
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
