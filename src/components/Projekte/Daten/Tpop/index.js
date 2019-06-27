import React, { useCallback, useContext, useState } from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from 'react-apollo-hooks'
import { Formik, Form, Field } from 'formik'

import TextField from '../../../shared/TextFieldFormik'
import TextFieldWithInfo from '../../../shared/TextFieldWithInfoFormik'
import Status from '../../../shared/Status'
import SelectCreatable from '../../../shared/SelectCreatableGemeinde'
import RadioButton from '../../../shared/RadioButtonFormik'
import RadioButtonGroupWithInfo from '../../../shared/RadioButtonGroupWithInfoFormik'
import RadioButtonGroup from '../../../shared/RadioButtonGroupFormik'
import FormTitle from '../../../shared/FormTitle'
import FilterTitle from '../../../shared/FilterTitle'
import TpopAbBerRelevantInfoPopover from '../TpopAbBerRelevantInfoPopover'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import query from './query'
import queryLists from './queryLists'
import queryTpops from './queryTpops'
import queryEkfrequenzs from './queryEkfrequenzs'
import updateTpopByIdGql from './updateTpopById'
import getGemeindeForKoord from '../../../../modules/getGemeindeForKoord'
import setUrlQueryValue from '../../../../modules/setUrlQueryValue'
import constants from '../../../../modules/constants'
import storeContext from '../../../../storeContext'
import { simpleTypes as tpopType } from '../../../../store/NodeFilterTree/tpop'
import Coordinates from '../../../shared/Coordinates'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'

const Container = styled.div`
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  background-color: ${props => (props.showfilter ? '#ffd3a7' : 'unset')};
`
const FieldsContainer = styled.div`
  overflow: hidden !important;
  height: 100%;
  fieldset {
    padding-right: 30px;
  }
`
const FormContainer = styled.div`
  padding: 10px;
  overflow-y: auto !important;
  height: calc(100% - 20px);
  column-width: ${props =>
    props['data-width'] > 2 * constants.columnWidth
      ? `${constants.columnWidth}px`
      : 'auto'};
`
const FormContainerNoColumns = styled.div`
  padding: 10px;
  overflow-y: auto !important;
  height: calc(100% - 20px);
`
const EkfrequenzOptionsContainer = styled.div`
  span {
    font-family: 'Roboto Mono' !important;
    font-size: 14px;
    white-space: pre;
    line-height: 1.5rem;
    font-weight: 500;
  }
`

