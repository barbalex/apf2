import { memo, useContext } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router'

import { StoreContext } from '../../../../storeContext.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'

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

export const ActiveFilters = memo(
  observer(() => {
    const { apId } = useParams()

    const store = useContext(StoreContext)

    const {
      nodeLabelFilter,
      mapFilter,
      apFilter,
      artIsFiltered,
      popIsFiltered,
    } = store.tree

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
          {!!mapFilterComment && (
            <FilterComment>{mapFilterComment}</FilterComment>
          )}
        </FilterCommentList>
      </ErrorBoundary>
    )
  }),
)
