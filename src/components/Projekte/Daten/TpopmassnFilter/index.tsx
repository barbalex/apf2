import { useState, useEffect, type ChangeEvent } from 'react'
import { useApolloClient } from '@apollo/client/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue, useSetAtom } from 'jotai'

import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.tsx'
import { TextField } from '../../../shared/TextField.tsx'
import { Select } from '../../../shared/Select.tsx'
import { SelectLoadingOptionsTypable } from '../../../shared/SelectLoadingOptionsTypable.tsx'
import { Checkbox2States } from '../../../shared/Checkbox2States.tsx'
import { DateField } from '../../../shared/Date.tsx'

import { FilterTitle } from '../../../shared/FilterTitle.tsx'
import { query } from './query.ts'
import { queryAeTaxonomies } from './queryAeTaxonomies.ts'
import {
  treeNodeLabelFilterAtom,
  treeMapFilterAtom,
  treeApFilterAtom,
  treeDataFilterAtom,
  treeDataFilterSetValueAtom,
  treeArtIsFilteredAtom,
  treePopIsFilteredAtom,
  treeTpopIsFilteredAtom,
  treeTpopmassnGqlFilterAtom,
} from '../../../../store/index.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { Tabs } from './Tabs.tsx'

import type { AdresseId } from '../../../../models/apflora/AdresseId.ts'
import type { TpopmassnTypWerteCode } from '../../../../models/apflora/TpopmassnTypWerteCode.ts'
import type { TpopkontrzaehlEinheitWerteCode } from '../../../../models/apflora/TpopkontrzaehlEinheitWerteCode.ts'

interface TpopmassnsFilterQueryResult {
  allTpopmassns: {
    totalCount: number
  }
  tpopmassnsFiltered: {
    totalCount: number
  }
  allAdresses: {
    nodes: Array<{
      id: string
      value: AdresseId
      label: string
    }>
  }
  allTpopmassnTypWertes: {
    nodes: Array<{
      id: string
      value: TpopmassnTypWerteCode
      label: string
      anpflanzung: boolean | null
    }>
  }
  allTpopkontrzaehlEinheitWertes: {
    nodes: Array<{
      id: string
      value: TpopkontrzaehlEinheitWerteCode
      label: string
    }>
  }
}

import styles from './index.module.css'