const Tpop = ({ treeName, showFilter = false }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const {
    nodeFilter,
    nodeFilterSetValue,
    refetch,
    urlQuery,
    setUrlQuery,
  } = store

  const { activeNodeArray, datenWidth, filterWidth } = store[treeName]
  const [tab, setTab] = useState(get(urlQuery, 'tpopTab', 'tpop'))
  const onChangeTab = useCallback((event, value) => {
    setUrlQueryValue({
      key: 'tpopTab',
      value,
      urlQuery,
      setUrlQuery,
    })
    setTab(value)
  })

  let id =
    activeNodeArray.length > 7
      ? activeNodeArray[7]
      : '99999999-9999-9999-9999-999999999999'
  if (showFilter) id = '99999999-9999-9999-9999-999999999999'
  const apId = activeNodeArray[3]
  const { data, loading, error, refetch: refetchTpop } = useQuery(query, {
    variables: {
      id,
    },
  })
  const {
    data: dataLists,
    loading: loadingLists,
    error: errorLists,
  } = useQuery(queryLists)

  const allTpopsFilter = {
    popByPopId: { apByApId: { projId: { equalTo: activeNodeArray[1] } } },
  }
  const tpopFilter = {
    popId: { isNull: false },
    popByPopId: { apByApId: { projId: { equalTo: activeNodeArray[1] } } },
  }
  const tpopFilterValues = Object.entries(nodeFilter[treeName].tpop).filter(
    e => e[1] || e[1] === 0,
  )
  tpopFilterValues.forEach(([key, value]) => {
    const expression = tpopType[key] === 'string' ? 'includes' : 'equalTo'
    tpopFilter[key] = { [expression]: value }
  })

  const { data: dataTpops } = useQuery(queryTpops, {
    variables: {
      showFilter,
      allTpopsFilter,
      tpopFilter,
      apId,
    },
  })

  const { data: dataEkfrequenzs } = useQuery(queryEkfrequenzs, {
    variables: {
      apId,
    },
  })

  let tpopTotalCount
  let tpopFilteredCount
  let tpopOfApTotalCount
  let tpopOfApFilteredCount
  let row
  if (showFilter) {
    row = nodeFilter[treeName].tpop
    tpopTotalCount = get(dataTpops, 'allTpops.totalCount', '...')
    tpopFilteredCount = get(dataTpops, 'tpopsFiltered.totalCount', '...')
    const popsOfAp = get(dataTpops, 'popsOfAp.nodes', [])
    tpopOfApTotalCount = !popsOfAp.length
      ? '...'
      : popsOfAp
          .map(p => get(p, 'tpops.totalCount'))
          .reduce((acc = 0, val) => acc + val)
    tpopOfApFilteredCount = !popsOfAp.length
      ? '...'
      : popsOfAp
          .map(p => get(p, 'tpopsFiltered.totalCount'))
          .reduce((acc = 0, val) => acc + val)
  } else {
    row = get(data, 'tpopById', {})
  }

  const onSubmit = useCallback(
    async (values, { setErrors }) => {
      const changedField = objectsFindChangedKey(values, row)
      const value = values[changedField]
      if (showFilter) {
        nodeFilterSetValue({
          treeName,
          table: 'tpop',
          key: changedField,
          value,
        })
      } else {
        try {
          await client.mutate({
            mutation: updateTpopByIdGql,
            variables: {
              ...objectsEmptyValuesToNull(values),
              changedBy: store.user.name,
            },
            optimisticResponse: {
              __typename: 'Mutation',
              updateTpopById: {
                tpop: {
                  ...values,
                  __typename: 'Tpop',
                },
                __typename: 'Tpop',
              },
            },
          })
        } catch (error) {
          return setErrors({ [changedField]: error.message })
        }
        // update tpop on map
        if (
          (value &&
            ((changedField === 'ylv95Y' && row.lv95X) ||
              (changedField === 'lv95X' && row.y))) ||
          (!value && (changedField === 'ylv95Y' || changedField === 'lv95X'))
        ) {
          if (refetch.tpopForMap) refetch.tpopForMap()
        }
        setErrors({})
      }
    },
    [showFilter, row],
  )

  const ekfrequenzOptions = get(
    dataEkfrequenzs,
    'allEkfrequenzs.nodes',
    [],
  ).map(o => {
    const ekTypeArray = [o.ek ? 'ek' : null, o.ekf ? 'ekf' : null].filter(
      v => !!v,
    )
    const code = (o.code || '').padEnd(2)
    const anwendungsfall = (
      `${o.anwendungsfall}, ${ekTypeArray.join(' und ')}` || ''
    ).padEnd(26)
    const name = (o.name || '').padEnd(27)
    return {
      value: o.code,
      label: `${code}: ${anwendungsfall} | ${name} | ${o.periodizitaet}`,
    }
  })

  //console.log('Tpop rendering')

  if (!showFilter && loading) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (error) return `Fehler: ${error.message}`
  if (errorLists) return `Fehler: ${errorLists.message}`
  return (
    <ErrorBoundary>
      <Container showfilter={showFilter}>
        {showFilter ? (
          <FilterTitle
            title="Teil-Population"
            treeName={treeName}
            table="tpop"
            totalNr={tpopTotalCount}
            filteredNr={tpopFilteredCount}
            totalApNr={tpopOfApTotalCount}
            filteredApNr={tpopOfApFilteredCount}
          />
        ) : (
          <FormTitle
            apId={get(data, 'tpopById.popByPopId.apId')}
            title="Teil-Population"
            treeName={treeName}
          />
        )}
        <FieldsContainer>
          <Tabs
            value={tab}
            onChange={onChangeTab}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Teil-Population" value="tpop" data-id="tpop" />
            <Tab label="EK" value="ek" data-id="ek" />
          </Tabs>
          {tab === 'tpop' && (
            <FormContainer data-width={showFilter ? filterWidth : datenWidth}>
              <Formik
                key={showFilter ? JSON.stringify(row) : row.id}
                initialValues={row}
                onSubmit={onSubmit}
                enableReinitialize
              >
                {({
                  handleSubmit,
                  handleChange,
                  handleBlur,
                  dirty,
                  setErrors,
                }) => (
                  <Form onBlur={() => dirty && handleSubmit()}>
                    <Field
                      name="nr"
                      label="Nr."
                      type="number"
                      component={TextField}
                    />
                    <Field
                      name="flurname"
                      label="Flurname"
                      type="text"
                      popover="Dieses Feld möglichst immer ausfüllen"
                      component={TextFieldWithInfo}
                    />
                    <Field
                      apJahr={get(
                        data,
                        'tpopById.popByPopId.apByApId.startJahr',
                        null,
                      )}
                      treeName={treeName}
                      showFilter={showFilter}
                      component={Status}
                    />
                    <Field
                      name="statusUnklar"
                      label="Status unklar"
                      component={RadioButton}
                    />
                    <Field
                      name="statusUnklarGrund"
                      label="Begründung"
                      type="text"
                      multiLine
                      component={TextField}
                    />
                    <Field
                      name="apberRelevant"
                      label="Für AP-Bericht relevant"
                      component={RadioButton}
                    />
                    <Field
                      name="apberRelevantGrund"
                      dataSource={get(
                        dataLists,
                        'allTpopApberrelevantGrundWertes.nodes',
                        [],
                      )}
                      loading={loadingLists}
                      popover={TpopAbBerRelevantInfoPopover}
                      label="Grund für AP-Bericht (Nicht-)Relevanz"
                      component={RadioButtonGroupWithInfo}
                    />
                    {!showFilter && (
                      <Coordinates
                        row={row}
                        refetchForm={refetchTpop}
                        table="tpop"
                      />
                    )}
                    <Field
                      name="gemeinde"
                      label="Gemeinde"
                      options={get(dataLists, 'allGemeindes.nodes', [])}
                      loading={loadingLists}
                      showLocate={!showFilter}
                      onClickLocate={async setStateValue => {
                        if (!row.lv95X) {
                          return setErrors({
                            gemeinde: 'Es fehlen Koordinaten',
                          })
                        }
                        const gemeinde = await getGemeindeForKoord({
                          lv95X: row.lv95X,
                          lv95Y: row.lv95Y,
                          store,
                        })
                        if (gemeinde) {
                          const fakeEvent = {
                            target: { value: gemeinde, name: 'gemeinde' },
                          }
                          handleChange(fakeEvent)
                          handleBlur(fakeEvent)
                          setTimeout(() => handleSubmit())
                        }
                      }}
                      component={SelectCreatable}
                    />
                    <Field
                      name="radius"
                      label="Radius (m)"
                      type="number"
                      component={TextField}
                    />
                    <Field
                      name="hoehe"
                      label="Höhe (m.ü.M.)"
                      type="number"
                      component={TextField}
                    />
                    <Field
                      name="exposition"
                      label="Exposition, Besonnung"
                      type="text"
                      component={TextField}
                    />
                    <Field
                      name="klima"
                      label="Klima"
                      type="text"
                      component={TextField}
                    />
                    <Field
                      name="neigung"
                      label="Hangneigung"
                      type="text"
                      component={TextField}
                    />
                    <Field
                      name="beschreibung"
                      label="Beschreibung"
                      type="text"
                      multiline
                      component={TextField}
                    />
                    <Field
                      name="katasterNr"
                      label="Kataster-Nr."
                      type="text"
                      component={TextField}
                    />
                    <Field
                      name="eigentuemer"
                      label="EigentümerIn"
                      type="text"
                      component={TextField}
                    />
                    <Field
                      name="kontakt"
                      label="Kontakt vor Ort"
                      type="text"
                      component={TextField}
                    />
                    <Field
                      name="nutzungszone"
                      label="Nutzungszone"
                      type="text"
                      component={TextField}
                    />
                    <Field
                      name="bewirtschafter"
                      label="BewirtschafterIn"
                      type="text"
                      component={TextField}
                    />
                    <Field
                      name="bewirtschaftung"
                      label="Bewirtschaftung"
                      type="text"
                      component={TextField}
                    />
                    <Field
                      name="bemerkungen"
                      label="Bemerkungen"
                      type="text"
                      multiline
                      component={TextField}
                    />
                  </Form>
                )}
              </Formik>
            </FormContainer>
          )}
          {tab === 'ek' && (
            <FormContainerNoColumns>
              <Formik
                key={showFilter ? JSON.stringify(row) : row.id}
                initialValues={row}
                onSubmit={onSubmit}
                enableReinitialize
              >
                {({
                  handleSubmit,
                  handleChange,
                  handleBlur,
                  dirty,
                  setErrors,
                }) => (
                  <Form onBlur={() => dirty && handleSubmit()}>
                    <EkfrequenzOptionsContainer>
                      <Field
                        name="ekfrequenz"
                        dataSource={ekfrequenzOptions}
                        loading={loadingLists}
                        label="EK-Frequenz"
                        component={RadioButtonGroup}
                      />
                    </EkfrequenzOptionsContainer>
                    <Field
                      name="ekfrequenzAbweichend"
                      label="EK-Frequenz abweichend"
                      component={RadioButton}
                    />
                    <div>
                      <Field
                        name="ekAbrechnungstyp"
                        dataSource={get(
                          dataLists,
                          'allEkAbrechnungstypWertes.nodes',
                          [],
                        )}
                        loading={loadingLists}
                        label="EK-Abrechnungstyp"
                        component={RadioButtonGroup}
                      />
                    </div>
                  </Form>
                )}
              </Formik>
            </FormContainerNoColumns>
          )}
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Tpop)
