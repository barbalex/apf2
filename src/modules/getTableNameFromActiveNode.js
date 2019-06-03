import tables from './tables'

export default activeNode => {
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
  if (
    [
      'adresseFolder',
      'apberrelevantGrundWerteFolder',
      'tpopkontrzaehlEinheitWerteFolder',
      'wlFolder',
      'userFolder',
      'currentIssuesFolder',
    ].includes(activeNode.menuType)
  )
    return null
  return tableName
}
