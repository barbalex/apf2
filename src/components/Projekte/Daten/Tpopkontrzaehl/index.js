// @flow
import React, { useState, useCallback, useEffect, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import compose from 'recompose/compose'
import withProps from 'recompose/withProps'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from 'react-apollo-hooks'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField'
import FormTitle from '../../../shared/FormTitle'
import Select from '../../../shared/Select'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import withData from './withData'
import updateTpopkontrzaehlByIdGql from './updateTpopkontrzaehlById'
import withAllTpopkontrzaehlEinheitWertes from './withAllTpopkontrzaehlEinheitWertes'
import mobxStoreContext from '../../../../mobxStoreContext'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  padding: 10px;
  overflow: auto !important;
  height: 100%;
`

const enhance = compose(
  withProps(() => ({
    mobxStore: useContext(mobxStoreContext),
  })),
  withData,
  withAllTpopkontrzaehlEinheitWertes,
  observer,
)

const Tpopkontrzaehl = ({
  treeName,
  dataAllTpopkontrzaehlEinheitWertes,
  data,
  refetchTree,
}: {
  treeName: string,
  dataAllTpopkontrzaehlEinheitWertes: Object,
  data: Object,
  refetchTree: () => void,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const client = useApolloClient()
  const [errors, setErrors] = useState({})

  const row = get(data, 'tpopkontrzaehlById', {})

  useEffect(() => setErrors({}), [row])

  let zaehleinheitWerte = get(
    dataAllTpopkontrzaehlEinheitWertes,
    'allTpopkontrzaehlEinheitWertes.nodes',
    [],
  )
  zaehleinheitWerte = sortBy(zaehleinheitWerte, 'sort').map(el => ({
    value: el.code,
    label: el.text,
  }))
  let methodeWerte = get(data, 'allTpopkontrzaehlMethodeWertes.nodes', [])
  methodeWerte = sortBy(methodeWerte, 'sort')
  methodeWerte = methodeWerte.map(el => ({
    value: el.code,
    label: el.text,
  }))

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      let value = event.target.value
      if ([undefined, ''].includes(value)) value = null
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      try {
        await client.mutate({
          mutation: updateTpopkontrzaehlByIdGql,
          variables: {
            id: row.id,
            [field]: value,
            changedBy: mobxStore.user.name,
          },
          /*optimisticResponse: {
          __typename: 'Mutation',
          updateTpopkontrzaehlById: {
            tpopkontrzaehl: {
              id: row.id,
              anzahl: field === 'anzahl' ? value : row.anzahl,
              einheit: field === 'einheit' ? value : row.einheit,
              methode: field === 'methode' ? value : row.methode,
              tpopkontrzaehlEinheitWerteByEinheit:
                row.tpopkontrzaehlEinheitWerteByEinheit,
              tpopkontrzaehlMethodeWerteByMethode:
                row.tpopkontrzaehlMethodeWerteByMethode,
              tpopkontrByTpopkontrId: row.tpopkontrByTpopkontrId,
              __typename: 'Tpopkontrzaehl',
            },
            __typename: 'Tpopkontrzaehl',
          },
        },*/
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors({})
      if (['einheit', 'methode'].includes(field)) refetchTree('tpopkontrzaehls')
    },
    [row],
  )

  if (data.loading || dataAllTpopkontrzaehlEinheitWertes.loading) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (data.error) return `Fehler: ${data.error.message}`
  if (dataAllTpopkontrzaehlEinheitWertes.error) {
    return `Fehler: ${dataAllTpopkontrzaehlEinheitWertes.error.message}`
  }
  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={get(
            data,
            'tpopkontrzaehlById.tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.apId',
          )}
          title="Zählung"
          treeName={treeName}
          table="tpopkontrzaehl"
        />
        <FieldsContainer>
          <Select
            key={`${row.id}einheit`}
            name="einheit"
            value={row.einheit}
            field="einheit"
            label="Einheit"
            options={zaehleinheitWerte}
            saveToDb={saveToDb}
            error={errors.einheit}
          />
          <TextField
            key={`${row.id}anzahl`}
            name="anzahl"
            label="Anzahl (nur ganze Zahlen)"
            value={row.anzahl}
            type="number"
            saveToDb={saveToDb}
            error={errors.anzahl}
          />
          <RadioButtonGroup
            key={`${row.id}methode`}
            name="methode"
            label="Methode"
            value={row.methode}
            dataSource={methodeWerte}
            saveToDb={saveToDb}
            error={errors.methode}
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(Tpopkontrzaehl)
