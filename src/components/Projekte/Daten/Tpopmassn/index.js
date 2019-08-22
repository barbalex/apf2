import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/react-hooks'
import { Formik, Form, Field } from 'formik'
import ErrorBoundary from 'react-error-boundary'

import RadioButtonGroup from '../../../shared/RadioButtonGroupFormik'
import TextField from '../../../shared/TextFieldFormik'
import Select from '../../../shared/SelectFormik'
import SelectLoadingOptionsTypable from '../../../shared/SelectLoadingOptionsTypableFormik'
import RadioButton from '../../../shared/RadioButtonFormik'
import DateFieldWithPicker from '../../../shared/DateFieldWithPickerFormik'
import StringToCopy from '../../../shared/StringToCopy'
import FormTitle from '../../../shared/FormTitle'
import FilterTitle from '../../../shared/FilterTitle'
import constants from '../../../../modules/constants'
import query from './query'
import queryLists from './queryLists'
import queryTpopmassns from './queryTpopmassns'
import queryAdresses from './queryAdresses'
import queryAeEigenschaftens from './queryAeEigenschaftens'
import updateTpopmassnByIdGql from './updateTpopmassnById'
import storeContext from '../../../../storeContext'
import { simpleTypes as tpopmassnType } from '../../../../store/NodeFilterTree/tpopmassn'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'

const Container = styled.div`
  height: ${props =>
    props.showfilter ? 'calc(100vh - 145px)' : 'calc(100vh - 64px)'};
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

const Tpopmassn = ({ treeName, showFilter = false }) => {
  const store = useContext(storeContext)
  const client = useApolloClient()
  const { nodeFilter, nodeFilterSetValue, refetch } = store

  const { activeNodeArray, datenWidth, filterWidth } = store[treeName]

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

  const onSubmit = useCallback(
    async (values, { setErrors }) => {
      const changedField = objectsFindChangedKey(values, row)
      const value = values[changedField]
      if (showFilter) {
        nodeFilterSetValue({
          treeName,
          table: 'tpopmassn',
          key: changedField,
          value,
        })
      } else {
        /**
         * enable passing two values
         * with same update
         */
        const variables = {
          ...objectsEmptyValuesToNull(values),
          changedBy: store.user.name,
        }
        if (changedField === 'jahr') {
          variables.datum = null
        }
        if (changedField === 'datum') {
          variables.jahr =
            value && value.substring ? +value.substring(0, 4) : value
        }
        try {
          await client.mutate({
            mutation: updateTpopmassnByIdGql,
            variables,
            optimisticResponse: {
              __typename: 'Mutation',
              updateTpopmassnById: {
                tpopmassn: {
                  ...variables,
                  __typename: 'Tpopmassn',
                },
                __typename: 'Tpopmassn',
              },
            },
          })
        } catch (error) {
          return setErrors({ [changedField]: error.message })
        }
        setErrors({})
        if ([('typ', 'jahr', 'datum')].includes(changedField)) {
          refetch.tpopmassns()
        }
      }
    },
    [
      client,
      nodeFilterSetValue,
      refetch,
      row,
      showFilter,
      store.user.name,
      treeName,
    ],
  )

  //console.log('Tpopmassn rendering')

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
        <FieldsContainer data-width={showFilter ? filterWidth : datenWidth}>
          <Formik
            key={showFilter ? JSON.stringify(row) : row.id}
            initialValues={row}
            onSubmit={onSubmit}
            enableReinitialize
          >
            {({ handleSubmit, dirty }) => (
              <Form onBlur={() => dirty && handleSubmit()}>
                <Field
                  name="jahr"
                  label="Jahr"
                  type="number"
                  component={TextField}
                />
                <Field
                  name="datum"
                  label="Datum"
                  component={DateFieldWithPicker}
                />
                <Field
                  name="typ"
                  label="Typ"
                  component={RadioButtonGroup}
                  dataSource={get(dataLists, 'allTpopmassnTypWertes.nodes', [])}
                  loading={loadingLists}
                />
                <Field
                  name="beschreibung"
                  label="Massnahme"
                  type="text"
                  component={TextField}
                />
                <Field
                  name="bearbeiter"
                  value={row.bearbeiter}
                  label="BearbeiterIn"
                  component={Select}
                  options={get(dataAdresses, 'allAdresses.nodes', [])}
                  loading={loadingAdresses}
                />
                <Field
                  name="bemerkungen"
                  label="Bemerkungen"
                  type="text"
                  component={TextField}
                  multiLine
                />
                <Field
                  name="planVorhanden"
                  label="Plan vorhanden"
                  component={RadioButton}
                />
                <Field
                  name="planBezeichnung"
                  label="Plan Bezeichnung"
                  type="text"
                  component={TextField}
                />
                <Field
                  name="flaeche"
                  label="Fläche (m2)"
                  type="number"
                  component={TextField}
                />
                <Field
                  name="form"
                  label="Form der Ansiedlung"
                  type="text"
                  component={TextField}
                />
                <Field
                  name="pflanzanordnung"
                  label="Pflanzanordnung"
                  type="text"
                  component={TextField}
                />
                <Field
                  name="markierung"
                  label="Markierung"
                  type="text"
                  component={TextField}
                />
                <Field
                  name="anzTriebe"
                  label="Anzahl Triebe"
                  type="number"
                  component={TextField}
                />
                <Field
                  name="anzPflanzen"
                  label="Anzahl Pflanzen"
                  type="number"
                  component={TextField}
                />
                <Field
                  name="anzPflanzstellen"
                  label="Anzahl Pflanzstellen"
                  type="number"
                  component={TextField}
                />
                <Field
                  field="wirtspflanze"
                  label="Wirtspflanze"
                  component={SelectLoadingOptionsTypable}
                  query={queryAeEigenschaftens}
                  queryNodesName="allAeEigenschaftens"
                />
                <Field
                  name="herkunftPop"
                  label="Herkunftspopulation"
                  type="text"
                  component={TextField}
                />
                <Field
                  name="sammeldatum"
                  label="Sammeldatum"
                  type="text"
                  component={TextField}
                />
                {!showFilter && <StringToCopy text={row.id} label="id" />}
              </Form>
            )}
          </Formik>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Tpopmassn)
