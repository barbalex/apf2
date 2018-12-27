// @flow
import React, { useState, useCallback, useEffect, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from 'react-apollo-hooks'

import TextField from '../../../shared/TextField'
import DateFieldWithPicker from '../../../shared/DateFieldWithPicker'
import FormTitle from '../../../shared/FormTitle'
import constants from '../../../../modules/constants'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import query from './data'
import updateIdealbiotopByIdGql from './updateIdealbiotopById'
import mobxStoreContext from '../../../../mobxStoreContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  padding: 10px;
  overflow: auto !important;
  height: 100%;
  column-width: ${props =>
    props['data-width'] > 2 * constants.columnWidth
      ? `${constants.columnWidth}px`
      : 'auto'};
`
const Section = styled.div`
  padding-top: 20px;
  padding-bottom: 7px;
  font-weight: bold;
  break-after: avoid;
  &:after {
    content: ':';
  }
`

const Idealbiotop = ({
  dimensions = { width: 380 },
  treeName,
}: {
  dimensions: Object,
  treeName: string,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const client = useApolloClient()
  const [errors, setErrors] = useState({})
  const { activeNodeArray } = mobxStore[treeName]

  const { data, loading, error } = useQuery(query, {
    suspend: false,
    variables: {
      id:
        activeNodeArray.length > 3
          ? activeNodeArray[3]
          : '99999999-9999-9999-9999-999999999999',
    },
  })

  const row = get(data, 'allIdealbiotops.nodes[0]', {})

  useEffect(() => setErrors({}), [row])

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value) || null
      try {
        await client.mutate({
          mutation: updateIdealbiotopByIdGql,
          variables: {
            id: row.id,
            [field]: value,
            changedBy: mobxStore.user.name,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateIdealbiotopById: {
              idealbiotop: {
                id: row.id,
                apId: field === 'apId' ? value : row.apId,
                erstelldatum:
                  field === 'erstelldatum' ? value : row.erstelldatum,
                hoehenlage: field === 'hoehenlage' ? value : row.hoehenlage,
                region: field === 'region' ? value : row.region,
                exposition: field === 'exposition' ? value : row.exposition,
                besonnung: field === 'besonnung' ? value : row.besonnung,
                hangneigung: field === 'hangneigung' ? value : row.hangneigung,
                bodenTyp: field === 'bodenTyp' ? value : row.bodenTyp,
                bodenKalkgehalt:
                  field === 'bodenKalkgehalt' ? value : row.bodenKalkgehalt,
                bodenDurchlaessigkeit:
                  field === 'bodenDurchlaessigkeit'
                    ? value
                    : row.bodenDurchlaessigkeit,
                bodenHumus: field === 'bodenHumus' ? value : row.bodenHumus,
                bodenNaehrstoffgehalt:
                  field === 'bodenNaehrstoffgehalt'
                    ? value
                    : row.bodenNaehrstoffgehalt,
                wasserhaushalt:
                  field === 'wasserhaushalt' ? value : row.wasserhaushalt,
                konkurrenz: field === 'konkurrenz' ? value : row.konkurrenz,
                moosschicht: field === 'moosschicht' ? value : row.moosschicht,
                krautschicht:
                  field === 'krautschicht' ? value : row.krautschicht,
                strauchschicht:
                  field === 'strauchschicht' ? value : row.strauchschicht,
                baumschicht: field === 'baumschicht' ? value : row.baumschicht,
                bemerkungen: field === 'bemerkungen' ? value : row.bemerkungen,
                __typename: 'Idealbiotop',
              },
              __typename: 'Idealbiotop',
            },
          },
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors({})
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
  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={row.apId}
          title="Idealbiotop"
          treeName={treeName}
          table="idealbiotop"
        />
        <FieldsContainer
          data-width={isNaN(dimensions.width) ? 380 : dimensions.width}
        >
          <DateFieldWithPicker
            key={`${row.id}erstelldatum`}
            name="erstelldatum"
            label="Erstelldatum"
            value={row.erstelldatum}
            saveToDb={saveToDb}
            error={errors.erstelldatum}
          />
          <Section>Lage</Section>
          <TextField
            key={`${row.id}hoehenlage`}
            name="hoehenlage"
            label="Höhe"
            value={row.hoehenlage}
            type="text"
            multiLine
            saveToDb={saveToDb}
            error={errors.hoehenlage}
          />
          <TextField
            key={`${row.id}region`}
            name="region"
            label="Region"
            value={row.region}
            type="text"
            multiLine
            saveToDb={saveToDb}
            error={errors.region}
          />
          <TextField
            key={`${row.id}exposition`}
            name="exposition"
            label="Exposition"
            value={row.exposition}
            type="text"
            multiLine
            saveToDb={saveToDb}
            error={errors.exposition}
          />
          <TextField
            key={`${row.id}besonnung`}
            name="besonnung"
            label="Besonnung"
            value={row.besonnung}
            type="text"
            multiLine
            saveToDb={saveToDb}
            error={errors.besonnung}
          />
          <TextField
            key={`${row.id}hangneigung`}
            name="hangneigung"
            label="Hangneigung"
            value={row.hangneigung}
            type="text"
            multiLine
            saveToDb={saveToDb}
            error={errors.hangneigung}
          />
          <Section>Boden</Section>
          <TextField
            key={`${row.id}bodenTyp`}
            name="bodenTyp"
            label="Typ"
            value={row.bodenTyp}
            type="text"
            multiLine
            saveToDb={saveToDb}
            error={errors.bodenTyp}
          />
          <TextField
            key={`${row.id}bodenKalkgehalt`}
            name="bodenKalkgehalt"
            label="Kalkgehalt"
            value={row.bodenKalkgehalt}
            type="text"
            multiLine
            saveToDb={saveToDb}
            error={errors.bodenKalkgehalt}
          />
          <TextField
            key={`${row.id}bodenDurchlaessigkeit`}
            name="bodenDurchlaessigkeit"
            label="Durchlässigkeit"
            value={row.bodenDurchlaessigkeit}
            type="text"
            multiLine
            saveToDb={saveToDb}
            error={errors.bodenDurchlaessigkeit}
          />
          <TextField
            key={`${row.id}bodenHumus`}
            name="bodenHumus"
            label="Humus"
            value={row.bodenHumus}
            type="text"
            multiLine
            saveToDb={saveToDb}
            error={errors.bodenHumus}
          />
          <TextField
            key={`${row.id}bodenNaehrstoffgehalt`}
            name="bodenNaehrstoffgehalt"
            label="Nährstoffgehalt"
            value={row.bodenNaehrstoffgehalt}
            type="text"
            multiLine
            saveToDb={saveToDb}
            error={errors.bodenNaehrstoffgehalt}
          />
          <TextField
            key={`${row.id}wasserhaushalt`}
            name="wasserhaushalt"
            label="Wasserhaushalt"
            value={row.wasserhaushalt}
            type="text"
            multiLine
            saveToDb={saveToDb}
            error={errors.wasserhaushalt}
          />
          <Section>Vegetation</Section>
          <TextField
            key={`${row.id}konkurrenz`}
            name="konkurrenz"
            label="Konkurrenz"
            value={row.konkurrenz}
            type="text"
            multiLine
            saveToDb={saveToDb}
            error={errors.konkurrenz}
          />
          <TextField
            key={`${row.id}moosschicht`}
            name="moosschicht"
            label="Moosschicht"
            value={row.moosschicht}
            type="text"
            multiLine
            saveToDb={saveToDb}
            error={errors.moosschicht}
          />
          <TextField
            key={`${row.id}Krautschicht`}
            name="krautschicht"
            label="Krautschicht"
            value={row.krautschicht}
            type="text"
            multiLine
            saveToDb={saveToDb}
            error={errors.krautschicht}
          />
          <TextField
            key={`${row.id}Strauchschicht`}
            name="strauchschicht"
            label="Strauchschicht"
            value={row.strauchschicht}
            type="text"
            multiLine
            saveToDb={saveToDb}
            error={errors.strauchschicht}
          />
          <TextField
            key={`${row.id}baumschicht`}
            name="baumschicht"
            label="Baumschicht"
            value={row.baumschicht}
            type="text"
            multiLine
            saveToDb={saveToDb}
            error={errors.baumschicht}
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

export default observer(Idealbiotop)
