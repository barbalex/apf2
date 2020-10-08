import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'
import { Formik, Form, Field } from 'formik'

import RadioButtonGroup from '../../../shared/RadioButtonGroupFormik'
import TextField from '../../../shared/TextFieldFormik'
import Select from '../../../shared/SelectFormik'
import SelectLoadingOptionsTypable from '../../../shared/SelectLoadingOptionsTypableFormik'
import Checkbox2States from '../../../shared/Checkbox2StatesFormik'
import DateField from '../../../shared/DateFormik'
import FilterTitle from '../../../shared/FilterTitle'
import constants from '../../../../modules/constants'
import queryLists from './queryLists'
import queryTpopmassns from './queryTpopmassns'
import queryAdresses from './queryAdresses'
import queryAeTaxonomies from './queryAeTaxonomies'
import queryIsMassnTypAnpflanzung from './queryIsMassnTypAnpflanzung'
import storeContext from '../../../../storeContext'
import { simpleTypes as tpopmassnType } from '../../../../store/Tree/DataFilter/tpopmassn'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import ErrorBoundary from '../../../shared/ErrorBoundary'

const Container = styled.div`
  height: calc(100vh - 145px);
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #ffd3a7;
`
const FormScrollContainer = styled.div`
  height: calc(100% - 43px - 48px);
  padding: 10px;
  overflow-y: auto !important;
`
const ColumnContainer = styled.div`
  ${(props) =>
    props['data-width'] > 2 * constants.columnWidth &&
    `column-width: ${constants.columnWidth}px`}
`

