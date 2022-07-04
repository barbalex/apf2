import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'
import flatten from 'lodash/flatten'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'
import SimpleBar from 'simplebar-react'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField'
import Select from '../../../shared/Select'
import SelectLoadingOptionsTypable from '../../../shared/SelectLoadingOptionsTypable'
import Checkbox2States from '../../../shared/Checkbox2States'
import DateField from '../../../shared/Date'

import FilterTitle from '../../../shared/FilterTitle'
import constants from '../../../../modules/constants'
import queryTpopmassns from './queryTpopmassns'
import queryAeTaxonomies from './queryAeTaxonomies'
import storeContext from '../../../../storeContext'
import { simpleTypes as tpopmassnType } from '../../../../store/Tree/DataFilter/tpopmassn'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #ffd3a7;
`
const FormScrollContainer = styled.div`
  overflow-y: auto;
`
const ColumnContainer = styled.div`
  padding: 10px;
  ${(props) =>
    props['data-column-width'] &&
    `column-width: ${props['data-column-width']}px;`}
`

const TpopmassnFilter = ({ treeName }) => {
  const store = useContext(storeContext)
  const { dataFilterSetValue } = store

  const { activeNodeArray, dataFilter, filterWidth: width } = store[treeName]

  const apId = activeNodeArray[3]

  const allTpopmassnFilter = {
    tpopByTpopId: {
      popByPopId: { apByApId: { projId: { equalTo: activeNodeArray[1] } } },
    },
  }
  const tpopmassnFilter = {
    tpopId: { isNull: false },
    tpopByTpopId: {
      popByPopId: { apByApId: { projId: { equalTo: activeNodeArray[1] } } },
    },
  }
  const tpopmassnFilterValues = Object.entries(dataFilter.tpopmassn).filter(
    (e) => e[1] || e[1] === 0,
  )
  tpopmassnFilterValues.forEach(([key, value]) => {
    const expression = tpopmassnType[key] === 'string' ? 'includes' : 'equalTo'
    tpopmassnFilter[key] = { [expression]: value }
  })
  const { data, loading, error } = useQuery(queryTpopmassns, {
    variables: {
      tpopmassnFilter,
      allTpopmassnFilter,
      apId,
      apIdExists: !!apId,
      apIdNotExists: !apId,
    },
  })

  const row = dataFilter.tpopmassn
  let totalNr
  let filteredNr
  if (apId) {
    const popsOfAp = data?.popsOfAp?.nodes ?? []
    const tpopsOfAp = flatten(popsOfAp.map((p) => p?.tpops?.nodes ?? []))
    totalNr = !tpopsOfAp.length
      ? '...'
      : tpopsOfAp
          .map((p) => p?.tpopmassns?.totalCount)
          .reduce((acc = 0, val) => acc + val)
    filteredNr = !tpopsOfAp.length
      ? '...'
      : tpopsOfAp
          .map((p) => p?.tpopmassnsFiltered?.totalCount)
          .reduce((acc = 0, val) => acc + val)
  } else {
    totalNr = data?.allTpopmassns?.totalCount ?? '...'
    filteredNr = data?.tpopmassnsFiltered?.totalCount ?? '...'
  }

  const isAnpflanzung = data?.allTpopmassnTypWertes?.nodes?.find(
    (n) => n.value === row.typ,
  )?.anpflanzung

  const saveToDb = useCallback(
    async (event) => {
      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value)

      dataFilterSetValue({
        treeName,
        table: 'tpopmassn',
        key: field,
        value,
      })
    },
    [dataFilterSetValue, treeName],
  )

  const columnWidth =
    width > 2 * constants.columnWidth ? constants.columnWidth : undefined

  if (error) return <Error error={error} />

  return (
    <Container>
      <ErrorBoundary>
        <FilterTitle
          title="Massnahmen"
          treeName={treeName}
          table="tpopmassn"
          totalNr={totalNr}
          filteredNr={filteredNr}
        />
        <FormScrollContainer>
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
          >
            <ColumnContainer data-column-width={columnWidth}>
              <TextField
                name="jahr"
                label="Jahr"
                type="number"
                value={row.jahr}
                saveToDb={saveToDb}
              />
              <DateField
                name="datum"
                label="Datum"
                value={row.datum}
                saveToDb={saveToDb}
              />
              <RadioButtonGroup
                name="typ"
                label="Typ"
                dataSource={data?.allTpopmassnTypWertes?.nodes ?? []}
                loading={loading}
                value={row.typ}
                saveToDb={saveToDb}
              />
              <TextField
                name="beschreibung"
                label="Massnahme"
                type="text"
                value={row.beschreibung}
                saveToDb={saveToDb}
              />
              <Select
                name="bearbeiter"
                label="BearbeiterIn"
                options={data?.allAdresses?.nodes ?? []}
                loading={loading}
                value={row.bearbeiter}
                saveToDb={saveToDb}
              />
              <TextField
                name="bemerkungen"
                label="Bemerkungen"
                type="text"
                multiLine
                value={row.bemerkungen}
                saveToDb={saveToDb}
              />
              <Checkbox2States
                name="planVorhanden"
                label="Plan vorhanden"
                value={row.planVorhanden}
                saveToDb={saveToDb}
              />
              <TextField
                name="planBezeichnung"
                label="Plan Bezeichnung"
                type="text"
                value={row.planBezeichnung}
                saveToDb={saveToDb}
              />
              <TextField
                name="flaeche"
                label="Fläche (m2)"
                type="number"
                value={row.flaeche}
                saveToDb={saveToDb}
              />
              <TextField
                name="form"
                label="Form der Ansiedlung"
                type="text"
                value={row.form}
                saveToDb={saveToDb}
              />
              <TextField
                name="pflanzanordnung"
                label="Pflanzanordnung"
                type="text"
                value={row.pflanzanordnung}
                saveToDb={saveToDb}
              />
              <TextField
                name="markierung"
                label="Markierung"
                type="text"
                value={row.markierung}
                saveToDb={saveToDb}
              />
              <TextField
                name="anzTriebe"
                label="Anzahl Triebe"
                type="number"
                value={row.anzTriebe}
                saveToDb={saveToDb}
              />
              <TextField
                name="anzPflanzen"
                label="Anzahl Pflanzen"
                type="number"
                value={row.anzPflanzen}
                saveToDb={saveToDb}
              />
              <TextField
                name="anzPflanzstellen"
                label="Anzahl Pflanzstellen"
                type="number"
                value={row.anzPflanzstellen}
                saveToDb={saveToDb}
              />
              {isAnpflanzung && (
                <>
                  <Select
                    name="zieleinheitEinheit"
                    label="Ziel-Einheit: Einheit (wird automatisch gesetzt)"
                    options={data?.allTpopkontrzaehlEinheitWertes?.nodes ?? []}
                    loading={loading}
                    value={row.zieleinheitEinheit}
                    saveToDb={saveToDb}
                  />
                  <TextField
                    name="zieleinheitAnzahl"
                    label="Ziel-Einheit: Anzahl (nur ganze Zahlen)"
                    type="number"
                    value={row.zieleinheitAnzahl}
                    saveToDb={saveToDb}
                  />
                </>
              )}
              <SelectLoadingOptionsTypable
                field="wirtspflanze"
                label="Wirtspflanze"
                query={queryAeTaxonomies}
                queryNodesName="allAeTaxonomies"
                value={row?.wirtspflanze}
                saveToDb={saveToDb}
                row={row}
              />
              <TextField
                name="herkunftPop"
                label="Herkunftspopulation"
                type="text"
                value={row.herkunftPop}
                saveToDb={saveToDb}
              />
              <TextField
                name="sammeldatum"
                label="Sammeldatum"
                type="text"
                value={row.sammeldatum}
                saveToDb={saveToDb}
              />
              <TextField
                name="vonAnzahlIndividuen"
                label="Anzahl besammelte Individuen der Herkunftspopulation"
                type="number"
                value={row.vonAnzahlIndividuen}
                saveToDb={saveToDb}
              />
            </ColumnContainer>
          </SimpleBar>
        </FormScrollContainer>
      </ErrorBoundary>
    </Container>
  )
}

export default observer(TpopmassnFilter)
