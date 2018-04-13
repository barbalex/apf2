// @flow

import axios from 'axios'
import clone from 'lodash/clone'

import beobIdsFromServerInsideFeatureCollection from './beobIdsFromServerInsideFeatureCollection'
import tpopIdsInsideFeatureCollection from './tpopIdsInsideFeatureCollection'
import popIdsInsideFeatureCollection from './popIdsInsideFeatureCollection'
import exportXlsx from './exportXlsx'
import exportCsv from './exportCsv'
import exportKml from './exportKml'

export default async ({
  store,
  changeArtFuerEierlegendeWollmilchsau,
  artFuerEierlegendeWollmilchsau,
  view,
  fileName,
  apId,
  kml,
}: {
  store: Object,
  changeArtFuerEierlegendeWollmilchsau: () => {},
  artFuerEierlegendeWollmilchsau: string,
  view: string,
  fileName: string,
  apId: number,
  kml: Boolean,
}) => {
  const onError = error => {
    if (artFuerEierlegendeWollmilchsau) {
      changeArtFuerEierlegendeWollmilchsau('')
    }
    store.listError(error)
    store.export.removeDownload(fileName)
  }
  const url = apId ? `/${view}?ApArtId=eq.${apId}` : `/${view}`

  store.export.addDownload(fileName)
  let result: { data: Array<Object> }
  try {
    result = await axios.get(url)
  } catch (error) {
    onError(error)
  }
  // $FlowIssue
  const { data } = result
  const { mapFilter } = store.map
  const { applyMapFilterToExport } = store.export
  // TODO: add this
  /*
  const {
    applyNodeLabelFilterToExport,
    applyActiveNodeFilterToExport,
  } = store.tree
  */
  let jsonData = clone(data)
  // now we could manipulate the data, for instance apply mapFilter
  const filterFeatures = mapFilter.filter.features
  if (filterFeatures.length > 0 && applyMapFilterToExport) {
    const keys = Object.keys(data[0])
    console.log('export: data', { keys, jsonData })
    // filter data
    // beob can also have PopId and tpop-id, so dont filter by TPopId if you filter by beob id
    if (keys.includes('id')) {
      const beobIds = beobIdsFromServerInsideFeatureCollection(store, data)
      jsonData = jsonData.filter(d => beobIds.includes(d.id))
    } else if (keys.includes('TPopId')) {
      // data sets with TPopId usually also deliver PopId,
      // so only filter by TPopid then
      const tpopIds = tpopIdsInsideFeatureCollection(store, data)
      jsonData = jsonData.filter(d => tpopIds.includes(d.id))
    } else if (keys.includes('PopId')) {
      const popIds = popIdsInsideFeatureCollection(store, data)
      jsonData = jsonData.filter(d => popIds.includes(d.PopId))
    }
  }
  if (jsonData.length === 0) {
    return onError(
      'Es gibt offenbar keine Daten, welche exportiert werden können'
    )
  }
  if (kml) {
    exportKml({
      fileName,
      jsonData,
    })
  } else if (store.export.fileType === 'csv') {
    exportCsv({
      fileName,
      jsonData,
    })
  } else {
    // pass some data in case something goes wrong
    exportXlsx({
      store,
      changeArtFuerEierlegendeWollmilchsau,
      artFuerEierlegendeWollmilchsau,
      fileName,
      jsonData,
    })
  }

  // always do:
  if (artFuerEierlegendeWollmilchsau) {
    changeArtFuerEierlegendeWollmilchsau('')
  }
  store.export.removeDownload(fileName)
}
