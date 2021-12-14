import React, { useState, useCallback, useContext } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import styled from 'styled-components'
import flatten from 'lodash/flatten'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import SimpleBar from 'simplebar-react'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField'
import MdField from '../../../shared/MarkdownField'
import Select from '../../../shared/Select'
import JesNo from '../../../shared/JesNo'
import RadioButtonGroupWithInfo from '../../../shared/RadioButtonGroupWithInfo'
import DateField from '../../../shared/Date'
import StringToCopy from '../../../shared/StringToCopy'
import FilterTitle from '../../../shared/FilterTitle'
import FormTitle from '../../../shared/FormTitle'
import TpopfeldkontrentwicklungPopover from '../TpopfeldkontrentwicklungPopover'
import constants from '../../../../modules/constants'
import query from './query'
import queryTpopkontrs from './queryTpopkontrs'
import setUrlQueryValue from '../../../../modules/setUrlQueryValue'
import storeContext from '../../../../storeContext'
import { simpleTypes as tpopfeldkontrType } from '../../../../store/Tree/DataFilter/tpopfeldkontr'
import Files from '../../../shared/Files'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'
import { tpopfeldkontr } from '../../../shared/fragments'
import Spinner from '../../../shared/Spinner'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: ${(props) => (props.showfilter ? '#ffd3a7' : 'unset')};
`
const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  > div:first-child {
    > div:first-child {
      display: block !important;
    }
  }
`
const FormContainer = styled.div`
  padding: 10px;
  height: 100%;
  ${(props) =>
    props['data-column-width'] &&
    `column-width: ${props['data-column-width']}px;`}
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
const TabContent = styled.div`
  height: 100%;
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
  const { activeNodeArray, dataFilter, formWidth, filterWidth } =
    store[treeName]

  const [fieldErrors, setFieldErrors] = useState({})

  let id =
    activeNodeArray.length > 9
      ? activeNodeArray[9]
      : '99999999-9999-9999-9999-999999999999'
  if (showFilter) id = '99999999-9999-9999-9999-999999999999'
  const width = showFilter ? filterWidth : formWidth
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
      tpopkontrFilter,
      allTpopkontrFilter,
      apId,
      apIdExists: !!apId && showFilter,
    },
  })

  const [tab, setTab] = useState(urlQuery?.feldkontrTab ?? 'entwicklung')
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
    tpopkontrTotalCount = dataTpopkontrs?.allTpopkontrs?.totalCount ?? '...'
    tpopkontrFilteredCount =
      dataTpopkontrs?.tpopkontrsFiltered?.totalCount ?? '...'
    const popsOfAp = dataTpopkontrs?.popsOfAp?.nodes ?? []
    const tpopsOfAp = flatten(popsOfAp.map((p) => p?.tpops?.nodes ?? []))
    tpopkontrsOfApTotalCount = !tpopsOfAp.length
      ? '...'
      : tpopsOfAp
          .map((p) => p?.tpopkontrs?.totalCount)
          .reduce((acc = 0, val) => acc + val)
    tpopkontrsOfApFilteredCount = !tpopsOfAp.length
      ? '...'
      : tpopsOfAp
          .map((p) => p?.tpopkontrsFiltered?.totalCount)
          .reduce((acc = 0, val) => acc + val)
  } else {
    row = data?.tpopkontrById ?? {}
  }

  const saveToDb = useCallback(
    async (event) => {
      const field = event.target.name
      let value = ifIsNumericAsNumber(event.target.value)

      if (showFilter) {
        dataFilterSetValue({
          treeName,
          table: 'tpopfeldkontr',
          key: field,
          value,
        })
        return
      }

      const variables = {
        id: row.id,
        [field]: value,
        changedBy: store.user.name,
      }
      if (field === 'jahr') {
        variables.datum = null
      }
      if (field === 'datum') {
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
                $${field}: ${fieldTypes[field]}
                ${field === 'jahr' ? '$datum: Date' : ''}
                ${field === 'datum' ? '$jahr: Int' : ''}
                $changedBy: String
              ) {
                updateTpopkontrById(
                  input: {
                    id: $id
                    tpopkontrPatch: {
                      ${field}: $${field}
                      ${field === 'jahr' ? 'datum: $datum' : ''}
                      ${field === 'datum' ? 'jahr: $jahr' : ''}
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
        })
      } catch (error) {
        return setFieldErrors({ [field]: error.message })
      }
      setFieldErrors({})
    },
    [client, dataFilterSetValue, row, showFilter, store.user.name, treeName],
  )

  const aeLrWerte = (data?.allAeLrDelarzes?.nodes ?? [])
    .map(
      (e) => `${e.label}: ${e.einheit ? e.einheit.replace(/  +/g, ' ') : ''}`,
    )
    .map((o) => ({ value: o, label: o }))

  const columnWidth =
    width > 2 * constants.columnWidth ? constants.columnWidth : undefined

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

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
          <div style={{ overflowY: 'auto' }}>
            <TabContent>
              {tab === 'entwicklung' && (
                <SimpleBar style={{ maxHeight: '100%', height: '100%' }}>
                  <FormContainer data-column-width={columnWidth}>
                    <TextField
                      name="jahr"
                      label="Jahr"
                      type="number"
                      value={row.jahr}
                      saveToDb={saveToDb}
                      error={fieldErrors.jahr}
                    />
                    <DateField
                      name="datum"
                      label="Datum"
                      value={row.datum}
                      saveToDb={saveToDb}
                      error={fieldErrors.datum}
                    />
                    <RadioButtonGroup
                      name="typ"
                      label="Kontrolltyp"
                      dataSource={tpopkontrTypWerte}
                      value={row.typ}
                      saveToDb={saveToDb}
                      error={fieldErrors.typ}
                    />
                    <Select
                      name="bearbeiter"
                      label="BearbeiterIn"
                      options={data?.allAdresses?.nodes ?? []}
                      loading={loading}
                      value={row.bearbeiter}
                      saveToDb={saveToDb}
                      error={fieldErrors.bearbeiter}
                    />
                    <JesNo
                      name="jungpflanzenVorhanden"
                      label="Jungpflanzen vorhanden"
                      value={row.jungpflanzenVorhanden}
                      saveToDb={saveToDb}
                      error={fieldErrors.jungpflanzenVorhanden}
                    />
                    <TextField
                      name="vitalitaet"
                      label="Vitalität"
                      type="text"
                      value={row.vitalitaet}
                      saveToDb={saveToDb}
                      error={fieldErrors.vitalitaet}
                    />
                    <TextField
                      name="ueberlebensrate"
                      label="Überlebensrate (in Prozent)"
                      type="number"
                      value={row.ueberlebensrate}
                      saveToDb={saveToDb}
                      error={fieldErrors.ueberlebensrate}
                    />
                    <RadioButtonGroupWithInfo
                      name="entwicklung"
                      label="Entwicklung"
                      dataSource={data?.allTpopEntwicklungWertes?.nodes ?? []}
                      loading={loading}
                      popover={TpopfeldkontrentwicklungPopover}
                      value={row.entwicklung}
                      saveToDb={saveToDb}
                      error={fieldErrors.entwicklung}
                    />
                    <TextField
                      name="ursachen"
                      label="Ursachen"
                      hintText="Standort: ..., Klima: ..., anderes: ..."
                      type="text"
                      multiLine
                      value={row.ursachen}
                      saveToDb={saveToDb}
                      error={fieldErrors.ursachen}
                    />
                    <TextField
                      name="gefaehrdung"
                      label="Gefährdung"
                      type="text"
                      multiLine
                      value={row.gefaehrdung}
                      saveToDb={saveToDb}
                      error={fieldErrors.gefaehrdung}
                    />
                    <TextField
                      name="erfolgsbeurteilung"
                      label="Erfolgsbeurteilung"
                      type="text"
                      multiLine
                      value={row.erfolgsbeurteilung}
                      saveToDb={saveToDb}
                      error={fieldErrors.erfolgsbeurteilung}
                    />
                    <TextField
                      name="umsetzungAendern"
                      label="Änderungs-Vorschläge Umsetzung"
                      type="text"
                      multiLine
                      value={row.umsetzungAendern}
                      saveToDb={saveToDb}
                      error={fieldErrors.umsetzungAendern}
                    />
                    <TextField
                      name="kontrolleAendern"
                      label="Änderungs-Vorschläge Kontrolle"
                      type="text"
                      multiLine
                      value={row.kontrolleAendern}
                      saveToDb={saveToDb}
                      error={fieldErrors.kontrolleAendern}
                    />
                    <MdField
                      name="bemerkungen"
                      label="Bemerkungen"
                      value={row.bemerkungen}
                      saveToDb={saveToDb}
                      error={fieldErrors.bemerkungen}
                    />
                    <JesNo
                      name="apberNichtRelevant"
                      label="Im Jahresbericht nicht berücksichtigen"
                      value={row.apberNichtRelevant}
                      saveToDb={saveToDb}
                      error={fieldErrors.apberNichtRelevant}
                    />
                    <TextField
                      name="apberNichtRelevantGrund"
                      label="Wieso im Jahresbericht nicht berücksichtigen?"
                      type="text"
                      multiLine
                      value={row.apberNichtRelevantGrund}
                      saveToDb={saveToDb}
                      error={fieldErrors.apberNichtRelevantGrund}
                    />
                    {!showFilter && <StringToCopy text={row.id} label="id" />}
                  </FormContainer>
                </SimpleBar>
              )}
              {tab === 'biotop' && (
                <SimpleBar style={{ maxHeight: '100%', height: '100%' }}>
                  <FormContainer data-column-width={columnWidth}>
                    <TextField
                      name="flaeche"
                      label="Fläche"
                      type="number"
                      value={row.flaeche}
                      saveToDb={saveToDb}
                      error={fieldErrors.flaeche}
                    />
                    <Section>Vegetation</Section>
                    <Select
                      data-id="lrDelarze"
                      name="lrDelarze"
                      label="Lebensraum nach Delarze"
                      options={aeLrWerte}
                      loading={loading}
                      value={row.lrDelarze}
                      saveToDb={saveToDb}
                      error={fieldErrors.lrDelarze}
                    />
                    <Select
                      name="lrUmgebungDelarze"
                      label="Umgebung nach Delarze"
                      options={aeLrWerte}
                      loading={loading}
                      value={row.lrUmgebungDelarze}
                      saveToDb={saveToDb}
                      error={fieldErrors.lrUmgebungDelarze}
                    />
                    <TextField
                      name="vegetationstyp"
                      label="Vegetationstyp"
                      type="text"
                      value={row.vegetationstyp}
                      saveToDb={saveToDb}
                      error={fieldErrors.vegetationstyp}
                    />
                    <TextField
                      name="konkurrenz"
                      label="Konkurrenz"
                      type="text"
                      value={row.konkurrenz}
                      saveToDb={saveToDb}
                      error={fieldErrors.konkurrenz}
                    />
                    <TextField
                      name="moosschicht"
                      label="Moosschicht"
                      type="text"
                      value={row.moosschicht}
                      saveToDb={saveToDb}
                      error={fieldErrors.moosschicht}
                    />
                    <TextField
                      name="krautschicht"
                      label="Krautschicht"
                      type="text"
                      value={row.krautschicht}
                      saveToDb={saveToDb}
                      error={fieldErrors.krautschicht}
                    />
                    <TextField
                      name="strauchschicht"
                      label="Strauchschicht"
                      type="text"
                      value={row.strauchschicht}
                      saveToDb={saveToDb}
                      error={fieldErrors.strauchschicht}
                    />
                    <TextField
                      name="baumschicht"
                      label="Baumschicht"
                      type="text"
                      value={row.baumschicht}
                      saveToDb={saveToDb}
                      error={fieldErrors.baumschicht}
                    />
                    <Section>Beurteilung</Section>
                    <TextField
                      name="handlungsbedarf"
                      label="Handlungsbedarf"
                      type="text"
                      multiline
                      value={row.handlungsbedarf}
                      saveToDb={saveToDb}
                      error={fieldErrors.handlungsbedarf}
                    />
                    <RadioButtonGroup
                      name="idealbiotopUebereinstimmung"
                      label="Übereinstimmung mit Idealbiotop"
                      dataSource={
                        data?.allTpopkontrIdbiotuebereinstWertes?.nodes ?? []
                      }
                      loading={loading}
                      value={row.idealbiotopUebereinstimmung}
                      saveToDb={saveToDb}
                      error={fieldErrors.idealbiotopUebereinstimmung}
                    />
                  </FormContainer>
                </SimpleBar>
              )}
              {tab === 'dateien' && !showFilter && (
                <Files parentId={row.id} parent="tpopkontr" />
              )}
            </TabContent>
          </div>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Tpopfeldkontr)
