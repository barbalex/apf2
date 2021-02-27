import tables from './tables'

const getTableNameFromActiveNode = (activeNode) => {
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
    const childTable = tables.find((t) => t.table === childTableName)
    if (childTable && childTable.parentTable) {
      tableName = childTable.parentTable
    }
    if (childTableName === 'idealbiotop') {
      tableName = childTableName
    }
  }
  //console.log('getTableNameFromActiveNode', { activeNode })
  if (
    ['adresseFolder', 'wlFolder', 'userFolder', 'currentIssuesFolder'].includes(
      activeNode.menuType,
    )
  ) {
    return null
  }
  if (activeNode.menuType.includes('WerteFolder')) {
    return null
  }
  return tableName
}

export default getTableNameFromActiveNode
