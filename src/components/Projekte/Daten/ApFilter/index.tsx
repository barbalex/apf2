import type { SaveToDbEvent } from '../../../shared/types.ts'
import { useState, useEffect } from 'react'
import { useApolloClient } from '@apollo/client/react'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
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
} from '../../../../store/index.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { Tabs } from './Tabs.tsx'

import type { AdresseId } from '../../../../models/apflora/Adresse.ts'

import type { AeTaxonomyFilter } from '../../../../gql/graphql.ts'

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
    nodes: {
      value: AdresseId
      label: string
    }[]
  }
}

interface ListsQueryResult {
  allApBearbstandWertes: {
    nodes: {
      value: number
      label: string
    }[]
  }
  allApUmsetzungWertes: {
    nodes: {
      value: number
      label: string
    }[]
  }
}

interface AeTaxonomiesByIdQueryResult {
  aeTaxonomyById?: {
    artname: string | null
  } | undefined
}

interface ApFilterRow {
  id?: string | undefined
  artId: string | null
  bearbeitung: number | null
  startJahr: number | null
  umsetzung: number | null
  bearbeiter: string | null
  ekfBeobachtungszeitpunkt: string | null
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
      // errors are thrown above, so data is defined
      return result.data as ApsQueryResult
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const { data: dataAdresses } = useSuspenseQuery({
    queryKey: ['adresses'],
    queryFn: async () => {
      const result = await apolloClient.query<AdressesQueryResult>({
        query: queryAdresses,
      })
      if (result.error) throw result.error
      // errors are thrown above, so data is defined
      return result.data as AdressesQueryResult
    },
    staleTime: Infinity, // This data rarely changes
  })

  const { data: dataLists } = useSuspenseQuery({
    queryKey: ['apFilterLists'],
    queryFn: async () => {
      const result = await apolloClient.query<ListsQueryResult>({
        query: queryLists,
      })
      if (result.error) throw result.error
      // errors are thrown above, so data is defined
      return result.data as ListsQueryResult
    },
    staleTime: Infinity, // This data rarely changes
  })

  const { data: dataAeTaxonomiesById } = useQuery({
    queryKey: ['aeTaxonomiesById', dataFilter.ap?.[activeTab]?.artId],
    queryFn: async () => {
      const result = await apolloClient.query<AeTaxonomiesByIdQueryResult>({
        query: queryAeTaxonomiesById,
        variables: {
          id: dataFilter.ap?.[activeTab]?.artId ?? '',
          run: !!dataFilter.ap?.[activeTab]?.artId,
        },
      })
      if (result.error) throw result.error
      return result.data
    },
    enabled: !!dataFilter.ap?.[activeTab]?.artId,
    staleTime: Infinity, // Keep data fresh until artId changes
  })

  const artname =
    dataFilter.ap?.[activeTab]?.artId ?
      (dataAeTaxonomiesById?.aeTaxonomyById?.artname ?? '')
    : ''

  const row = dataFilter.ap[activeTab] as ApFilterRow | undefined

  const saveToDb = (event: SaveToDbEvent) => {
    const field = event.target.name ?? ''
    const value = ifIsNumericAsNumber(event.target.value)

    setDataFilterValue({
      table: 'ap',
      key: field,
      value,
      index: activeTab,
    })
  }

  const aeTaxonomiesFilter = (inputValue: string) => {
    const filter: AeTaxonomyFilter = { apByArtIdExists: true }
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
          totalNr={apsData?.allAps?.totalCount ?? '...'}
          filteredNr={apsData?.filteredAps?.totalCount ?? '...'}
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
              valueLabel={undefined}
              label="Art (das namensgebende Taxon)"
              labelSize={undefined}
              row={{
                ...row,
                ...{ aeTaxonomyByArtId: { artname } },
              }}
              query={queryAeTaxonomies}
              filter={aeTaxonomiesFilter}
              queryNodesName="allAeTaxonomies"
              saveToDb={saveToDb}
              error={undefined}
            />
            <RadioButtonGroupWithInfo
              key={`${row?.id}bearbeitung`}
              name="bearbeitung"
              dataSource={dataLists?.allApBearbstandWertes?.nodes ?? []}
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
              value={row?.bearbeitung as unknown as string}
              saveToDb={saveToDb}
              error={undefined}
            />
            <TextField
              name="startJahr"
              label="Start im Jahr"
              type="number"
              value={row?.startJahr}
              saveToDb={saveToDb}
              error={undefined}
            />
            <div className={styles.fieldContainer}>
              <RadioButtonGroupWithInfo
                key={`${row?.id}umsetzung`}
                name="umsetzung"
                dataSource={dataLists?.allApUmsetzungWertes?.nodes ?? []}
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
                value={row?.umsetzung as unknown as string}
                saveToDb={saveToDb}
                error={undefined}
              />
            </div>
            <Select
              key={`${row?.id}bearbeiter`}
              name="bearbeiter"
              label="Verantwortlich"
              options={dataAdresses?.allAdresses?.nodes ?? []}
              value={row?.bearbeiter}
              saveToDb={saveToDb}
            />
            <TextField
              name="ekfBeobachtungszeitpunkt"
              label="Bester Beobachtungszeitpunkt für EKF (Freiwilligen-Kontrollen)"
              type="text"
              value={row?.ekfBeobachtungszeitpunkt}
              saveToDb={saveToDb}
              error={undefined}
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
