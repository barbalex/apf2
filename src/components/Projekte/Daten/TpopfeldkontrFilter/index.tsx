import { useState, useContext, useEffect } from 'react'
import MuiTabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { Form, useParams } from 'react-router'
import { useAtomValue, useSetAtom } from 'jotai'

import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.tsx'
import { TextField } from '../../../shared/TextField.tsx'
import { MarkdownField } from '../../../shared/MarkdownField/index.tsx'
import { Select } from '../../../shared/Select.tsx'
import { JesNo } from '../../../shared/JesNo.tsx'
import { RadioButtonGroupWithInfo } from '../../../shared/RadioButtonGroupWithInfo.tsx'
import { DateField } from '../../../shared/Date.tsx'
import { FilterTitle } from '../../../shared/FilterTitle.tsx'
import { TpopfeldkontrentwicklungPopover } from '../../../shared/TpopfeldkontrentwicklungPopover.tsx'
import { query } from './query.ts'
import { queryTpopkontrs } from './queryTpopkontrs.ts'
import {
  treeNodeLabelFilterAtom,
  treeMapFilterAtom,
  treeApFilterAtom,
  treeDataFilterAtom,
  treeDataFilterSetValueAtom,
  treeArtIsFilteredAtom,
  treePopIsFilteredAtom,
  treeTpopIsFilteredAtom,
  treeEkGqlFilterAtom,
} from '../../../../JotaiStore/index.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { Tabs } from './Tabs.tsx'
import { useSearchParamsState } from '../../../../modules/useSearchParamsState.ts'

import type {
  AdresseId,
  TpopEntwicklungWerteCode,
  TpopkontrIdbiotuebereinstWerteCode,
} from '../../../../generated/apflora/models.ts'

import styles from './index.module.css'

interface TpopfeldkontrFilterQueryResult {
  allTpopkontrIdbiotuebereinstWertes?: {
    nodes: {
      value: TpopkontrIdbiotuebereinstWerteCode
      label?: string | null
    }[]
  } | null
  allTpopEntwicklungWertes?: {
    nodes: {
      value: TpopEntwicklungWerteCode
      label?: string | null
    }[]
  } | null
  allAeLrDelarzes?: {
    nodes: {
      id: string
      label?: string | null
      einheit?: string | null
    }[]
  } | null
  allAdresses?: {
    nodes: {
      value: AdresseId
      label?: string | null
    }[]
  } | null
}

