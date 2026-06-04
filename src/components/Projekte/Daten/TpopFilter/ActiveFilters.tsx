import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import {
  treeNodeLabelFilterAtom,
  treeMapFilterAtom,
  treeApFilterAtom,
  treeArtIsFilteredAtom,
  treePopIsFilteredAtom,
} from '../../../../store/index.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'

import styles from './ActiveFilters.module.css'

export const ActiveFilters = () => {
  const { apId } = useParams()

  const nodeLabelFilter = useAtomValue(treeNodeLabelFilterAtom)
  const mapFilter = useAtomValue(treeMapFilterAtom)
  const apFilter = useAtomValue(treeApFilterAtom)
  const artIsFiltered = useAtomValue(treeArtIsFilteredAtom)
  const popIsFiltered = useAtomValue(treePopIsFilteredAtom)

  const navApFilterComment = apFilter
    ? `Navigationsbaum, "nur AP"-Filter: Nur Teil-Populationen von AP-Arten werden berücksichtigt.`
    : undefined
  const navHiearchyComment =
    // popId ? 'Navigationsbaum, Hierarchie-Filter: Im Navigationsbaum ist eine Population gewählt. Es werden nur ihre Teil-Populationen berücksichtigt.' :
    apId
      ? 'Navigationsbaum, Hierarchie-Filter: Im Navigationsbaum ist eine Art gewählt. Es werden nur ihre Teil-Populationen berücksichtigt.'
      : undefined
  const navLabelComment = nodeLabelFilter.tpop
    ? `Navigationsbaum, Label-Filter: Das Label der Teil-Populationen wird nach "${nodeLabelFilter.tpop}" gefiltert.`
    : undefined
  const artHierarchyComment = artIsFiltered
    ? 'Formular-Filter, Ebene Art: Es werden nur Teil-Populationen berücksichtigt, deren Art die Bedingungen des gesetzten Filters erfüllt.'
    : undefined
  const popHierarchyComment = popIsFiltered
    ? 'Formular-Filter, Ebene Population: Es werden nur Teil-Populationen berücksichtigt, deren Population die Bedingungen des gesetzten Filters erfüllt.'
    : undefined
  const mapFilterComment = mapFilter
    ? 'Karten-Filter: wird angewendet.'
    : undefined

  const showFilterComments =
    !!navApFilterComment ||
    !!navHiearchyComment ||
    !!navLabelComment ||
    !!artHierarchyComment ||
    !!popHierarchyComment ||
    !!mapFilter

  if (!showFilterComments) return null

  return (
    <ErrorBoundary>
      <div className={styles.title}>Zusätzlich aktive Filter:</div>
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
        {!!mapFilterComment && (
          <li className={styles.comment}>{mapFilterComment}</li>
        )}
      </ul>
    </ErrorBoundary>
  )
}
