import { useEffect, useState } from 'react'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import { query } from './query.ts'
import { FilterTitle } from '../../../shared/FilterTitle.tsx'
import { treeEkfGqlFilterAtom } from '../../../../store/index.ts'
import {
  treeNodeLabelFilterAtom,
  treeMapFilterAtom,
  treeApFilterAtom,
  treeDataFilterAtom,
  treeArtIsFilteredAtom,
  treePopIsFilteredAtom,
  treeTpopIsFilteredAtom,
} from '../../../../store/index.ts'
import { Form } from './Form/index.tsx'
import { Tabs } from './Tabs.tsx'

interface TpopkontrsQueryResult {
  allTpopkontrs: {
    totalCount: number
  }
  tpopkontrsFiltered: {
    totalCount: number
  }
}

import styles from './index.module.css'

export const TpopfreiwkontrFilter = () => {
  const { apId } = useParams()

  const ekfGqlFilter = useAtomValue(treeEkfGqlFilterAtom)
  const dataFilter = useAtomValue(treeDataFilterAtom)
  const nodeLabelFilter = useAtomValue(treeNodeLabelFilterAtom)
  const mapFilter = useAtomValue(treeMapFilterAtom)
  const apFilter = useAtomValue(treeApFilterAtom)
  const artIsFiltered = useAtomValue(treeArtIsFilteredAtom)
  const popIsFiltered = useAtomValue(treePopIsFilteredAtom)
  const tpopIsFiltered = useAtomValue(treeTpopIsFilteredAtom)

  const [activeTab, setActiveTab] = useState(0)
  useEffect(() => {
    if (dataFilter.tpopfreiwkontr.length - 1 < activeTab) {
      // filter was emptied, need to set correct tab
      setActiveTab(0)
    }
  }, [activeTab, dataFilter.tpopfreiwkontr.length])

  const row = dataFilter.tpopfreiwkontr[activeTab]

  const apolloClient = useApolloClient()

  const { data: dataTpopkontrs } = useQuery<TpopkontrsQueryResult>({
    queryKey: ['tpopfreiwkontrsCount', ekfGqlFilter.filtered, ekfGqlFilter.all],
    queryFn: async () => {
      const result = await apolloClient.query<TpopkontrsQueryResult>({
        query,
        variables: {
          filteredFilter: ekfGqlFilter.filtered,
          allFilter: ekfGqlFilter.all,
        },
      })
      if (result.error) throw result.error
      return result.data
    },
  })

  const navApFilterComment =
    apFilter ?
      `Navigationsbaum, "nur AP"-Filter: Nur Freiwilligen-Kontrollen von AP-Arten werden berücksichtigt.`
    : undefined
  const navHiearchyComment =
    // tpopId ? 'Navigationsbaum, Hierarchie-Filter: Im Navigationsbaum ist eine Teil-Population gewählt. Es werden nur ihre Freiwilligen-Kontrollen berücksichtigt.'
    // : popId
    // ? 'Navigationsbaum, Hierarchie-Filter: Im Navigationsbaum ist eine Population gewählt. Es werden nur ihre Freiwilligen-Kontrollen berücksichtigt.' :
    apId ?
      'Navigationsbaum, Hierarchie-Filter: Im Navigationsbaum ist eine Art gewählt. Es werden nur ihre Freiwilligen-Kontrollen berücksichtigt.'
    : undefined
  const navLabelComment =
    nodeLabelFilter.tpopfeldkontr ?
      `Navigationsbaum, Label-Filter: Das Label der Freiwilligen-Kontrollen wird nach "${nodeLabelFilter.tpopfeldkontr}" gefiltert.`
    : undefined
  const artHierarchyComment =
    artIsFiltered ?
      'Formular-Filter, Ebene Art: Es werden nur Freiwilligen-Kontrollen berücksichtigt, deren Art die Bedingungen des gesetzten Filters erfüllt.'
    : undefined
  const popHierarchyComment =
    popIsFiltered ?
      'Formular-Filter, Ebene Population: Es werden nur Freiwilligen-Kontrollen berücksichtigt, deren Population die Bedingungen des gesetzten Filters erfüllt.'
    : undefined
  const tpopHierarchyComment =
    tpopIsFiltered ?
      'Formular-Filter, Ebene Teil-Population: Es werden nur Freiwilligen-Kontrollen berücksichtigt, deren Teil-Population die Bedingungen des gesetzten Filters erfüllt.'
    : undefined
  const mapFilterComment =
    mapFilter ?
      'Karten-Filter: Nur Freiwilligen-Kontrollen von Teil-Populationen innerhalb des Karten-Filters werden berücksichtigt.'
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
    <div className={styles.container}>
      <FilterTitle
        title="Freiwilligen-Kontrollen"
        table="tpopfreiwkontr"
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
        dataFilter={dataFilter.tpopfreiwkontr}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className={styles.scrollContainer}>
        <Form
          row={row}
          activeTab={activeTab}
        />
      </div>
    </div>
  )
}
