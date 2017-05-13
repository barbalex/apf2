// @flow
import { extendObservable, action } from 'mobx'

export default (store: Object): void => {
  extendObservable(store.export, {
    applyNodeLabelFilterToExport: false,
    toggleApplyNodeLabelFilterToExport: action(
      'toggleApplyNodeLabelFilterToExport',
      () =>
        (store.export.applyNodeLabelFilterToExport = !store.export
          .applyNodeLabelFilterToExport),
    ),
    applyActiveNodeFilterToExport: false,
    toggleApplyActiveNodeFilterToExport: action(
      'toggleApplyActiveNodeFilterToExport',
      () =>
        (store.export.applyActiveNodeFilterToExport = !store.export
          .applyActiveNodeFilterToExport),
    ),
    applyMapFilterToExport: false,
    toggleApplyMapFilterToExport: action(
      'toggleApplyMapFilterToExport',
      () =>
        (store.export.applyMapFilterToExport = !store.export
          .applyMapFilterToExport),
    ),
  })
}
