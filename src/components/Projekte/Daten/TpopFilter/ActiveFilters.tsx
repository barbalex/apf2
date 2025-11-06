import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router'

import { MobxContext } from '../../../../mobxContext.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'

import { title, comment } from './ActiveFilters.module.css'

export const ActiveFilters = observer(() => {
  const { apId } = useParams()

  const store = useContext(MobxContext)

  const { nodeLabelFilter, mapFilter, apFilter, artIsFiltered, popIsFiltered } =
    store.tree

  const navApFilterComment =
    apFilter ?
      `Navigationsbaum, "nur AP"-Filter: Nur Teil-Populationen von AP-Arten werden berücksichtigt.`
    : undefined
  const navHiearchyComment =
    // popId ? 'Navigationsbaum, Hierarchie-Filter: Im Navigationsbaum ist eine Population gewählt. Es werden nur ihre Teil-Populationen berücksichtigt.' :
    apId ?
      'Navigationsbaum, Hierarchie-Filter: Im Navigationsbaum ist eine Art gewählt. Es werden nur ihre Teil-Populationen berücksichtigt.'
    : undefined
  const navLabelComment =
    nodeLabelFilter.tpop ?
      `Navigationsbaum, Label-Filter: Das Label der Teil-Populationen wird nach "${nodeLabelFilter.tpop}" gefiltert.`
    : undefined
  const artHierarchyComment =
    artIsFiltered ?
      'Formular-Filter, Ebene Art: Es werden nur Teil-Populationen berücksichtigt, deren Art die Bedingungen des gesetzten Filters erfüllt.'
    : undefined
  const popHierarchyComment =
    popIsFiltered ?
      'Formular-Filter, Ebene Population: Es werden nur Teil-Populationen berücksichtigt, deren Population die Bedingungen des gesetzten Filters erfüllt.'
    : undefined
  const mapFilterComment =
    mapFilter ? 'Karten-Filter: wird angewendet.' : undefined

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
      <div className={title}>Zusätzlich aktive Filter:</div>
      <ul>
        {!!navApFilterComment && (
          <li className={comment}>{navApFilterComment}</li>
        )}
        {!!navHiearchyComment && (
          <li className={comment}>{navHiearchyComment}</li>
        )}
        {!!navLabelComment && <li className={comment}>{navLabelComment}</li>}
        {!!artHierarchyComment && (
          <li className={comment}>{artHierarchyComment}</li>
        )}
        {!!popHierarchyComment && (
          <li className={comment}>{popHierarchyComment}</li>
        )}
        {!!mapFilterComment && <li className={comment}>{mapFilterComment}</li>}
      </ul>
    </ErrorBoundary>
  )
})
