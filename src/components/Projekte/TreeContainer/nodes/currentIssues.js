import sortBy from 'lodash/sortBy'

const currentIssuesNodes = ({ data, projektNodes }) => {
  const currentIssues = data?.allCurrentissues?.nodes ?? []

  // fetch sorting indexes of parents
  const currentIssueIndex = projektNodes.length + 3

  // map through all elements and create array of nodes
  const nodes = sortBy(currentIssues, ['sort', 'title'])
    .map((el) => ({
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
    })

  return nodes
}

export default currentIssuesNodes