interface TpopkontrsCountQueryResult {
  allTpopkontrs?: {
    totalCount: number
  } | null
  tpopkontrsFiltered?: {
    totalCount: number
  } | null
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

export const TpopfeldkontrFilter = () => {
  const { apId } = useParams()

  const ekGqlFilter = useAtomValue(treeEkGqlFilterAtom)
  const dataFilter = useAtomValue(treeDataFilterAtom)
  const setDataFilterValue = useSetAtom(treeDataFilterSetValueAtom)
  const nodeLabelFilter = useAtomValue(treeNodeLabelFilterAtom)
  const mapFilter = useAtomValue(treeMapFilterAtom)
  const apFilter = useAtomValue(treeApFilterAtom)
  const artIsFiltered = useAtomValue(treeArtIsFilteredAtom)
  const popIsFiltered = useAtomValue(treePopIsFilteredAtom)
  const tpopIsFiltered = useAtomValue(treeTpopIsFilteredAtom)

  const [activeTab, setActiveTab] = useState(0)
  useEffect(() => {
    if (dataFilter.tpopfeldkontr.length - 1 < activeTab) {
      // filter was emptied, need to set correct tab
      setActiveTab(0)
    }
  }, [activeTab, dataFilter.tpopfeldkontr.length])

  const row = dataFilter.tpopfeldkontr[activeTab]

  const apolloClient = useApolloClient()

  const { data } = useQuery<TpopfeldkontrFilterQueryResult>({
    queryKey: ['tpopfeldkontrFilterData'],
    queryFn: async () => {
      const result = await apolloClient.query<TpopfeldkontrFilterQueryResult>({
        query,
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

  const { data: dataTpopkontrs } = useQuery<TpopkontrsCountQueryResult>({
    queryKey: ['tpopkontrsCount', ekGqlFilter.filtered, ekGqlFilter.all],
    queryFn: async () => {
      const result = await apolloClient.query<TpopkontrsCountQueryResult>({
        query: queryTpopkontrs,
        variables: {
          filteredFilter: ekGqlFilter.filtered,
          allFilter: ekGqlFilter.all,
        },
      })
      if (result.error) throw result.error
      return result.data
    },
  })

  const [tab, setTab] = useSearchParamsState('feldkontrTab', 'entwicklung')
  const onChangeTab = (event, value) => setTab(value)

  const saveToDb = async (event) =>
    setDataFilterValue({
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

  const navApFilterComment = apFilter
    ? `Navigationsbaum, "nur AP"-Filter: Nur Feld-Kontrollen von AP-Arten werden berücksichtigt.`
    : undefined
  const navHiearchyComment =
    // tpopId ? 'Navigationsbaum, Hierarchie-Filter: Im Navigationsbaum ist eine Teil-Population gewählt. Es werden nur ihre Feld-Kontrollen berücksichtigt.'
    // : popId
    // ? 'Navigationsbaum, Hierarchie-Filter: Im Navigationsbaum ist eine Population gewählt. Es werden nur ihre Feld-Kontrollen berücksichtigt.' :
    apId
      ? 'Navigationsbaum, Hierarchie-Filter: Im Navigationsbaum ist eine Art gewählt. Es werden nur ihre Feld-Kontrollen berücksichtigt.'
      : undefined
  const navLabelComment = nodeLabelFilter.tpopfeldkontr
    ? `Navigationsbaum, Label-Filter: Das Label der Feld-Kontrollen wird nach "${nodeLabelFilter.tpopfeldkontr}" gefiltert.`
    : undefined
  const artHierarchyComment = artIsFiltered
    ? 'Formular-Filter, Ebene Art: Es werden nur Feld-Kontrollen berücksichtigt, deren Art die Bedingungen des gesetzten Filters erfüllt.'
    : undefined
  const popHierarchyComment = popIsFiltered
    ? 'Formular-Filter, Ebene Population: Es werden nur Feld-Kontrollen berücksichtigt, deren Population die Bedingungen des gesetzten Filters erfüllt.'
    : undefined
  const tpopHierarchyComment = tpopIsFiltered
    ? 'Formular-Filter, Ebene Teil-Population: Es werden nur Feld-Kontrollen berücksichtigt, deren Teil-Population die Bedingungen des gesetzten Filters erfüllt.'
    : undefined
  const mapFilterComment = mapFilter
    ? 'Karten-Filter: Nur Feld-Kontrollen von Teil-Populationen innerhalb des Karten-Filters werden berücksichtigt.'
    : undefined

  const showFilterComments =
    !!navApFilterComment ||
    !!navHiearchyComment ||
    !!navLabelComment ||
    !!artHierarchyComment ||
    !!popHierarchyComment ||
    !!tpopHierarchyComment ||
    !!mapFilter

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FilterTitle
          title="Feld-Kontrollen"
          table="tpopfeldkontr"
          totalNr={dataTpopkontrs?.allTpopkontrs?.totalCount ?? '...'}
          filteredNr={dataTpopkontrs?.tpopkontrsFiltered?.totalCount ?? '...'}
          activeTab={activeTab}
        />
        {showFilterComments && (
          <>
            <div className={styles.filterCommentTitle}>
              Zusätzlich aktive Filter:
            </div>
            <ul>
              {!!navApFilterComment && (
                <li className={styles.filterComment}>{navApFilterComment}</li>
              )}
              {!!navHiearchyComment && (
                <li className={styles.filterComment}>{navHiearchyComment}</li>
              )}
              {!!navLabelComment && (
                <li className={styles.filterComment}>{navLabelComment}</li>
              )}
              {!!artHierarchyComment && (
                <li className={styles.filterComment}>{artHierarchyComment}</li>
              )}
              {!!popHierarchyComment && (
                <li className={styles.filterComment}>{popHierarchyComment}</li>
              )}
              {!!tpopHierarchyComment && (
                <li className={styles.filterComment}>{tpopHierarchyComment}</li>
              )}
              {!!mapFilterComment && (
                <li className={styles.filterComment}>{mapFilterComment}</li>
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
            className={styles.styledTab}
          />
          <Tab
            label="Biotop"
            value="biotop"
            data-id="biotop"
            className={styles.styledTab}
          />
        </MuiTabs>
        <div className={styles.formContainer}>
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
                key={`${row?.id}bearbeiter`}
                name="bearbeiter"
                label="BearbeiterIn"
                options={data?.allAdresses?.nodes ?? []}
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
              <div className={styles.section}>Vegetation</div>
              <Select
                key={`${row?.id}lrDelarze`}
                data-id="lrDelarze"
                name="lrDelarze"
                label="Lebensraum nach Delarze"
                options={aeLrWerte}
                value={row?.lrDelarze}
                saveToDb={saveToDb}
              />
              <Select
                key={`${row?.id}lrUmgebungDelarze`}
                name="lrUmgebungDelarze"
                label="Umgebung nach Delarze"
                options={aeLrWerte}
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
              <div className={styles.section}>Beurteilung</div>
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
                value={row?.idealbiotopUebereinstimmung}
                saveToDb={saveToDb}
              />
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}
