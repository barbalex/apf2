// @flow
import omit from 'lodash/omit'

import idsInsideFeatureCollection from './idsInsideFeatureCollection'
import exportXlsx from './exportXlsx'
import exportCsv from './exportCsv'
import exportKml from './exportKml'

export default async ({
  data:dataPassed,
  fileName,
  fileType,
  applyMapFilterToExport,
  kml,
  mapFilter = {},
  idKey,
  xKey,
  yKey,
  errorState,
}:{
  data: Array<Object>,
  fileName: String,
  fileType: String,
  applyMapFilterToExport: Boolean,
  kml: Boolean,
  mapFilter: Object,
  idKey: String,
  xKey: String,
  yKey: String,
  errorState: Object,
}) => {
  let data = dataPassed.map(d=> omit(d, ['__typename', 'Symbol(id)']))
  // now we could manipulate the data, for instance apply mapFilter
  const filterFeatures = mapFilter.features
  if (
    filterFeatures.length > 0 &&
    applyMapFilterToExport &&
    idKey && xKey && yKey
  ) {
    // filter data
    const ids = idsInsideFeatureCollection({
      mapFilter,
      data,
      idKey,
      xKey,
      yKey,
    })
    data = data.filter(d => ids.includes(d[idKey]))
  }
  if (data.length === 0) {
    return errorState.add(new Error('Es gibt offenbar keine Daten, welche exportiert werden können'))
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
      errorState,
    })
  }
}
