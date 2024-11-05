import { useState, useCallback, useContext, useEffect } from 'react'
import MuiTabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'
import SimpleBar from 'simplebar-react'
import { useParams } from 'react-router-dom'

import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.jsx'
import { TextField } from '../../../shared/TextField.jsx'
import { MarkdownField } from '../../../shared/MarkdownField/index.jsx'
import { Select } from '../../../shared/Select.jsx'
import { JesNo } from '../../../shared/JesNo.jsx'
import { RadioButtonGroupWithInfo } from '../../../shared/RadioButtonGroupWithInfo.jsx'
import { DateField } from '../../../shared/Date.jsx'
import { FilterTitle } from '../../../shared/FilterTitle.jsx'
import { TpopfeldkontrentwicklungPopover } from '../TpopfeldkontrentwicklungPopover.jsx'
import { constants } from '../../../../modules/constants.js'
import { query } from './query.js'
import { queryTpopkontrs } from './queryTpopkontrs.js'
import { StoreContext } from '../../../../storeContext.js'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../shared/Error.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Tabs } from './Tabs.jsx'
import { useSearchParamsState } from '../../../../modules/useSearchParamsState.js'

const Container = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #ffd3a7;
`
const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  > div:first-of-type {
    > div:first-of-type {
      display: block !important;
    }
  }
`
const FormContainer = styled.div`
  padding: 10px;
  height: 100%;
  column-width: ${constants.columnWidth}px;
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
const FilterCommentTitle = styled.div`
  margin-top: -10px;
  margin-bottom: -10px;
  padding: 0 10px;
  font-size: 0.75em;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.87);
`
const FilterCommentList = styled.ul``
const FilterComment = styled.li`
  padding: 0 10px;
  font-size: 0.75em;
