export const nodeFromMenu = (menu) => ({
  nodeType: menu.treeNodeType,
  menuType: menu.treeMenuType,
  id: menu.treeId,
  tableId: menu.treeTableId,
  parentId: menu.treeParentId,
  parentTableId: menu.treeParentTableId,
  urlLabel: menu.id,
  label: menu.label,
  labelLeftElements: menu.labelLeftElements,
  labelRightElements: menu.labelRightElements,
  url: menu.treeUrl,
  singleElementName: menu.treeSingleElementName,
  hasChildren: menu.hasChildren,
  alwaysOpen: menu.alwaysOpen,
  // needed for apzieljahr folders
  jahr: menu.jahr,
})
