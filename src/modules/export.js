import omit from 'lodash/omit'

import idsInsideFeatureCollection from './idsInsideFeatureCollection'
import exportXlsx from './exportXlsx'
import exportCsv from './exportCsv'
import exportKml from './exportKml'

export default async ({
  data: dataPassed,
  fileName,
  exportFileType,
  exportApplyMapFilter,
  kml,
  mapFilter = {},
  idKey,
  xKey,
  yKey,
  addError,
}) => {
  let data = dataPassed.map(d => omit(d, ['__typename', 'Symbol(id)']))
  // now we could manipulate the data, for instance apply mapFilter
  const filterFeatures = mapFilter.features
  if (
    filterFeatures.length > 0 &&
    exportApplyMapFilter &&
    idKey &&
    xKey &&
    yKey
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
  // TODO: filter by nodeFilterState
  // 1. add field to choose to filter by nodeFilterState
  // 2. depending on typename check if this table is filtered
  // 3. if yes: filter by nodeFilterState by converting camelCase to lower_case
  if (data.length === 0) {
    return addError(
      new Error(
        'Es gibt offenbar keine Daten, welche exportiert werden können',
      ),
    )
  }
  if (kml) {
    exportKml({
      fileName,
      data,
    })
  } else if (exportFileType === 'csv') {
    exportCsv({
      fileName,
      data,
    })
  } else {
    // pass some data in case something goes wrong
    exportXlsx({
      fileName,
      data,
      addError,
    })
  }
}
