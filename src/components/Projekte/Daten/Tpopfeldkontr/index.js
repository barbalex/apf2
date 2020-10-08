import React, { useState, useCallback, useContext } from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import styled from 'styled-components'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import { Formik, Form, Field } from 'formik'

import RadioButtonGroup from '../../../shared/RadioButtonGroupFormik'
import Checkbox3States from '../../../shared/Checkbox3StatesFormik'
import TextField from '../../../shared/TextFieldFormik'
import MdField from '../../../shared/MarkdownFieldFormik'
import Select from '../../../shared/SelectFormik'
import RadioButtonGroupWithInfo from '../../../shared/RadioButtonGroupWithInfoFormik'
import DateField from '../../../shared/DateFormik'
import StringToCopy from '../../../shared/StringToCopy'
import FilterTitle from '../../../shared/FilterTitle'
import FormTitle from '../../../shared/FormTitle'
import TpopfeldkontrentwicklungPopover from '../TpopfeldkontrentwicklungPopover'
import constants from '../../../../modules/constants'
import query from './query'
import queryLists from './queryLists'
import queryAdresses from './queryAdresses'
import queryTpopkontrs from './queryTpopkontrs'
import setUrlQueryValue from '../../../../modules/setUrlQueryValue'
import storeContext from '../../../../storeContext'
import { simpleTypes as tpopfeldkontrType } from '../../../../store/Tree/DataFilter/tpopfeldkontr'
import Files from '../../../shared/Files'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import { tpopfeldkontr } from '../../../shared/fragments'

const Container = styled.div`
  height: ${(props) =>
    props.showfilter ? 'calc(100vh - 145px)' : 'calc(100vh - 64px)'};
  display: flex;
  flex-direction: column;
  background-color: ${(props) => (props.showfilter ? '#ffd3a7' : 'unset')};
`
const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  > div:first-child {
    > div:first-child {
      display: block !important;
    }
  }
`
const FormContainer = styled.div`
  padding: 10px;
  overflow-y: auto !important;
  height: calc(100% - 43px - 48px);
  column-width: ${(props) =>
    props['data-width'] > 2 * constants.columnWidth
      ? `${constants.columnWidth}px`
      : 'auto'};
`
const FilesContainer = styled.div`
  padding: 10px;
  overflow-y: auto !important;
  height: calc(100% - 20px);
`
const Section = styled.div`
  padding-top: 20px;
  padding-bottom: 5px;
  font-weight: bold;
  break-after: avoid;
  &:after {
    content: ':';
  }
`
const StyledTab = styled(Tab)`
  text-transform: none !important;
