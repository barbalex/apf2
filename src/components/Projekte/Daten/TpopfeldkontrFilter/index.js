import React, { useState, useCallback, useContext } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import styled from 'styled-components'
import flatten from 'lodash/flatten'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'
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
import TpopfeldkontrentwicklungPopover from '../TpopfeldkontrentwicklungPopover'
import constants from '../../../../modules/constants'
import query from './query'
import queryTpopkontrs from './queryTpopkontrs'
import setUrlQueryValue from '../../../../modules/setUrlQueryValue'
import storeContext from '../../../../storeContext'
import { simpleTypes as tpopfeldkontrType } from '../../../../store/Tree/DataFilter/tpopfeldkontr'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'
import Spinner from '../../../shared/Spinner'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #ffd3a7;
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

const TpopfeldkontrFilter = ({ treeName }) => {
  const store = useContext(storeContext)
  const { dataFilterSetValue, urlQuery, setUrlQuery } = store
  const { activeNodeArray, dataFilter, filterWidth } = store[treeName]

  const [fieldErrors, setFieldErrors] = useState({})

  const id = '99999999-9999-9999-9999-999999999999'
  const width = filterWidth
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
      allTpopkontrFilter,
      tpopkontrFilter,
      apId,
      apIdExists: !!apId,
      apIdNotExists: !apId,
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

  let totalNr
  let filteredNr
  const row = dataFilter.tpopfeldkontr
  if (apId) {
    const pops = dataTpopkontrs?.allPops?.nodes ?? []
    const tpops = flatten(pops.map((p) => p?.tpops?.nodes ?? []))
    totalNr = !tpops.length
      ? '...'
      : tpops
          .map((p) => p?.tpopkontrs?.totalCount)
          .reduce((acc = 0, val) => acc + val)
    filteredNr = !tpops.length
      ? '...'
      : tpops
          .map((p) => p?.tpopkontrsFiltered?.totalCount)
          .reduce((acc = 0, val) => acc + val)
  } else {
    totalNr = dataTpopkontrs?.allTpopkontrs?.totalCount ?? '...'
    filteredNr = dataTpopkontrs?.tpopkontrsFiltered?.totalCount ?? '...'
  }

  const saveToDb = useCallback(
    async (event) =>
      dataFilterSetValue({
        treeName,
        table: 'tpopfeldkontr',
        key: event.target.name,
        value: ifIsNumericAsNumber(event.target.value),
      }),
    [dataFilterSetValue, treeName],
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
      <Container>
        <FilterTitle
          title="Feld-Kontrollen"
          treeName={treeName}
          table="tpopfeldkontr"
          totalNr={totalNr}
          filteredNr={filteredNr}
        />
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
            </TabContent>
          </div>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(TpopfeldkontrFilter)
