// @flow
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'

import isNodeInActiveNodePath from '../../isNodeInActiveNodePath'
import isNodeOpen from '../../isNodeOpen'

export default (props: Object, nextProps: Object) => {
  const {
    tree,
    node,
    activeNodes,
    treeName,
    data,
    moving,
    openNodes,
    copying,
    activeApfloraLayers,
    mapFilter,
    mapIdsFiltered,
    nodeFilterState,
  } = props
  const {
    tree: next_tree,
    node: next_node,
    activeNodes: next_activeNodes,
    treeName: next_treeName,
    data: next_data,
    moving: next_moving,
    openNodes: next_openNodes,
    copying: next_copying,
    activeApfloraLayers: next_activeApfloraLayers,
    mapFilter: next_mapFilter,
    mapIdsFiltered: next_mapIdsFiltered,
    nodeFilterState: next_nodeFilterState,
  } = nextProps

  const activeNodeArray = get(data, `${treeName}.activeNodeArray`)
  const nodeIsInActiveNodePath = isNodeInActiveNodePath(node, activeNodeArray)
  const next_activeNodeArray = get(
    next_data,
    `${next_treeName}.activeNodeArray`,
  )
  const next_nodeIsInActiveNodePath = isNodeInActiveNodePath(
    node,
    next_activeNodeArray,
  )
  if (nodeIsInActiveNodePath !== next_nodeIsInActiveNodePath) return true

  // build symbols
  const nodeIsOpen = isNodeOpen(openNodes, node.url)
  let useSymbolIcon = true
  let useSymbolSpan = false
  let symbolIcon
  let showPrintIcon = false
  if (node.hasChildren && nodeIsOpen) {
    symbolIcon = 'expandMore'
  } else if (node.hasChildren) {
    symbolIcon = 'chevronRight'
  } else if (node.label === 'lade Daten...') {
    symbolIcon = 'moreHoriz'
  } else {
    useSymbolSpan = true
    useSymbolIcon = false
  }
  if (
    (node.menuType === 'apber' || node.menuType === 'apberuebersicht') &&
    tree.name === 'tree'
  ) {
    showPrintIcon = true
  }
  // next
  const next_nodeIsOpen = isNodeOpen(next_openNodes, node.url)
  let next_useSymbolIcon = true
  let next_useSymbolSpan = false
  let next_symbolIcon
  let next_showPrintIcon = false
  if (next_node.hasChildren && next_nodeIsOpen) {
    next_symbolIcon = 'expandMore'
  } else if (next_node.hasChildren) {
    next_symbolIcon = 'chevronRight'
  } else if (next_node.label === 'lade Daten...') {
    next_symbolIcon = 'moreHoriz'
  } else {
    next_useSymbolSpan = true
    next_useSymbolIcon = false
  }
  if (
    (next_node.menuType === 'apber' ||
      next_node.menuType === 'apberuebersicht') &&
    next_tree.name === 'tree'
  ) {
    next_showPrintIcon = true
  }
  if (useSymbolIcon !== next_useSymbolIcon) return true
  if (useSymbolSpan !== next_useSymbolSpan) return true
  if (symbolIcon !== next_symbolIcon) return true
  if (showPrintIcon !== next_showPrintIcon) return true

  const level =
    node.url[0] === 'Projekte' ? node.url.length - 1 : node.url.length
  const next_level =
    next_node.url[0] === 'Projekte'
      ? next_node.url.length - 1
      : next_node.url.length
  if (level !== next_level) return true

  const isMoving =
    node.nodeType === 'table' &&
    node.menuType === moving.table &&
    node.id === moving.id
  const next_isMoving =
    next_node.nodeType === 'table' &&
    next_node.menuType === next_moving.table &&
    next_node.id === next_moving.id
  if (isMoving !== next_isMoving) return true

  const isCopying =
    node.nodeType === 'table' &&
    node.menuType === copying.table &&
    node.id === copying.id
  const next_isCopying =
    next_node.nodeType === 'table' &&
    next_node.menuType === next_copying.table &&
    next_node.id === next_copying.id
  if (isCopying !== next_isCopying) return true

  const copyingBiotop =
    node.nodeType === 'table' && node.id === get(data, 'copyingBiotop.id')
  const next_copyingBiotop =
    next_node.nodeType === 'table' &&
    next_node.id === get(next_data, 'copyingBiotop.id')
  if (copyingBiotop !== next_copyingBiotop) return true

  if (node.label !== next_node.label) return true

  if (activeNodes.ap !== next_activeNodes.ap) return true

  return false
}