`

const fieldTypes = {
  typ: 'String',
  datum: 'Date',
  jahr: 'Int',
  vitalitaet: 'String',
  ueberlebensrate: 'Int',
  entwicklung: 'Int',
  ursachen: 'String',
  erfolgsbeurteilung: 'String',
  umsetzungAendern: 'String',
  kontrolleAendern: 'String',
  bemerkungen: 'String',
  lrDelarze: 'String',
  flaeche: 'Int',
  lrUmgebungDelarze: 'String',
  vegetationstyp: 'String',
  konkurrenz: 'String',
  moosschicht: 'String',
  krautschicht: 'String',
  strauchschicht: 'String',
  baumschicht: 'String',
  bodenTyp: 'String',
  bodenKalkgehalt: 'String',
  bodenDurchlaessigkeit: 'String',
  bodenHumus: 'String',
  bodenNaehrstoffgehalt: 'String',
  bodenAbtrag: 'String',
  wasserhaushalt: 'String',
  idealbiotopUebereinstimmung: 'Int',
  handlungsbedarf: 'String',
  flaecheUeberprueft: 'Int',
  deckungVegetation: 'Int',
  deckungNackterBoden: 'Int',
  deckungApArt: 'Int',
  vegetationshoeheMaximum: 'Int',
  vegetationshoeheMittel: 'Int',
  gefaehrdung: 'String',
  tpopId: 'UUID',
  bearbeiter: 'UUID',
  planVorhanden: 'Boolean',
  jungpflanzenVorhanden: 'Boolean',
  apberNichtRelevant: 'Boolean',
  apberNichtRelevantGrund: 'String',
}

const tpopkontrTypWerte = [
  {
    value: 'Ausgangszustand',
    label: 'Ausgangszustand',
  },
  {
    value: 'Zwischenbeurteilung',
    label: 'Zwischenbeurteilung',
  },
]

const Tpopfeldkontr = ({ treeName, showFilter = false }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
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

  const allTpopkontrFilter = {
    or: [
      { typ: { notEqualTo: 'Freiwilligen-Erfolgskontrolle' } },
      { typ: { isNull: true } },
    ],
    tpopByTpopId: {
      popByPopId: { apByApId: { projId: { equalTo: activeNodeArray[1] } } },
    },
  }
  const tpopkontrFilter = {
    or: [
      { typ: { notEqualTo: 'Freiwilligen-Erfolgskontrolle' } },
      { typ: { isNull: true } },
    ],
    tpopByTpopId: {
      popByPopId: { apByApId: { projId: { equalTo: activeNodeArray[1] } } },
    },
  }
  const tpopfeldkontrFilterValues = Object.entries(
    dataFilter.tpopfeldkontr,
  ).filter((e) => e[1] || e[1] === 0)
  tpopfeldkontrFilterValues.forEach(([key, value]) => {
    const expression =
      tpopfeldkontrType[key] === 'string' ? 'includes' : 'equalTo'
    tpopkontrFilter[key] = { [expression]: value }
  })
  const { data: dataTpopkontrs } = useQuery(queryTpopkontrs, {
    variables: {
      showFilter,
      tpopkontrFilter,
      allTpopkontrFilter,
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

  const [tab, setTab] = useState(get(urlQuery, 'feldkontrTab', 'entwicklung'))
  const onChangeTab = useCallback(
    (event, value) => {
      setUrlQueryValue({
        key: 'feldkontrTab',
        value,
        urlQuery,
        setUrlQuery,
      })
      setTab(value)
    },
    [setUrlQuery, urlQuery],
  )

  let tpopkontrTotalCount
  let tpopkontrFilteredCount
  let tpopkontrsOfApTotalCount
  let tpopkontrsOfApFilteredCount
  let row
  if (showFilter) {
    row = dataFilter.tpopfeldkontr
    tpopkontrTotalCount = get(dataTpopkontrs, 'allTpopkontrs.totalCount', '...')
    tpopkontrFilteredCount = get(
      dataTpopkontrs,
      'tpopkontrsFiltered.totalCount',
      '...',
    )
    const popsOfAp = get(dataTpopkontrs, 'popsOfAp.nodes', [])
    const tpopsOfAp = flatten(popsOfAp.map((p) => get(p, 'tpops.nodes', [])))
    tpopkontrsOfApTotalCount = !tpopsOfAp.length
      ? '...'
      : tpopsOfAp
          .map((p) => get(p, 'tpopkontrs.totalCount'))
          .reduce((acc = 0, val) => acc + val)
    tpopkontrsOfApFilteredCount = !tpopsOfAp.length
      ? '...'
      : tpopsOfAp
          .map((p) => get(p, 'tpopkontrsFiltered.totalCount'))
          .reduce((acc = 0, val) => acc + val)
  } else {
    row = get(data, 'tpopkontrById', {})
  }

  const onSubmit = useCallback(
    async (values, { setErrors }) => {
      const changedField = objectsFindChangedKey(values, row)
      const value = values[changedField]
      console.log('Tpopfeldkontr, onSubmit', {
        values,
        changedField,
        value,
        showFilter,
      })
      if (showFilter) {
        dataFilterSetValue({
          treeName,
          table: 'tpopfeldkontr',
          key: changedField,
          value,
        })
      } else {
        const variables = {
          ...objectsEmptyValuesToNull(values),
          changedBy: store.user.name,
        }
        if (changedField === 'jahr') {
          variables.datum = null
        }
        if (changedField === 'datum') {
          // value can be null so check if substring method exists
          const newJahr =
            value && value.substring ? +value.substring(0, 4) : value
          variables.jahr = newJahr
        }
        try {
          await client.mutate({
            mutation: gql`
              mutation updateTpopkontrForEk(
                $id: UUID!
                $${changedField}: ${fieldTypes[changedField]}
                ${changedField === 'jahr' ? '$datum: Date' : ''}
                ${changedField === 'datum' ? '$jahr: Int' : ''}
                $changedBy: String
              ) {
                updateTpopkontrById(
                  input: {
                    id: $id
                    tpopkontrPatch: {
                      ${changedField}: $${changedField}
                      ${changedField === 'jahr' ? 'datum: $datum' : ''}
                      ${changedField === 'datum' ? 'jahr: $jahr' : ''}
                      changedBy: $changedBy
                    }
                  }
                ) {
                  tpopkontr {
                    ...TpopfeldkontrFields
                  }
                }
              }
              ${tpopfeldkontr}
            `,
            variables,
            optimisticResponse: {
              __typename: 'Mutation',
              updateTpopkontrById: {
                tpopkontr: {
                  ...variables,
                  __typename: 'Tpopkontr',
                },
                __typename: 'Tpopkontr',
              },
            },
          })
        } catch (error) {
          return setErrors({ [changedField]: error.message })
        }
        setErrors({})
      }
    },
    [client, dataFilterSetValue, row, showFilter, store.user.name, treeName],
  )

  const aeLrWerte = get(dataLists, 'allAeLrDelarzes.nodes', [])
    .map(
      (e) => `${e.label}: ${e.einheit ? e.einheit.replace(/  +/g, ' ') : ''}`,
    )
    .map((o) => ({ value: o, label: o }))

  if (loading) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (error) return `Fehler beim Laden der Daten: ${error.message}`
  if (errorAdresses) return `Fehler: ${errorAdresses.message}`
  if (errorLists) return `Fehler: ${errorLists.message}`
  return (
    <ErrorBoundary>
      <Container showfilter={showFilter}>
        {showFilter ? (
          <FilterTitle
            title="Feld-Kontrollen"
            treeName={treeName}
            table="tpopfeldkontr"
            totalNr={tpopkontrTotalCount}
            filteredNr={tpopkontrFilteredCount}
            totalApNr={tpopkontrsOfApTotalCount}
            filteredApNr={tpopkontrsOfApFilteredCount}
          />
        ) : (
          <FormTitle
            apId={activeNodeArray[3]}
            title="Feld-Kontrolle"
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
            <StyledTab
              label="Entwicklung"
              value="entwicklung"
              data-id="entwicklung"
            />
            <StyledTab label="Biotop" value="biotop" data-id="biotop" />
            {!showFilter && (
              <StyledTab label="Dateien" value="dateien" data-id="dateien" />
            )}
          </Tabs>
          {tab === 'entwicklung' && (
            <FormContainer data-width={showFilter ? filterWidth : datenWidth}>
              <Formik
                key={showFilter ? JSON.stringify(row) : row.id}
                initialValues={row}
                onSubmit={onSubmit}
                enableReinitialize
              >
                {({ handleSubmit, dirty }) => (
                  <Form onBlur={() => dirty && handleSubmit()}>
                    <TextField name="jahr" label="Jahr" type="number" />
                    <Field name="datum" label="Datum" component={DateField} />
                    <Field
                      name="typ"
                      label="Kontrolltyp"
                      component={RadioButtonGroup}
                      dataSource={tpopkontrTypWerte}
                    />
                    <Field
                      name="bearbeiter"
                      label="BearbeiterIn"
                      component={Select}
                      options={get(dataAdresses, 'allAdresses.nodes', [])}
                      loading={loadingAdresses}
                    />
                    <Field
                      name="jungpflanzenVorhanden"
                      label="Jungpflanzen vorhanden"
                      component={Checkbox3States}
                    />
                    <TextField
                      name="vitalitaet"
                      label="Vitalität"
                      type="text"
                    />
                    <TextField
                      name="ueberlebensrate"
                      label="Überlebensrate (in Prozent)"
                      type="number"
                    />
                    <Field
                      name="entwicklung"
                      label="Entwicklung"
                      component={RadioButtonGroupWithInfo}
                      dataSource={get(
                        dataLists,
                        'allTpopEntwicklungWertes.nodes',
                        [],
                      )}
                      loading={loadingLists}
                      popover={TpopfeldkontrentwicklungPopover}
                    />
                    <TextField
                      name="ursachen"
                      label="Ursachen"
                      hintText="Standort: ..., Klima: ..., anderes: ..."
                      type="text"
                      multiLine
                    />
                    <TextField
                      name="gefaehrdung"
                      label="Gefährdung"
                      type="text"
                      multiLine
                    />
                    <TextField
                      name="erfolgsbeurteilung"
                      label="Erfolgsbeurteilung"
                      type="text"
                      multiLine
                    />
                    <TextField
                      name="umsetzungAendern"
                      label="Änderungs-Vorschläge Umsetzung"
                      type="text"
                      multiLine
                    />
                    <TextField
                      name="kontrolleAendern"
                      label="Änderungs-Vorschläge Kontrolle"
                      type="text"
                      multiLine
                    />
                    <Field
                      name="bemerkungen"
                      label="Bemerkungen"
                      component={MdField}
                    />
                    <Field
                      name="apberNichtRelevant"
                      label="Im Jahresbericht nicht berücksichtigen"
                      component={Checkbox3States}
                    />
                    <TextField
                      name="apberNichtRelevantGrund"
                      label="Wieso im Jahresbericht nicht berücksichtigen?"
                      type="text"
                      multiLine
                    />
                    {!showFilter && <StringToCopy text={row.id} label="id" />}
                  </Form>
                )}
              </Formik>
            </FormContainer>
          )}
          {tab === 'biotop' && (
            <FormContainer data-width={datenWidth}>
              <Formik
                initialValues={row}
                onSubmit={onSubmit}
                enableReinitialize
              >
                {({ handleSubmit, dirty }) => (
                  <Form onBlur={() => dirty && handleSubmit()}>
                    <TextField name="flaeche" label="Fläche" type="number" />
                    <Section>Vegetation</Section>
                    <Field
                      data-id="lrDelarze"
                      name="lrDelarze"
                      label="Lebensraum nach Delarze"
                      component={Select}
                      options={aeLrWerte}
                      loading={loadingLists}
                    />
                    <Field
                      name="lrUmgebungDelarze"
                      label="Umgebung nach Delarze"
                      component={Select}
                      options={aeLrWerte}
                      loading={loadingLists}
                    />
                    <TextField
                      name="vegetationstyp"
                      label="Vegetationstyp"
                      type="text"
                    />
                    <TextField
                      name="konkurrenz"
                      label="Konkurrenz"
                      type="text"
                    />
                    <TextField
                      name="moosschicht"
                      label="Moosschicht"
                      type="text"
                    />
                    <TextField
                      name="krautschicht"
                      label="Krautschicht"
                      type="text"
                    />
                    <TextField
                      name="strauchschicht"
                      label="Strauchschicht"
                      type="text"
                    />
                    <TextField
                      name="baumschicht"
                      label="Baumschicht"
                      type="text"
                    />
                    <Section>Boden</Section>
                    <TextField name="bodenTyp" label="Typ" type="text" />
                    <TextField
                      name="bodenKalkgehalt"
                      label="Kalkgehalt"
                      type="text"
                    />
                    <TextField
                      name="bodenDurchlaessigkeit"
                      label="Durchlässigkeit"
                      type="text"
                    />
                    <TextField
                      name="bodenHumus"
                      label="Humusgehalt"
                      type="text"
                    />
                    <TextField
                      name="bodenNaehrstoffgehalt"
                      label="Nährstoffgehalt"
                      type="text"
                    />
                    <TextField
                      name="bodenAbtrag"
                      label="Bodenabtrag"
                      type="text"
                    />
                    <TextField
                      name="wasserhaushalt"
                      label="Wasserhaushalt"
                      type="text"
                    />
                    <Section>Beurteilung</Section>
                    <TextField
                      name="handlungsbedarf"
                      label="Handlungsbedarf"
                      type="text"
                      multiline
                    />
                    <Field
                      name="idealbiotopUebereinstimmung"
                      label="Übereinstimmung mit Idealbiotop"
                      component={RadioButtonGroup}
                      dataSource={get(
                        dataLists,
                        'allTpopkontrIdbiotuebereinstWertes.nodes',
                        [],
                      )}
                      loading={loadingLists}
                    />
                  </Form>
                )}
              </Formik>
            </FormContainer>
          )}
          {tab === 'dateien' && !showFilter && (
            <FilesContainer data-width={datenWidth}>
              <Files parentId={row.id} parent="tpopkontr" />
            </FilesContainer>
          )}
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Tpopfeldkontr)
