import { useState, useEffect, type ChangeEvent } from 'react'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue, useSetAtom } from 'jotai'

import { RadioButtonGroupWithInfo } from '../../../shared/RadioButtonGroupWithInfo.tsx'
import { TextField } from '../../../shared/TextField.tsx'
import { Select } from '../../../shared/Select.tsx'
import { SelectLoadingOptions } from '../../../shared/SelectLoadingOptions.tsx'
import { FilterTitle } from '../../../shared/FilterTitle.tsx'
import { queryAeTaxonomiesById } from './queryAeTaxonomiesById.ts'
import { queryLists } from './queryLists.ts'
import { queryAps } from './queryAps.ts'
import { queryAdresses } from './queryAdresses.ts'
import { queryAeTaxonomies } from './queryAeTaxonomies.ts'
import {
  treeNodeLabelFilterAtom,
  treeDataFilterAtom,
  treeDataFilterSetValueAtom,
  treeApFilterAtom,
  treeApGqlFilterAtom,
} from '../../../../JotaiStore/index.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { Tabs } from './Tabs.tsx'

import type { AdresseId } from '../../../../models/apflora/Adresse.ts'
import type { AeTaxonomiesId } from '../../../../models/apflora/AeTaxonomies.ts'
import type { ApBearbstandWerteCode } from '../../../../models/apflora/ApBearbstandWerte.ts'
import type { ApUmsetzungWerteCode } from '../../../../models/apflora/ApUmsetzungWerte.ts'

import styles from './index.module.css'

interface ApsQueryResult {
  allAps: {
    totalCount: number
  }
  filteredAps: {
    totalCount: number
  }
}

interface AdressesQueryResult {
  allAdresses: {
    nodes: Array<{
      value: AdresseId
      label: string
    }>
  }
}

interface ListsQueryResult {
  allApBearbstandWertes: {
    nodes: Array<{
      value: ApBearbstandWerteCode
      label: string
    }>
  }
  allApUmsetzungWertes: {
    nodes: Array<{
      value: ApUmsetzungWerteCode
      label: string
    }>
  }
}

interface AeTaxonomiesByIdQueryResult {
  aeTaxonomyById: {
    artname: string
  }
}

