//@flow
import tables from './tables'

export default (activeNode:Object): String => {
  if (!activeNode) return null
  let tableName = null
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
  return tableName
}