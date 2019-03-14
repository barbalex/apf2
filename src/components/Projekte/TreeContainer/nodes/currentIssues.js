// @flow
import get from 'lodash/get'
import memoizeOne from 'memoize-one'

import compareLabel from './compareLabel'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  projektNodes,
  mobxStore,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  mobxStore: Object,
}): Array<Object> => {
  const currentIssues = get(data, 'allCurrentissues.nodes', [])

  // fetch sorting indexes of parents
  const currentIssueIndex = projektNodes.length + 3

  // map through all elements and create array of nodes
  const nodes = memoizeOne(() =>
    currentIssues
      .map(el => {
        const message = el.role
          ? el.role.replace('apflora_', '')
          : 'keine Rolle'
        const label = el.name ? `${el.name} (${message})` : '(kein Name)'

        return {
          nodeType: 'table',
          menuType: 'currentIssue',
          id: el.id,
          urlLabel: el.id,
          label,
          url: ['Aktuelle-Fehler', el.id],
          hasChildren: false,
        }
      })
      // sort by label
      .sort(compareLabel)
      .map((el, index) => {
        el.sort = [currentIssueIndex, index]
        return el
      }),
  )()

  return nodes
}
