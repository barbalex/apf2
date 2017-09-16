// @flow
import { extendObservable, action } from 'mobx'

export default (store: Object): void => {
  extendObservable(store.export, {
    applyNodeLabelFilterToExport: false,
    toggleApplyNodeLabelFilterToExport: action(
      'toggleApplyNodeLabelFilterToExport',
      () =>
        (store.export.applyNodeLabelFilterToExport = !store.export
          .applyNodeLabelFilterToExport)
    ),
    applyActiveNodeFilterToExport: false,
    toggleApplyActiveNodeFilterToExport: action(
      'toggleApplyActiveNodeFilterToExport',
      () =>
        (store.export.applyActiveNodeFilterToExport = !store.export
          .applyActiveNodeFilterToExport)
    ),
    applyMapFilterToExport: false,
    toggleApplyMapFilterToExport: action(
      'toggleApplyMapFilterToExport',
      () =>
        (store.export.applyMapFilterToExport = !store.export
          .applyMapFilterToExport)
    ),
    activeDownloads: [],
    addDownload: action('addDownload', name =>
      store.export.activeDownloads.unshift(name)
    ),
    removeDownload: action(
      'removeDownload',
      name =>
        (store.export.activeDownloads = store.export.activeDownloads.filter(
          x => x !== name
        ))
    ),
    fileType: 'xlsx',
    toggleFileType: action('toggleFileType', () => {
      if (store.export.fileType === 'csv') {
        store.export.fileType = 'xlsx'
      } else {
        store.export.fileType = 'csv'
      }
    }),
  })
}