export const ApFilter = () => {
  const apolloClient = useApolloClient()

  const nurApFilter = useAtomValue(treeApFilterAtom)
  const apGqlFilter = useAtomValue(treeApGqlFilterAtom)
  const nodeLabelFilter = useAtomValue(treeNodeLabelFilterAtom)
  const dataFilter = useAtomValue(treeDataFilterAtom)
  const setDataFilterValue = useSetAtom(treeDataFilterSetValueAtom)

  const [activeTab, setActiveTab] = useState(0)
  useEffect(() => {
    if (dataFilter.ap.length - 1 < activeTab) {
      // filter was emptied, need to set correct tab
      setActiveTab(0)
    }
  }, [activeTab, dataFilter.ap.length])

  const { data: apsData } = useQuery({
    queryKey: ['aps', apGqlFilter.filtered, apGqlFilter.all],
    queryFn: async () => {
      const result = await apolloClient.query<ApsQueryResult>({
        query: queryAps,
        variables: {
          filteredFilter: apGqlFilter.filtered,
          allFilter: apGqlFilter.all,
        },
      })
      if (result.error) throw result.error
      return result
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const { data: dataAdresses } = useQuery({
    queryKey: ['adresses'],
    queryFn: async () => {
      const result = await apolloClient.query<AdressesQueryResult>({
        query: queryAdresses,
      })
      if (result.error) throw result.error
      return result
    },
    suspense: true,
    staleTime: Infinity, // This data rarely changes
  })

  const { data: dataLists } = useQuery({
    queryKey: ['apFilterLists'],
    queryFn: async () => {
      const result = await apolloClient.query<ListsQueryResult>({
        query: queryLists,
      })
      if (result.error) throw result.error
      return result
    },
    suspense: true,
    staleTime: Infinity, // This data rarely changes
  })

  const { data: dataAeTaxonomiesById } = useQuery({
    queryKey: ['aeTaxonomiesById', dataFilter.ap?.[activeTab]?.artId],
    queryFn: async () => {
      const result = await apolloClient.query<AeTaxonomiesByIdQueryResult>({
        query: queryAeTaxonomiesById,
        variables: {
          id: dataFilter.ap?.[activeTab]?.artId,
          run: !!dataFilter.ap?.[activeTab]?.artId,
        },
      })
      if (result.error) throw result.error
      return result
    },
    enabled: !!dataFilter.ap?.[activeTab]?.artId,
    staleTime: Infinity, // Keep data fresh until artId changes
  })

  const artname =
    !!dataFilter.ap?.[activeTab]?.artId ?
      (dataAeTaxonomiesById?.data?.aeTaxonomyById?.artname ?? '')
    : ''

  const row = dataFilter.ap[activeTab]

  const saveToDb = (event: ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name
    const value = ifIsNumericAsNumber(event.target.value)

    setDataFilterValue({
      table: 'ap',
      key: field,
      value,
      index: activeTab,
    })
  }

  const aeTaxonomiesFilter = (inputValue: string) => {
    let filter: any = { apByArtIdExists: true }
    if (inputValue) filter.artname = { includesInsensitive: inputValue }
    if (nurApFilter) filter.apByArtId = { bearbeitung: { in: [1, 2, 3] } }
    return filter
  }

  const navApFilterComment =
    nurApFilter ?
      `Navigationsbaum, "nur AP"-Filter: Nur AP-Arten werden berücksichtigt.`
    : undefined
  const navLabelComment =
    nodeLabelFilter.ap ?
      `Navigationsbaum, Label-Filter: Das Label der Art wird nach "${nodeLabelFilter.ap}" gefiltert.`
    : undefined

  const showFilterComments = !!navApFilterComment || !!navLabelComment

  if (!row) return null

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FilterTitle
          title="Art"
          table="ap"
          totalNr={apsData?.data?.allAps?.totalCount ?? '...'}
          filteredNr={apsData?.data?.filteredAps?.totalCount ?? '...'}
          // need to pass row even though not used
          // to ensure title re-renders an change of row
          row={row}
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
              {!!navLabelComment && (
                <li className={styles.filterComment}>{navLabelComment}</li>
              )}
            </ul>
          </>
        )}
        <Tabs
          dataFilter={dataFilter.ap}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <div className={styles.fieldsContainer}>
          <div className={styles.formContainer}>
            <SelectLoadingOptions
              key={`${row?.id}artId`}
              field="artId"
              valueLabelPath="aeTaxonomyByArtId.artname"
              label="Art (das namensgebende Taxon)"
              row={{
                ...row,
                ...{ aeTaxonomyByArtId: { artname } },
              }}
              query={queryAeTaxonomies}
              filter={aeTaxonomiesFilter}
              queryNodesName="allAeTaxonomies"
              value={row?.artId}
              saveToDb={saveToDb}
            />
            <RadioButtonGroupWithInfo
              key={`${row?.id}bearbeitung`}
              name="bearbeitung"
              dataSource={dataLists?.data?.allApBearbstandWertes?.nodes ?? []}
              popover={
                <div className={styles.popover}>
                  <div className={styles.title}>Legende</div>
                  <div className={styles.row}>
                    <div className={styles.columnLeft}>keiner:</div>
                    <div>kein Aktionsplan vorgesehen</div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.columnLeft}>erstellt:</div>
                    <div>Aktionsplan fertig, auf der Webseite der FNS</div>
                  </div>
                </div>
              }
              label="Aktionsplan"
              value={row?.bearbeitung}
              saveToDb={saveToDb}
            />
            <TextField
              name="startJahr"
              label="Start im Jahr"
              type="number"
              value={row?.startJahr}
              saveToDb={saveToDb}
            />
            <div className={styles.fieldContainer}>
              <RadioButtonGroupWithInfo
                key={`${row?.id}umsetzung`}
                name="umsetzung"
                dataSource={dataLists?.data?.allApUmsetzungWertes?.nodes ?? []}
                popover={
                  <div className={styles.popover}>
                    <div className={styles.title}>Legende</div>
                    <div className={styles.row}>
                      <div className={styles.columnLeft}>
                        noch keine
                        <br />
                        Umsetzung:
                      </div>
                      <div>noch keine Massnahmen ausgeführt</div>
                    </div>
                    <div className={styles.row}>
                      <div className={styles.columnLeft}>in Umsetzung:</div>
                      <div>
                        bereits Massnahmen ausgeführt (auch wenn AP noch nicht
                        erstellt)
                      </div>
                    </div>
                  </div>
                }
                label="Stand Umsetzung"
                value={row?.umsetzung}
                saveToDb={saveToDb}
              />
            </div>
            <Select
              key={`${row?.id}bearbeiter`}
              name="bearbeiter"
              label="Verantwortlich"
              options={dataAdresses?.data?.allAdresses?.nodes ?? []}
              value={row?.bearbeiter}
              saveToDb={saveToDb}
            />
            <TextField
              name="ekfBeobachtungszeitpunkt"
              label="Bester Beobachtungszeitpunkt für EKF (Freiwilligen-Kontrollen)"
              type="text"
              value={row?.ekfBeobachtungszeitpunkt}
              saveToDb={saveToDb}
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