const Tpopmassn = ({ treeName }) => {
  const store = useContext(storeContext)
  const { dataFilterSetValue } = store

  const { activeNodeArray, filterWidth, dataFilter } = store[treeName]

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
  const { data: dataTpopmassns, error } = useQuery(queryTpopmassns, {
    variables: {
      showFilter: true,
      tpopmassnFilter,
      allTpopmassnFilter,
      apId,
    },
  })

  const {
    data: dataAdresses,
    loading: loadingAdresses,
    error: errorAdresses,
  } = useQuery(queryAdresses)
  const {
    data: dataLists,
    loading: loadingLists,
    error: errorLists,
  } = useQuery(queryLists)

  const row = dataFilter.tpopmassn
  const tpopmassnTotalCount = get(
    dataTpopmassns,
    'allTpopmassns.totalCount',
    '...',
  )
  const tpopmassnFilteredCount = get(
    dataTpopmassns,
    'tpopmassnsFiltered.totalCount',
    '...',
  )
  const popsOfAp = get(dataTpopmassns, 'popsOfAp.nodes', [])
  const tpopsOfAp = flatten(popsOfAp.map((p) => get(p, 'tpops.nodes', [])))
  const tpopmassnsOfApTotalCount = !tpopsOfAp.length
    ? '...'
    : tpopsOfAp
        .map((p) => get(p, 'tpopmassns.totalCount'))
        .reduce((acc = 0, val) => acc + val)
  const tpopmassnsOfApFilteredCount = !tpopsOfAp.length
    ? '...'
    : tpopsOfAp
        .map((p) => get(p, 'tpopmassnsFiltered.totalCount'))
        .reduce((acc = 0, val) => acc + val)

  const { data: dataIsMassnTypAnpflanzung } = useQuery(
    queryIsMassnTypAnpflanzung,
    {
      variables: { typ: row.typ || 999999999 },
    },
  )
  const isAnpflanzung = get(
    dataIsMassnTypAnpflanzung,
    'allTpopmassnTypWertes.nodes[0].anpflanzung',
  )

  const onSubmit = useCallback(
    async (values, { setErrors }) => {
      const changedField = objectsFindChangedKey(values, row)
      const value = values[changedField]
      dataFilterSetValue({
        treeName,
        table: 'tpopmassn',
        key: changedField,
        value,
      })
    },
    [dataFilterSetValue, row, treeName],
  )

  if (error) return `Fehler beim Laden der Daten: ${error.message}`
  if (errorAdresses) return `Fehler: ${errorAdresses.message}`
  if (errorLists) return `Fehler: ${errorLists.message}`
  return (
    <ErrorBoundary>
      <Container>
        <FilterTitle
          title="Massnahmen"
          treeName={treeName}
          table="tpopmassn"
          totalNr={tpopmassnTotalCount}
          filteredNr={tpopmassnFilteredCount}
          totalApNr={tpopmassnsOfApTotalCount}
          filteredApNr={tpopmassnsOfApFilteredCount}
        />
        <FormScrollContainer>
          <ColumnContainer data-width={filterWidth}>
            <Formik
              key={row}
              initialValues={row}
              onSubmit={onSubmit}
              enableReinitialize
            >
              {({ handleSubmit, dirty }) => (
                <Form onBlur={() => dirty && handleSubmit()}>
                  <TextField name="jahr" label="Jahr" type="number" />
                  <DateField
                    name="datum"
                    label="Datum"
                    handleSubmit={handleSubmit}
                  />
                  <RadioButtonGroup
                    name="typ"
                    label="Typ"
                    dataSource={get(
                      dataLists,
                      'allTpopmassnTypWertes.nodes',
                      [],
                    )}
                    loading={loadingLists}
                    handleSubmit={handleSubmit}
                  />
                  <TextField
                    name="beschreibung"
                    label="Massnahme"
                    type="text"
                  />
                  <Field
                    name="bearbeiter"
                    value={row.bearbeiter}
                    label="BearbeiterIn"
                    component={Select}
                    options={get(dataAdresses, 'allAdresses.nodes', [])}
                    loading={loadingAdresses}
                  />
                  <TextField
                    name="bemerkungen"
                    label="Bemerkungen"
                    type="text"
                    multiLine
                  />
                  <Checkbox2States
                    name="planVorhanden"
                    label="Plan vorhanden"
                    handleSubmit={handleSubmit}
                  />
                  <TextField
                    name="planBezeichnung"
                    label="Plan Bezeichnung"
                    type="text"
                  />
                  <TextField name="flaeche" label="Fläche (m2)" type="number" />
                  <TextField
                    name="form"
                    label="Form der Ansiedlung"
                    type="text"
                  />
                  <TextField
                    name="pflanzanordnung"
                    label="Pflanzanordnung"
                    type="text"
                  />
                  <TextField name="markierung" label="Markierung" type="text" />
                  <TextField
                    name="anzTriebe"
                    label="Anzahl Triebe"
                    type="number"
                  />
                  <TextField
                    name="anzPflanzen"
                    label="Anzahl Pflanzen"
                    type="number"
                  />
                  <TextField
                    name="anzPflanzstellen"
                    label="Anzahl Pflanzstellen"
                    type="number"
                  />
                  {isAnpflanzung && (
                    <>
                      <Field
                        name="zieleinheitEinheit"
                        label="Ziel-Einheit: Einheit (wird automatisch gesetzt)"
                        options={get(
                          dataLists,
                          'allTpopkontrzaehlEinheitWertes.nodes',
                          [],
                        )}
                        loading={loadingLists}
                        component={Select}
                      />
                      <TextField
                        name="zieleinheitAnzahl"
                        label="Ziel-Einheit: Anzahl (nur ganze Zahlen)"
                        type="number"
                      />
                    </>
                  )}
                  <Field
                    field="wirtspflanze"
                    label="Wirtspflanze"
                    component={SelectLoadingOptionsTypable}
                    query={queryAeTaxonomies}
                    queryNodesName="allAeTaxonomies"
                  />
                  <TextField
                    name="herkunftPop"
                    label="Herkunftspopulation"
                    type="text"
                  />
                  <TextField
                    name="sammeldatum"
                    label="Sammeldatum"
                    type="text"
                  />
                  <TextField
                    name="vonAnzahlIndividuen"
                    label="Anzahl besammelte Individuen der Herkunftspopulation"
                    type="number"
                  />
                </Form>
              )}
            </Formik>
          </ColumnContainer>
        </FormScrollContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Tpopmassn)
