// @flow
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import memoizeOne from 'memoize-one'

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
    sortBy(currentIssues, ['sort', 'title'])
      .map(el => ({
        nodeType: 'table',
        menuType: 'currentIssue',
        id: el.id,
        urlLabel: el.id,
        label: el.label,
        url: ['Aktuelle-Fehler', el.id],
        hasChildren: false,
      }))
      .map((el, index) => {
        el.sort = [currentIssueIndex, index]
        return el
      }),
  )()

  return nodes
}
