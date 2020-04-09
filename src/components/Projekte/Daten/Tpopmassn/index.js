import React, { useCallback, useContext, useState } from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import styled from 'styled-components'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/react-hooks'
import { Formik, Form, Field } from 'formik'
import ErrorBoundary from 'react-error-boundary'
import gql from 'graphql-tag'

import RadioButtonGroup from '../../../shared/RadioButtonGroupFormik'
import TextField from '../../../shared/TextFieldFormik'
import Select from '../../../shared/SelectFormik'
import SelectLoadingOptionsTypable from '../../../shared/SelectLoadingOptionsTypableFormik'
import Checkbox2States from '../../../shared/Checkbox2StatesFormik'
import DateField from '../../../shared/DateFormik'
import StringToCopy from '../../../shared/StringToCopy'
import FormTitle from '../../../shared/FormTitle'
import FilterTitle from '../../../shared/FilterTitle'
import constants from '../../../../modules/constants'
import query from './query'
import queryLists from './queryLists'
import queryTpopmassns from './queryTpopmassns'
import queryAdresses from './queryAdresses'
import queryAeTaxonomies from './queryAeTaxonomies'
import queryIsMassnTypAnpflanzung from './queryIsMassnTypAnpflanzung'
import updateTpopmassnByIdGql from './updateTpopmassnById'
import storeContext from '../../../../storeContext'
import { simpleTypes as tpopmassnType } from '../../../../store/Tree/DataFilter/tpopmassn'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'
import Files from '../../../shared/Files'
import setUrlQueryValue from '../../../../modules/setUrlQueryValue'

const Container = styled.div`
  height: ${(props) =>
    props.showfilter ? 'calc(100vh - 145px)' : 'calc(100vh - 64px)'};
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  ${(props) => props.showfilter && 'background-color: #ffd3a7'};
`
const LoadingContainer = styled.div`
  padding: 10px;
  padding-top: 0;
  height: 100%;
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
const FilesContainer = styled.div`
  padding: 10px;
  overflow-y: auto !important;
  height: calc(100% - 20px);
`
const StyledTab = styled(Tab)`
  text-transform: none !important;
`

const Tpopmassn = ({ treeName, showFilter = false }) => {
  const store = useContext(storeContext)
  const client = useApolloClient()
  const { dataFilterSetValue, urlQuery, setUrlQuery } = store

  const { activeNodeArray, datenWidth, filterWidth, dataFilter } = store[
    treeName
  ]

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
  const tpopmassnFilterValues = Object.entries(dataFilter.tpopmassn).filter(
    (e) => e[1] || e[1] === 0,
  )
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
    row = dataFilter.tpopmassn
    tpopmassnTotalCount = get(dataTpopmassns, 'allTpopmassns.totalCount', '...')
    tpopmassnFilteredCount = get(
      dataTpopmassns,
      'tpopmassnsFiltered.totalCount',
      '...',
    )
    const popsOfAp = get(dataTpopmassns, 'popsOfAp.nodes', [])
    const tpopsOfAp = flatten(popsOfAp.map((p) => get(p, 'tpops.nodes', [])))
    tpopmassnsOfApTotalCount = !tpopsOfAp.length
      ? '...'
      : tpopsOfAp
          .map((p) => get(p, 'tpopmassns.totalCount'))
          .reduce((acc = 0, val) => acc + val)
    tpopmassnsOfApFilteredCount = !tpopsOfAp.length
      ? '...'
      : tpopsOfAp
          .map((p) => get(p, 'tpopmassnsFiltered.totalCount'))
          .reduce((acc = 0, val) => acc + val)
  } else {
    row = get(data, 'tpopmassnById', {})
  }

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
      if (showFilter) {
        dataFilterSetValue({
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
        if (changedField === 'typ') {
          // IF typ is anpflanzung
          // have to set zieleinheit_einheit to
          // ekzaehleinheit with zielrelevant = true
          let zieleinheitIdResult
          try {
            zieleinheitIdResult = await client.query({
              query: gql`
                query tpopmassnZieleinheitQuery($apId: UUID!, $typ: Int!) {
                  allTpopmassnTypWertes(filter: { code: { equalTo: $typ } }) {
                    nodes {
                      id
                      anpflanzung
                    }
                  }
                  allEkzaehleinheits(
                    filter: {
                      zielrelevant: { equalTo: true }
                      apId: { equalTo: $apId }
                    }
                  ) {
                    nodes {
                      id
                      tpopkontrzaehlEinheitWerteByZaehleinheitId {
                        id
                        code
                      }
                    }
                  }
                }
              `,
              variables: { apId, typ: variables.typ },
            })
          } catch (error) {
            return setErrors({ [changedField]: error.message })
          }
          const isAnpflanzung = get(
            zieleinheitIdResult,
            'data.allTpopmassnTypWertes.nodes[0].anpflanzung',
          )
          const zieleinheitCode =
            get(
              zieleinheitIdResult,
              'data.allEkzaehleinheits.nodes[0].tpopkontrzaehlEinheitWerteByZaehleinheitId.code',
            ) || null
          if (isAnpflanzung && zieleinheitCode) {
            variables.zieleinheitEinheit = zieleinheitCode
          }
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
      }
    },
    [
      apId,
      client,
      dataFilterSetValue,
      row,
      showFilter,
      store.user.name,
      treeName,
    ],
  )

  const [tab, setTab] = useState(get(urlQuery, 'tpopmassnTab', 'tpopmassn'))
  const onChangeTab = useCallback(
    (event, value) => {
      setUrlQueryValue({
        key: 'tpopmassnTab',
        value,
        urlQuery,
        setUrlQuery,
      })
      setTab(value)
    },
    [setUrlQuery, urlQuery],
  )

  //console.log('Tpopmassn rendering')

  if (loading) {
    return (
      <Container>
        <LoadingContainer>Lade...</LoadingContainer>
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
        <Tabs
          value={tab}
          onChange={onChangeTab}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <StyledTab label="Massnahme" value="tpopmassn" data-id="tpopmassn" />
          {!showFilter && (
            <StyledTab label="Dateien" value="dateien" data-id="dateien" />
          )}
        </Tabs>
        {tab === 'tpopmassn' && (
          <FormScrollContainer>
            <ColumnContainer data-width={showFilter ? filterWidth : datenWidth}>
              <Formik
                key={showFilter ? row : row.id}
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
                    <Field name="datum" label="Datum" component={DateField} />
                    <Field
                      name="typ"
                      label="Typ"
                      component={RadioButtonGroup}
                      dataSource={get(
                        dataLists,
                        'allTpopmassnTypWertes.nodes',
                        [],
                      )}
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
                      component={Checkbox2States}
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
                        <Field
                          name="zieleinheitAnzahl"
                          label="Ziel-Einheit: Anzahl (nur ganze Zahlen)"
                          type="number"
                          component={TextField}
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
            </ColumnContainer>
          </FormScrollContainer>
        )}
        {tab === 'dateien' && !showFilter && (
          <FilesContainer data-width={datenWidth}>
            <Files parentId={row.id} parent="tpopmassn" />
          </FilesContainer>
        )}
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Tpopmassn)
