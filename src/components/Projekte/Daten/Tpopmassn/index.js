// @flow
import React, { useState, useCallback, useEffect, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from 'react-apollo-hooks'

import Wirtspflanze from './Wirtspflanze'
import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField'
import Select from '../../../shared/Select'
import RadioButton from '../../../shared/RadioButton'
import StringToCopy from '../../../shared/StringToCopy'
import FormTitle from '../../../shared/FormTitle'
import FilterTitle from '../../../shared/FilterTitle'
import DateFieldWithPicker from '../../../shared/DateFieldWithPicker'
import constants from '../../../../modules/constants'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import query from './query'
import queryLists from './queryLists'
import queryTpopmassns from './queryTpopmassns'
import queryAdresses from './queryAdresses'
import queryAeEigenschaftens from './queryAeEigenschaftens'
import updateTpopmassnByIdGql from './updateTpopmassnById'
import mobxStoreContext from '../../../../mobxStoreContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import { simpleTypes as tpopmassnType } from '../../../../mobxStore/NodeFilterTree/tpopmassn'

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
  column-width: ${props =>
    props['data-width'] > 2 * constants.columnWidth
      ? `${constants.columnWidth}px`
      : 'auto'};
`

const Tpopmassn = ({
  dimensions = { width: 380 },
  treeName,
  showFilter = false,
}: {
  onNewRequestWirtspflanze: () => void,
  onBlurWirtspflanze: () => void,
  dimensions: number,
  treeName: string,
  showFilter: Boolean,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const client = useApolloClient()
  const { nodeFilter, nodeFilterSetValue, refetch } = mobxStore

  const [errors, setErrors] = useState({})
  const { activeNodeArray } = mobxStore[treeName]

  let id =
    activeNodeArray.length > 9
      ? activeNodeArray[9]
      : '99999999-9999-9999-9999-999999999999'
  if (showFilter) id = '99999999-9999-9999-9999-999999999999'
  const apId = activeNodeArray[3]
  const { data, loading, error } = useQuery(query, {
    variables: {
      id,
    },
  })

  /**
   * THIS IS A BAD HACK
   * and it will not work once there are many projects
   * because 'connectionFilterRelations: true' cannot be set for postgraphile
   * correct would be to query only what is in this project
   * isNull: false is set so there is never an empty object, otherwise qraphql will fail
   */
  const tpopmassnFilter = { tpopId: { isNull: false } }
  const tpopmassnFilterValues = Object.entries(
    nodeFilter[treeName].tpopmassn,
  ).filter(e => e[1] || e[1] === 0)
  tpopmassnFilterValues.forEach(([key, value]) => {
    const expression = tpopmassnType[key] === 'string' ? 'includes' : 'equalTo'
    tpopmassnFilter[key] = { [expression]: value }
  })
  const { data: dataTpopmassns } = useQuery(queryTpopmassns, {
    variables: {
      showFilter,
      tpopmassnFilter,
      apId,
    },
  })

  const {
    data: dataAdresses,
    loading: loadingAdresses,
    error: errorAdresses,
  } = useQuery(queryAdresses)
  const aeEigenschaftenFilter = { artname: { isNull: false } }
  const {
    data: dataAeEigenschaftens,
    loading: loadingAeEigenschaftens,
    error: errorAeEigenschaftens,
  } = useQuery(queryAeEigenschaftens, {
    variables: {
      filter: aeEigenschaftenFilter,
    },
  })
  const {
    data: dataLists,
    loading: loadingLists,
    error: errorLists,
  } = useQuery(queryLists)

  const aeEigenschaftenWerte = get(
    dataAeEigenschaftens,
    'allAeEigenschaftens.nodes',
    [],
  )

  let tpopmassnTotalCount
  let tpopmassnFilteredCount
  let tpopmassnsOfApTotalCount
  let tpopmassnsOfApFilteredCount
  let row
  if (showFilter) {
    row = nodeFilter[treeName].tpopmassn
    tpopmassnTotalCount = get(dataTpopmassns, 'allTpopmassns.totalCount', '...')
    tpopmassnFilteredCount = get(
      dataTpopmassns,
      'tpopmassnsFiltered.totalCount',
      '...',
    )
    const popsOfAp = get(dataTpopmassns, 'popsOfAp.nodes', [])
    const tpopsOfAp = flatten(popsOfAp.map(p => get(p, 'tpops.nodes', [])))
    tpopmassnsOfApTotalCount = !tpopsOfAp.length
      ? '...'
      : tpopsOfAp
          .map(p => get(p, 'tpopmassns.totalCount'))
          .reduce((acc = 0, val) => acc + val)
    tpopmassnsOfApFilteredCount = !tpopsOfAp.length
      ? '...'
      : tpopsOfAp
          .map(p => get(p, 'tpopmassnsFiltered.totalCount'))
          .reduce((acc = 0, val) => acc + val)
  } else {
    row = get(data, 'tpopmassnById', {})
  }

  useEffect(() => setErrors({}), [row])

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value)
      if (showFilter) {
        nodeFilterSetValue({
          treeName,
          table: 'tpopmassn',
          key: field,
          value,
        })
      } else {
        /**
         * enable passing two values
         * with same update
         */
        const variables = {
          id: row.id,
          [field]: value,
          changedBy: mobxStore.user.name,
        }
        let field2
        if (field === 'jahr') field2 = 'datum'
        if (field === 'datum') field2 = 'jahr'
        let value2
        if (field === 'jahr') value2 = null
        if (field === 'datum') {
          // this broke 13.2.2019
          //value2 = !!value ? +format(new Date(value), 'yyyy') : null
          // value can be null so check if substring method exists
          value2 = value.substring ? +value.substring(0, 4) : value
        }
        if (field2) variables[field2] = value2
        try {
          await client.mutate({
            mutation: updateTpopmassnByIdGql,
            variables,
            optimisticResponse: {
              __typename: 'Mutation',
              updateTpopmassnById: {
                tpopmassn: {
                  id: row.id,
                  typ: field === 'typ' ? value : row.typ,
                  beschreibung:
                    field === 'beschreibung' ? value : row.beschreibung,
                  jahr:
                    field === 'jahr'
                      ? value
                      : field2 === 'jahr'
                      ? value2
                      : row.jahr,
                  datum:
                    field === 'datum'
                      ? value
                      : field2 === 'datum'
                      ? value2
                      : row.datum,
                  bemerkungen:
                    field === 'bemerkungen' ? value : row.bemerkungen,
                  planBezeichnung:
                    field === 'planBezeichnung' ? value : row.planBezeichnung,
                  flaeche: field === 'flaeche' ? value : row.flaeche,
                  markierung: field === 'markierung' ? value : row.markierung,
                  anzTriebe: field === 'anzTriebe' ? value : row.anzTriebe,
                  anzPflanzen:
                    field === 'anzPflanzen' ? value : row.anzPflanzen,
                  anzPflanzstellen:
                    field === 'anzPflanzstellen' ? value : row.anzPflanzstellen,
                  wirtspflanze:
                    field === 'wirtspflanze' ? value : row.wirtspflanze,
                  herkunftPop:
                    field === 'herkunftPop' ? value : row.herkunftPop,
                  sammeldatum:
                    field === 'sammeldatum' ? value : row.sammeldatum,
                  form: field === 'form' ? value : row.form,
                  pflanzanordnung:
                    field === 'pflanzanordnung' ? value : row.pflanzanordnung,
                  tpopId: field === 'tpopId' ? value : row.tpopId,
                  bearbeiter: field === 'bearbeiter' ? value : row.bearbeiter,
                  planVorhanden:
                    field === 'planVorhanden' ? value : row.planVorhanden,
                  __typename: 'Tpopmassn',
                },
                __typename: 'Tpopmassn',
              },
            },
          })
        } catch (error) {
          return setErrors({ [field]: error.message })
        }
        setErrors({})
        if (['typ'].includes(field)) refetch.tpopmassns()
      }
    },
    [row, showFilter],
  )

  const width = isNaN(dimensions.width) ? 380 : dimensions.width

  if (loading) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (error) return `Fehler: ${error.message}`
  if (errorAdresses) return `Fehler: ${errorAdresses.message}`
  if (errorLists) return `Fehler: ${errorLists.message}`
  if (errorAeEigenschaftens) return `Fehler: ${errorAeEigenschaftens.message}`
  return (
    <ErrorBoundary>
      <Container showfilter={showFilter}>
        {showFilter ? (
          <FilterTitle
            title="Massnahmen"
            treeName={treeName}
            table="tpopmassn"
            totalNr={tpopmassnTotalCount}
            filteredNr={tpopmassnFilteredCount}
            totalApNr={tpopmassnsOfApTotalCount}
            filteredApNr={tpopmassnsOfApFilteredCount}
          />
        ) : (
          <FormTitle
            apId={activeNodeArray[3]}
            title="Massnahme"
            treeName={treeName}
          />
        )}
        <FieldsContainer data-width={width}>
          <TextField
            key={`${row.id}jahr`}
            name="jahr"
            label="Jahr"
            value={row.jahr}
            type="number"
            saveToDb={saveToDb}
            error={errors.jahr}
          />
          <DateFieldWithPicker
            key={`${row.id}datum`}
            name="datum"
            label="Datum"
            value={row.datum}
            saveToDb={saveToDb}
            error={errors.datum}
          />
          <RadioButtonGroup
            key={`${row.id}typ`}
            name="typ"
            label="Typ"
            value={row.typ}
            dataSource={get(dataLists, 'allTpopmassnTypWertes.nodes', [])}
            loading={loadingLists}
            saveToDb={saveToDb}
            error={errors.typ}
          />
          <TextField
            key={`${row.id}beschreibung`}
            name="beschreibung"
            label="Massnahme"
            value={row.beschreibung}
            type="text"
            saveToDb={saveToDb}
            error={errors.beschreibung}
          />
          <Select
            key={`${row.id}bearbeiter`}
            name="bearbeiter"
            value={row.bearbeiter}
            field="bearbeiter"
            label="BearbeiterIn"
            options={get(dataAdresses, 'allAdresses.nodes', [])}
            loading={loadingAdresses}
            saveToDb={saveToDb}
            error={errors.bearbeiter}
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
          <RadioButton
            key={`${row.id}planVorhanden`}
            name="planVorhanden"
            label="Plan vorhanden"
            value={row.planVorhanden}
            saveToDb={saveToDb}
            error={errors.planVorhanden}
          />
          <TextField
            key={`${row.id}planBezeichnung`}
            name="planBezeichnung"
            label="Plan Bezeichnung"
            value={row.planBezeichnung}
            type="text"
            saveToDb={saveToDb}
            error={errors.planBezeichnung}
          />
          <TextField
            key={`${row.id}flaeche`}
            name="flaeche"
            label="Fläche (m2)"
            value={row.flaeche}
            type="number"
            saveToDb={saveToDb}
            error={errors.flaeche}
          />
          <TextField
            key={`${row.id}form`}
            name="form"
            label="Form der Ansiedlung"
            value={row.form}
            type="text"
            saveToDb={saveToDb}
            error={errors.form}
          />
          <TextField
            key={`${row.id}pflanzanordnung`}
            name="pflanzanordnung"
            label="Pflanzanordnung"
            value={row.pflanzanordnung}
            type="text"
            saveToDb={saveToDb}
            error={errors.pflanzanordnung}
          />
          <TextField
            key={`${row.id}markierung`}
            name="markierung"
            label="Markierung"
            value={row.markierung}
            type="text"
            saveToDb={saveToDb}
            error={errors.markierung}
          />
          <TextField
            key={`${row.id}anzTriebe`}
            name="anzTriebe"
            label="Anzahl Triebe"
            value={row.anzTriebe}
            type="number"
            saveToDb={saveToDb}
            error={errors.anzTriebe}
          />
          <TextField
            key={`${row.id}anzPflanzen`}
            name="anzPflanzen"
            label="Anzahl Pflanzen"
            value={row.anzPflanzen}
            type="number"
            saveToDb={saveToDb}
            error={errors.anzPflanzen}
          />
          <TextField
            key={`${row.id}anzPflanzstellen`}
            name="anzPflanzstellen"
            label="Anzahl Pflanzstellen"
            value={row.anzPflanzstellen}
            type="number"
            saveToDb={saveToDb}
            error={errors.anzPflanzstellen}
          />
          <Wirtspflanze
            key={`${row.id}wirtspflanze`}
            row={row}
            saveToDb={saveToDb}
            error={errors.wirtspflanze}
          />
          <TextField
            key={`${row.id}herkunftPop`}
            name="herkunftPop"
            label="Herkunftspopulation"
            value={row.herkunftPop}
            type="text"
            saveToDb={saveToDb}
            error={errors.herkunftPop}
          />
          <TextField
            key={`${row.id}sammeldatum`}
            name="sammeldatum"
            label="Sammeldatum"
            value={row.sammeldatum}
            type="text"
            saveToDb={saveToDb}
            error={errors.sammeldatum}
          />
          <StringToCopy text={row.id} label="id" />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Tpopmassn)
