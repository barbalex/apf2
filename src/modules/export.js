// @flow
import omit from 'lodash/omit'

import beobIdsFromServerInsideFeatureCollection from './beobIdsFromServerInsideFeatureCollection'
import tpopIdsInsideFeatureCollection from './tpopIdsInsideFeatureCollection'
import popIdsInsideFeatureCollection from './popIdsInsideFeatureCollection'
import exportXlsx from './exportXlsx'
import exportCsv from './exportCsv'
import exportKml from './exportKml'
import listError from './listError'

export default async ({
  data:dataPassed,
  fileName,
  fileType,
  applyMapFilterToExport,
  kml,
  mapFilter,
}: {
  data: Array<Object>,
  fileName: String,
  fileType: String,
  applyMapFilterToExport: Boolean,
  kml: Boolean,
  mapFilter: Object,
}) => {
  // TODO
  let data = dataPassed.map(d=> omit(d, ['__typename', 'Symbol(id)']))
  // now we could manipulate the data, for instance apply mapFilter
  const filterFeatures = mapFilter.filter.features
  if (filterFeatures.length > 0 && applyMapFilterToExport) {
    const keys = Object.keys(data[0])
    // filter data
    // beob can also have PopId and tpop-id, so dont filter by TPopId if you filter by beob id
    if (keys.includes('id')) {
      const beobIds = beobIdsFromServerInsideFeatureCollection({ mapFilter, data })
      data = data.filter(d => beobIds.includes(d.id))
    } else if (keys.includes('TPopId')) {
      // data sets with TPopId usually also deliver PopId,
      // so only filter by TPopid then
      const tpopIds = tpopIdsInsideFeatureCollection({ mapFilter, data })
      data = data.filter(d => tpopIds.includes(d.id))
    } else if (keys.includes('PopId')) {
      const popIds = popIdsInsideFeatureCollection({ mapFilter, data })
      data = data.filter(d => popIds.includes(d.PopId))
    }
  }
  if (data.length === 0) {
    return listError(new Error('Es gibt offenbar keine Daten, welche exportiert werden können'))
  }
  if (kml) {
    exportKml({
      fileName,
      data,
    })
  } else if (fileType === 'csv') {
    exportCsv({
      fileName,
      data,
    })
  } else {
    // pass some data in case something goes wrong
    exportXlsx({
      fileName,
      data,
    })
  }
}
