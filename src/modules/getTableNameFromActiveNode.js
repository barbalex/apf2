//@flow
import tables from './tables'

export default (activeNode: Object): string => {
  console.log('getTableFromActiveNode 1', { activeNode })
  if (!activeNode) return null
  // name it projekt
  // because: /projekte has no nodes!
  let tableName = 'projekt'
  if (activeNode.nodeType === 'table') {
    tableName = activeNode.menuType
    // need to convert feldkontrzaehl and freiwkontrzaehl to kontrzaehl
    if (['tpopfreiwkontrzaehl', 'tpopfeldkontrzaehl'].includes(tableName)) {
      tableName = 'tpopkontrzaehl'
    }
  } else {
    const childTableName = activeNode.menuType.replace('Folder', '')
    const childTable = tables.find(t => t.table === childTableName)
    if (childTable && childTable.parentTable) {
      tableName = childTable.parentTable
    }
    if (childTableName === 'idealbiotop') {
      tableName = childTableName
    }
  }
  if (['adresseFolder', 'wlFolder', 'userFolder'].includes(activeNode.menuType))
    return null
  console.log('getTableFromActiveNode', { tableName, activeNode })
  return tableName
}
