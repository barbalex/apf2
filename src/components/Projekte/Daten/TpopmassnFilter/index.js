import React, { useCallback, useContext, useState } from 'react'
import styled from 'styled-components'
import flatten from 'lodash/flatten'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'
import { Formik, Form } from 'formik'
import { withResizeDetector } from 'react-resize-detector'
import SimpleBar from 'simplebar-react'

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
import Error from '../../../shared/Error'

const Container = styled.div`
  height: ${(props) => `calc(100% - ${props['data-filter-title-height']}px)`};
  display: flex;
  flex-direction: column;
  background-color: #ffd3a7;
`
const FormScrollContainer = styled.div`
  height: ${(props) => `calc(100% - ${props['data-form-title-height']}px)`};
`
const ColumnContainer = styled.div`
  padding: 10px;
  ${(props) =>
    props['data-column-width'] &&
    `column-width: ${props['data-column-width']}px;`}
`

const TpopmassnFilter = ({
  treeName,
  width = 1000,
  filterTitleHeight = 81,
}) => {
  const store = useContext(storeContext)
  const { dataFilterSetValue } = store

  const { activeNodeArray, dataFilter } = store[treeName]

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

  const onSubmit = useCallback(
    async (values, { setErrors }) => {
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

  const [formTitleHeight, setFormTitleHeight] = useState(0)

  const columnWidth =
    width > 2 * constants.columnWidth ? constants.columnWidth : undefined

  const errors = [
    ...(error ? [error] : []),
    ...(errorLists ? [errorLists] : []),
    ...(errorAdresses ? [errorAdresses] : []),
  ]
  if (errors.length) return <Error errors={errors} />

  return (
    <Container data-filter-title-height={filterTitleHeight}>
      <ErrorBoundary>
        <FilterTitle
          title="Massnahmen"
          treeName={treeName}
          table="tpopmassn"
          totalNr={tpopmassnTotalCount}
          filteredNr={tpopmassnFilteredCount}
          totalApNr={tpopmassnsOfApTotalCount}
          filteredApNr={tpopmassnsOfApFilteredCount}
          setFormTitleHeight={setFormTitleHeight}
        />
        <FormScrollContainer data-form-title-height={formTitleHeight}>
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
                      handleSubmit={handleSubmit}
                    />
                    <DateField
                      name="datum"
                      label="Datum"
                      handleSubmit={handleSubmit}
                    />
                    <RadioButtonGroup
                      name="typ"
                      label="Typ"
                      dataSource={dataLists?.allTpopmassnTypWertes?.nodes ?? []}
                      loading={loadingLists}
                      handleSubmit={handleSubmit}
                    />
                    <TextField
                      name="beschreibung"
                      label="Massnahme"
                      type="text"
                      handleSubmit={handleSubmit}
                    />
                    <Select
                      name="bearbeiter"
                      value={row.bearbeiter}
                      label="BearbeiterIn"
                      options={dataAdresses?.allAdresses?.nodes ?? []}
                      loading={loadingAdresses}
                      handleSubmit={handleSubmit}
                    />
                    <TextField
                      name="bemerkungen"
                      label="Bemerkungen"
                      type="text"
                      multiLine
                      handleSubmit={handleSubmit}
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
                      handleSubmit={handleSubmit}
                    />
                    <TextField
                      name="flaeche"
                      label="Fläche (m2)"
                      type="number"
                      handleSubmit={handleSubmit}
                    />
                    <TextField
                      name="form"
                      label="Form der Ansiedlung"
                      type="text"
                      handleSubmit={handleSubmit}
                    />
                    <TextField
                      name="pflanzanordnung"
                      label="Pflanzanordnung"
                      type="text"
                      handleSubmit={handleSubmit}
                    />
                    <TextField
                      name="markierung"
                      label="Markierung"
                      type="text"
                      handleSubmit={handleSubmit}
                    />
                    <TextField
                      name="anzTriebe"
                      label="Anzahl Triebe"
                      type="number"
                      handleSubmit={handleSubmit}
                    />
                    <TextField
                      name="anzPflanzen"
                      label="Anzahl Pflanzen"
                      type="number"
                      handleSubmit={handleSubmit}
                    />
                    <TextField
                      name="anzPflanzstellen"
                      label="Anzahl Pflanzstellen"
                      type="number"
                      handleSubmit={handleSubmit}
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
                          handleSubmit={handleSubmit}
                        />
                        <TextField
                          name="zieleinheitAnzahl"
                          label="Ziel-Einheit: Anzahl (nur ganze Zahlen)"
                          type="number"
                          handleSubmit={handleSubmit}
                        />
                      </>
                    )}
                    <SelectLoadingOptionsTypable
                      key={`any-filter${!!row.wirtspflanze}`}
                      name="wirtspflanze"
                      field="wirtspflanze"
                      label="Wirtspflanze"
                      handleSubmit={handleSubmit}
                      query={queryAeTaxonomies}
                      queryNodesName="allAeTaxonomies"
                    />
                    <TextField
                      name="herkunftPop"
                      label="Herkunftspopulation"
                      type="text"
                      handleSubmit={handleSubmit}
                    />
                    <TextField
                      name="sammeldatum"
                      label="Sammeldatum"
                      type="text"
                      handleSubmit={handleSubmit}
                    />
                    <TextField
                      name="vonAnzahlIndividuen"
                      label="Anzahl besammelte Individuen der Herkunftspopulation"
                      type="number"
                      handleSubmit={handleSubmit}
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

export default withResizeDetector(observer(TpopmassnFilter))
