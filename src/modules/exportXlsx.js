// @flow

import axios from 'axios'
import fileSaver from 'file-saver'
import clone from 'lodash/clone'
import format from 'date-fns/format'

import beobIdsFromServerInsideFeatureCollection from './beobIdsFromServerInsideFeatureCollection'
import tpopIdsInsideFeatureCollection from './tpopIdsInsideFeatureCollection'
import popIdsInsideFeatureCollection from './popIdsInsideFeatureCollection'
import getXlsxBuffer from './getXlsxBuffer'

export default ({
  store,
  changeArtFuerEierlegendeWollmilchsau,
  artFuerEierlegendeWollmilchsau,
  view,
  fileName,
  apArtId,
}: {
  store: Object,
  changeArtFuerEierlegendeWollmilchsau: () => {},
  artFuerEierlegendeWollmilchsau: string,
  view: string,
  fileName: string,
  apArtId: number,
}) => {
  const url = `/exportView/json/view=${view}${apArtId ? `/${apArtId}` : ''}`
  store.export.addDownload(fileName)
  axios
    .get(url)
    .then(({ data }) => {
      const { mapFilter } = store.map
      const { applyMapFilterToExport } = store.export
      const {
        // TODO: add this
        applyNodeLabelFilterToExport, // eslint-disable-line no-unused-vars
        applyActiveNodeFilterToExport, // eslint-disable-line no-unused-vars
      } = store.tree
      let jsonData = clone(data)
      // now we could manipulate the data, for instance apply mapFilter
      const filterFeatures = mapFilter.filter.features
      if (filterFeatures.length > 0 && applyMapFilterToExport) {
        const keys = Object.keys(data[0])
        // filter data
        // beob can also have PopId and TPopId, so dont filter by TPopId if you filter by beob id
        if (keys.includes('id')) {
          const beobIds = beobIdsFromServerInsideFeatureCollection(store, data)
          jsonData = jsonData.filter(d => beobIds.includes(d.id))
        } else if (keys.includes('TPopId')) {
          // data sets with TPopId usually also deliver PopId,
          // so only filter by TPopid then
          const tpopIds = tpopIdsInsideFeatureCollection(store, data)
          jsonData = jsonData.filter(d => tpopIds.includes(d.TPopId))
        } else if (keys.includes('PopId')) {
          const popIds = popIdsInsideFeatureCollection(store, data)
          jsonData = jsonData.filter(d => popIds.includes(d.PopId))
        }
      }
      if (jsonData.length === 0) {
        throw new Error(
          'Es gibt offenbar keine Daten, welche exportiert werden können'
        )
      }
      // Version for csv
      /*
      try {
        const csvData = json2csv({ data: jsonData })
        const file = `${fileName}_${format(
          new Date(),
          'YYYY-MM-DD_HH-mm-ss'
        )}`
        store.export.removeDownload(fileName)
        fileDownload(csvData, `${file}.csv`)
        if (artFuerEierlegendeWollmilchsau) {
          changeArtFuerEierlegendeWollmilchsau('')
        }
      } catch (err) {
        throw err
      }
      */
      // Version for xlsx
      return getXlsxBuffer(store, jsonData)
    })
    .then(buffer => {
      const file = `${fileName}_${format(new Date(), 'YYYY-MM-DD_HH-mm-ss')}`
      store.export.removeDownload(fileName)
      fileSaver.saveAs(
        new Blob([buffer], { type: 'application/octet-stream' }),
        `${file}.xlsx`
      )
      if (artFuerEierlegendeWollmilchsau) {
        changeArtFuerEierlegendeWollmilchsau('')
      }
    })
    .catch(error => {
      if (artFuerEierlegendeWollmilchsau) {
        changeArtFuerEierlegendeWollmilchsau('')
      }
      store.listError(error)
      store.export.removeDownload(fileName)
    })
}
