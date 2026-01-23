import { useState, useEffect, type ChangeEvent } from 'react'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue, useSetAtom } from 'jotai'

import { TextField } from '../../../shared/TextField.tsx'
import { TextFieldWithInfo } from '../../../shared/TextFieldWithInfo.tsx'
import { Status } from '../../../shared/Status.tsx'
import { Checkbox2States } from '../../../shared/Checkbox2States.tsx'
import { FilterTitle } from '../../../shared/FilterTitle.tsx'
import { query } from './query.ts'
import {
  treeNodeLabelFilterAtom,
  treeMapFilterAtom,
  treeApFilterAtom,
  treeDataFilterAtom,
  treeDataFilterSetValueAtom,
  treeArtIsFilteredAtom,
  treePopGqlFilterAtom,
} from '../../../../store/index.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { PopOrTabs } from './PopOrTabs.tsx'

import styles from './index.module.css'

interface PopFilterQueryResult {
  pops?: {
    totalCount: number
  }
  popsFiltered?: {
    totalCount: number
  }
}

export const PopFilter = () => {
  const { apId } = useParams()

  const apolloClient = useApolloClient()

  const popGqlFilter = useAtomValue(treePopGqlFilterAtom)
  const nodeLabelFilter = useAtomValue(treeNodeLabelFilterAtom)
  const mapFilter = useAtomValue(treeMapFilterAtom)
  const apFilter = useAtomValue(treeApFilterAtom)
  const dataFilter = useAtomValue(treeDataFilterAtom)
  const setDataFilterValue = useSetAtom(treeDataFilterSetValueAtom)
  const artIsFiltered = useAtomValue(treeArtIsFilteredAtom)

  // somehow to live updates without this
  const dataFilterPop = dataFilter.pop

  const [activeTab, setActiveTab] = useState(0)
  useEffect(() => {
    if (dataFilterPop.length - 1 < activeTab) {
      // filter was emptied, need to set correct tab
      setActiveTab(0)
    }
  }, [activeTab, dataFilterPop.length])

  const { data: dataPops } = useQuery({
    queryKey: ['popFilter', popGqlFilter.filtered, popGqlFilter.all],
    queryFn: async () => {
      const result = await apolloClient.query<PopFilterQueryResult>({
        query,
        variables: {
          filteredFilter: popGqlFilter.filtered,
          allFilter: popGqlFilter.all,
        },
      })
      if (result.error) throw result.error
      return result.data
    },
  })

  const row = dataFilterPop[activeTab]

  const saveToDb = async (event: ChangeEvent<HTMLInputElement>) =>
    setDataFilterValue({
      table: 'pop',
      key: event.target.name,
      value: ifIsNumericAsNumber(event.target.value),
      index: activeTab,
    })

  const navApFilterComment =
    apFilter ?
      `Navigationsbaum, "nur AP"-Filter: Nur Populationen von AP-Arten werden berücksichtigt.`
    : undefined
  const navHiearchyComment =
    apId ?
      'Navigationsbaum, Hierarchie-Filter: Im Navigationsbaum ist eine Art gewählt. Es werden nur ihre Populationen berücksichtigt.'
    : undefined
  const navLabelComment =
    nodeLabelFilter.pop ?
      `Navigationsbaum, Label-Filter: Das Label der Populationen wird nach "${nodeLabelFilter.pop}" gefiltert.`
    : undefined
  const hierarchyComment =
    artIsFiltered ?
      'Formular-Filter, Ebene Art: Es werden nur Populationen berücksichtigt, deren Art die Bedingungen des gesetzten Filters erfüllt.'
    : undefined
  const mapFilterComment =
    mapFilter ? 'Karten-Filter: wird angewendet.' : undefined

  const showFilterComments =
    !!navApFilterComment ||
    !!navHiearchyComment ||
    !!navLabelComment ||
    !!hierarchyComment ||
    !!mapFilter

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FilterTitle
          title="Population"
          table="pop"
          totalNr={dataPops?.pops?.totalCount ?? '...'}
          filteredNr={dataPops?.popsFiltered?.totalCount ?? '...'}
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
              {!!hierarchyComment && (
                <li className={styles.filterComment}>{hierarchyComment}</li>
              )}
              {!!mapFilterComment && (
                <li className={styles.filterComment}>{mapFilterComment}</li>
              )}
            </ul>
          </>
        )}
        <PopOrTabs
          dataFilter={dataFilterPop}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <div className={styles.formContainer}>
          <TextField
            label="Nr."
            name="nr"
            type="number"
            value={row?.nr}
            saveToDb={saveToDb}
          />
          <TextFieldWithInfo
            label="Name"
            name="name"
            type="text"
            popover="Dieses Feld möglichst immer ausfüllen"
            value={row?.name}
            saveToDb={saveToDb}
          />
          <Status
            apJahr={row?.apByApId?.startJahr}
            showFilter={true}
            saveToDb={saveToDb}
            row={row}
          />
          <Checkbox2States
            label="Status unklar"
            name="statusUnklar"
            value={row?.statusUnklar}
            saveToDb={saveToDb}
          />
          <TextField
            label="Begründung"
            name="statusUnklarBegruendung"
            type="text"
            multiLine
            value={row?.statusUnklarBegruendung}
            saveToDb={saveToDb}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}