`
const simplebarStyle = { maxHeight: '100%', height: '100%' }

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

export const TpopfeldkontrFilter = observer(() => {
  const { apId } = useParams()

  const store = useContext(StoreContext)
  const {
    dataFilter,
    ekGqlFilter,
    nodeLabelFilter,
    mapFilter,
    apFilter,
    artIsFiltered,
    popIsFiltered,
    tpopIsFiltered,
    dataFilterSetValue,
  } = store.tree

  const [activeTab, setActiveTab] = useState(0)
  useEffect(() => {
    if (dataFilter.tpopfeldkontr.length - 1 < activeTab) {
      // filter was emptied, need to set correct tab
      setActiveTab(0)
    }
  }, [activeTab, dataFilter.tpopfeldkontr.length])

  const row = dataFilter.tpopfeldkontr[activeTab]

  const { data, loading, error } = useQuery(query)
  const { data: dataTpopkontrs } = useQuery(queryTpopkontrs, {
    variables: {
      filteredFilter: ekGqlFilter.filtered,
      allFilter: ekGqlFilter.all,
    },
  })

  const [tab, setTab] = useSearchParamsState('feldkontrTab', 'entwicklung')
  const onChangeTab = useCallback((event, value) => setTab(value), [setTab])

  const saveToDb = useCallback(
    async (event) =>
      dataFilterSetValue({
        table: 'tpopfeldkontr',
        key: event.target.name,
        value: ifIsNumericAsNumber(event.target.value),
        index: activeTab,
      }),
    [activeTab, dataFilterSetValue],
  )

  const aeLrWerte = (data?.allAeLrDelarzes?.nodes ?? [])
    .map(
      (e) => `${e.label}: ${e.einheit ? e.einheit.replace(/  +/g, ' ') : ''}`,
    )
    .map((o) => ({ value: o, label: o }))

  const navApFilterComment =
    apFilter ?
      `Navigationsbaum, "nur AP"-Filter: Nur Feld-Kontrollen von AP-Arten werden berücksichtigt.`
    : undefined
  const navHiearchyComment =
    // tpopId ? 'Navigationsbaum, Hierarchie-Filter: Im Navigationsbaum ist eine Teil-Population gewählt. Es werden nur ihre Feld-Kontrollen berücksichtigt.'
    // : popId
    // ? 'Navigationsbaum, Hierarchie-Filter: Im Navigationsbaum ist eine Population gewählt. Es werden nur ihre Feld-Kontrollen berücksichtigt.' :
    apId ?
      'Navigationsbaum, Hierarchie-Filter: Im Navigationsbaum ist eine Art gewählt. Es werden nur ihre Feld-Kontrollen berücksichtigt.'
    : undefined
  const navLabelComment =
    nodeLabelFilter.tpopfeldkontr ?
      `Navigationsbaum, Label-Filter: Das Label der Feld-Kontrollen wird nach "${nodeLabelFilter.tpopfeldkontr}" gefiltert.`
    : undefined
  const artHierarchyComment =
    artIsFiltered ?
      'Formular-Filter, Ebene Art: Es werden nur Feld-Kontrollen berücksichtigt, deren Art die Bedingungen des gesetzten Filters erfüllt.'
    : undefined
  const popHierarchyComment =
    popIsFiltered ?
      'Formular-Filter, Ebene Population: Es werden nur Feld-Kontrollen berücksichtigt, deren Population die Bedingungen des gesetzten Filters erfüllt.'
    : undefined
  const tpopHierarchyComment =
    tpopIsFiltered ?
      'Formular-Filter, Ebene Teil-Population: Es werden nur Feld-Kontrollen berücksichtigt, deren Teil-Population die Bedingungen des gesetzten Filters erfüllt.'
    : undefined
  const mapFilterComment =
    mapFilter ?
      'Karten-Filter: Nur Feld-Kontrollen von Teil-Populationen innerhalb des Karten-Filters werden berücksichtigt.'
    : undefined

  const showFilterComments =
    !!navApFilterComment ||
    !!navHiearchyComment ||
    !!navLabelComment ||
    !!artHierarchyComment ||
    !!popHierarchyComment ||
    !!tpopHierarchyComment ||
    !!mapFilter

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Container>
        <FilterTitle
          title="Feld-Kontrollen"
          table="tpopfeldkontr"
          totalNr={dataTpopkontrs?.allTpopkontrs?.totalCount ?? '...'}
          filteredNr={dataTpopkontrs?.tpopkontrsFiltered?.totalCount ?? '...'}
          activeTab={activeTab}
        />
        {showFilterComments && (
          <>
            <FilterCommentTitle>Zusätzlich aktive Filter:</FilterCommentTitle>
            <FilterCommentList>
              {!!navApFilterComment && (
                <FilterComment>{navApFilterComment}</FilterComment>
              )}
              {!!navHiearchyComment && (
                <FilterComment>{navHiearchyComment}</FilterComment>
              )}
              {!!navLabelComment && (
                <FilterComment>{navLabelComment}</FilterComment>
              )}
              {!!artHierarchyComment && (
                <FilterComment>{artHierarchyComment}</FilterComment>
              )}
              {!!popHierarchyComment && (
                <FilterComment>{popHierarchyComment}</FilterComment>
              )}
              {!!tpopHierarchyComment && (
                <FilterComment>{tpopHierarchyComment}</FilterComment>
              )}
              {!!mapFilterComment && (
                <FilterComment>{mapFilterComment}</FilterComment>
              )}
            </FilterCommentList>
          </>
        )}
        <Tabs
          dataFilter={dataFilter.tpopfeldkontr}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <FieldsContainer>
          <MuiTabs
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
            <StyledTab
              label="Biotop"
              value="biotop"
              data-id="biotop"
            />
          </MuiTabs>
          <div style={{ overflowY: 'auto' }}>
            <TabContent>
              {tab === 'entwicklung' && (
                <SimpleBar
                  style={simplebarStyle}
                  tabIndex={-1}
                >
                  <FormContainer>
                    <TextField
                      name="jahr"
                      label="Jahr"
                      type="number"
                      value={row?.jahr}
                      saveToDb={saveToDb}
                    />
                    <DateField
                      name="datum"
                      label="Datum"
                      value={row?.datum}
                      saveToDb={saveToDb}
                    />
                    <RadioButtonGroup
                      name="typ"
                      label="Kontrolltyp"
                      dataSource={tpopkontrTypWerte}
                      value={row?.typ}
                      saveToDb={saveToDb}
                    />
                    <Select
                      name="bearbeiter"
                      label="BearbeiterIn"
                      options={data?.allAdresses?.nodes ?? []}
                      loading={loading}
                      value={row?.bearbeiter}
                      saveToDb={saveToDb}
                    />
                    <JesNo
                      name="jungpflanzenVorhanden"
                      label="Jungpflanzen vorhanden"
                      value={row?.jungpflanzenVorhanden}
                      saveToDb={saveToDb}
                    />
                    <TextField
                      name="vitalitaet"
                      label="Vitalität"
                      type="text"
                      value={row?.vitalitaet}
                      saveToDb={saveToDb}
                    />
                    <TextField
                      name="ueberlebensrate"
                      label="Überlebensrate (in Prozent)"
                      type="number"
                      value={row?.ueberlebensrate}
                      saveToDb={saveToDb}
                    />
                    <RadioButtonGroupWithInfo
                      name="entwicklung"
                      label="Entwicklung"
                      dataSource={data?.allTpopEntwicklungWertes?.nodes ?? []}
                      loading={loading}
                      popover={TpopfeldkontrentwicklungPopover}
                      value={row?.entwicklung}
                      saveToDb={saveToDb}
                    />
                    <TextField
                      name="ursachen"
                      label="Ursachen"
                      hintText="Standort: ..., Klima: ..., anderes: ..."
                      type="text"
                      multiLine
                      value={row?.ursachen}
                      saveToDb={saveToDb}
                    />
                    <TextField
                      name="gefaehrdung"
                      label="Gefährdung"
                      type="text"
                      multiLine
                      value={row?.gefaehrdung}
                      saveToDb={saveToDb}
                    />
                    <TextField
                      name="erfolgsbeurteilung"
                      label="Erfolgsbeurteilung"
                      type="text"
                      multiLine
                      value={row?.erfolgsbeurteilung}
                      saveToDb={saveToDb}
                    />
                    <TextField
                      name="umsetzungAendern"
                      label="Änderungs-Vorschläge Umsetzung"
                      type="text"
                      multiLine
                      value={row?.umsetzungAendern}
                      saveToDb={saveToDb}
                    />
                    <TextField
                      name="kontrolleAendern"
                      label="Änderungs-Vorschläge Kontrolle"
                      type="text"
                      multiLine
                      value={row?.kontrolleAendern}
                      saveToDb={saveToDb}
                    />
                    <MarkdownField
                      name="bemerkungen"
                      label="Bemerkungen"
                      value={row?.bemerkungen}
                      saveToDb={saveToDb}
                    />
                    <JesNo
                      name="apberNichtRelevant"
                      label="Im Jahresbericht nicht berücksichtigen"
                      value={row?.apberNichtRelevant}
                      saveToDb={saveToDb}
                    />
                    <TextField
                      name="apberNichtRelevantGrund"
                      label="Wieso im Jahresbericht nicht berücksichtigen?"
                      type="text"
                      multiLine
                      value={row?.apberNichtRelevantGrund}
                      saveToDb={saveToDb}
                    />
                  </FormContainer>
                </SimpleBar>
              )}
              {tab === 'biotop' && (
                <SimpleBar
                  style={simplebarStyle}
                  tabIndex={-1}
                >
                  <FormContainer>
                    <TextField
                      name="flaeche"
                      label="Fläche"
                      type="number"
                      value={row?.flaeche}
                      saveToDb={saveToDb}
                    />
                    <Section>Vegetation</Section>
                    <Select
                      data-id="lrDelarze"
                      name="lrDelarze"
                      label="Lebensraum nach Delarze"
                      options={aeLrWerte}
                      loading={loading}
                      value={row?.lrDelarze}
                      saveToDb={saveToDb}
                    />
                    <Select
                      name="lrUmgebungDelarze"
                      label="Umgebung nach Delarze"
                      options={aeLrWerte}
                      loading={loading}
                      value={row?.lrUmgebungDelarze}
                      saveToDb={saveToDb}
                    />
                    <TextField
                      name="vegetationstyp"
                      label="Vegetationstyp"
                      type="text"
                      value={row?.vegetationstyp}
                      saveToDb={saveToDb}
                    />
                    <TextField
                      name="konkurrenz"
                      label="Konkurrenz"
                      type="text"
                      value={row?.konkurrenz}
                      saveToDb={saveToDb}
                    />
                    <TextField
                      name="moosschicht"
                      label="Moosschicht"
                      type="text"
                      value={row?.moosschicht}
                      saveToDb={saveToDb}
                    />
                    <TextField
                      name="krautschicht"
                      label="Krautschicht"
                      type="text"
                      value={row?.krautschicht}
                      saveToDb={saveToDb}
                    />
                    <TextField
                      name="strauchschicht"
                      label="Strauchschicht"
                      type="text"
                      value={row?.strauchschicht}
                      saveToDb={saveToDb}
                    />
                    <TextField
                      name="baumschicht"
                      label="Baumschicht"
                      type="text"
                      value={row?.baumschicht}
                      saveToDb={saveToDb}
                    />
                    <Section>Beurteilung</Section>
                    <TextField
                      name="handlungsbedarf"
                      label="Handlungsbedarf"
                      type="text"
                      multiline
                      value={row?.handlungsbedarf}
                      saveToDb={saveToDb}
                    />
                    <RadioButtonGroup
                      name="idealbiotopUebereinstimmung"
                      label="Übereinstimmung mit Idealbiotop"
                      dataSource={
                        data?.allTpopkontrIdbiotuebereinstWertes?.nodes ?? []
                      }
                      loading={loading}
                      value={row?.idealbiotopUebereinstimmung}
                      saveToDb={saveToDb}
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
})
