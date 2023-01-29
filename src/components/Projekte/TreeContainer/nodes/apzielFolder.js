import union from 'lodash/union'

const apzielFolderNode = ({ data, loading, projId, apId, store }) => {
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.ziel ?? ''

  const zieljahre = (data?.apById?.zielsByApId?.nodes ?? [])
    // reduce to distinct years
    .reduce((a, el) => union(a, [el.jahr]), [])
  const zieljahreLength = zieljahre.length
  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${zieljahreLength} ${zieljahreLength === 1 ? 'Jahr' : 'Jahre'} gefiltert`
    : `${zieljahreLength} ${zieljahreLength === 1 ? 'Jahr' : 'Jahre'}`

  const url = ['Projekte', projId, 'Arten', apId, 'AP-Ziele']

  return {
    nodeType: 'folder',
    menuType: 'zielFolder',
    filterTable: 'ziel',
    id: `${apId}ApzielFolder`,
    tableId: apId,
    urlLabel: 'AP-Ziele',
    label: `AP-Ziele (${message})`,
    url,
    hasChildren: zieljahreLength > 0,
  }
}

export default apzielFolderNode
