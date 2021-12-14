import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'
import flatten from 'lodash/flatten'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'
import { Formik, Form } from 'formik'
import SimpleBar from 'simplebar-react'

import RadioButtonGroupFormik from '../../../shared/RadioButtonGroupFormik'
import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextFieldFormik from '../../../shared/TextFieldFormik'
import TextField from '../../../shared/TextField'
import SelectFormik from '../../../shared/SelectFormik'
import Select from '../../../shared/Select'
import SelectLoadingOptionsTypableFormik from '../../../shared/SelectLoadingOptionsTypableFormik'
import SelectLoadingOptionsTypable from '../../../shared/SelectLoadingOptionsTypable'
import Checkbox2StatesFormik from '../../../shared/Checkbox2StatesFormik'
import Checkbox2States from '../../../shared/Checkbox2States'
import DateFieldFormik from '../../../shared/DateFormik'
import DateField from '../../../shared/Date'

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
const FormContainer = styled.div`
  padding: 10px;
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
  const { data: dataTpopmassns, error } = useQuery(queryTpopmassns, {
    variables: {
      tpopmassnFilter,
      allTpopmassnFilter,
      apId,
      apIdExists: !!apId,
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
  const tpopmassnTotalCount = dataTpopmassns?.allTpopmassns?.totalCount ?? '...'
  const tpopmassnFilteredCount =
    dataTpopmassns?.tpopmassnsFiltered?.totalCount ?? '...'
  const popsOfAp = dataTpopmassns?.popsOfAp?.nodes ?? []
  const tpopsOfAp = flatten(popsOfAp.map((p) => p?.tpops?.nodes ?? []))
  const tpopmassnsOfApTotalCount = !tpopsOfAp.length
    ? '...'
    : tpopsOfAp
        .map((p) => p?.tpopmassns?.totalCount)
        .reduce((acc = 0, val) => acc + val)
  const tpopmassnsOfApFilteredCount = !tpopsOfAp.length
    ? '...'
    : tpopsOfAp
        .map((p) => p?.tpopmassnsFiltered?.totalCount)
        .reduce((acc = 0, val) => acc + val)

  const { data: dataIsMassnTypAnpflanzung } = useQuery(
    queryIsMassnTypAnpflanzung,
    {
      variables: { typ: row.typ || 999999999 },
    },
  )
  const isAnpflanzung =
    dataIsMassnTypAnpflanzung?.allTpopmassnTypWertes?.nodes?.[0]?.anpflanzung

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

  const onSubmit = useCallback(
    async (values) => {
      const changedField = objectsFindChangedKey(values, row)
      // BEWARE: react-select fires twice when a value is cleared
      // second event leads to an error as the values passed are same as before
      // so prevent this by returning if no changed field exists
      // https://github.com/JedWatson/react-select/issues/4101
      if (!changedField) return

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

  const columnWidth =
    width > 2 * constants.columnWidth ? constants.columnWidth : undefined

  const errors = [
    ...(error ? [error] : []),
    ...(errorLists ? [errorLists] : []),
    ...(errorAdresses ? [errorAdresses] : []),
  ]
  if (errors.length) return <Error errors={errors} />

  return (
    <Container>
      <ErrorBoundary>
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
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
          >
            <ColumnContainer data-column-width={columnWidth}>
              <Formik
                key={row}
                initialValues={row}
                onSubmit={onSubmit}
                enableReinitialize
              >
                {({ handleSubmit, dirty }) => (
                  <Form onBlur={() => dirty && handleSubmit()}>
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
                      dataSource={dataLists?.allTpopmassnTypWertes?.nodes ?? []}
                      loading={loadingLists}
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
                      options={dataAdresses?.allAdresses?.nodes ?? []}
                      loading={loadingAdresses}
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
                          options={
                            dataLists?.allTpopkontrzaehlEinheitWertes?.nodes ??
                            []
                          }
                          loading={loadingLists}
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
                      handleSubmit={handleSubmit}
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
                  </Form>
                )}
              </Formik>
            </ColumnContainer>
          </SimpleBar>
        </FormScrollContainer>
      </ErrorBoundary>
    </Container>
  )
}

export default observer(TpopmassnFilter)
