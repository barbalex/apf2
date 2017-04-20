// @flow
export default (store: Object, oldIndex: number, newIndex: number): void => {
  /**
   * need to move array elements in overlays array
   * when user moves them in layer list
   * react-sortable-hoc has arrayMove method
   * but that does not work when using mobx
   * because it returns new array
   * so  use method that changes sequence while
   * keeping same array
   * from: http://stackoverflow.com/a/7180095/712005
   */
  store.map.overlays.splice(
    newIndex,
    0,
    store.map.overlays.splice(oldIndex, 1)[0]
  )
}