export const TpopmassnFilter = () => {
  const { apId } = useParams()

  const tpopmassnGqlFilter = useAtomValue(treeTpopmassnGqlFilterAtom)
  const nodeLabelFilter = useAtomValue(treeNodeLabelFilterAtom)
  const mapFilter = useAtomValue(treeMapFilterAtom)
  const apFilter = useAtomValue(treeApFilterAtom)
  const dataFilter = useAtomValue(treeDataFilterAtom)
  const setDataFilterValue = useSetAtom(treeDataFilterSetValueAtom)
  const artIsFiltered = useAtomValue(treeArtIsFilteredAtom)
  const popIsFiltered = useAtomValue(treePopIsFilteredAtom)
  const tpopIsFiltered = useAtomValue(treeTpopIsFilteredAtom)

  const [activeTab, setActiveTab] = useState(0)
  useEffect(() => {
    if (dataFilter.tpopmassn.length - 1 < activeTab) {
      // filter was emptied, need to set correct tab
      setActiveTab(0)
    }
  }, [activeTab, dataFilter.tpopmassn.length])

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()
  const { data } = useQuery({
    queryKey: [
      'tpopmassnFilter',
      tpopmassnGqlFilter.filtered,
      tpopmassnGqlFilter.all,
    ],
    queryFn: async () => {
      const result = await apolloClient.query<TpopmassnsFilterQueryResult>({
        query,
        variables: {
          filteredFilter: tpopmassnGqlFilter.filtered,
          allFilter: tpopmassnGqlFilter.all,
        },
      })
      if (result.error) throw result.error
      return result.data
    },
    staleTime: Infinity,
    gcTime: Infinity,
  })

  const row = dataFilter.tpopmassn[activeTab]

  const isAnpflanzung = data?.allTpopmassnTypWertes?.nodes?.find(
    (n) => n.value === row?.typ,
  )?.anpflanzung

  const saveToDb = (event: ChangeEvent<HTMLInputElement>) => {
    setDataFilterValue({
      table: 'tpopmassn',
      key: event.target.name,
      value: ifIsNumericAsNumber(event.target.value),
      index: activeTab,
    })
    tsQueryClient.invalidateQueries({
      queryKey: [
        'tpopmassnFilter',
        tpopmassnGqlFilter.filtered,
        tpopmassnGqlFilter.all,
      ],
    })
  }

  const navApFilterComment =
    apFilter ?
      `Navigationsbaum, "nur AP"-Filter: Nur Massnahmen von AP-Arten werden berücksichtigt.`
    : undefined
  const navHiearchyComment =
    // tpopId ? 'Navigationsbaum, Hierarchie-Filter: Im Navigationsbaum ist eine Teil-Population gewählt. Es werden nur ihre Massnahmen berücksichtigt.'
    // : popId
    // ? 'Navigationsbaum, Hierarchie-Filter: Im Navigationsbaum ist eine Population gewählt. Es werden nur ihre Massnahmen berücksichtigt.' :
    apId ?
      'Navigationsbaum, Hierarchie-Filter: Im Navigationsbaum ist eine Art gewählt. Es werden nur ihre Massnahmen berücksichtigt.'
    : undefined
  const navLabelComment =
    nodeLabelFilter.tpopmassn ?
      `Navigationsbaum, Label-Filter: Das Label der Massnahmen wird nach "${nodeLabelFilter.tpopmassn}" gefiltert.`
    : undefined
  const artHierarchyComment =
    artIsFiltered ?
      'Formular-Filter, Ebene Art: Es werden nur Massnahmen berücksichtigt, deren Art die Bedingungen des gesetzten Filters erfüllt.'
    : undefined
  const popHierarchyComment =
    popIsFiltered ?
      'Formular-Filter, Ebene Population: Es werden nur Massnahmen berücksichtigt, deren Population die Bedingungen des gesetzten Filters erfüllt.'
    : undefined
  const tpopHierarchyComment =
    tpopIsFiltered ?
      'Formular-Filter, Ebene Teil-Population: Es werden nur Massnahmen berücksichtigt, deren Teil-Population die Bedingungen des gesetzten Filters erfüllt.'
    : undefined
  const mapFilterComment =
    mapFilter ?
      'Karten-Filter: Nur Massnahmen von Teil-Populationen innerhalb des Karten-Filters werden berücksichtigt.'
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
          title="Massnahmen"
          table="tpopmassn"
          totalNr={data?.allTpopmassns?.totalCount ?? '...'}
          filteredNr={data?.tpopmassnsFiltered?.totalCount ?? '...'}
          activeTab={activeTab}
        />
        {showFilterComments && (
          <>
            <div className={styles.commentTitle}>Zusätzlich aktive Filter:</div>
            <ul>
              {!!navApFilterComment && (
                <li className={styles.comment}>{navApFilterComment}</li>
              )}
              {!!navHiearchyComment && (
                <li className={styles.comment}>{navHiearchyComment}</li>
              )}
              {!!navLabelComment && (
                <li className={styles.comment}>{navLabelComment}</li>
              )}
              {!!artHierarchyComment && (
                <li className={styles.comment}>{artHierarchyComment}</li>
              )}
              {!!popHierarchyComment && (
                <li className={styles.comment}>{popHierarchyComment}</li>
              )}
              {!!tpopHierarchyComment && (
                <li className={styles.comment}>{tpopHierarchyComment}</li>
              )}
              {!!mapFilterComment && (
                <li className={styles.comment}>{mapFilterComment}</li>
              )}
            </ul>
          </>
        )}
        <Tabs
          dataFilter={dataFilter.tpopmassn}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <div className={styles.scrollContainer}>
          <div className={styles.columnContainer}>
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
              label="Typ"
              dataSource={data?.allTpopmassnTypWertes?.nodes ?? []}
              value={row?.typ}
              saveToDb={saveToDb}
            />
            <TextField
              name="beschreibung"
              label="Massnahme"
              type="text"
              value={row?.beschreibung}
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
            <TextField
              name="bemerkungen"
              label="Bemerkungen"
              type="text"
              multiLine
              value={row?.bemerkungen}
              saveToDb={saveToDb}
            />
            <Checkbox2States
              name="planVorhanden"
              label="Plan vorhanden"
              value={row?.planVorhanden}
              saveToDb={saveToDb}
            />
            <TextField
              name="planBezeichnung"
              label="Plan Bezeichnung"
              type="text"
              value={row?.planBezeichnung}
              saveToDb={saveToDb}
            />
            <TextField
              name="flaeche"
              label="Fläche (m2)"
              type="number"
              value={row?.flaeche}
              saveToDb={saveToDb}
            />
            <TextField
              name="form"
              label="Form der Ansiedlung"
              type="text"
              value={row?.form}
              saveToDb={saveToDb}
            />
            <TextField
              name="pflanzanordnung"
              label="Pflanzanordnung"
              type="text"
              value={row?.pflanzanordnung}
              saveToDb={saveToDb}
            />
            <TextField
              name="markierung"
              label="Markierung"
              type="text"
              value={row?.markierung}
              saveToDb={saveToDb}
            />
            <TextField
              name="anzTriebe"
              label="Anzahl Triebe"
              type="number"
              value={row?.anzTriebe}
              saveToDb={saveToDb}
            />
            <TextField
              name="anzPflanzen"
              label="Anzahl Pflanzen"
              type="number"
              value={row?.anzPflanzen}
              saveToDb={saveToDb}
            />
            <TextField
              name="anzPflanzstellen"
              label="Anzahl Pflanzstellen"
              type="number"
              value={row?.anzPflanzstellen}
              saveToDb={saveToDb}
            />
            {isAnpflanzung && (
              <>
                <Select
                  key={`${row?.id}zieleinheitEinheit`}
                  name="zieleinheitEinheit"
                  label="Ziel-Einheit: Einheit (wird automatisch gesetzt)"
                  options={data?.allTpopkontrzaehlEinheitWertes?.nodes ?? []}
                  value={row?.zieleinheitEinheit}
                  saveToDb={saveToDb}
                />
                <TextField
                  name="zieleinheitAnzahl"
                  label="Ziel-Einheit: Anzahl (nur ganze Zahlen)"
                  type="number"
                  value={row?.zieleinheitAnzahl}
                  saveToDb={saveToDb}
                />
              </>
            )}
            <SelectLoadingOptionsTypable
              key={`${row?.id}wirtspflanze`}
              field="wirtspflanze"
              label="Wirtspflanze"
              query={queryAeTaxonomies}
              queryNodesName="allAeTaxonomies"
              value={row?.wirtspflanze}
              saveToDb={saveToDb}
              row={row}
            />
            <TextField
              name="herkunftPop"
              label="Herkunftspopulation"
              type="text"
              value={row?.herkunftPop}
              saveToDb={saveToDb}
            />
            <TextField
              name="sammeldatum"
              label="Sammeldatum"
              type="text"
              value={row?.sammeldatum}
              saveToDb={saveToDb}
            />
            <TextField
              name="vonAnzahlIndividuen"
              label="Anzahl besammelte Individuen der Herkunftspopulation"
              type="number"
              value={row?.vonAnzahlIndividuen}
              saveToDb={saveToDb}
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
