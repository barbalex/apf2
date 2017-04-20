// @flow

export default (store: Object): void => {
  // forward apflora.ch to Projekte
  if (store.tree.activeNodeArray.length === 0) {
    store.tree.activeNodeArray.push(`Projekte`)
  }

  /**
   * make sure no nodes are included, that are filtered out by tree.nodeLabelFilter
   * idea:
   * create map urlFolderName > tableName
   * find last urlfolderName followed by another element in activeNodeArray
   * get table from map
   * get id from following element
   * find id in filteredAndSorted
   * if not included, remove these elements
   *
   * danger: special case of AP-Ziele:
   * - not next element is id but index + 2
   * - also check zieljahr
   */
}
