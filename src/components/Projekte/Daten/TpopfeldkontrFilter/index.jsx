import { useState, useContext, useEffect } from 'react'
import MuiTabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client/react'
import { Form, useParams } from 'react-router'

import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.jsx'
import { TextField } from '../../../shared/TextField.jsx'
import { MarkdownField } from '../../../shared/MarkdownField/index.jsx'
import { Select } from '../../../shared/Select.jsx'
import { JesNo } from '../../../shared/JesNo.jsx'
import { RadioButtonGroupWithInfo } from '../../../shared/RadioButtonGroupWithInfo.jsx'
import { DateField } from '../../../shared/Date.jsx'
import { FilterTitle } from '../../../shared/FilterTitle.jsx'
import { TpopfeldkontrentwicklungPopover } from '../../../shared/TpopfeldkontrentwicklungPopover.jsx'
import { query } from './query.js'
import { queryTpopkontrs } from './queryTpopkontrs.js'
import { MobxContext } from '../../../../mobxContext.js'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../shared/Error.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Tabs } from './Tabs.jsx'
import { useSearchParamsState } from '../../../../modules/useSearchParamsState.js'

import {
  container,
  formContainer,
  section,
  styledTab,
  filterCommentTitle,
  filterComment,
} from './index.module.css'

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

  const store = useContext(MobxContext)
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
  const onChangeTab = (event, value) => setTab(value)

  const saveToDb = async (event) =>
    dataFilterSetValue({
      table: 'tpopfeldkontr',
      key: event.target.name,
      value: ifIsNumericAsNumber(event.target.value),
      index: activeTab,
    })

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
      <div className={container}>
        <FilterTitle
          title="Feld-Kontrollen"
          table="tpopfeldkontr"
          totalNr={dataTpopkontrs?.allTpopkontrs?.totalCount ?? '...'}
          filteredNr={dataTpopkontrs?.tpopkontrsFiltered?.totalCount ?? '...'}
          activeTab={activeTab}
        />
        {showFilterComments && (
          <>
            <div className={filterCommentTitle}>Zusätzlich aktive Filter:</div>
            <ul>
              {!!navApFilterComment && (
                <li className={filterComment}>{navApFilterComment}</li>
              )}
              {!!navHiearchyComment && (
                <li className={filterComment}>{navHiearchyComment}</li>
              )}
              {!!navLabelComment && (
                <li className={filterComment}>{navLabelComment}</li>
              )}
              {!!artHierarchyComment && (
                <li className={filterComment}>{artHierarchyComment}</li>
              )}
              {!!popHierarchyComment && (
                <li className={filterComment}>{popHierarchyComment}</li>
              )}
              {!!tpopHierarchyComment && (
                <li className={filterComment}>{tpopHierarchyComment}</li>
              )}
              {!!mapFilterComment && (
                <li className={filterComment}>{mapFilterComment}</li>
              )}
            </ul>
          </>
        )}
        <Tabs
          dataFilter={dataFilter.tpopfeldkontr}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <MuiTabs
          value={tab}
          onChange={onChangeTab}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab
            label="Entwicklung"
            value="entwicklung"
            data-id="entwicklung"
            className={styledTab}
          />
          <Tab
            label="Biotop"
            value="biotop"
            data-id="biotop"
            className={styledTab}
          />
        </MuiTabs>
        <div className={formContainer}>
          {tab === 'entwicklung' && (
            <>
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
            </>
          )}
          {tab === 'biotop' && (
            <>
              <TextField
                name="flaeche"
                label="Fläche"
                type="number"
                value={row?.flaeche}
                saveToDb={saveToDb}
              />
              <div className={section}>Vegetation</div>
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
              <div className={section}>Beurteilung</div>
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
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
})
