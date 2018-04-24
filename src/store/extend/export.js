// @flow
import { extendObservable, action } from 'mobx'

export default (store: Object): void => {
  extendObservable(store.export, {
    applyNodeLabelFilterToExport: false,
    applyActiveNodeFilterToExport: false,
    applyMapFilterToExport: false,
    toggleApplyMapFilterToExport: action(
      () =>
        (store.export.applyMapFilterToExport = !store.export
          .applyMapFilterToExport)
    ),
    activeDownloads: [],
    addDownload: action('addDownload', name =>
      store.export.activeDownloads.unshift(name)
    ),
    removeDownload: action(
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
