export const nodeFromMenu = (menu) => ({
  // Use case: when inserting from table, last url element is popped
  nodeType: menu.treeNodeType,
  // know what menu to show
  menuType: menu.treeMenuType,
  // is used
  id: menu.treeTableId,
  // know what parent to insert a new node into
  // this has to be the id of the parent table's dataset
  parentTableId: menu.treeParentTableId,
  urlLabel: menu.id,
  label: menu.label,
  labelLeftElements: menu.labelLeftElements,
  labelRightElements: menu.labelRightElements,
  url: menu.treeUrl,
  // used after creating a new node, to ensure the actual form is shown, not the nav list
  singleElementName: menu.treeSingleElementName,
  // determines the symbol used left of the label in the tree
  hasChildren: menu.hasChildren,
  // used by f.i. zaehlungen
  alwaysOpen: menu.alwaysOpen,
  // needed for apzieljahr folders
  jahr: menu.jahr,
  // needed for pop and tpop folders
  status: menu.status,
  // used for zaehlungen in ekf
  hideInNavList: menu.hideInNavList,
  // used by NodeWithList
  childrenAreFolders: menu.childrenAreFolders,
})
